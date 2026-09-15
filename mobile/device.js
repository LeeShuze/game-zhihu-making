/* Shared profile runs before any scene module; desktop defaults remain unchanged. */
(function () {
  const query = new URLSearchParams(location.search).get('device');
  let override = query;
  try {
    if (['mobile','desktop','auto'].includes(query)) sessionStorage.setItem('happiness-device',query);
    else override = sessionStorage.getItem('happiness-device');
  } catch {}
  const coarse = matchMedia('(pointer: coarse)').matches;
  const touch = (navigator.maxTouchPoints || 0) > 0;
  const shortSide = Math.min(screen.width || innerWidth, screen.height || innerHeight);
  const mobile = override === 'mobile' || (override !== 'desktop' && touch && coarse && shortSide <= 1024);
  const root = document.documentElement;
  root.dataset.mobile = String(mobile);
  if(mobile)window.PERFORMANCE_MODE_LOW=true;
  const profile = window.HappinessDevice = {
    mobile, blocked: false,
    asset(url) { return mobile && /\.glb(?:[?#]|$)/i.test(url) && !url.includes('/mobile/') ? url.replace(/([^/]+\.glb)/i,'mobile/$1') : url; },
  };
  const portraitQuery = matchMedia("(orientation: portrait)");
  function sync() {
    const previous = profile.blocked;
    profile.blocked = mobile && portraitQuery.matches;
    root.classList.toggle('portrait-blocked',profile.blocked);
    root.style.setProperty('--game-height',(window.visualViewport?.height || innerHeight)+'px');
    if (previous !== profile.blocked) {
      window.dispatchEvent(new CustomEvent('happiness:orientation',{detail:{blocked:profile.blocked}}));
      if(profile.blocked){window.GalDialogue?.setAutoMode?.(false);window.GalDialogue?.setSkipMode?.(false);window.MenuUI?.syncToggles?.();}
    }
  }
  for(const type of ['keydown','pointerdown','click'])document.addEventListener(type,e=>{if(profile.blocked&&!e.target.closest?.('#mobile-orientation')){e.preventDefault();e.stopImmediatePropagation();}},true);
  sync();
  const resync = () => { sync(); requestAnimationFrame(sync); };
  addEventListener('resize',resync);
  addEventListener('orientationchange',resync);
  addEventListener('pageshow',resync);
  if(portraitQuery.addEventListener)portraitQuery.addEventListener('change',resync);
  else portraitQuery.addListener?.(resync);
  window.visualViewport?.addEventListener('resize',resync);
  screen.orientation?.addEventListener('change',resync);
  function init() {
    if(!mobile)return;
    const exitButton=document.getElementById('exit-story');if(exitButton)exitButton.textContent='走出电梯';
    const overlay=document.getElementById('mobile-orientation');
    const fullscreen=document.createElement('button');fullscreen.id='mobile-fullscreen';fullscreen.textContent='全屏';fullscreen.setAttribute('aria-label','尝试全屏横屏');
    fullscreen.onclick=async()=>{try{await document.documentElement.requestFullscreen?.();await screen.orientation?.lock?.('landscape');}catch{};sync();};
    if(!document.documentElement.requestFullscreen){
      fullscreen.textContent='全屏方式';fullscreen.setAttribute('aria-label','查看无地址栏打开方式');
      fullscreen.onclick=()=>alert('Safari 的地址栏由浏览器控制。\n\n正式网址可通过 Safari 的分享菜单 → 添加到主屏幕（如有“作为网页 App 打开”，请开启），再从桌面图标进入。\n\n直接在浏览器中游玩也可以，游戏会适配地址栏下方的可见区域。');
    }
    if(!navigator.standalone&&!matchMedia('(display-mode: standalone)').matches)document.body.append(fullscreen);
    // Let touch dragging look around the fixed duty-room camera. Taps still collect objects.
    if(document.getElementById('root')){
      const hint=document.createElement('p');hint.id='mobile-duty-hint';hint.textContent='拖动画面观察 · 轻点物品查看或收取';document.body.append(hint);
      let drag=null,suppressUntil=0;
      document.addEventListener('pointerdown',e=>{
        if(e.pointerType!=='touch'||e.target.tagName!=='CANVAS'||profile.blocked||drag)return;
        suppressUntil=0;drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};
      });
      document.addEventListener('pointermove',e=>{
        if(!drag||drag.id!==e.pointerId)return;
        const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
        drag.x=e.clientX;drag.y=e.clientY;
        if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>12)drag.moved=true;
        if(drag.moved){
          suppressUntil=performance.now()+500;
          window.dispatchEvent(new CustomEvent('happiness:look-drag',{detail:{dx,dy}}));
        }
      });
      for(const type of ['pointerup','pointercancel'])document.addEventListener(type,e=>{
        if(drag?.id!==e.pointerId)return;
        if(drag.moved||type==='pointercancel')suppressUntil=performance.now()+500;
        drag=null;
      });
      document.addEventListener('click',e=>{if(e.target.tagName==='CANVAS'&&performance.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
      addEventListener('happiness:orientation',()=>{drag=null;});
    }
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
