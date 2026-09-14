(() => {
  const histories = {};
  let currentNpc = null;
  let boundUi = null;
  let onKey = null;
  let sending = false;

  function resolveGreeting(npc) {
    if (!npc) return "……";
    if (npc.greeting) return npc.greeting;
    const cat = window.AmbientNpcs?.getCatalogEntry?.(npc.id);
    if (cat?.greeting) return cat.greeting;
    if (Array.isArray(npc.fallback) && npc.fallback[0]) return npc.fallback[0];
    return "……";
  }

  function setHint(text) {
    const hint = boundUi?.hintEl;
    if (!hint) return;
    hint.textContent = text || "输入发送 · Esc 关闭";
  }

  /** 每次打开都直绑按钮，避免 dialog.stopPropagation 吃掉委托点击 */
  function wireControls(ui) {
    if (!ui) return;
    boundUi = ui;
    if (ui.aiClose) {
      ui.aiClose.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        close();
      };
    }
    if (ui.aiSend) {
      ui.aiSend.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        send();
      };
    }
    if (ui.aiInput) {
      ui.aiInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          send();
        }
      };
    }
  }

  function open(npc) {
    if (!npc || !window.GalDialogue?.openNpcChatUI) return;
    const cat = window.AmbientNpcs?.getCatalogEntry?.(npc.id);
    currentNpc = {
      ...cat,
      ...npc,
      role: npc.role || cat?.role,
      greeting: npc.greeting || cat?.greeting,
      fallback: npc.fallback || cat?.fallback,
    };
    const id = currentNpc.id;
    if (!histories[id]) histories[id] = [];

    const greeting = resolveGreeting(currentNpc);
    if (histories[id].length === 0 && greeting && greeting !== "……") {
      histories[id].push({ role: "assistant", content: greeting });
    }
    const lastNpc = [...histories[id]]
      .reverse()
      .find((m) => m.role === "assistant");
    const openText = lastNpc?.content || greeting;

    window.Game?.setExplorationEnabled?.(false);

    const ui = window.GalDialogue.openNpcChatUI({
      name: currentNpc.name || "对方",
      sprite: currentNpc.sprite,
      text: openText,
      side: "right",
    });
    wireControls(ui);
    setHint("输入发送 · Esc 关闭");

    if (onKey) document.removeEventListener("keydown", onKey);
    onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);

    if (ui?.aiInput) {
      ui.aiInput.value = "";
      ui.aiInput.disabled = false;
      ui.aiInput.focus();
    }
    if (ui?.aiSend) ui.aiSend.disabled = false;
  }

  function close() {
    if (onKey) {
      document.removeEventListener("keydown", onKey);
      onKey = null;
    }
    currentNpc = null;
    sending = false;
    window.GalDialogue?.setNpcChatBusy?.(false);
    window.GalDialogue?.closeNpcChatUI?.();
    window.Game?.setExploreCharsHidden?.(false);
    window.Game?.setExplorationEnabled?.(true);
  }

  async function send() {
    if (!currentNpc || sending) return;
    const stage = document.getElementById("stage");
    const input =
      boundUi?.aiInput || stage?.querySelector?.(".vn-ai-input");
    const text = String(input?.value || "").trim();
    if (!text) return;

    const npcId = currentNpc.id;
    const npcName = currentNpc.name || "对方";
    histories[npcId] = histories[npcId] || [];
    histories[npcId].push({ role: "user", content: text });
    if (input) input.value = "";

    sending = true;
    window.GalDialogue?.setNpcChatBusy?.(true);
    window.GalDialogue?.setNpcChatLine?.({
      name: "宁念",
      text,
      generating: false,
    });
    setHint("……");

    await new Promise((r) => setTimeout(r, 160));
    if (!currentNpc || currentNpc.id !== npcId) {
      sending = false;
      window.GalDialogue?.setNpcChatBusy?.(false);
      return;
    }

    window.GalDialogue?.setNpcChatLine?.({
      name: npcName,
      generating: true,
    });

    const histForApi = histories[npcId].slice(0, -1);
    const result = await window.GalAI?.chatNpc?.({
      npc: currentNpc,
      userText: text,
      history: histForApi,
      stage: currentNpc.stage,
    });
    const reply = result?.text || "……";
    histories[npcId].push({ role: "assistant", content: reply });

    if (!currentNpc || currentNpc.id !== npcId) {
      sending = false;
      window.GalDialogue?.setNpcChatBusy?.(false);
      return;
    }

    window.GalDialogue?.setNpcChatLine?.({
      name: npcName,
      text: reply,
      generating: false,
    });
    window.GalDialogue?.setNpcChatBusy?.(false);
    sending = false;

    // 关闭按钮在忙碌时也始终可用：只禁用发送与输入
    if (boundUi?.aiClose) boundUi.aiClose.disabled = false;

    if (result?.source === "ai") {
      setHint("输入发送 · Esc 关闭");
    } else if (result?.source === "fallback") {
      const why = result.error || window.GalAI?.getLastError?.() || "本地短句";
      setHint(`（未连上 AI：${String(why).slice(0, 28)}）`);
    } else {
      setHint("输入发送 · Esc 关闭");
    }

    (boundUi?.aiInput || input)?.focus();
  }

  function clearHistories() {
    Object.keys(histories).forEach((k) => delete histories[k]);
  }

  window.AmbientChat = { open, close, clearHistories };
})();
