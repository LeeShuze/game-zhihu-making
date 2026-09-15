import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
function profile({touch=0,coarse=false,width=1440,height=900,query='',store=new Map()}={}){
 const events=[],listeners={};const context={location:{search:query},navigator:{maxTouchPoints:touch},screen:{width,height},innerWidth:width,innerHeight:height,matchMedia:q=>q.includes('orientation')?{get matches(){return context.innerHeight>context.innerWidth;},addEventListener(t,cb){listeners.media=cb;}}:{matches:coarse},URLSearchParams,requestAnimationFrame:fn=>fn(),sessionStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},document:{readyState:'loading',documentElement:{dataset:{},classList:{toggle(){}},style:{setProperty(){}}},addEventListener(){}},addEventListener:(t,cb)=>listeners[t]=cb,CustomEvent:class{constructor(t,options){this.type=t;this.detail=options.detail;}}};
 context.window=context;context.dispatchEvent=e=>events.push(e);vm.runInNewContext(read('mobile/device.js'),context);return {context,events,listeners,device:context.HappinessDevice};
}
test('desktop, phone, tablet and touch laptop profiles are distinct',()=>{
 assert.equal(profile().device.mobile,false);
 assert.equal(profile({touch:10,coarse:false,width:1366,height:768}).device.mobile,false);
 assert.equal(profile({touch:5,coarse:true,width:390,height:844}).device.mobile,true);
 assert.equal(profile({touch:5,coarse:true,width:844,height:390}).device.mobile,true);
 assert.equal(profile({touch:5,coarse:true,width:1024,height:768}).device.mobile,true);
 assert.equal(profile({width:500,height:800}).device.mobile,false);
});
test('profile override survives stage navigation; auto resets detection',()=>{
 const store=new Map();assert(profile({query:'?device=mobile',store}).device.mobile);
 assert(profile({store}).device.mobile);
 assert.equal(profile({query:'?device=auto',store}).device.mobile,false);
 assert.equal(profile({touch:5,coarse:true,query:'?device=desktop'}).device.mobile,false);
});
test('rotation blocks portrait and unblocks landscape without changing assets',()=>{
 const {context,device,listeners}=profile({touch:5,coarse:true,width:390,height:844});assert(device.blocked);
 context.innerWidth=844;context.innerHeight=390;listeners.resize();assert.equal(device.blocked,false);assert(device.mobile);
 assert.equal(device.asset('./models/key.glb?v=2'),'./models/mobile/key.glb?v=2');assert.equal(device.asset('models/mobile/key.glb'),'models/mobile/key.glb');
 assert.equal(profile().device.asset('models/key.glb'),'models/key.glb');
});
test('all pages include detection before scene code and mobile styles last',()=>{
 for(const f of ['index.html','duty/index.html','elevator/index.html','avg/index.html']){
  const html=read(f);assert(html.includes('mobile-orientation'));assert(html.includes('viewport-fit=cover'));
  assert(html.indexOf('mobile/device.js')<html.indexOf('type="module"') || !html.includes('type="module"'));
  const styles=[...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)];assert(styles.at(-1)[0].includes('mobile/layout.css'));
 }
});
test('two fingers independently own movement and look; cancellation clears only its owner',()=>{
 const bundle=read('elevator/assets/index-D79AMlZO.js');const start=bundle.indexOf('n.addEventListener(`pointerdown`');const end=bundle.indexOf('return{pause:te',start);
 function target(){return {handlers:{},style:{},addEventListener(t,fn){this.handlers[t]=fn;},setPointerCapture(){},getBoundingClientRect(){return {left:0,top:0,width:100,height:100}}};}
 const canvas=target(),joystick=target(),knob=target();const context={n:canvas,o:()=>joystick,document:{pointerLockElement:null}};
 context.o=s=>s==='#joystick'?joystick:knob;context.globalThis=context;
 vm.runInNewContext('let _=true,s=false,S=null,k=null,O={x:0,y:0};let delta=0;function ie(x,y){delta+=Math.abs(x)+Math.abs(y)};'+bundle.slice(start,end)+';globalThis.snapshot=()=>({S,k,x:O.x,y:O.y,delta});',context);
 const e=(id,x=80,y=50)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',preventDefault(){}});
 joystick.handlers.pointerdown(e(1));canvas.handlers.pointerdown(e(2));canvas.handlers.pointermove(e(2,95,60));
 assert(context.snapshot().x>0);assert(context.snapshot().delta>0);
 joystick.handlers.pointerdown(e(3));joystick.handlers.pointerup(e(3));assert.equal(context.snapshot().k,1);
 canvas.handlers.pointercancel(e(2));assert.equal(context.snapshot().S,null);assert.equal(context.snapshot().k,1);
 joystick.handlers.pointercancel(e(1));assert.equal(context.snapshot().x,0);
});
function unpack(file){const b=fs.readFileSync(path.join(root,file));const n=b.readUInt32LE(12);return {doc:JSON.parse(b.subarray(20,20+n)),bin:b.subarray(28+n)};}
function geometryBuffer({doc,bin}){
 doc=structuredClone(doc);delete doc.images;delete doc.textures;delete doc.materials;
 for(const mesh of doc.meshes||[])for(const prim of mesh.primitives)delete prim.material;
 const json=Buffer.from(JSON.stringify(doc));const padded=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);const body=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);
 const head=Buffer.alloc(20);head.writeUInt32LE(0x46546c67);head.writeUInt32LE(2,4);head.writeUInt32LE(28+padded.length+body.length,8);head.writeUInt32LE(padded.length,12);head.writeUInt32LE(0x4e4f534a,16);
 const bh=Buffer.alloc(8);bh.writeUInt32LE(body.length);bh.writeUInt32LE(0x004e4942,4);const all=Buffer.concat([head,padded,bh,body]);return all.buffer.slice(all.byteOffset,all.byteOffset+all.byteLength);
}
test('all mobile models preserve source hashes and parse geometry with the actual GLTF/Meshopt loaders',async()=>{
 const report=JSON.parse(read('mobile/models.json'));const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
 for(const r of report){
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,r.source))).digest('hex'),r.sourceSha256);
  const mobile=unpack(r.mobile),original=unpack(r.source);
  for(const key of ['meshes','nodes','animations','materials','textures'])assert.deepEqual(mobile.doc[key],original.doc[key]);
  const gltf=await loader.parseAsync(geometryBuffer(mobile),'');let meshes=0;
  gltf.scene.traverse(o=>{if(o.isMesh){meshes++;assert(o.geometry.attributes.position.count>0);}});assert(meshes>0,r.mobile);
 }
});

