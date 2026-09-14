(() => {
  let activeSession = null;
  let autoMode = false;
  let skipMode = false;
  let autoTimer = null;
  const historyLog = [];
  const AUTO_MS = 2600;
  const SKIP_MS = 40;

  function ensureUI(stage) {
    let layer = stage.querySelector(".vn-layer");
    if (layer && (!layer.querySelector(".vn-dock") || !layer.querySelector(".vn-ai-row"))) {
      layer.remove();
      layer = null;
    }
    if (layer) {
      return {
        layer,
        dock: layer.querySelector(".vn-dock"),
        chars: layer.querySelector(".vn-stage-chars"),
        dialog: layer.querySelector(".vn-dialog"),
        nameEl: layer.querySelector(".vn-dialog-name"),
        textEl: layer.querySelector(".vn-dialog-text"),
        hintEl: layer.querySelector(".vn-dialog-hint"),
        aiRow: layer.querySelector(".vn-ai-row"),
        aiInput: layer.querySelector(".vn-ai-input"),
        aiSend: layer.querySelector(".vn-ai-send"),
        aiClose: layer.querySelector(".vn-ai-close"),
        advanceEl: layer.querySelector("[data-vn-advance]"),
      };
    }

    layer = document.createElement("div");
    layer.className = "vn-layer";
    layer.hidden = true;
    layer.innerHTML = `
      <div class="vn-click-catcher" data-vn-advance tabindex="0" aria-label="点击继续对话"></div>
      <div class="vn-dock">
        <div class="vn-stage-chars" aria-hidden="true"></div>
        <div class="vn-dialog" role="dialog" aria-live="polite">
          <div class="vn-dialog-name"></div>
          <p class="vn-dialog-text"></p>
          <span class="vn-dialog-hint">点击继续 ▾</span>
          <div class="vn-ai-row" hidden>
            <input class="vn-ai-input" type="text" maxlength="200" placeholder="直接说点什么…" autocomplete="off" />
            <button type="button" class="vn-ai-send">发送</button>
            <button type="button" class="vn-ai-close">关闭</button>
          </div>
        </div>
      </div>
    `;
    stage.appendChild(layer);
    return {
      layer,
      dock: layer.querySelector(".vn-dock"),
      chars: layer.querySelector(".vn-stage-chars"),
      dialog: layer.querySelector(".vn-dialog"),
      nameEl: layer.querySelector(".vn-dialog-name"),
      textEl: layer.querySelector(".vn-dialog-text"),
      hintEl: layer.querySelector(".vn-dialog-hint"),
      aiRow: layer.querySelector(".vn-ai-row"),
      aiInput: layer.querySelector(".vn-ai-input"),
      aiSend: layer.querySelector(".vn-ai-send"),
      aiClose: layer.querySelector(".vn-ai-close"),
      advanceEl: layer.querySelector("[data-vn-advance]"),
    };
  }

  function afterPaint(fn) {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }

  function spriteUrl(sprite) {
    const s = String(sprite || "");
    if (!s) return "";
    return `${s}${s.includes("?") ? "&" : "?"}v=newArt1`;
  }

  function dismissChar(el) {
    if (!el || el.dataset.leaving === "1") return;
    el.dataset.leaving = "1";
    el.classList.remove("is-visible");
    const tidy = () => {
      if (el.parentNode && el.dataset.leaving === "1") el.remove();
    };
    el.addEventListener("transitionend", tidy, { once: true });
    window.setTimeout(tidy, 700);
  }

  function revealChar(el) {
    if (!el || el.classList.contains("is-visible")) return;
    el.getBoundingClientRect();
    afterPaint(() => {
      if (!el.parentNode || el.dataset.leaving === "1") return;
      el.classList.add("is-visible");
    });
  }

  function setSlots(ui, slots, activeSide) {
    const incoming = new Map();
    (slots || []).forEach((slot) => {
      if (!slot?.sprite) return;
      incoming.set(slot.side || "right", slot);
    });

    [...ui.chars.children].forEach((el) => {
      const side = el.dataset.side;
      if (!incoming.has(side)) dismissChar(el);
    });

    incoming.forEach((slot, side) => {
      let el = ui.chars.querySelector(`.vn-character[data-side="${side}"]`);
      const isNew = !el;
      if (el?.dataset.leaving === "1") {
        delete el.dataset.leaving;
      }
      if (!el) {
        el = document.createElement("div");
        el.className = `vn-character side-${side} is-body-34`;
        el.dataset.side = side;
        const img = document.createElement("img");
        img.draggable = false;
        el.appendChild(img);
        ui.chars.appendChild(el);
      }
      el.classList.toggle("is-dim", !!(activeSide && slot.side && slot.side !== activeSide));
      const img = el.querySelector("img");
      const src = spriteUrl(slot.sprite);
      if (img && el.dataset.sprite !== slot.sprite) {
        el.dataset.sprite = slot.sprite;
        img.src = src;
      }
      if (img) img.alt = slot.name || "";
      if (isNew) revealChar(el);
      else if (!el.classList.contains("is-visible")) revealChar(el);
    });
  }

  function pushHistory(line) {
    if (!line?.text) return;
    historyLog.push({
      speaker:
        line.speaker ||
        (line.type === "system" ? "系统" : line.type === "danmaku" ? "弹幕" : ""),
      text: line.text,
      type: line.type || "say",
    });
  }

  function popHistory(n = 1) {
    for (let i = 0; i < n; i += 1) historyLog.pop();
  }

  function clearAutoTimer() {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
  }

  function scheduleAuto() {
    clearAutoTimer();
    if (!activeSession || activeSession.locked) return;
    if (!autoMode && !skipMode) return;
    const delay = skipMode ? SKIP_MS : AUTO_MS;
    autoTimer = setTimeout(() => {
      activeSession?.advance?.();
    }, delay);
  }

  function playDialogue(opts) {
    const stage = document.getElementById("stage");
    if (!stage) return Promise.resolve("done");

    let lines = opts.lines || [];
    if (!lines.length) return Promise.resolve("done");

    if (typeof lines[0] === "string") {
      lines = lines.map((text) => ({
        text,
        speaker: opts.speaker || "",
        type: "say",
        sprite: opts.sprite,
        side: opts.side || "right",
      }));
    }

    if (activeSession?.abort) activeSession.abort(true);

    const ui = ensureUI(stage);
    let index = 0;
    let locked = false;
    let finished = false;
    let currentSlots = opts.slots || [];
    let onKey = null;
    const skipInitialHistory = opts.recordHistory === false;

    return new Promise((resolve) => {
      const finish = (reason) => {
        if (finished) return;
        finished = true;
        locked = true;
        clearAutoTimer();
        if (onKey) document.removeEventListener("keydown", onKey);
        const delay =
          reason === "aborted" || reason === "back" || skipMode || opts.keepVisible ? 0 : 220;
        window.setTimeout(() => {
          // 新对话已经接上时，不要把当前层藏掉（读档/重播会 abort 上一句）
          if (activeSession?.resolve !== resolve) {
            resolve(reason || "done");
            return;
          }
          if (
            opts.keepVisible ||
            ui.dialog.classList.contains("is-generating") ||
            ui.dialog.classList.contains("is-choices") ||
            ui.dialog.classList.contains("is-held")
          ) {
            activeSession = null;
            resolve(reason || "done");
            return;
          }
          ui.dialog.classList.remove("is-visible", "is-system", "is-danmaku");
          [...ui.chars.children].forEach((c) => c.classList.remove("is-visible"));
          ui.layer.hidden = true;
          ui.layer.classList.remove("is-active");
          ui.chars.innerHTML = "";
          activeSession = null;
          resolve(reason || "done");
        }, delay);
      };

      const showLine = ({ recordHistory = true } = {}) => {
        const line = lines[index];
        const type = line.type || "say";

        ui.dialog.classList.remove("is-choices", "is-generating", "is-held");
        const choiceBox = ui.dialog.querySelector(".vn-dialog-choices");
        if (choiceBox) {
          choiceBox.hidden = true;
          choiceBox.innerHTML = "";
        }
        if (ui.textEl) ui.textEl.hidden = false;
        if (ui.hintEl) {
          ui.hintEl.hidden = false;
          ui.hintEl.textContent = "点击继续 ▾";
        }
        ui.dialog.classList.toggle("is-system", type === "system");
        ui.dialog.classList.toggle("is-danmaku", type === "danmaku");

        if (line.slots) currentSlots = line.slots;

        let slots = currentSlots;
        if (line.sprite) {
          const side = line.side || "right";
          const others = (currentSlots || []).filter((s) => s.side !== side);
          slots = [...others, { side, sprite: line.sprite, name: line.speaker }];
          currentSlots = slots;
        }

        if ((type === "narration" || type === "system" || type === "danmaku") && line.clearSprites) {
          currentSlots = [];
          slots = [];
        }

        const activeSide =
          type === "say" && line.sprite ? line.side || "right" : line.focusSide || null;
        setSlots(ui, slots, activeSide);

        ui.nameEl.textContent =
          line.speaker ||
          (type === "system" ? "系统" : type === "danmaku" ? "弹幕" : "");
        ui.dialog.classList.remove("is-generating");
        ui.textEl.textContent = line.text || "";
        ui.dialog.classList.add("is-visible");
        if (recordHistory) pushHistory(line);
        scheduleAuto();
      };

      const advance = () => {
        if (locked) return;
        if (index < lines.length - 1) {
          index += 1;
          showLine();
          return;
        }
        finish("done");
      };

      const back = () => {
        if (locked) return false;
        if (index > 0) {
          index -= 1;
          popHistory(1);
          showLine({ recordHistory: false });
          return true;
        }
        // 本段第一句：不改历史，由剧情引擎决定是否跳到上一个对话框
        finish("back");
        return true;
      };

      onKey = (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
          e.preventDefault();
          advance();
        }
      };

      activeSession = {
        resolve,
        advance,
        back,
        abort: (silent) => finish(silent ? "aborted" : "done"),
        getIndex: () => index,
      };

      Object.defineProperty(activeSession, "locked", {
        get: () => locked,
      });

      ui.layer.hidden = false;
      ui.layer.classList.add("is-active");
      showLine({ recordHistory: !skipInitialHistory });

      ui.advanceEl.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (skipMode || autoMode) return;
        advance();
      };
      ui.dialog.style.pointerEvents = "auto";
      ui.dialog.onclick = (e) => {
        e.stopPropagation();
        if (skipMode || autoMode) return;
        advance();
      };
      document.addEventListener("keydown", onKey);
    });
  }

  const CHOICE_ICON = `<span class="story-choice-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.6" />
      <path d="M7.5 10.2c0-2.1 1.9-3.7 4.5-3.7s4.5 1.6 4.5 3.7c0 1.5-1 2.7-2.5 3.3v1.1h-4v-1.1c-1.5-.6-2.5-1.8-2.5-3.3z" fill="currentColor"/>
      <circle cx="12" cy="17.2" r="1" fill="currentColor" />
    </svg>
  </span>`;

  let choiceFinish = null;

  function isChoicesOpen() {
    if (choiceFinish) return true;
    const panel = document.getElementById("storyChoicePanel");
    return !!(panel && !panel.hidden);
  }

  function clearDialogChoices(ui) {
    if (!ui?.dialog) return;
    ui.dialog.classList.remove("is-choices", "is-held");
    const box = ui.dialog.querySelector(".vn-dialog-choices");
    if (box) {
      box.hidden = true;
      box.innerHTML = "";
    }
    if (ui.textEl) ui.textEl.hidden = false;
  }

  /** 钉住上一句对白，不推进；选项叠在这句对话框上面 */
  function holdDialogueLine(line = {}, { waiting = false } = {}) {
    const stage = document.getElementById("stage");
    if (!stage || !String(line.text || "").trim()) return;
    const ui = ensureUI(stage);
    ui.layer.hidden = false;
    ui.layer.classList.add("is-active");

    const type = line.type || "say";
    ui.dialog.classList.remove("is-choices", "is-generating", "is-chat");
    ui.dialog.classList.toggle("is-system", type === "system");
    ui.dialog.classList.toggle("is-danmaku", type === "danmaku");
    ui.dialog.classList.add("is-visible", "is-held");

    let slots = line.slots || [];
    if (line.sprite) {
      const side = line.side || "right";
      const others = (slots || []).filter((s) => s.side !== side);
      slots = [...others, { side, sprite: line.sprite, name: line.speaker }];
    }
    const activeSide =
      type === "say" ? line.side || line.focusSide || null : line.focusSide || null;
    setSlots(ui, slots, activeSide);

    ui.nameEl.textContent =
      line.speaker ||
      (type === "system" ? "系统" : type === "danmaku" ? "弹幕" : "");
    ui.textEl.hidden = false;
    ui.textEl.textContent = line.text;
    if (ui.hintEl) {
      if (waiting) {
        ui.hintEl.hidden = false;
        ui.hintEl.textContent = "……";
      } else {
        ui.hintEl.hidden = true;
      }
    }
    const choiceBox = ui.dialog.querySelector(".vn-dialog-choices");
    if (choiceBox) {
      choiceBox.hidden = true;
      choiceBox.innerHTML = "";
    }
    blockAdvance(ui);
  }

  function showChoices({ prompt, options, slots, placement, holdLine }) {
    const above = placement === "above" || placement === "dialog";
    const panel = document.getElementById("storyChoicePanel");
    const promptEl = document.getElementById("storyChoicePrompt");
    const list = document.getElementById("storyChoiceList");
    if (!panel || !list) return Promise.resolve(null);

    window.GalDialogue?.setSkipMode?.(false);
    window.GalDialogue?.setAutoMode?.(false);
    window.MenuUI?.syncToggles?.();

    const stage = document.getElementById("stage");
    const ui = stage ? ensureUI(stage) : null;
    if (ui) clearDialogChoices(ui);

    if (above && holdLine?.text) {
      holdDialogueLine({ ...holdLine, slots: holdLine.slots || slots });
    } else if (ui && slots?.length) {
      ui.layer.hidden = false;
      ui.layer.classList.add("is-active");
      setSlots(ui, slots, null);
    }

    panel.classList.toggle("is-above-dialog", above);
    if (promptEl) promptEl.textContent = prompt || "你打算怎么做？";
    list.innerHTML = "";
    panel.hidden = false;

    return new Promise((resolve) => {
      let settled = false;
      const finish = (opt) => {
        if (settled) return;
        settled = true;
        choiceFinish = null;
        panel.hidden = true;
        panel.classList.remove("is-above-dialog");
        list.innerHTML = "";
        resolve(opt);
      };
      choiceFinish = () => finish(null);
      (options || []).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "story-choice";
        btn.innerHTML = `${CHOICE_ICON}<span class="story-choice-label"></span>`;
        btn.querySelector(".story-choice-label").textContent = opt.label;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          finish(opt);
        });
        list.appendChild(btn);
      });
    });
  }

  function hideChoices() {
    if (choiceFinish) {
      choiceFinish();
      return;
    }
    const panel = document.getElementById("storyChoicePanel");
    if (panel) {
      panel.hidden = true;
      panel.classList.remove("is-above-dialog");
    }
    const stage = document.getElementById("stage");
    if (!stage) return;
    const dialog = stage.querySelector(".vn-dialog");
    if (dialog) {
      clearDialogChoices({
        dialog,
        textEl: stage.querySelector(".vn-dialog-text"),
        hintEl: stage.querySelector(".vn-dialog-hint"),
      });
    }
  }

  /** 对话框内三点：等待 AI / 本地失败线生成，不可点击推进 */
  function showGenerating({ slots } = {}) {
    const stage = document.getElementById("stage");
    if (!stage) return;
    if (activeSession?.abort) activeSession.abort(true);
    clearAutoTimer();

    const ui = ensureUI(stage);
    ui.layer.hidden = false;
    ui.layer.classList.add("is-active");
    if (slots?.length) setSlots(ui, slots, null);

    ui.nameEl.textContent = "";
    ui.dialog.classList.remove("is-system", "is-danmaku", "is-choices");
    ui.dialog.classList.add("is-visible", "is-generating");
    const choiceBox = ui.dialog.querySelector(".vn-dialog-choices");
    if (choiceBox) {
      choiceBox.hidden = true;
      choiceBox.innerHTML = "";
    }
    ui.textEl.hidden = false;
    ui.textEl.innerHTML =
      '<span class="vn-generating-dots" aria-label="正在生成"><i></i><i></i><i></i></span>';

    const block = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    ui.advanceEl.onclick = block;
    ui.dialog.onclick = (e) => e.stopPropagation();
    ui.dialog.style.pointerEvents = "auto";
  }

  function hideGenerating() {
    const stage = document.getElementById("stage");
    if (!stage) return;
    const layer = stage.querySelector(".vn-layer");
    if (!layer) return;
    const dialog = layer.querySelector(".vn-dialog");
    const textEl = layer.querySelector(".vn-dialog-text");
    if (dialog) dialog.classList.remove("is-generating");
    if (textEl && dialog?.classList.contains("is-visible")) {
      /* 留给后续 showBeat 覆盖正文 */
    }
  }

  function showBeat(beat, opts = {}) {
    if (!beat) return Promise.resolve("done");
    if (beat.lines) {
      return playDialogue({
        ...beat,
        recordHistory: opts.recordHistory,
        keepVisible: opts.keepVisible,
      });
    }
    if (beat.text) {
      return playDialogue({
        lines: [
          {
            text: beat.text,
            speaker: beat.speaker || "",
            type: beat.type || "narration",
            sprite: beat.sprite,
            side: beat.side,
            slots: beat.slots,
            clearSprites: beat.clearSprites,
            focusSide: beat.focusSide,
          },
        ],
        slots: beat.slots,
        recordHistory: opts.recordHistory,
        keepVisible: opts.keepVisible,
      });
    }
    return Promise.resolve("done");
  }

  let chatMode = false;

  function blockAdvance(ui) {
    const block = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    ui.advanceEl.onclick = block;
    ui.dialog.onclick = (e) => e.stopPropagation();
    ui.dialog.style.pointerEvents = "auto";
  }

  /** 闲聊：复用剧情对话框 + 底部输入行（对齐 movable playable） */
  function openNpcChatUI({ name, sprite, text, side = "right" } = {}) {
    const stage = document.getElementById("stage");
    if (!stage) return null;
    if (activeSession?.abort) activeSession.abort(true);
    clearAutoTimer();
    chatMode = true;

    const ui = ensureUI(stage);
    ui.layer.hidden = false;
    ui.layer.classList.add("is-active", "is-chat");
    if (sprite) {
      setSlots(ui, [{ side, sprite, name: name || "" }], side);
    } else {
      ui.chars.innerHTML = "";
    }

    ui.nameEl.textContent = name || "";
    ui.dialog.classList.remove("is-system", "is-danmaku", "is-generating", "is-held", "is-choices");
    ui.dialog.classList.add("is-visible", "is-chat");
    ui.textEl.hidden = false;
    ui.textEl.textContent = text || "你可以直接说话。";
    if (ui.hintEl) {
      ui.hintEl.textContent = "输入发送 · Esc 关闭";
      ui.hintEl.hidden = false;
    }
    if (ui.aiRow) ui.aiRow.hidden = false;
    blockAdvance(ui);
    return ui;
  }

  function setNpcChatLine({ name, text, generating = false } = {}) {
    const stage = document.getElementById("stage");
    if (!stage) return;
    const ui = ensureUI(stage);
    if (name != null) ui.nameEl.textContent = name;
    ui.dialog.classList.toggle("is-generating", !!generating);
    if (generating) {
      ui.textEl.innerHTML =
        '<span class="vn-generating-dots" aria-label="正在生成"><i></i><i></i><i></i></span>';
    } else {
      ui.textEl.textContent = text || "";
    }
  }

  function setNpcChatBusy(busy) {
    const stage = document.getElementById("stage");
    if (!stage) return;
    const ui = ensureUI(stage);
    if (ui.aiSend) ui.aiSend.disabled = !!busy;
    if (ui.aiInput) ui.aiInput.disabled = !!busy;
    // 关闭必须随时可点
    if (ui.aiClose) ui.aiClose.disabled = false;
  }

  function closeNpcChatUI() {
    const stage = document.getElementById("stage");
    if (!stage) return;
    chatMode = false;
    const ui = ensureUI(stage);
    if (ui.aiRow) ui.aiRow.hidden = true;
    if (ui.aiInput) {
      ui.aiInput.value = "";
      ui.aiInput.disabled = false;
    }
    if (ui.aiSend) ui.aiSend.disabled = false;
    ui.dialog.classList.remove("is-visible", "is-chat", "is-generating");
    if (ui.hintEl) {
      ui.hintEl.textContent = "点击继续 ▾";
      ui.hintEl.hidden = false;
    }
    [...ui.chars.children].forEach((c) => c.classList.remove("is-visible"));
    ui.chars.innerHTML = "";
    ui.layer.classList.remove("is-active", "is-chat");
    ui.layer.hidden = true;
  }

  function releaseHeldDialogue() {
    if (chatMode) return;
    const stage = document.getElementById("stage");
    if (!stage) return;
    const layer = stage.querySelector(".vn-layer");
    if (!layer) return;
    const dialog = layer.querySelector(".vn-dialog");
    if (!dialog?.classList.contains("is-held")) return;
    dialog.classList.remove("is-held", "is-visible", "is-system", "is-danmaku", "is-generating");
    const chars = layer.querySelector(".vn-stage-chars");
    if (chars) chars.innerHTML = "";
    const textEl = layer.querySelector(".vn-dialog-text");
    if (textEl) textEl.hidden = false;
    const hintEl = layer.querySelector(".vn-dialog-hint");
    if (hintEl) {
      hintEl.hidden = false;
      hintEl.textContent = "点击继续 ▾";
    }
    layer.classList.remove("is-active");
    layer.hidden = true;
  }

  function isNpcChatOpen() {
    return chatMode;
  }

  window.GalDialogue = {
    playDialogue,
    showBeat,
    showChoices,
    hideChoices,
    isChoicesOpen,
    holdDialogueLine,
    releaseHeldDialogue,
    showGenerating,
    hideGenerating,
    openNpcChatUI,
    setNpcChatLine,
    setNpcChatBusy,
    closeNpcChatUI,
    isNpcChatOpen,
    advance: () => activeSession?.advance?.(),
    abort: (silent = true) => activeSession?.abort?.(silent),
    back: () => activeSession?.back?.() || false,
    hasSession: () => !!activeSession && !activeSession.locked,
    setAutoMode: (on) => {
      autoMode = !!on;
      if (autoMode) skipMode = false;
      scheduleAuto();
    },
    setSkipMode: (on) => {
      skipMode = !!on;
      if (skipMode) autoMode = false;
      scheduleAuto();
    },
    isAuto: () => autoMode,
    isSkip: () => skipMode,
    getHistory: () => historyLog.slice(),
    popHistory,
    clearHistory: () => {
      historyLog.length = 0;
    },
  };
})();
