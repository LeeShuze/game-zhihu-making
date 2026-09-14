import { recordStage, blackCover } from './flow.js';

addEventListener(
  'zhihu:enter-story',
  (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    const next = new URL('avg/', document.baseURI);
    const cover = blackCover();
    cover.style.transition = 'none';
    cover.style.opacity = '1';
    if (event.detail?.complete && !event.detail.complete()) {
      cover.remove();
      return;
    }
    recordStage(sessionStorage, 'avg');
    location.replace(next.href);
  },
  true
);
