import test from 'node:test';
import assert from 'node:assert/strict';
import {createAuth} from '../server/auth.mjs';
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},writeHead(status,h){this.status=status;Object.assign(this.headers,h);},end(body){this.body=body;}};}
const origin='https://game.example';
function fixture(){let clock=1000000,calls=0,badProfile=false;const auth=createAuth({dbPath:':memory:',origin,appId:'test',appKey:'fake',redirectUri:origin+'/api/auth/zhihu/callback',now:()=>clock,fetchImpl:async url=>{calls++;return url.endsWith('access_token')?{ok:true,json:async()=>({access_token:'mock-token',expires_in:3600})}:{ok:true,text:async()=>badProfile?'{}':'{"uid":969570047710216201,"fullname":"测试读者","avatar_path":"https://picx.zhimg.com/a.png"}'};}});
 async function request(p,cookie='',method='GET',requestOrigin=origin){const req={method,headers:{cookie,origin:requestOrigin}};const res=response();await auth.handle(req,res,new URL(p,origin));return res;}
 async function start(){const r=await request('/api/auth/zhihu/start');return {cookie:r.headers['Set-Cookie'][0].split(';')[0],state:new URL(r.headers.Location).searchParams.get('state')};}
 return {auth,request,start,advance(){clock+=600001;},get calls(){return calls;},bad(){badProfile=true;}};
}
test('OAuth consumes browser-bound state, preserves int64 and supports logout',async()=>{const f=fixture();try{const s=await f.start();
 const wrong=await f.request('/api/auth/zhihu/callback?authorization_code=x&state='+s.state,'hh_oauth=other');assert.match(wrong.headers.Location,/expired/);assert.equal(f.calls,0);
 const r=await f.request('/api/auth/zhihu/callback?authorization_code=x&state='+s.state,s.cookie);assert.equal(r.headers.Location,'/?login=success');
 const session=r.headers['Set-Cookie'][1].split(';')[0];assert.match(r.headers['Set-Cookie'][1],/HttpOnly.*Secure/);
 const me=JSON.parse((await f.request('/api/auth/me',session)).body);assert.equal(me.user.id,'969570047710216201');assert.equal(me.user.name,'测试读者');assert(!JSON.stringify(me).includes('mock-token'));
 await f.request('/api/auth/zhihu/callback?authorization_code=x&state='+s.state,s.cookie);assert.equal(f.calls,2);
 assert.equal((await f.request('/api/auth/logout',session,'POST','https://other.example')).status,403);
 await f.request('/api/auth/logout',session,'POST');assert.equal(JSON.parse((await f.request('/api/auth/me',session)).body).user,null);
 }finally{f.auth.close();}});
test('missing, mismatched, expired state never exchanges a token',async()=>{const f=fixture();try{const s=await f.start();for(const value of ['', 'wrong'])await f.request('/api/auth/zhihu/callback?code=x&state='+value,s.cookie);f.advance();await f.request('/api/auth/zhihu/callback?code=x&state='+s.state,s.cookie);assert.equal(f.calls,0);}finally{f.auth.close();}});
test('invalid profile cannot establish session',async()=>{const f=fixture();try{f.bad();const s=await f.start();const r=await f.request('/api/auth/zhihu/callback?code=x&state='+s.state,s.cookie);assert.match(r.headers.Location,/failed/);assert.equal(r.headers['Set-Cookie'].length,1);}finally{f.auth.close();}});
test('session expires and cancelled requests do not create users',async()=>{const f=fixture();try{let s=await f.start();await f.request('/api/auth/zhihu/callback?error=denied&state='+s.state,s.cookie);assert.equal(f.calls,0);s=await f.start();const r=await f.request('/api/auth/zhihu/callback?code=x&state='+s.state,s.cookie);const cookie=r.headers['Set-Cookie'][1].split(';')[0];for(let i=0;i<6;i++)f.advance();assert.equal(JSON.parse((await f.request('/api/auth/me',cookie)).body).user,null);}finally{f.auth.close();}});
test('registered root callback leaves normal homepage alone and exchanges with exact root URI',async()=>{
 let exchanged=false;
 const auth=createAuth({dbPath:':memory:',origin,appId:'757',appKey:'mock',redirectUri:origin+'/',fetchImpl:async(url,opts)=>{if(url.endsWith('access_token')){assert.equal(opts.body.get('redirect_uri'),origin+'/');exchanged=true;return {ok:true,json:async()=>({access_token:'mock'})};}return {ok:true,text:async()=>'{"hash_id":"root-user","fullname":"读者"}'};}});
 const req={method:'GET',headers:{}};
 try{
  assert.equal(await auth.handle(req,response(),new URL(origin+'/')),false);
  const start=response();await auth.handle(req,start,new URL(origin+'/api/auth/zhihu/start'));
  const target=new URL(start.headers.Location);assert.equal(target.searchParams.get('redirect_uri'),origin+'/');
  const end=response();await auth.handle({method:'GET',headers:{cookie:start.headers['Set-Cookie'][0].split(';')[0]}},end,new URL(origin+'/?authorization_code=mock&state='+target.searchParams.get('state')));
  assert(exchanged);assert.equal(end.headers.Location,'/?login=success');
 }finally{auth.close();}
});
