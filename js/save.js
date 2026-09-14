(() => {
  const PREFIX = "galgame-save-slot-";
  const SLOT_COUNT = 6;

  function slotKey(n) {
    return `${PREFIX}${n}`;
  }

  function readSlot(n) {
    try {
      const raw = localStorage.getItem(slotKey(n));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function writeSlot(n, data) {
    localStorage.setItem(slotKey(n), JSON.stringify(data));
  }

  function clearSlot(n) {
    localStorage.removeItem(slotKey(n));
  }

  function listSlots() {
    return Array.from({ length: SLOT_COUNT }, (_, i) => {
      const slot = i + 1;
      return { slot, data: readSlot(slot) };
    });
  }

  function buildSavePayload() {
    return (
      window.Story?.getSaveData?.() || {
        version: 1,
        sceneId: window.Game?.getCurrentScene?.() || null,
        livingVariant: window.Game?.getVariant?.("floor30_living") || "dirty",
        savedAt: Date.now(),
      }
    );
  }

  function formatTime(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleString("zh-CN", { hour12: false });
    } catch (_) {
      return "";
    }
  }

  function summarize(data) {
    if (!data) return "空存档";
    const scene = data.sceneId || "未知场景";
    const story = data.storyId ? `剧情 ${data.storyId}` : "自由探索";
    const beat =
      Number.isFinite(data.beatIndex) && data.playing !== false
        ? ` · 进度 #${data.beatIndex}`
        : "";
    const horror =
      data.horror != null ? ` · 惊悚 ${Math.round(Number(data.horror) || 0)}` : "";
    return `${story}${beat}${horror} · ${scene}`;
  }

  async function saveToSlot(n) {
    const data = { ...buildSavePayload(), savedAt: Date.now(), slot: n };
    writeSlot(n, data);
    return data;
  }

  async function loadFromSlot(n) {
    const data = readSlot(n);
    if (!data) throw new Error("empty");
    await window.Story?.loadSaveData?.(data);
    return data;
  }

  // 迁移旧单槽
  try {
    const legacy = localStorage.getItem("galgame-save-slot1");
    if (legacy && !localStorage.getItem(slotKey(1))) {
      localStorage.setItem(slotKey(1), legacy);
    }
  } catch (_) {
    /* ignore */
  }

  window.SaveSystem = {
    SLOT_COUNT,
    listSlots,
    readSlot,
    saveToSlot,
    loadFromSlot,
    clearSlot,
    summarize,
    formatTime,
  };
})();
