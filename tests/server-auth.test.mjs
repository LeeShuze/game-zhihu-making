import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createServer} from 'node:net';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';

test('HTTP: encoded paths, private files, authenticated assets and SQLite restart persistence',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'hh-auth-test-')),dbPath=path.join(dir,'test.db');
 const probe=createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(r=>probe.close(r));
 let child;
 async function start(){child=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port),HOST:'127.0.0.1',APP_ORIGIN:`http://127.0.0.1:${port}`,DATABASE_PATH:dbPath,ZHIHU_OAUTH_APP_ID:'',ZHIHU_OAUTH_APP_KEY:'',ZHIHU_OAUTH_REDIRECT_URI:''},stdio:['ignore','pipe','pipe']});await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw Error('Server exited before ready');}),new Promise((_,reject)=>{const t=setTimeout(()=>reject(Error('Startup timeout')),5000);t.unref();})]);}
 async function stop(){const c=child;child=null;const done=once(c,'exit');c.kill();await done;}
 async function get(p,cookie=''){return fetch(`http://127.0.0.1:${port}${p}`,{redirect:'manual',headers:{cookie}});}
 try{
  await start();
  for(const p of ['/avg/','/duty/index.html','/elevator/assets/index-D79AMlZO.js','/assets/%2e%2e%2favg/index.html','/assets%2f..%2favg/index.html']){const r=await get(p);assert.equal(r.status,303,p);assert.equal(r.headers.get('location'),'/?login=required');}
  for(const p of ['/.env','/server/auth.mjs','/package.json'])assert.equal((await get(p)).status,404,p);
  assert.equal((await get('/')).status,200);
  const db=new DatabaseSync(dbPath);db.prepare('INSERT INTO users VALUES (?,?,?,?,?)').run('test-user','测试','',Date.now(),Date.now());db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(createHash('sha256').update('test-session').digest('hex'),'test-user',Date.now()+60000);db.close();
  assert.equal((await get('/avg/','hh_session=test-session')).status,200);
  await stop();await start();
  const me=await (await get('/api/auth/me','hh_session=test-session')).json();assert.equal(me.user.name,'测试');
  const r=await get('/avg/index.html','hh_session=test-session');assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'private, no-store');
 }finally{if(child)await stop();rmSync(dir,{recursive:true,force:true});}
});