test('orientation media event releases the gate even before window resize is dispatched',()=>{
 const {context,device,listeners}=profile({touch:5,coarse:true,width:390,height:844});
 assert(device.blocked);context.innerWidth=844;context.innerHeight=390;listeners.media();assert.equal(device.blocked,false);
});

test('actual entrance handler opens a book by touch or mouse, but ignores swipes and cancelled/missed taps',()=>{
 const bundle=read('assets/main-CSCvUmFG.js');const start=bundle.indexOf('I.addEventListener(`pointerdown`');const end=bundle.indexOf('I.addEventListener(`pointerleave`',start);
 const handlers={},captured=new Set();
 const context={I:{addEventListener(t,fn){handlers[t]=fn;},setPointerCapture(id){captured.add(id);},hasPointerCapture:id=>captured.has(id),releasePointerCapture:id=>captured.delete(id)},F:{focus(){},classList:{add(){},remove(){},toggle(){}}},H:{},q:false,A:{phase:'browse'},O:{active:false},E:0,z:{},L:{play(){}},k:{begin(){},end(){},drag(){}}};
 vm.runInNewContext('let Y=null,N=null,gn=null,J=-1,hit=0,opened=0;function Cn(e){hit=e.hit??0;}function wn(){return hit;}function Dn(){opened++;}function $(){};'+bundle.slice(start,end).replace(/,$/,'')+';globalThis.opens=()=>opened;',context);
 const event=(id,x=100,{type='touch',hit=0,primary=true}={})=>({pointerId:id,clientX:x,clientY:100,pointerType:type,button:0,isPrimary:primary,hit,preventDefault(){}});
 handlers.pointerdown(event(1));handlers.pointerup(event(1,107));assert.equal(context.opens(),1);
 handlers.pointerdown(event(2));handlers.pointermove(event(2,140));handlers.pointerup(event(2,140));assert.equal(context.opens(),1);
 handlers.pointerdown(event(3));handlers.pointercancel(event(3));handlers.pointerup(event(3));assert.equal(context.opens(),1);
 handlers.pointerdown(event(4));handlers.pointerup(event(4,100,{hit:2}));assert.equal(context.opens(),1);
 handlers.pointerdown(event(5,100,{primary:false}));handlers.pointerup(event(5));assert.equal(context.opens(),1);
 handlers.pointerdown(event(6,100,{type:'mouse'}));handlers.pointerup(event(6,102,{type:'mouse'}));assert.equal(context.opens(),2);
 assert.equal(captured.size,0);
});

