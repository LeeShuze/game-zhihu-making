(() => {
  const STORAGE_KEY = "galgame-audio";

  const state = {
    master: 80,
    bgm: 70,
    se: 80,
    voice: 80,
    muted: false,
  };

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

  load();
  apply();

  window.AudioSettings = {
    get: () => ({ ...state }),
    set,
    effective,
  };
})();
