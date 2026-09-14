export const FLOW_KEY = 'happiness-home:prologue:v1';
export const WORK_ID = '1747681485547843585';
export function hasDepartureItems(inventory) { return inventory?.roomKey30F === true && inventory?.flashlight === true; }
export function routeFrom(stage, base) {
  const routes = {
    entrance: 'avg/',
    avg: '../duty/',
    duty: '../elevator/?from=duty',
    elevator: '../avg/?from=elevator',
  };
  if(!routes[stage])throw new Error('Unknown departure stage');
  return new URL(routes[stage],base);
}
export function recordStage(storage, stage, inventory = {}) {
  const state={version:1,workId:WORK_ID,chapter:'幸福之家',stage,inventory,updatedAt:Date.now()};
  try{storage.setItem(FLOW_KEY,JSON.stringify(state));}catch{/* The one-way flow still works if storage is disabled. */}
  return state;
}
export async function checkRoute(url) {
  const response=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error('下一段暂时无法加载，请重试。');
}
export function blackCover() {
  const cover=document.createElement('div');cover.setAttribute('aria-label','正在切换场景');
  cover.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#000;opacity:0;transition:opacity 350ms ease;';
  document.body.append(cover);return cover;
}
export function warmNext(manifestUrl) {
  // Browser-managed low-priority downloads only. No iframe, JS execution, audio or WebGL context.
  const controller=new AbortController();
  addEventListener('pagehide',()=>controller.abort(),{once:true});
  const begin=async()=>{
    try{
      const response=await fetch(manifestUrl,{signal:controller.signal});if(!response.ok)return;
      const urls=await response.json();if(controller.signal.aborted)return;
      for(const relative of urls){const link=document.createElement('link');link.rel='prefetch';link.href=new URL(relative,manifestUrl).href;document.head.append(link);}
    }catch{/* Warming is optional; normal stage loading owns any visible errors. */}
  };
  if(document.readyState==='complete')begin();else addEventListener('load',begin,{once:true});
}
