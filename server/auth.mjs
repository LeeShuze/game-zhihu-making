import { DatabaseSync } from 'node:sqlite';
import { randomBytes, createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const hash = value => createHash('sha256').update(value).digest('hex');
const random = () => randomBytes(32).toString('base64url');
export function createAuth({dbPath, origin, appId='', appKey='', redirectUri='', fetchImpl=fetch, now=Date.now}) {
  const base = new URL(origin);
  if (base.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(base.hostname)) throw Error('Public origin requires HTTPS');
  const enabled = Boolean(appId && appKey && redirectUri);
  if (redirectUri && (new URL(redirectUri).origin !== base.origin || !['/', '/api/auth/zhihu/callback'].includes(new URL(redirectUri).pathname) || new URL(redirectUri).search || new URL(redirectUri).hash)) throw Error('Callback must use the configured origin and an accepted callback path');
  if (dbPath !== ':memory:') fs.mkdirSync(path.dirname(dbPath), {recursive:true, mode:0o700});
  const db = new DatabaseSync(dbPath);
  if (dbPath !== ':memory:') fs.chmodSync(dbPath,0o600);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, avatar TEXT NOT NULL, created INTEGER NOT NULL, updated INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS oauth_states (id TEXT PRIMARY KEY, browser TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires);`);
  const secure = base.protocol === 'https:';
  const cookie = (name,value,age) => `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${secure?'; Secure':''}`;
  const cookies = req => Object.fromEntries(String(req.headers.cookie || '').split(';').map(s=>s.trim().split('=')));
  const json = (res,status,data) => {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  const redirect = (res,to,cs=[]) => {res.writeHead(303,{Location:to,'Set-Cookie':cs,'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});res.end();};
  function prune() {db.prepare('DELETE FROM sessions WHERE expires<=?').run(now());db.prepare('DELETE FROM oauth_states WHERE expires<=?').run(now());}
  function user(req) {
    const sid=cookies(req).hh_session || '';
    const row=db.prepare('SELECT users.id, name, avatar FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.id=? AND expires>?').get(hash(sid),now());
    return row || null;
  }
  const timer=setInterval(prune,60000);timer.unref();prune();
  async function handle(req,res,url) {
    const callbackPath = redirectUri ? new URL(redirectUri).pathname : '/api/auth/zhihu/callback';
    const isCallback = url.pathname === callbackPath && (callbackPath !== '/' || ['authorization_code','code','state','error','error_code'].some(key=>url.searchParams.has(key)));
    if (!url.pathname.startsWith('/api/') && !isCallback) return false;
    const p=url.pathname;
    if (p==='/api/auth/me' && req.method==='GET') {json(res,200,{enabled,user:user(req)});return true;}
    if (p==='/api/auth/logout' && req.method==='POST') {
      if(req.headers.origin!==base.origin) {json(res,403,{error:'请求来源不匹配'});return true;}
      db.prepare('DELETE FROM sessions WHERE id=?').run(hash(cookies(req).hh_session || ''));
      res.setHeader('Set-Cookie',cookie('hh_session','',0));json(res,200,{user:null});return true;
    }
    if (p==='/api/auth/zhihu/start' && req.method==='GET') {
      if(!enabled) {redirect(res,'/?login=unconfigured');return true;}
      prune();
      const old=cookies(req).hh_oauth || '';
      db.prepare('DELETE FROM oauth_states WHERE browser=?').run(hash(old));
      const state=random(), browser=random();
      db.prepare('INSERT INTO oauth_states VALUES (?,?,?)').run(hash(state),hash(browser),now()+600000);
      const target=new URL('https://openapi.zhihu.com/authorize');
      target.search=new URLSearchParams({app_id:appId,redirect_uri:redirectUri,response_type:'code',state}).toString();
      redirect(res,target.href,[cookie('hh_oauth',browser,600)]);return true;
    }
    if(isCallback && req.method==='GET') {
      const clear=cookie('hh_oauth','',0);
      const fail=reason=>redirect(res,`/?login=${reason}`,[clear]);
      if(!enabled) {fail('unconfigured');return true;}
      const state=url.searchParams.get('state') || '', browser=cookies(req).hh_oauth || '';
      // DELETE RETURNING atomically validates and consumes the browser-bound request.
      const accepted=db.prepare('DELETE FROM oauth_states WHERE id=? AND browser=? AND expires>? RETURNING id').get(hash(state),hash(browser),now());
      if(!state || !browser || !accepted) {fail('expired');return true;}
      const code=url.searchParams.get('authorization_code') || url.searchParams.get('code');
      if(!code || url.searchParams.has('error')) {fail('cancelled');return true;}
      try {
        const response=await fetchImpl('https://openapi.zhihu.com/access_token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({app_id:appId,app_key:appKey,grant_type:'authorization_code',redirect_uri:redirectUri,code}),signal:AbortSignal.timeout(10000)});
        const payload=await response.json(), token=payload.access_token || payload.data?.access_token;
        if(!response.ok || typeof token!=='string' || !token) throw Error('token');
        const profileResponse=await fetchImpl('https://openapi.zhihu.com/user',{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(10000)});
        // Node 24 JSON source context preserves int64 identifiers before Number rounding.
        const parsed=JSON.parse(await profileResponse.text(),(key,value,context)=>key==='uid' && typeof value==='number' ? context.source : value);
        const profile=parsed.data && typeof parsed.data==='object' ? parsed.data : parsed;
        const id=typeof profile.hash_id==='string' && profile.hash_id ? profile.hash_id : typeof profile.uid==='string' && /^\d+$/.test(profile.uid) ? profile.uid : '';
        if(!profileResponse.ok || !id) throw Error('profile');
        let avatar='';try {const a=new URL(profile.avatar_path);if(a.protocol==='https:') avatar=a.href;}catch{}
        const name=String(profile.fullname || '知乎读者').slice(0,100);
        const seconds=Number(payload.expires_in ?? payload.data?.expires_in);
        const ttl=Math.min(Number.isFinite(seconds)&&seconds>0?Math.floor(seconds):3600,7*86400);
        const sid=random();
        db.exec('BEGIN IMMEDIATE');
        try {
          db.prepare('INSERT INTO users VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,avatar=excluded.avatar,updated=excluded.updated').run(id,name,avatar,now(),now());
          db.prepare('DELETE FROM sessions WHERE id=?').run(hash(cookies(req).hh_session || ''));
          db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(hash(sid),id,now()+ttl*1000);
          db.exec('COMMIT');
        } catch(e) {db.exec('ROLLBACK');throw e;}
        redirect(res,'/?login=success',[clear,cookie('hh_session',sid,ttl)]);
      }catch {fail('failed');}
      return true;
    }
    json(res,404,{error:'接口不存在'});return true;
  }
  return {handle,user,close(){clearInterval(timer);db.close();}};
}
