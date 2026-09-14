(() => {
  const STORAGE_KEY = "galgame-audio";

  const state = {
    master: 80,
    bgm: 70,
    se: 80,
    voice: 80,
    muted: false,
  };

  let bgmEl = null;
  let currentSrc = "";
  let fadeTimer = 0;
  let unlockArmed = false;
  let bgmGen = 0;

  function clamp(n) {
    return Math.max(0, Math.min(100, Number(n) || 0));
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        Object.assign(state, {
          master: clamp(saved.master ?? state.master),
          bgm: clamp(saved.bgm ?? state.bgm),
          se: clamp(saved.se ?? state.se),
          voice: clamp(saved.voice ?? state.voice),
          muted: !!saved.muted,
        });
      }
    } catch (_) {
      /* ignore */
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    apply();
  }

  function effective(channel) {
    if (state.muted) return 0;
    return (state.master / 100) * (state[channel] / 100);
  }

  function apply() {
    document.documentElement.style.setProperty("--vol-master", String(state.master / 100));
    document.documentElement.style.setProperty("--vol-bgm", String(effective("bgm")));
    document.documentElement.style.setProperty("--vol-se", String(effective("se")));
    document.documentElement.style.setProperty("--vol-voice", String(effective("voice")));
    applyBgmVolume(false);
    window.dispatchEvent(new CustomEvent("gal-audio-change", { detail: { ...state } }));
  }

  function set(partial) {
    if (partial.master != null) state.master = clamp(partial.master);
    if (partial.bgm != null) state.bgm = clamp(partial.bgm);
    if (partial.se != null) state.se = clamp(partial.se);
    if (partial.voice != null) state.voice = clamp(partial.voice);
    if (partial.muted != null) state.muted = !!partial.muted;
    persist();
  }

  function targetBgmVolume() {
    return effective("bgm");
  }

  function applyBgmVolume(snap) {
    if (!bgmEl) return;
    if (snap || !fadeTimer) bgmEl.volume = targetBgmVolume();
  }

  function clearFade() {
    if (fadeTimer) {
      cancelAnimationFrame(fadeTimer);
      fadeTimer = 0;
    }
  }

  function fadeVolume(to, ms, onDone) {
    const el = bgmEl;
    if (!el) {
      onDone?.();
      return;
    }
    clearFade();
    const from = el.volume;
    const dur = Math.max(0, Number(ms) || 0);
    if (dur <= 0 || Math.abs(from - to) < 0.01) {
      el.volume = to;
      onDone?.();
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.volume = from + (to - from) * t;
      if (t < 1) {
        fadeTimer = requestAnimationFrame(tick);
        return;
      }
      fadeTimer = 0;
      el.volume = to;
      onDone?.();
    };
    fadeTimer = requestAnimationFrame(tick);
  }

  function ensureEl() {
    if (bgmEl) return bgmEl;
    bgmEl = new Audio();
    bgmEl.preload = "auto";
    bgmEl.loop = true;
    bgmEl.volume = targetBgmVolume();
    return bgmEl;
  }

  function armUnlock() {
    if (unlockArmed) return;
    unlockArmed = true;
    const tryPlay = () => {
      document.removeEventListener("pointerdown", tryPlay, true);
      unlockArmed = false;
      if (!currentSrc || !bgmEl) return;
      bgmEl.play().catch(() => {});
    };
    document.addEventListener("pointerdown", tryPlay, true);
  }

  function play(src, { loop = true, restart = false, fadeMs = 500 } = {}) {
    if (!src) return;
    const gen = ++bgmGen;
    const el = ensureEl();
    const same = currentSrc === src && !el.paused;
    if (same && !restart) {
      el.loop = loop !== false;
      applyBgmVolume(true);
      return;
    }
    clearFade();
    currentSrc = src;
    el.loop = loop !== false;
    if (!same) {
      el.src = src;
      try {
        el.currentTime = 0;
      } catch (_) {
        /* ignore */
      }
    }
    el.volume = 0;
    const start = () => {
      if (gen !== bgmGen) return;
      fadeVolume(targetBgmVolume(), fadeMs);
    };
    const p = el.play();
    if (p && typeof p.then === "function") {
      p.then(start).catch(() => {
        if (gen !== bgmGen) return;
        el.volume = targetBgmVolume();
        armUnlock();
      });
    } else {
      start();
    }
  }

  function stop({ fadeMs = 700 } = {}) {
    const gen = ++bgmGen;
    currentSrc = "";
    if (!bgmEl) return;
    const el = bgmEl;
    fadeVolume(0, fadeMs, () => {
      if (gen !== bgmGen) return;
      el.pause();
      el.removeAttribute("src");
      el.load();
    });
  }

  function syncFromStory(beats, upToIndex) {
    let src = null;
    let loop = true;
    if (!Array.isArray(beats)) {
      stop({ fadeMs: 0 });
      return;
    }
    const end = Math.max(0, Number(upToIndex) || 0);
    for (let i = 0; i <= end; i += 1) {
      const b = beats[i];
      if (b?.type !== "bgm") continue;
      if (b.stop) {
        src = null;
      } else if (b.src) {
        src = b.src;
        loop = b.loop !== false;
      }
    }
    if (src) play(src, { loop, restart: false, fadeMs: 0 });
    else stop({ fadeMs: 400 });
  }

  load();
  apply();

  window.AudioSettings = {
    get: () => ({ ...state }),
    set,
    effective,
  };

  window.GalAudio = {
    play,
    stop,
    syncFromStory,
  };
})();
