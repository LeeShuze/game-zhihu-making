import { recordStage, routeFrom, checkRoute } from '../flow.js';

if (!window.__avgReturnBound) {
  window.__avgReturnBound = true;
  addEventListener(
    'happiness-home:prologue-complete',
    () => {
      recordStage(sessionStorage, 'complete', { roomKey30F: true, flashlight: true });
      const next = routeFrom('elevator', document.baseURI);
      checkRoute(next)
        .then(() => {
          window.setTimeout(() => location.replace(next.href), 1400);
        })
        .catch(() => {});
    },
    { once: true }
  );
}