test('duty touch jitter remains a tap; deliberate drags suppress only their own click',()=>{
 const source=read('mobile/device.js'),start=source.indexOf('      let drag=null'),end=source.indexOf("      addEventListener('happiness:orientation'",start);
 const handlers={},events=[];let now=1000;
 const context={document:{addEventListener(t,fn){handlers[t]=fn;}},profile:{blocked:false},performance:{now:()=>now},window:{dispatchEvent:e=>events.push(e)},CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail;}}};
 vm.runInNewContext(source.slice(start,end),context);
 const e=(x,id=1)=>({pointerId:id,pointerType:'touch',clientX:x,clientY:50,target:{tagName:'CANVAS'},preventDefault(){this.prevented=true;},stopImmediatePropagation(){}});
 handlers.pointerdown(e(100));
 for(let i=0;i<20;i++)handlers.pointermove(e(i%2?103:100));
 handlers.pointerup(e(103));const tap=e(103);handlers.click(tap);assert(!tap.prevented);assert.equal(events.length,0);
 handlers.pointerdown(e(100));handlers.pointermove(e(125));handlers.pointerup(e(125));
 const swipe=e(125);handlers.click(swipe);assert(swipe.prevented);assert.equal(events.length,1);
 handlers.pointerdown(e(125));handlers.pointerup(e(125));const next=e(125);handlers.click(next);assert(!next.prevented);
});

