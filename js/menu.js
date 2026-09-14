(() => {
  function toast(msg) {
    const stage = document.getElementById("stage");
    if (!stage) return;
    let el = stage.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      stage.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("is-on"), 1400);
  }

  function renderHistory() {
    const list = document.getElementById("historyList");
    if (!list) return;
    const items = window.GalDialogue?.getHistory?.() || [];
    list.innerHTML = items
      .map((it) => {
        const who = it.speaker ? escapeHtml(it.speaker) : "旁白";
        const msg = escapeHtml(it.text || "");
        return `<div class="history-item"><p class="who">${who}</p><p class="msg">${msg}</p></div>`;
      })
      .join("");
    list.scrollTop = list.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openHistory(on) {
    const panel = document.getElementById("historyPanel");
    if (!panel) return;
    if (on) {
      renderHistory();
      panel.hidden = false;
    } else {
      panel.hidden = true;
    }
  }

  function syncToggles() {
    const autoBtn = document.querySelector('.vn-menu-btn[data-action="auto"]');
    const skipBtn = document.querySelector('.vn-menu-btn[data-action="skip"]');
    if (autoBtn) {
      const on = !!window.GalDialogue?.isAuto?.();
      autoBtn.setAttribute("aria-pressed", String(on));
      autoBtn.classList.toggle("is-active", on);
    }
    if (skipBtn) {
      const on = !!window.GalDialogue?.isSkip?.();
      skipBtn.classList.toggle("is-active", on);
    }
  }

  async function saveGame() {
    try {
      await window.SaveSystem.saveToSlot(1);
      toast("已保存到槽位 1");
    } catch (_) {
      toast("保存失败");
    }
  }

  async function loadGame() {
    try {
      toast("读取中…");
      await window.SaveSystem.loadFromSlot(1);
      syncToggles();
      toast("已读取槽位 1");
    } catch (_) {
      toast("没有存档");
    }
  }

  function init() {
    const menu = document.getElementById("vnMenu");
    if (!menu) return;

    menu.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      e.stopPropagation();
      const action = btn.dataset.action;

      if (action !== "settings") {
        window.SettingsUI?.close?.();
      }

      if (action === "back") {
        const ok = window.Story?.back?.();
        if (!ok) toast("没有更早的对话");
        return;
      }

      if (action === "history") {
        const panel = document.getElementById("historyPanel");
        openHistory(!!panel?.hidden);
        return;
      }

      if (action === "skip") {
        window.Story?.skipToggle?.();
        syncToggles();
        return;
      }

      if (action === "auto") {
        window.Story?.autoToggle?.();
        syncToggles();
        return;
      }

      if (action === "save") {
        if (e.shiftKey) loadGame();
        else saveGame();
        return;
      }
    });

    document.getElementById("historyClose")?.addEventListener("click", () => {
      openHistory(false);
    });

    const saveBtn = menu.querySelector('[data-action="save"]');
    saveBtn?.setAttribute("title", "快捷保存槽位1 / Shift读取 / 设置里管理全部存档");

    syncToggles();
  }

  window.MenuUI = { init, syncToggles, openHistory, toast, saveGame, loadGame };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
