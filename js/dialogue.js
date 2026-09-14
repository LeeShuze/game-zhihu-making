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
    if (layer && !layer.querySelector(".vn-dock")) {
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
      advanceEl: layer.querySelector("[data-vn-advance]"),
    };
  }

  function setSlots(ui, slots, activeSide) {
    ui.chars.innerHTML = "";
    (slots || []).forEach((slot) => {
      if (!slot?.sprite) return;
      const side = slot.side || "right";
      const el = document.createElement("div");
      el.className = `vn-character side-${side}`;
      // 新全身立绘：按 3/4 身裁切（旧特写：phone/sew/soothe/protect、boss_head/chest、nainai_mask 等除外）
      const isFullBody =
        /ningnian_front|ningnian_daily|ningnian_normal|ningnian\.png|sisi_front|sisi\.png|sisi_hug|sisi_blood|boss_front|boss_head|boss\.png|yeye_enter|yeye_front|yeye_patched|hongjie|junge|suxiaomo|nainai_front|nainai_enter|huangmao|fangyuan|doghead|boy27|mom27|girl28|twin_/i.test(
          slot.sprite
        );
      if (isFullBody) {
        el.classList.add("is-body-34");
      }
      if (activeSide && slot.side && slot.side !== activeSide) {
        el.classList.add("is-dim");
      }
      const img = document.createElement("img");
      // 新全身立绘强制绕过浏览器缓存
      img.src = isFullBody ? `${slot.sprite}?v=body34g` : slot.sprite;
      img.alt = slot.name || "";
      img.draggable = false;
      el.appendChild(img);
      ui.chars.appendChild(el);
      requestAnimationFrame(() => el.classList.add("is-visible"));
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
        ui.dialog.classList.remove("is-visible", "is-system", "is-danmaku");
        [...ui.chars.children].forEach((c) => c.classList.remove("is-visible"));
        const delay = reason === "aborted" || reason === "back" || skipMode ? 0 : 220;
        window.setTimeout(() => {
          ui.layer.hidden = true;
          ui.layer.classList.remove("is-active");
          ui.chars.innerHTML = "";
          if (activeSession?.resolve === resolve) activeSession = null;
          resolve(reason || "done");
        }, delay);
      };

      const showLine = ({ recordHistory = true } = {}) => {
        const line = lines[index];
        const type = line.type || "say";

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

  function showChoices({ prompt, options, slots }) {
    const panel = document.getElementById("storyChoicePanel");
    const promptEl = document.getElementById("storyChoicePrompt");
    const list = document.getElementById("storyChoiceList");
    if (!panel || !list) return Promise.resolve(null);

    window.GalDialogue?.setSkipMode?.(false);
    window.GalDialogue?.setAutoMode?.(false);
    window.MenuUI?.syncToggles?.();

    const stage = document.getElementById("stage");
    const ui = stage ? ensureUI(stage) : null;
    if (ui && slots?.length) {
      ui.layer.hidden = false;
      ui.layer.classList.add("is-active");
      setSlots(ui, slots, null);
    }

    promptEl.textContent = prompt || "你打算怎么做？";
    list.innerHTML = "";
    panel.hidden = false;

    return new Promise((resolve) => {
      let settled = false;
      const finish = (opt) => {
        if (settled) return;
        settled = true;
        choiceFinish = null;
        panel.hidden = true;
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
    if (panel) panel.hidden = true;
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
    ui.dialog.classList.remove("is-system", "is-danmaku");
    ui.dialog.classList.add("is-visible", "is-generating");
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
      return playDialogue({ ...beat, recordHistory: opts.recordHistory });
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
      });
    }
    return Promise.resolve("done");
  }

  window.GalDialogue = {
    playDialogue,
    showBeat,
    showChoices,
    hideChoices,
    showGenerating,
    hideGenerating,
    advance: () => activeSession?.advance?.(),
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