test('all original duty clue images exist and mobile viewer exposes load/error and zoom states',()=>{
 const source=read('duty/big-pengu-runtime/assets/index-Hxh_mXsm.js');
 const urls=[...source.matchAll(/"\.\/big-pengu-runtime\/images\/[^"]+\.(?:png|jpg)(?:\?[^"]*)?"/g)].map(m=>JSON.parse(m[0]).split('?')[0]);
 assert(urls.length>=13);
 for(const url of new Set(urls))assert(fs.existsSync(path.join(root,'duty',url)),url);
 const component=source.slice(source.indexOf('function MobileClueViewer'),source.indexOf('function DocumentImageModal'));
 assert(component.includes('onLoad:'));assert(component.includes('onError:'));assert(component.includes('setZoom'));
 assert(!component.includes('setTimeout'));
});

test('mobile reading controls render before intro completion and clipboard closes both UI and camera',()=>{
 const source=read('duty/big-pengu-runtime/assets/index-Hxh_mXsm.js');
 const start=source.indexOf('function xX(){'),end=source.indexOf('const happinessReactRoot=',start);
 const code=source.slice(start,end),names=[...code.matchAll(/F\.jsx(?:s)?\(([A-Za-z_$][\w$]*),/g)].map(x=>x[1]);
 const states=[],context={window:{HappinessDevice:{mobile:true}},devicePixelRatio:2,
 W:{useState(initial){const index=states.length;states.push(initial);return [initial,value=>states[index]=value];},useEffect(){},Suspense:'Suspense'},
 F:{Fragment:'Fragment',jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}};
 // Symbols are component types only: inspect the app's actual JSX tree without a browser.
 for(const name of names)if(!(name in context))context[name]=name;
 vm.runInNewContext(code+';globalThis.tree=xX();',context);
 const nodes=[];function visit(node){if(!node||typeof node!=='object')return;nodes.push(node);for(const child of [].concat(node.props?.children||[]))visit(child);}
 visit(context.tree);
 assert.equal(states[0],'loading');
 for(const type of ['WW','DocumentImageModal','EvidencePhotoModal'])assert(nodes.some(n=>n.type===type),type+' must mount while intro is loading');
 const scene=nodes.find(n=>n.type==='VW');scene.props.onClipboardZoom();
 assert.equal(states[6],true);assert.equal(states[7],true);
 nodes.find(n=>n.type==='WW').props.onClose();
 assert.equal(states[6],false);assert.equal(states[7],false);
 const documents=nodes.filter(n=>n.type==='DocumentImageModal');
 scene.props.onTaskPaperClick();assert.equal(states[16],'task');
 documents[0].props.onClose();assert.equal(states[16],null);
 scene.props.onFolderClick();assert.equal(states[16],'folder');
 documents[1].props.onClose();assert.equal(states[16],null);
});

test('terminal CSS viewport follows canvas bounds and refreshes after size changes',()=>{
 const source=read('duty/assets/index-Bb-fNYbi.js'),start=source.indexOf('let terminalViewportKey='),end=source.indexOf('const terminalExit=',start);
 let rect={left:12,top:0,width:820,height:330};const sizes=[];
 const context={window:{HappinessDevice:{mobile:true}},document:{querySelector:()=>({getBoundingClientRect:()=>rect})},wt:{style:{}},Dt:{setSize:(w,h)=>sizes.push([w,h])}};
 vm.runInNewContext(source.slice(start,end)+';globalThis.sync=syncTerminalViewport;',context);
 context.sync();assert.deepEqual(sizes[0],[820,330]);assert.equal(context.wt.style.left,'12px');
 context.sync();assert.equal(sizes.length,1);
 rect={left:0,top:0,width:844,height:390};context.sync();assert.deepEqual(sizes[1],[844,390]);
});

test('mobile terminal maps all four DOM corners to the same camera-projected plane',async()=>{
 const {Vector3,Matrix4,PerspectiveCamera}=await import('three');
 const source=read('duty/assets/index-Bb-fNYbi.js'),start=source.indexOf('function renderMobileTerminal(){'),end=source.indexOf('function rn(){',start);
 const camera=new PerspectiveCamera(46,844/390,.01,100);camera.position.set(.1,.15,2);camera.lookAt(0,0,0);camera.updateMatrixWorld();
 const matrix=new Matrix4().makeRotationY(.2).multiply(new Matrix4().makeScale(.000593,.000593,.000593));
 const container={appendChild(el){el.parentNode=this;}},element={style:{}};
 const context={Q:{camera},document:{querySelector:()=>({getBoundingClientRect:()=>({width:844,height:390})})},P:Vector3,Et:{matrix},yt:1280,bt:845,wt:container,X:element};
 vm.runInNewContext(source.slice(start,end)+';renderMobileTerminal();',context);
 const m=element.style.transform.slice(9,-1).split(',').map(Number);
 for(const [x,y] of [[0,0],[1280,0],[1280,845],[0,845]]){
 const v=new Vector3(x-640,422.5-y,0).applyMatrix4(matrix).project(camera),w=m[3]*x+m[7]*y+1;
 assert(Math.abs((m[0]*x+m[4]*y+m[12])/w-(v.x+1)*422)<1e-6);
 assert(Math.abs((m[1]*x+m[5]*y+m[13])/w-(1-v.y)*195)<1e-6);
 }
});
