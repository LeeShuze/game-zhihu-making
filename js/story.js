(() => {
  let playing = false;
  let beatIndex = 0;
  let currentStory = null;
  let lastDialogueIndex = null;
  let cancelToken = { cancelled: false };
  let farthestBeatIndex = 0;
  /** 剧情循环内等待的「回退到上一对话框」请求 */
  let pendingBack = false;

  function isDialogueBeat(beat) {
    if (!beat || !beat.text) return false;
    return !["scene", "variant", "wait", "horror", "pause", "choice"].includes(
      beat.type
    );
  }

  /** 合并多章为一条时间线，保证跨章回退可用 */
  function buildMainStory() {
    const parts = [
      window.STORY_CH01_06,
      window.STORY_CH07_12,
      window.STORY_CH13_16,
      window.STORY_CH17_19,
      window.STORY_CH20_END,
    ].filter((s) => s?.beats?.length);
    if (!parts.length) return null;
    if (parts.length === 1) return parts[0];
    return {
      id: "main",
      beats: parts.flatMap((s) => s.beats),
    };
  }

  let pauseState = {
    active: false,
    checkpointId: null,
    resumeFromIndex: null,
    unlock: [],
    resumeNpc: null,
    hint: "",
  };

  function resolveUnlockList(unlock) {
    if (Array.isArray(unlock)) return unlock.slice();
    if (typeof unlock === "string" && window.STORY_UNLOCK_PRESETS?.[unlock]) {
      return window.STORY_UNLOCK_PRESETS[unlock].slice();
    }
    return window.STORY_UNLOCK_PRESETS?.home?.slice() || [];
  }

  async function enterPause(beat, resumeFromIndex) {
    pauseState = {
      active: true,
      checkpointId: beat.id || null,
      resumeFromIndex,
      unlock: resolveUnlockList(beat.unlock),
      resumeNpc: beat.resumeNpc || null,
      hint: beat.hint || "自由探索中。",
    };

    window.GalDialogue?.setSkipMode?.(false);
    window.GalDialogue?.setAutoMode?.(false);
    window.MenuUI?.syncToggles?.();

    window.Game?.setUnlockedScenes?.(pauseState.unlock);
    window.Game?.setResumeNpc?.(pauseState.resumeNpc);
    window.Game?.setExplorationEnabled?.(true);

    const dest =
      beat.exploreScene ||
      beat.resumeNpc?.scene ||
      window.Game?.getCurrentScene?.();
    if (dest) {
      await window.Game?.goToScene?.(dest, { withFade: true, force: true });
    }

    window.MenuUI?.toast?.(pauseState.hint);
    return "pause";
  }

  function clearPause() {
    pauseState = {
      active: false,
      checkpointId: null,
      resumeFromIndex: null,
      unlock: [],
      resumeNpc: null,
      hint: "",
    };
    window.Game?.setResumeNpc?.(null);
  }

  async function resumeFromPause() {
    if (!pauseState.active || pauseState.resumeFromIndex == null || !currentStory) {
      return false;
    }
    const from = pauseState.resumeFromIndex;
    clearPause();
    window.Game?.setExplorationEnabled?.(false);
    window.Game?.setResumeNpc?.(null);
    await playStory(currentStory, {
      fromIndex: from,
      resetHorror: false,
      unlockOnEnd: true,
    });
    return true;
  }

  function resolveStoryById(storyId) {
    if (storyId === "main") return { story: buildMainStory(), indexOffset: 0 };
    if (storyId === "ch20_end" && window.STORY_CH20_END && window.STORY_CH01_06) {
      const offset =
        (window.STORY_CH01_06?.beats?.length || 0) +
        (window.STORY_CH07_12?.beats?.length || 0) +
        (window.STORY_CH13_16?.beats?.length || 0) +
        (window.STORY_CH17_19?.beats?.length || 0);
      return { story: buildMainStory(), indexOffset: offset };
    }
    if (storyId === "ch17_19" && window.STORY_CH17_19 && window.STORY_CH01_06) {
      const offset =
        (window.STORY_CH01_06?.beats?.length || 0) +
        (window.STORY_CH07_12?.beats?.length || 0) +
        (window.STORY_CH13_16?.beats?.length || 0);
      return { story: buildMainStory(), indexOffset: offset };
    }
    if (storyId === "ch13_16" && window.STORY_CH13_16 && window.STORY_CH01_06) {
      const offset =
        (window.STORY_CH01_06?.beats?.length || 0) +
        (window.STORY_CH07_12?.beats?.length || 0);
      return { story: buildMainStory(), indexOffset: offset };
    }
    if (storyId === "ch07_12" && window.STORY_CH07_12 && window.STORY_CH01_06) {
      // 旧存档：ch07 的 beatIndex 映射到合并后的绝对下标
      return {
        story: buildMainStory(),
        indexOffset: window.STORY_CH01_06.beats.length,
      };
    }
    if (storyId === "ch01_06" && window.STORY_CH01_06) {
      return { story: buildMainStory() || window.STORY_CH01_06, indexOffset: 0 };
    }
    return { story: buildMainStory(), indexOffset: 0 };
  }

  async function wait(ms) {
    const skip = window.GalDialogue?.isSkip?.();
    return new Promise((r) => setTimeout(r, skip ? Math.min(ms, 20) : ms));
  }

  function findPrevDialogueIndex(fromIndex) {
    if (!currentStory?.beats) return null;
    for (let i = fromIndex - 1; i >= 0; i -= 1) {
      if (isDialogueBeat(currentStory.beats[i])) return i;
    }
    return null;
  }

  function computeHorrorUpTo(targetIndex) {
    if (!currentStory?.beats) return 0;
    let horror = 0;
    const end = Math.min(targetIndex, currentStory.beats.length - 1);
    for (let i = 0; i <= end; i += 1) {
      const b = currentStory.beats[i];
      if (!b || b.type !== "horror") continue;
      if (b.set != null) horror = Number(b.set) || 0;
      else if (b.add != null) horror += Number(b.add) || 0;
    }
    return Math.max(0, Math.min(100, horror));
  }

  async function restoreWorldUpTo(targetIndex) {
    if (!currentStory?.beats) return;
    let sceneId = window.SCENE_GRAPH?.start || null;
    const variants = {};

    for (let i = 0; i <= targetIndex; i += 1) {
      const b = currentStory.beats[i];
      if (!b) continue;
      if (b.type === "scene" && b.scene) sceneId = b.scene;
      if (b.type === "variant" && b.scene && b.variant) {
        variants[b.scene] = b.variant;
      }
    }

    // 未在时间线里出现的变体场景，回到默认态（避免打扫后回退仍显示打扫后）
    const scenes = window.SCENE_GRAPH?.scenes || {};
    for (const sid of Object.keys(scenes)) {
      const scene = scenes[sid];
      if (!scene?.variants) continue;
      const want =
        variants[sid] || scene.defaultVariant || Object.keys(scene.variants)[0];
      if (want) {
        await window.Game?.setVariant?.(sid, want, { withFade: false });
      }
    }

    if (sceneId) {
      const cur = window.Game?.getCurrentScene?.();
      const changed = cur !== sceneId;
      await window.Game?.goToScene?.(sceneId, {
        withFade: changed,
        force: true,
      });
    }
    window.HorrorMeter?.set?.(computeHorrorUpTo(targetIndex), { animate: false });
  }

  async function handleBackToPrevDialogue(fromIndex, { popHistory = true } = {}) {
    const prev = findPrevDialogueIndex(fromIndex);
    if (prev == null) return false;
    if (popHistory) window.GalDialogue?.popHistory?.(1);
    await restoreWorldUpTo(prev);
    beatIndex = prev;
    return true;
  }

  async function runMetaBeat(beat) {
    const kind = beat.type;
    const skip = !!window.GalDialogue?.isSkip?.();

    if (kind === "pause") {
      // resume index = 下一条 beat
      return enterPause(beat, beatIndex + 1);
    }

    if (kind === "horror") {
      window.HorrorMeter?.applyBeat?.(beat);
      await wait(skip ? 0 : 180);
      return;
    }

    if (kind === "scene") {
      const cur = window.Game?.getCurrentScene?.();
      if (cur === beat.scene) {
        await window.Game.reloadScene?.(beat.scene, { withFade: false });
      } else {
        await window.Game.goToScene(beat.scene, { withFade: !skip, force: true });
      }
      await wait(60);
      return;
    }

    if (kind === "variant") {
      await window.Game?.setVariant?.(beat.scene, beat.variant, {
        withFade: skip ? false : beat.withFade !== false,
      });
      await wait(60);
      return;
    }

    if (kind === "wait") {
      await wait(beat.ms || 400);
    }

    if (kind === "choice") {
      return handleChoice(beat);
    }
  }

  function recentContext(limit = 4) {
    const items = window.GalDialogue?.getHistory?.() || [];
    return items
      .slice(-limit)
      .map((it) => `${it.speaker || "旁白"}：${it.text || ""}`)
      .join(" / ")
      .slice(0, 400);
  }

  function hideFailPanel() {
    const el = document.getElementById("storyFail");
    if (el) el.hidden = true;
  }

  function waitFailRetry(ending) {
    const el = document.getElementById("storyFail");
    const title = document.getElementById("storyFailTitle");
    const text = document.getElementById("storyFailText");
    const btn = document.getElementById("storyFailRetry");
    if (!el || !btn) return Promise.resolve();
    if (title) title.textContent = ending.title || "存活失败";
    if (text) {
      text.textContent = [ending.text, ending.system].filter(Boolean).join("\n\n");
    }
    el.hidden = false;
    return new Promise((resolve) => {
      const onClick = (e) => {
        e.stopPropagation();
        btn.removeEventListener("click", onClick);
        el.hidden = true;
        resolve();
      };
      btn.addEventListener("click", onClick);
    });
  }

  async function runDialogueBeat(beat, { recordHistory = true } = {}) {
    return window.GalDialogue?.showBeat?.(
      {
        text: beat.text,
        speaker: beat.speaker || "",
        type: beat.type === "say" ? "say" : beat.type,
        sprite: beat.sprite,
        side: beat.side,
        slots: beat.slots,
        clearSprites: beat.clearSprites,
        focusSide: beat.focusSide,
      },
      { recordHistory }
    );
  }

  async function playGeneratedBeats(beats, token) {
    for (const b of beats || []) {
      if (token?.cancelled) return;
      if (b.type === "horror") {
        window.HorrorMeter?.applyBeat?.(b);
        await wait(160);
        continue;
      }
      if (b.text) await runDialogueBeat(b);
    }
  }

  async function handleChoice(beat) {
    const option = await window.GalDialogue?.showChoices?.({
      prompt: beat.prompt,
      options: beat.options,
      slots: beat.slots,
    });
    if (!option) return "choice-retry";
    if (option.canon) return;

    const ending =
      window.STORY_ENDINGS?.[option.ending] || window.STORY_ENDINGS.sisi_kill;
    window.MenuUI?.toast?.("偏离原剧情，生成短失败线…");
    const gen = await window.GalAI?.generateFailBeats?.({
      prompt: beat.prompt,
      optionId: option.id,
      optionLabel: option.label,
      ending,
      context: recentContext(),
    });
    if (gen?.source === "ai") {
      window.MenuUI?.toast?.("AI 已生成失败过程");
    } else {
      const why = gen?.error || window.GalAI?.getLastError?.() || "未知原因";
      window.MenuUI?.toast?.(`AI 不可用：${why}`);
    }
    await playGeneratedBeats(gen?.beats || [], cancelToken);
    if (ending.horror != null) {
      window.HorrorMeter?.set?.(ending.horror, { animate: true });
    }
    if (ending.text) {
      await runDialogueBeat({
        type: "narration",
        text: ending.text,
        clearSprites: true,
      });
    }
    if (ending.system) {
      await runDialogueBeat({ type: "system", text: ending.system });
    }
    await waitFailRetry(ending);
    window.GalDialogue?.hideChoices?.();
    return "choice-retry";
  }

  async function playStory(
    story,
    { fromIndex = 0, replay = false, resetHorror = true, unlockOnEnd = true } = {}
  ) {
    if (!story?.beats?.length) return;
    cancelToken.cancelled = true;
    cancelToken = { cancelled: false };
    const token = cancelToken;
    pendingBack = false;

    playing = true;
    currentStory = story;
    beatIndex = Math.max(0, fromIndex);
    if (fromIndex === 0 && !replay && resetHorror) {
      window.HorrorMeter?.set?.(0, { animate: false });
      farthestBeatIndex = 0;
    } else if (fromIndex > 0) {
      window.HorrorMeter?.set?.(computeHorrorUpTo(fromIndex - 1), { animate: false });
    }
    window.Game?.setExplorationEnabled?.(false);
    window.GalDialogue?.setSkipMode?.(false);
    window.GalDialogue?.setAutoMode?.(false);
    window.MenuUI?.syncToggles?.();

    // 从中途续播 / 重播对话框时，先对齐场景与变体
    if (fromIndex > 0 || replay) {
      await restoreWorldUpTo(Math.max(0, fromIndex));
    }

    let suppressHistoryOnce = !!replay;

    while (beatIndex < story.beats.length) {
      if (token.cancelled) break;

      const beat = story.beats[beatIndex];

      if (!isDialogueBeat(beat)) {
        const metaResult = await runMetaBeat(beat);
        if (token.cancelled) break;
        if (metaResult === "pause") {
          farthestBeatIndex = Math.max(farthestBeatIndex, beatIndex);
          break;
        }
        if (metaResult === "choice-retry") {
          farthestBeatIndex = Math.max(farthestBeatIndex, beatIndex);
          continue;
        }
        // 换场景 / 等 meta 过程中点了回退：立刻回到上一对话框并还原场景
        if (pendingBack) {
          pendingBack = false;
          const ok = await handleBackToPrevDialogue(beatIndex, { popHistory: false });
          if (ok) {
            suppressHistoryOnce = true;
            continue;
          }
        }
        farthestBeatIndex = Math.max(farthestBeatIndex, beatIndex);
        beatIndex += 1;
        continue;
      }

      lastDialogueIndex = beatIndex;
      const recordHistory = !suppressHistoryOnce;
      suppressHistoryOnce = false;
      const result = await runDialogueBeat(beat, { recordHistory });
      if (token.cancelled) break;

      if (result === "back" || pendingBack) {
        pendingBack = false;
        const ok = await handleBackToPrevDialogue(beatIndex, { popHistory: true });
        if (!ok) {
          suppressHistoryOnce = true;
          continue;
        }
        suppressHistoryOnce = true;
        continue;
      }

      beatIndex += 1;
      farthestBeatIndex = Math.max(farthestBeatIndex, beatIndex);
    }

    playing = false;
    if (!token.cancelled) {
      window.GalDialogue?.setSkipMode?.(false);
      window.GalDialogue?.setAutoMode?.(false);
      // pause 自己会开放探索；正常播完才按 unlockOnEnd
      if (unlockOnEnd && !pauseState.active) {
        window.Game?.setExplorationEnabled?.(true);
      }
      window.MenuUI?.syncToggles?.();
    }
  }

  function stopStory() {
    cancelToken.cancelled = true;
    pendingBack = false;
    window.GalDialogue?.setSkipMode?.(false);
    window.GalDialogue?.hideChoices?.();
    hideFailPanel();
    playing = false;
  }

  function getSaveData() {
    return {
      version: 2,
      beatIndex,
      playing,
      lastDialogueIndex,
      storyId: currentStory?.id || "main",
      sceneId: window.Game?.getCurrentScene?.() || null,
      livingVariant: window.Game?.getVariant?.("floor30_living") || "dirty",
      horror: window.HorrorMeter?.get?.() ?? 0,
      farthestBeatIndex,
      pause: pauseState.active
        ? {
            checkpointId: pauseState.checkpointId,
            resumeFromIndex: pauseState.resumeFromIndex,
            unlock: pauseState.unlock,
            resumeNpc: pauseState.resumeNpc,
            hint: pauseState.hint,
          }
        : null,
      exploration: pauseState.active || true,
      savedAt: Date.now(),
    };
  }

  async function loadSaveData(data) {
    if (!data) return false;
    stopStory();
    window.GalDialogue?.clearHistory?.();
    clearPause();

    if (data.horror != null) {
      window.HorrorMeter?.set?.(data.horror, { animate: false });
    }

    if (data.livingVariant) {
      await window.Game?.setVariant?.("floor30_living", data.livingVariant, {
        withFade: false,
      });
    }

    const resolved = resolveStoryById(data.storyId);
    const story = resolved?.story;
    currentStory = story;
    farthestBeatIndex = Math.max(
      Number(data.farthestBeatIndex) || 0,
      Number(data.beatIndex) || 0
    );

    if (data.pause?.resumeFromIndex != null && story) {
      pauseState = {
        active: true,
        checkpointId: data.pause.checkpointId || null,
        resumeFromIndex: data.pause.resumeFromIndex,
        unlock: data.pause.unlock || resolveUnlockList("home"),
        resumeNpc: data.pause.resumeNpc || null,
        hint: data.pause.hint || "自由探索中。",
      };
      window.Game?.setUnlockedScenes?.(pauseState.unlock);
      window.Game?.setResumeNpc?.(pauseState.resumeNpc);
      window.Game?.setExplorationEnabled?.(true);
      const dest =
        data.sceneId ||
        pauseState.resumeNpc?.scene ||
        pauseState.unlock[0];
      if (dest) await window.Game?.goToScene?.(dest, { force: true, withFade: false });
      window.MenuUI?.toast?.(pauseState.hint);
      return true;
    }

    if (story?.beats?.length) {
      const offset = resolved.indexOffset || 0;
      const idx = Number.isFinite(data.beatIndex) ? data.beatIndex : 0;
      await playStory(story, {
        fromIndex: Math.max(0, idx + offset),
        resetHorror: false,
      });
      return true;
    }

    if (data.sceneId) {
      await window.Game?.goToScene?.(data.sceneId, { force: true });
      window.Game?.setExplorationEnabled?.(true);
    }
    return true;
  }

  /**
   * 回退到上一个对话框。
   * - 对话进行中：退到上一句/上一个对话框
   * - 已退出对话：重新进入上次对话框
   */
  function back() {
    window.GalDialogue?.setSkipMode?.(false);
    window.GalDialogue?.setAutoMode?.(false);
    window.MenuUI?.syncToggles?.();

    if (window.GalDialogue?.hasSession?.()) {
      return window.GalDialogue.back();
    }

    if (lastDialogueIndex == null || !currentStory) return false;

    if (playing) {
      pendingBack = true;
      return true;
    }

    playStory(currentStory, {
      fromIndex: lastDialogueIndex,
      replay: true,
      resetHorror: false,
    });
    return true;
  }

  function listProgressNodes() {
    const story = currentStory || buildMainStory();
    if (!story?.beats) return [];
    return story.beats
      .map((b, index) =>
        b.progress
          ? {
              index,
              id: b.id || `node-${index}`,
              title: b.progress,
            }
          : null
      )
      .filter(Boolean);
  }

  async function jumpTo(index) {
    const story = currentStory || buildMainStory();
    if (!story?.beats?.length) return false;
    const dest = Math.max(0, Math.min(Number(index) || 0, story.beats.length - 1));
    if (dest > farthestBeatIndex) {
      window.MenuUI?.toast?.("尚未到达该节点");
      return false;
    }
    stopStory();
    window.GalDialogue?.hideChoices?.();
    hideFailPanel();
    clearPause();
    window.Game?.setExplorationEnabled?.(false);
    await playStory(story, {
      fromIndex: dest,
      resetHorror: false,
      unlockOnEnd: true,
    });
    return true;
  }

  window.Story = {
    playStory,
    stopStory,
    buildMainStory,
    resumeFromPause,
    isPlaying: () => playing,
    isPaused: () => pauseState.active,
    getPauseState: () => ({ ...pauseState }),
    getBeatIndex: () => beatIndex,
    getFarthestBeatIndex: () => farthestBeatIndex,
    listProgressNodes,
    jumpTo,
    getSaveData,
    loadSaveData,
    back,
    skipToggle: () => {
      const next = !window.GalDialogue?.isSkip?.();
      window.GalDialogue?.setSkipMode?.(next);
      if (next) window.GalDialogue?.setAutoMode?.(false);
      if (next) window.GalDialogue?.advance?.();
      return next;
    },
    autoToggle: () => {
      const next = !window.GalDialogue?.isAuto?.();
      window.GalDialogue?.setAutoMode?.(next);
      if (next) window.GalDialogue?.setSkipMode?.(false);
      return next;
    },
  };
})();
