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
