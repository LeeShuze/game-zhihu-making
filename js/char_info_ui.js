(() => {
  let sets = window.CharInfo?.ensureSets?.(window.CharInfo.createState()) || {
    known: new Set(["ningnian"]),
    milestones: new Set(),
  };
  let activeId = null;

  function el(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function syncFromSets(next) {
    if (next) sets = window.CharInfo.ensureSets(next);
    if (activeId && !sets.known.has(activeId)) activeId = null;
    render();
    const btn = el("charInfoBtn");
    if (btn) {
      const n = sets.known.size;
      btn.setAttribute("data-count", String(n));
      btn.setAttribute("aria-label", `人物信息（${n}）`);
      const badge = el("charInfoBadge");
      if (badge) {
        badge.textContent = String(n);
        badge.hidden = n < 1;
      }
    }
  }

  function getState() {
    return window.CharInfo.toSave(sets);
  }

  function applyBeat(beat) {
    window.CharInfo.applyBeat(sets, beat);
    render();
  }

  function rebuildFromStory(beats, index) {
    sets = window.CharInfo.rebuildFromBeats(beats, index);
    syncFromSets(sets);
  }

  function showList() {
    activeId = null;
    render();
  }

  function showDetail(id) {
    if (!id || !sets.known.has(id)) return;
    activeId = id;
    render();
  }

  function render() {
    const list = el("charInfoList");
    const detail = el("charInfoDetail");
    const title = el("charInfoTitle");
    const back = el("charInfoBack");
    if (!list || !detail) return;

    if (activeId) {
      list.hidden = true;
      detail.hidden = false;
      if (back) back.hidden = false;
      if (title) title.textContent = "人物详情";
      renderDetail(activeId);
      return;
    }

    list.hidden = false;
    detail.hidden = true;
    if (back) back.hidden = true;
    if (title) title.textContent = "人物信息";
    renderList();
  }

  function renderList() {
    const list = el("charInfoList");
    if (!list) return;
    const entries = window.CharInfo.listEntries(sets, { includeUnknown: true });
    list.innerHTML = entries
      .map((e) => {
        if (!e.known) {
          return `
            <button type="button" class="char-info-card is-unknown" data-char-id="${e.id}" data-known="0" aria-label="尚未出现的人物">
              <span class="char-info-card-face-wrap">
                <span class="char-info-card-face is-unknown-mark" aria-hidden="true">？</span>
              </span>
              <span class="char-info-card-meta">
                <span class="char-info-card-name">？？？</span>
                <span class="char-info-card-title">尚未出现</span>
              </span>
            </button>
          `;
        }
        const img = e.portrait
          ? `<img class="char-info-card-face" src="${e.portrait}?v=charInfo3" alt="${escapeHtml(e.name)}" draggable="false" />`
          : `<span class="char-info-card-face is-empty"></span>`;
        return `
          <button type="button" class="char-info-card" data-char-id="${e.id}" data-known="1">
            <span class="char-info-card-face-wrap">${img}</span>
            <span class="char-info-card-meta">
              <span class="char-info-card-name">${escapeHtml(e.name)}</span>
              <span class="char-info-card-title">${escapeHtml(e.title)}</span>
            </span>
          </button>
        `;
      })
      .join("");
  }

  function renderDetail(id) {
    const detail = el("charInfoDetail");
    const e = window.CharInfo.resolveEntry(id, sets);
    if (!detail || !e) {
      showList();
      return;
    }
    const img = e.portrait
      ? `<img class="char-info-hero" src="${e.portrait}?v=charInfo3" alt="${escapeHtml(e.name)}" draggable="false" />`
      : "";
    detail.innerHTML = `
      <div class="char-info-detail-layout">
        <div class="char-info-hero-wrap">${img}</div>
        <div class="char-info-detail-body">
          <p class="char-info-detail-kicker">${escapeHtml(e.title)}</p>
          <h3 class="char-info-detail-name">${escapeHtml(e.name)}</h3>
          ${e.relation ? `<p class="char-info-relation">${escapeHtml(e.relation)}</p>` : ""}
          <dl class="char-info-facts">
            <div><dt>性别</dt><dd>${escapeHtml(e.gender)}</dd></div>
            <div><dt>年龄</dt><dd>${escapeHtml(e.age)}</dd></div>
            <div><dt>性格</dt><dd>${escapeHtml(e.personality)}</dd></div>
            <div class="is-wide"><dt>经历</dt><dd>${escapeHtml(e.experience)}</dd></div>
          </dl>
          <p class="char-info-status">${escapeHtml(e.text)}</p>
        </div>
      </div>
    `;
  }

  function open() {
    const panel = el("charInfoPanel");
    if (!panel) return;
    activeId = null;
    render();
    panel.hidden = false;
  }

  function close() {
    const panel = el("charInfoPanel");
    if (panel) panel.hidden = true;
    activeId = null;
  }

  function toggle() {
    const panel = el("charInfoPanel");
    if (!panel) return;
    if (panel.hidden) open();
    else close();
  }

  function init() {
    el("charInfoBtn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    });
    el("charInfoClose")?.addEventListener("click", (e) => {
      e.stopPropagation();
      close();
    });
    el("charInfoBack")?.addEventListener("click", (e) => {
      e.stopPropagation();
      showList();
    });
    el("charInfoList")?.addEventListener("click", (e) => {
      const card = e.target.closest?.("[data-char-id]");
      if (!card) return;
      e.stopPropagation();
      if (card.dataset.known === "0") {
        window.MenuUI?.toast?.("尚未相遇");
        return;
      }
      showDetail(card.dataset.charId);
    });
    el("charInfoPanel")?.addEventListener("click", (e) => {
      if (e.target === el("charInfoPanel")) close();
    });
    syncFromSets(sets);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.CharInfoUI = {
    syncFromSets,
    getState,
    applyBeat,
    rebuildFromStory,
    open,
    close,
    toggle,
  };
})();
