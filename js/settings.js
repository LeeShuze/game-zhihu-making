(() => {
  const ASPECT_KEY = "galgame-aspect";

  let panel;
  let settingsBtn;
  let activeTab = "save";

  function toast(msg) {
    window.MenuUI?.toast?.(msg);
  }

  function isOpen() {
    return panel && !panel.hidden;
  }

  function open(tab) {
    if (!panel) return;
    if (tab) setTab(tab);
    else setTab(activeTab || "save");
    panel.hidden = false;
    settingsBtn?.setAttribute("aria-expanded", "true");
    refreshSaveList();
    refreshProgressList();
    syncAiUI();
    syncSoundUI();
    syncDisplayUI();
  }

  function close() {
    if (!panel) return;
    panel.hidden = true;
    settingsBtn?.setAttribute("aria-expanded", "false");
  }

  function toggle(force) {
    const shouldOpen = typeof force === "boolean" ? force : !isOpen();
    if (shouldOpen) open();
    else close();
  }

  function setTab(tab) {
    activeTab = tab;
    panel?.querySelectorAll("[data-settings-tab]").forEach((btn) => {
      const on = btn.dataset.settingsTab === tab;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", String(on));
    });
    panel?.querySelectorAll("[data-settings-pane]").forEach((pane) => {
      pane.hidden = pane.dataset.settingsPane !== tab;
    });
    if (tab === "save") refreshSaveList();
    if (tab === "progress") refreshProgressList();
    if (tab === "ai") syncAiUI();
  }

  function refreshProgressList() {
    const list = document.getElementById("progressNodeList");
    if (!list) return;
    const nodes = window.Story?.listProgressNodes?.() || [];
    const curIdx = window.Story?.getBeatIndex?.() ?? 0;
    const farIdx = window.Story?.getFarthestBeatIndex?.() ?? 0;
    if (!nodes.length) {
      list.innerHTML = `<p class="save-slot-summary">暂无进度节点。开始游戏后会出现。</p>`;
      return;
    }
    const currentNode = [...nodes].filter((n) => n.index <= curIdx).pop();
    list.innerHTML = nodes
      .map((node) => {
        const locked = node.index > farIdx;
        const isCur = currentNode && currentNode.index === node.index;
        const canBack = !locked && node.index < curIdx;
        const canFwd = !locked && node.index > curIdx && node.index <= farIdx;
        return `
          <article class="progress-node ${isCur ? "is-current" : ""} ${locked ? "is-locked" : ""}" data-node-index="${node.index}">
            <p class="progress-node-title">${escapeHtml(node.title)}</p>
            <div class="progress-node-actions">
              <button type="button" data-progress-act="back" data-index="${node.index}" ${canBack ? "" : "disabled"}>回退</button>
              <button type="button" data-progress-act="fwd" data-index="${node.index}" ${canFwd ? "" : "disabled"}>快进</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function syncAiUI() {
    const cfg = window.GalAI?.getConfig?.() || window.GalAI?.DEFAULTS || {};
    const enabled = document.getElementById("aiEnabled");
    const endpoint = document.getElementById("aiEndpoint");
    const model = document.getElementById("aiModel");
    const key = document.getElementById("aiApiKey");
    const hint = document.getElementById("aiHint");
    if (enabled) enabled.checked = !!cfg.enabled;
    if (endpoint) {
      endpoint.value =
        cfg.endpoint ||
        window.GalAI?.DEFAULTS?.endpoint ||
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
    }
    if (model) model.value = cfg.model || "qwen-plus";
    if (key) key.value = cfg.apiKey || "";
    if (hint) {
      const err = window.GalAI?.getLastError?.();
      hint.textContent = err
        ? `上次错误：${err}`
        : "国内推荐：阿里云百炼地址 + 模型 qwen-plus；可只填到 /v1，会自动补 /chat/completions";
    }
  }

  function saveAiSettings() {
    const cfg = window.GalAI?.setConfig?.({
      enabled: !!document.getElementById("aiEnabled")?.checked,
      endpoint: document.getElementById("aiEndpoint")?.value?.trim() || "",
      model: document.getElementById("aiModel")?.value?.trim() || "",
      apiKey: document.getElementById("aiApiKey")?.value?.trim() || "",
    });
    syncAiUI();
    toast(
      cfg?.apiKey
        ? cfg?.enabled
          ? "AI 设置已保存（失败支线 + 闲聊）"
          : "已保存：闲聊可用；失败支线需勾选「启用」"
        : "已保存（请填写 API Key 才能闲聊）"
    );
  }

  async function testAiConnection() {
    saveAiSettings();
    toast("正在测试…");
    const result = await window.GalAI?.testConnection?.();
    syncAiUI();
    if (result?.ok) toast("连接成功");
    else toast(`连接失败：${result?.error || "未知错误"}`);
  }

  function refreshSaveList() {
    const list = document.getElementById("saveSlotList");
    if (!list || !window.SaveSystem) return;
    const slots = window.SaveSystem.listSlots();
    list.innerHTML = slots
      .map(({ slot, data }) => {
        const empty = !data;
        const title = empty ? `槽位 ${slot}` : `槽位 ${slot}`;
        const summary = empty
          ? "空存档"
          : window.SaveSystem.summarize(data);
        const time = empty ? "" : window.SaveSystem.formatTime(data.savedAt);
        return `
          <article class="save-slot ${empty ? "is-empty" : ""}" data-slot="${slot}">
            <div class="save-slot-info">
              <h3>${title}</h3>
              <p class="save-slot-summary">${escapeHtml(summary)}</p>
              ${time ? `<p class="save-slot-time">${escapeHtml(time)}</p>` : ""}
            </div>
            <div class="save-slot-actions">
              <button type="button" data-save-act="write" data-slot="${slot}">保存</button>
              <button type="button" data-save-act="read" data-slot="${slot}" ${empty ? "disabled" : ""}>读取</button>
              <button type="button" data-save-act="delete" data-slot="${slot}" ${empty ? "disabled" : ""}>删除</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function syncSoundUI() {
    const audio = window.AudioSettings?.get?.();
    if (!audio) return;
    ["master", "bgm", "se", "voice"].forEach((key) => {
      const input = document.querySelector(`[data-vol="${key}"]`);
      const label = document.querySelector(`[data-vol-val="${key}"]`);
      if (input) input.value = String(audio[key]);
      if (label) label.textContent = `${audio[key]}%`;
    });
    const mute = document.getElementById("audioMute");
    if (mute) mute.checked = !!audio.muted;
  }

  function syncDisplayUI() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(ASPECT_KEY) || "null");
    } catch (_) {
      /* ignore */
    }
    const aspect = saved?.aspect || document.body.dataset.aspect || "16-9";
    document.querySelectorAll(".ratio-option").forEach((btn) => {
      btn.setAttribute("aria-checked", String(btn.dataset.aspect === aspect));
    });
  }

  function applyAspect(aspect, w, h) {
    document.body.dataset.aspect = aspect;
    document.body.style.setProperty("--aspect-w", String(w));
    document.body.style.setProperty("--aspect-h", String(h));
    document.querySelectorAll(".ratio-option").forEach((btn) => {
      btn.setAttribute("aria-checked", String(btn.dataset.aspect === aspect));
    });
    localStorage.setItem(ASPECT_KEY, JSON.stringify({ aspect, w: Number(w), h: Number(h) }));
    window.Game?.relayout?.();
  }

  function loadAspect() {
    try {
      const saved = JSON.parse(localStorage.getItem(ASPECT_KEY) || "null");
      if (saved?.aspect) {
        applyAspect(saved.aspect, saved.w, saved.h);
        return;
      }
    } catch (_) {
      /* ignore */
    }
    applyAspect("16-9", 16, 9);
  }

  /**
   * 返回主菜单：优先走同事主菜单钩子，否则占位提示。
   * 接入方式任选其一：
   *   window.GameHooks.goToMainMenu = () => { ... }
   *   document 监听 "gal-goto-main-menu"
   */
  function goToMainMenu() {
    close();
    if (typeof window.GameHooks?.goToMainMenu === "function") {
      window.GameHooks.goToMainMenu();
      return;
    }
    window.dispatchEvent(new CustomEvent("gal-goto-main-menu"));
    toast("主菜单尚未接入");
  }

  async function onSaveAction(act, slot) {
    if (!window.SaveSystem) return;
    try {
      if (act === "write") {
        await window.SaveSystem.saveToSlot(slot);
        toast(`已保存到槽位 ${slot}`);
        refreshSaveList();
        return;
      }
      if (act === "read") {
        close();
        toast("读取中…");
        await window.SaveSystem.loadFromSlot(slot);
        window.MenuUI?.syncToggles?.();
        toast(`已读取槽位 ${slot}`);
        return;
      }
      if (act === "delete") {
        if (!confirm(`确定删除槽位 ${slot} 的存档？`)) return;
        window.SaveSystem.clearSlot(slot);
        toast("已删除");
        refreshSaveList();
      }
    } catch (_) {
      toast(act === "read" ? "读取失败" : "操作失败");
    }
  }

  function init() {
    panel = document.getElementById("settingsPanel");
    settingsBtn = document.getElementById("settingsBtn");
    if (!panel) return;

    loadAspect();

    panel.querySelectorAll("[data-settings-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.settingsTab;
        if (tab === "title") {
          setTab("title");
          return;
        }
        setTab(tab);
      });
    });

    document.getElementById("settingsClose")?.addEventListener("click", close);

    panel.addEventListener("click", (e) => {
      if (e.target === panel) close();
    });

    document.getElementById("saveSlotList")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-save-act]");
      if (!btn || btn.disabled) return;
      onSaveAction(btn.dataset.saveAct, Number(btn.dataset.slot));
    });

    document.getElementById("progressNodeList")?.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-progress-act]");
      if (!btn || btn.disabled) return;
      const index = Number(btn.dataset.index);
      close();
      const ok = await window.Story?.jumpTo?.(index);
      if (!ok) toast("无法跳转到该节点");
      else toast(btn.dataset.progressAct === "back" ? "已回退" : "已快进");
    });

    document.getElementById("aiSaveBtn")?.addEventListener("click", saveAiSettings);
    document.getElementById("aiTestBtn")?.addEventListener("click", () => {
      testAiConnection();
    });

    panel.querySelectorAll("[data-vol]").forEach((input) => {
      input.addEventListener("input", () => {
        const key = input.dataset.vol;
        const val = Number(input.value);
        window.AudioSettings?.set?.({ [key]: val });
        const label = document.querySelector(`[data-vol-val="${key}"]`);
        if (label) label.textContent = `${val}%`;
      });
    });

    document.getElementById("audioMute")?.addEventListener("change", (e) => {
      window.AudioSettings?.set?.({ muted: e.target.checked });
    });

    panel.querySelectorAll(".ratio-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyAspect(btn.dataset.aspect, btn.dataset.w, btn.dataset.h);
      });
    });

    document.getElementById("confirmMainMenu")?.addEventListener("click", goToMainMenu);
    document.getElementById("cancelMainMenu")?.addEventListener("click", () => setTab("save"));

    settingsBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        e.preventDefault();
        close();
      }
    });

    // 不再用点击外侧自动关：全屏遮罩自身点击空白处关闭
  }

  window.SettingsUI = {
    open,
    close,
    toggle,
    isOpen,
    applyAspect,
    goToMainMenu,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
