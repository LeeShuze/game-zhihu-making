const account=document.createElement('button');account.className='account-button';account.textContent='用知乎账号登录';account.type='button';
document.body.append(account);
const dialog=document.createElement('dialog');dialog.className='login-dialog';dialog.setAttribute('aria-labelledby','login-heading');
dialog.innerHTML='<p class="login-label">盐选故事馆 · 读者登记</p><h2 id="login-heading">进入故事之前</h2><p id="login-message">使用知乎账号登录，开启你的故事。</p><a class="login-primary" href="/api/auth/zhihu/start">用知乎账号登录</a><button class="login-guest" type="button">先以访客身份浏览书架</button>';
document.body.append(dialog);
let state=null;
const message=dialog.querySelector('#login-message');
function show(required=false,text='') {message.textContent=text || (required?'请先使用知乎账号登录，再进入副本。':'使用知乎账号登录，开启你的故事。');if(!dialog.open)dialog.showModal();}
dialog.querySelector('.login-guest').onclick=()=>{try{sessionStorage.setItem('hh_guest','1');}catch{}dialog.close();};
function paint(){account.replaceChildren();if(state?.user){if(state.user.avatar){const img=document.createElement('img');img.src=state.user.avatar;img.alt='';img.referrerPolicy='no-referrer';account.append(img);}account.append(document.createTextNode(`${state.user.name} · 退出`));}else account.textContent='用知乎账号登录';
 const link=dialog.querySelector('a');link.hidden=state?.enabled===false;
 if(state?.enabled===false)message.textContent='进入副本需要知乎登录。登录暂未开放，你可以先浏览书架。';}
async function refresh(){const response=await fetch('/api/auth/me',{cache:'no-store'});if(!response.ok)throw Error();state=await response.json();paint();return state;}
account.onclick=async()=>{if(!state?.user){show();paint();return;}account.disabled=true;try{const r=await fetch('/api/auth/logout',{method:'POST'});if(!r.ok)throw Error();await refresh();}catch{show(false,'退出未完成，请稍后重试。');}finally{account.disabled=false;}};
// Capture before the existing module enters its animation/handoff state.
document.addEventListener('click',event=>{if(!event.target.closest?.('#confirm-story'))return;if(!state?.user){event.preventDefault();event.stopImmediatePropagation();show(true);paint();}},true);
window.HappinessAuth={async requireLogin(){try{await refresh();}catch{show(true,'暂时无法确认登录状态，请稍后重试。');return false;}if(!state.user){show(true);paint();return false;}return true;}};
const reason=new URL(location.href).searchParams.get('login');
const errors={required:'请先使用知乎账号登录，再进入副本。',expired:'这次登录已失效，请重新登录。',cancelled:'授权未完成，你可以重新登录。',failed:'登录未完成，请稍后重试。',unconfigured:'进入副本需要知乎登录。登录暂未开放，你可以先浏览书架。'};
try{await refresh();let guest=false;try{guest=sessionStorage.getItem('hh_guest')==='1';}catch{}
 if(!state.user && (reason || !guest)){show(Boolean(reason),errors[reason] || '');paint();}
 if(reason){const url=new URL(location.href);url.searchParams.delete('login');history.replaceState(null,'',url.pathname+url.search+url.hash);}
}catch{account.textContent='登录暂不可用';account.onclick=()=>show(true,'暂时无法连接登录服务，请稍后重试。');}
