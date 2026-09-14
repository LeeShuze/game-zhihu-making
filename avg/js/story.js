(() => {
  let playing = false;
  let beatIndex = 0;
  let currentStory = null;
  let lastDialogueIndex = null;
  let cancelToken = { cancelled: false };
  let farthestBeatIndex = 0;
  let playGen = 0;
  /** 剧情循环内等待的「回退到上一对话框」请求 */
  let pendingBack = false;

  /** flavorChoice 选项后台预生成缓存：id -> { promise, result } */
  const flavorOptCache = new Map();
  /** 刚播完的旁支对白，供正史句回退时再走进去 */
  let lastFlavorPlayback = null;

  function flavorCacheKey(beat) {
    return beat?.id || beat?.progress || "";
  }

  function flavorBeatIndex(beat, fallback) {
    const beats = currentStory?.beats || [];
    if (beat?.id) {
      const hit = beats.findIndex((b) => b.id === beat.id && b.type === "flavorChoice");
      if (hit >= 0) return hit;
    }
    if (typeof fallback === "number" && fallback >= 0) return fallback;
    return beatIndex;
  }

  function flavorStoryContext(atIndex, limit = 12) {
    const beats = currentStory?.beats || [];
    const end = atIndex == null ? beatIndex : atIndex;
    const bits = [];
    for (let i = end - 1; i >= 0 && bits.length < limit; i -= 1) {
      const b = beats[i];
      if (!b?.text) continue;
      if (
        ["scene", "variant", "wait", "horror", "pause", "choice", "flavorChoice", "bgm"].includes(
          b.type
        )
      ) {
        continue;
      }
      const who =
        b.speaker ||
        (b.type === "narration" ? "旁白" : b.type === "system" ? "系统" : b.type === "danmaku" ? "弹幕" : "");
      bits.unshift(
        `${who}：${String(b.text)
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 90)}`
      );
    }
    return bits.join("\n").slice(0, 1200);
  }

  function flavorAiPayload(beat, atIndex) {
    const idx = flavorBeatIndex(beat, atIndex);
    const slots = [...(beat.slots || []), ...(beat.extraSlots || [])];
    return {
      prompt: beat.prompt,
      canon: beat.canon,
      mode: beat.mode || "",
      npcHint: beat.npcHint,
      plotHint: beat.plotHint,
      resumeHint: beat.resumeHint,
      forbid: beat.forbid,
      optionCount: beat.optionCount,
      sampleLabel: beat.sampleLabel,
      optionTopic: beat.optionTopic,
      roundSpeakers: beat.roundSpeakers,
      presentChars: slots.map((s) => s.name).filter(Boolean).join("、"),
      sideHints: beat.sideHints,
      sideIntents: beat.sideIntents,
      sideOptions: beat.sideOptions,
      context: flavorStoryContext(idx),
    };
  }

  function shuffleCopy(list) {
    const a = (list || []).slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** 四人各一句：立绘换成当前说话人在左、宁念在右，出场顺序当场打乱 */
  function arrangeRoundReplies(beats, speakers, allSlots) {
    const names = (speakers || []).filter(Boolean);
    const ning = allSlots.find((s) => s.name === "宁念");
    const byName = new Map();
    for (const b of beats || []) {
      if (b?.type !== "say" || !names.includes(b.speaker) || byName.has(b.speaker)) continue;
      byName.set(b.speaker, b);
    }
    return shuffleCopy(names)
      .map((name) => {
        const line = byName.get(name);
        if (!line?.text) return null;
        const who = allSlots.find((s) => s.name === name);
        const talkSlots = [
          who ? { ...who, side: "left" } : null,
          ning ? { ...ning, side: "right" } : null,
        ].filter(Boolean);
        return decorateFlavorBeats(
          [
            {
              ...line,
              side: "left",
              sprite: who?.sprite || line.sprite,
              slots: talkSlots,
            },
          ],
          talkSlots
        )[0];
      })
      .filter(Boolean);
  }

  function flavorAllSlots(beat) {
    const seen = new Set();
    const out = [];
    for (const s of [...(beat.slots || []), ...(beat.extraSlots || [])]) {
      if (!s?.name || seen.has(s.name)) continue;
      seen.add(s.name);
      out.push(s);
    }
    return out;
  }

  function canonFlavorOpt(beat) {
    return {
      id: beat.canon?.id || "canon",
      label: beat.canon?.label || "继续。",
      intent: beat.canon?.intent || "",
      canon: true,
    };
  }

  /** 开局/续播时后台预拉合流选项；一次只拉下一处，避免连打接口 */
  function prefetchFlavorOptions(story, fromIndex = 0) {
    if (!story?.beats?.length) return;
    const start = Math.max(0, fromIndex | 0);
    for (let i = start; i < story.beats.length; i += 1) {
      const beat = story.beats[i];
      if (beat?.type !== "flavorChoice") continue;
      const key = flavorCacheKey(beat);
      if (!key) continue;
      const existing = flavorOptCache.get(key);
      if (existing?.promise && !existing.result) return;
      if (existing?.result?.source === "ai") continue;
      const token = Symbol(key);
      const payload = flavorAiPayload(beat, i);
      const promise = Promise.resolve()
        .then(() => window.GalAI?.generateFlavorOptions?.(payload))
        .then((gen) => {
          const cur = flavorOptCache.get(key);
          if (cur?.token !== token) return gen;
          const result =
            gen?.source === "ai" && gen.options?.length
              ? {
                  ok: true,
                  source: "ai",
                  canonLabel: beat.canon?.label,
                  options: gen.options,
                  _canon: canonFlavorOpt(beat),
                  error: "",
                }
              : {
                  ok: false,
                  source: "error",
                  canonLabel: beat.canon?.label,
                  options: [],
                  _canon: canonFlavorOpt(beat),
                  error: gen?.error || window.GalAI?.getLastError?.() || "预生成失败",
                };
          flavorOptCache.set(key, { promise, result, token });
          return result;
        })
        .catch((err) => {
          const cur = flavorOptCache.get(key);
          if (cur?.token !== token) return null;
          const result = {
            ok: false,
            source: "error",
            options: [],
            _canon: canonFlavorOpt(beat),
            error: err?.message || window.GalAI?.getLastError?.() || "预生成失败",
          };
          flavorOptCache.set(key, { promise, result, token });
          return result;
        });
      flavorOptCache.set(key, { promise, result: null, token });
      break;
    }
  }

  function clearFlavorOptCache() {
    flavorOptCache.clear();
  }

  async function resolveFlavorOptions(beat, { allowWait = true, forceRetry = false } = {}) {
    const key = flavorCacheKey(beat);
    const fail = {
      ok: false,
      source: "error",
      options: [],
      _canon: canonFlavorOpt(beat),
      error: window.GalAI?.getLastError?.() || "无 AI 选项",
    };
    if (!key) return fail;

    if (forceRetry) flavorOptCache.delete(key);

    let entry = flavorOptCache.get(key);
    if (!entry || (entry.result && entry.result.source !== "ai")) {
      if (entry?.result?.source === "error") flavorOptCache.delete(key);
      prefetchFlavorOptions({ beats: [beat] }, 0);
      entry = flavorOptCache.get(key);
    }
    if (entry?.result?.source === "ai") return entry.result;
    if (allowWait && entry?.promise) {
      try {
        return (await entry.promise) || fail;
      } catch (_) {
        return fail;
      }
    }
    return entry?.result || fail;
  }

  function isDialogueBeat(beat) {
    if (!beat || !beat.text) return false;
    return !["scene", "variant", "wait", "horror", "pause", "choice", "flavorChoice", "bgm"].includes(
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
    ambientNpcs: [],
  };

  function resolveUnlockList(unlock) {
    if (Array.isArray(unlock)) return unlock.slice();
    if (typeof unlock === "string" && window.STORY_UNLOCK_PRESETS?.[unlock]) {
      return window.STORY_UNLOCK_PRESETS[unlock].slice();
    }
    return window.STORY_UNLOCK_PRESETS?.home?.slice() || [];
  }

  async function enterPause(beat, resumeFromIndex) {
    const ambient =
      Array.isArray(beat.ambientNpcs) && beat.ambientNpcs.length
        ? beat.ambientNpcs.map((n) => ({ ...n }))
        : window.AmbientNpcs?.rollForPause?.(
            beat.id,
            beat.resumeNpc,
            resolveUnlockList(beat.unlock)
          ) || [];

    pauseState = {
      active: true,
      checkpointId: beat.id || null,
      resumeFromIndex,
      unlock: resolveUnlockList(beat.unlock),
      resumeNpc: beat.resumeNpc || null,
      hint: beat.hint || "自由探索中。",
      ambientNpcs: ambient,
    };

    window.GalDialogue?.setSkipMode?.(false);
    window.GalDialogue?.setAutoMode?.(false);
    window.MenuUI?.syncToggles?.();
    window.AmbientChat?.close?.();

    window.Game?.setUnlockedScenes?.(pauseState.unlock);
    window.Game?.setResumeNpc?.(pauseState.resumeNpc);
    window.Game?.setAmbientNpcs?.(pauseState.ambientNpcs);
    window.Game?.setExplorationEnabled?.(true);

    const dest =
      beat.exploreScene ||
      beat.resumeNpc?.scene ||
      window.Game?.getCurrentScene?.();
    if (dest) {
      await window.Game?.goToScene?.(dest, { withFade: true, force: true });
    }

    const ambientHint =
      window.AmbientNpcs?.formatAmbientHint?.(ambient) ||
      (ambient.length
        ? `另有可闲聊角色：${ambient.map((n) => n.name).join("、")}。`
        : "");
    window.MenuUI?.toast?.(
      [pauseState.hint, ambientHint].filter(Boolean).join(" "),
      ambient.length ? 3600 : 1400
    );
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
      ambientNpcs: [],
    };
    window.Game?.setResumeNpc?.(null);
    window.Game?.setAmbientNpcs?.([]);
    window.AmbientChat?.close?.();
  }

  async function resumeFromPause() {
    if (!pauseState.active || pauseState.resumeFromIndex == null || !currentStory) {
      return false;
    }
    const from = pauseState.resumeFromIndex;
    clearPause();
    window.Game?.setExplorationEnabled?.(false);
    window.Game?.setResumeNpc?.(null);
    window.Game?.setAmbientNpcs?.([]);
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

  /** 紧挨在当前句前面的选项（中间只允许 horror/wait） */
  function findOwningChoiceIndex(fromIndex) {
    if (!currentStory?.beats) return null;
    for (let i = fromIndex - 1; i >= 0; i -= 1) {
      const b = currentStory.beats[i];
      if (!b) continue;
      if (b.type === "flavorChoice" || b.type === "choice") return i;
      if (b.type === "horror" || b.type === "wait" || b.type === "bgm") continue;
      return null;
    }
    return null;
  }

  function rememberFlavorPlayback(index, lines, slots) {
    const list = (lines || []).filter((b) => b && b.text).map((b) => ({ ...b }));
    lastFlavorPlayback = list.length
      ? { beatIndex: index, lines: list, slots: slots || null }
      : null;
  }

  function clearFlavorPlaybackAt(index) {
    if (index == null || lastFlavorPlayback?.beatIndex === index) {
      lastFlavorPlayback = null;
    }
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
      const last = currentStory.beats[targetIndex];
      if (
        window.PrologueBridge?.cameFromElevator?.() &&
        last?.type === "pause" &&
        last.resumeNpc?.scene
      ) {
        sceneId = last.resumeNpc.scene;
      }
      const cur = window.Game?.getCurrentScene?.();
      const changed = cur !== sceneId;
      await window.Game?.goToScene?.(sceneId, {
        withFade: changed,
        force: true,
      });
    }
    window.HorrorMeter?.set?.(computeHorrorUpTo(targetIndex), { animate: false });
    window.GalAudio?.syncFromStory?.(currentStory.beats, targetIndex);
  }

  async function handleBackToPrevDialogue(fromIndex, { popHistory = true } = {}) {
    const prev = findPrevDialogueIndex(fromIndex);
    if (prev == null) return false;
    if (popHistory) window.GalDialogue?.popHistory?.(1);
    await restoreWorldUpTo(prev);
    beatIndex = prev;
    if (currentStory?.beats) {
      window.CharInfoUI?.rebuildFromStory?.(currentStory.beats, prev);
    }
    return true;
  }

  async function runMetaBeat(beat) {
    const kind = beat.type;
    const skip = !!window.GalDialogue?.isSkip?.();

    if (kind === "pause") {
      window.CharInfoUI?.applyBeat?.(beat);
      const fromElevator = window.PrologueBridge?.cameFromElevator?.();
      if (beat.id === "before_knock" && !fromElevator) {
        const handed = await window.PrologueBridge?.goDuty?.();
        if (handed) return "pause";
      }
      const pauseBeat =
        fromElevator && beat.id === "before_knock"
          ? {
              ...beat,
              exploreScene: beat.resumeNpc?.scene || "floor30_outside",
              hint:
                beat.hintAfterPrologue ||
                "自由探索中。将鼠标移到门上显示「敲门」后点击可继续。",
            }
          : beat;
      return enterPause(pauseBeat, beatIndex + 1);
    }

    if (kind === "horror") {
      window.HorrorMeter?.applyBeat?.(beat);
      await wait(skip ? 0 : 180);
      return;
    }

    if (kind === "bgm") {
      if (beat.stop) window.GalAudio?.stop?.({ fadeMs: skip ? 0 : 700 });
      else if (beat.src) {
        window.GalAudio?.play?.(beat.src, {
          loop: beat.loop !== false,
          fadeMs: skip ? 0 : 500,
        });
      }
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

    if (kind === "flavorChoice") {
      return handleFlavorChoice(beat);
    }
  }

  function decorateFlavorBeats(beats, slots) {
    if (!slots?.length) return beats || [];
    return (beats || []).map((b) => {
      if (b.type !== "say" || b.sprite) return { ...b };
      const hit = slots.find((s) => s.name && b.speaker && s.name === b.speaker);
      if (!hit) return { ...b };
      return { ...b, sprite: hit.sprite, side: hit.side || b.side };
    });
  }

  function findHoldLine(beat) {
    const slots = beat?.slots || [];
    for (let i = beatIndex - 1; i >= 0; i -= 1) {
      const b = currentStory?.beats?.[i];
      if (!isDialogueBeat(b)) continue;
      const named = (b.slots || slots).find((s) => s.name && s.name === b.speaker);
      return {
        speaker:
          b.speaker ||
          (b.type === "system" ? "系统" : b.type === "danmaku" ? "弹幕" : ""),
        text: b.text,
        type: b.type || "say",
        slots: slots.length ? slots : b.slots,
        sprite: b.sprite || named?.sprite,
        side: b.side || named?.side,
        focusSide: b.focusSide,
      };
    }
    const last = (window.GalDialogue?.getHistory?.() || []).slice(-1)[0];
    if (!last?.text) return null;
    const named = slots.find((s) => s.name && s.name === last.speaker);
    return {
      speaker: last.speaker || "",
      text: last.text,
      type: last.type || "say",
      slots,
      sprite: named?.sprite,
      side: named?.side,
    };
  }

  async function waitChoicePick(beat) {
    const token = cancelToken;
    let option = null;
    const above = beat.type === "flavorChoice" || beat._placement === "above";
    const choiceWait = window.GalDialogue?.showChoices?.({
      prompt: beat.prompt,
      options: beat._resolvedOptions || beat.options,
      slots: beat.slots,
      placement: above ? "above" : "overlay",
      holdLine: beat._holdLine || (above ? findHoldLine(beat) : null),
    });
    if (choiceWait && typeof choiceWait.then === "function") {
      option = await new Promise((resolve) => {
        let settled = false;
        const done = (v) => {
          if (settled) return;
          settled = true;
          clearInterval(poll);
          resolve(v);
        };
        choiceWait.then((v) => done(v));
        const poll = setInterval(() => {
          if (pendingBack || token.cancelled) {
            window.GalDialogue?.hideChoices?.();
            done(null);
          }
        }, 80);
      });
    }
    return option;
  }

  /**
   * 原神式合流岔路：选项与旁支对白都只用 AI；失败不播本地稿。
   */
  async function handleFlavorChoice(beat) {
    const token = cancelToken;
    restoreHorrorAtBeat(beatIndex);

    const holdLine = findHoldLine(beat);
    const canAi = !!window.GalAI?.canFlavorAi?.();
    const cached = flavorOptCache.get(flavorCacheKey(beat));
    let gen;

    if (cached?.result?.source === "ai") {
      gen = cached.result;
    } else {
      window.GalDialogue?.holdDialogueLine?.(holdLine, { waiting: true });
      try {
        gen = await resolveFlavorOptions(beat, { allowWait: true });
        if (canAi && gen?.source !== "ai") {
          gen = await resolveFlavorOptions(beat, { allowWait: true, forceRetry: true });
        }
      } finally {
        window.GalDialogue?.hideGenerating?.();
      }
    }
    if (token.cancelled) {
      pendingBack = false;
      restoreHorrorAtBeat(beatIndex);
      return "choice-retry";
    }
    if (pendingBack) {
      restoreHorrorAtBeat(beatIndex);
      return "choice-retry";
    }

    const canonOpt = canonFlavorOpt(beat);
    const canonText = String(canonOpt.label || "").trim();
    const qaOnly = beat.mode === "qa";
    const farewellOnly = beat.mode === "farewell";
    const oneReply = qaOnly || farewellOnly;
    const roundOnly = beat.mode === "round";
    const noCanon = oneReply || roundOnly || beat.mode === "chat" || beat.noCanon;
    const wantN = Math.min(3, Math.max(1, Number(beat.optionCount) || 3));
    const sides = (gen?.source === "ai" ? gen.options || [] : [])
      .filter(
        (o) => o && String(o.label || "").trim() && String(o.label).trim() !== canonText
      )
      .slice(0, wantN);
    const options = noCanon ? sides : [canonOpt, ...sides];
    if (!sides.length) {
      const why = gen?.error || window.GalAI?.getLastError?.() || "AI 未生成旁支";
      window.MenuUI?.toast?.(`旁支选项生成失败：${String(why).slice(0, 40)}`, 3600);
      if (noCanon) return;
    }

    if (noCanon && !options.length) return;

    const option = await waitChoicePick({
      ...beat,
      _resolvedOptions: options,
      _holdLine: holdLine,
      _placement: "above",
    });

    if (pendingBack) {
      restoreHorrorAtBeat(beatIndex);
      return "choice-retry";
    }
    if (!option || token.cancelled) {
      restoreHorrorAtBeat(beatIndex);
      return "choice-retry";
    }
    const allSlots = flavorAllSlots(beat);
    const ningSlot = allSlots.find((s) => s.name === "宁念");
    const spoken = decorateFlavorBeats(
      [
        {
          type: "say",
          speaker: "宁念",
          text: String(option.label || "").trim(),
          sprite: ningSlot?.sprite,
          side: ningSlot?.side || "left",
          slots: beat.slots,
        },
      ],
      beat.slots
    )[0];
    if (!spoken?.text) {
      restoreHorrorAtBeat(beatIndex);
      return "choice-retry";
    }

    if (option.canon) {
      const r = await playGeneratedQueue([spoken], token, {
        slots: beat.slots,
        remember: (lines) => rememberFlavorPlayback(beatIndex, lines, beat.slots),
      });
      if (r === "back" || pendingBack || token.cancelled) {
        pendingBack = false;
        restoreHorrorAtBeat(beatIndex);
        return "choice-retry";
      }
      return;
    }

    const resumeHint =
      beat.resumeHint ||
      "之后立刻接回正史内心独白/下一句固定剧情，不要另起结局。";
    const presentChars =
      allSlots.map((s) => s.name).filter(Boolean).join("、") || "宁念、思思";

    let openErr = "";
    const openPromise = Promise.resolve(
      window.GalAI?.generateFlavorSegment?.({
        phase: "open",
        mode: beat.mode || "",
        spokenAlready: true,
        prompt: beat.prompt,
        optionLabel: option.label,
        optionIntent: option.intent || option.label,
        canonIntent: beat.canon?.intent || "",
        resumeHint,
        presentChars,
        roundSpeakers: beat.roundSpeakers,
        npcHint: beat.npcHint,
        plotHint: beat.plotHint,
        optionTopic: beat.optionTopic,
        forbid: beat.forbid,
        context: flavorStoryContext(beatIndex),
      })
    )
      .then((v) => {
        if (v?.source !== "ai" || !v.beats?.length) {
          openErr = v?.error || window.GalAI?.getLastError?.() || "旁支对白未生成";
          return [];
        }
        if (roundOnly) {
          const replies = arrangeRoundReplies(
            v.beats,
            beat.roundSpeakers || [],
            allSlots
          );
          if (!replies.length) {
            openErr = "家人轮流回应未生成";
            return [];
          }
          return replies;
        }
        const beats = decorateFlavorBeats(v.beats, allSlots);
        if (!oneReply) return beats;
        const npc = beats.find((b) => b.type === "say" && b.speaker && b.speaker !== "宁念");
        if (!npc) return [];
        const who = allSlots.find((s) => s.name === npc.speaker);
        const ning = allSlots.find((s) => s.name === "宁念");
        const talkSlots = [ning, who].filter(Boolean);
        return decorateFlavorBeats([{ ...npc, slots: talkSlots.length ? talkSlots : beat.slots }], allSlots);
      })
      .catch(() => {
        openErr = window.GalAI?.getLastError?.() || "旁支对白未生成";
        return [];
      });

    const closePromise = oneReply || roundOnly
      ? null
      : openPromise.then((openBeats) => {
      if (!openBeats.length) return [];
      return Promise.resolve(
        window.GalAI?.generateFlavorSegment?.({
          phase: "close",
          spokenAlready: true,
          prompt: beat.prompt,
          optionLabel: option.label,
          optionIntent: option.intent || option.label,
          canonIntent: beat.canon?.intent || "",
          resumeHint,
          presentChars,
          npcHint: beat.npcHint,
          plotHint: beat.plotHint,
          optionTopic: beat.optionTopic,
          forbid: beat.forbid,
          previousBeats: [spoken, ...openBeats],
          context: flavorStoryContext(beatIndex),
        })
      )
        .then((v) => decorateFlavorBeats(v?.source === "ai" ? v.beats || [] : [], allSlots))
        .catch(() => []);
    });

    const r = await playGeneratedQueue([spoken], token, {
      moreBeats: openPromise,
      tailBeats: closePromise,
      slots: beat.slots,
      remember: (lines) => rememberFlavorPlayback(beatIndex, lines, beat.slots),
    });
    if (r === "back" || pendingBack || token.cancelled) {
      pendingBack = false;
      restoreHorrorAtBeat(beatIndex);
      return "choice-retry";
    }
    if (openErr) {
      window.MenuUI?.toast?.(
        `旁支对白生成失败，已接回正史：${String(openErr).slice(0, 36)}`,
        3600
      );
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
    setGenerating(false);
  }

  function setGenerating(on, text) {
    const el = document.getElementById("storyGenerating");
    const label = document.getElementById("storyGeneratingText");
    if (!el) return;
    if (text && label) label.textContent = text;
    el.hidden = !on;
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
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        btn.removeEventListener("click", onClick);
        clearInterval(poll);
        el.hidden = true;
        resolve();
      };
      const onClick = (e) => {
        e.stopPropagation();
        finish();
      };
      // 「回退」在失败面板期间只会置 pendingBack；此处一并结束等待
      const poll = setInterval(() => {
        if (pendingBack || cancelToken.cancelled) finish();
      }, 80);
      btn.addEventListener("click", onClick);
    });
  }

  async function runDialogueBeat(beat, { recordHistory = true } = {}) {
    const next = currentStory?.beats?.[beatIndex + 1];
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
      { recordHistory, keepVisible: next?.type === "flavorChoice" }
    );
  }

  function restoreHorrorAtBeat(index) {
    const i = Math.max(0, index == null ? beatIndex : index);
    window.HorrorMeter?.set?.(computeHorrorUpTo(i), { animate: false });
  }

  /**
   * 旁支/失败线当成同一段对话播：段内可逐句回退；退过首句则返回 "back"（回到选项）。
   * moreBeats：播完当前稿后接上的展开；tailBeats：展开之后的收束。
   */
  async function playGeneratedQueue(
    beats,
    token,
    { moreBeats, tailBeats, slots, startAt = 0, replay = false, remember } = {}
  ) {
    const lines = (beats || []).filter((b) => b && b.text);
    if (!replay) {
      (beats || []).forEach((b) => {
        if (b?.type === "horror") window.HorrorMeter?.applyBeat?.(b);
      });
    }

    let fromIndex = lines.length
      ? Math.min(Math.max(0, startAt), lines.length - 1)
      : 0;
    let isReplay = !!replay || startAt > 0;
    let extraMerged = moreBeats == null;
    let tailMerged = tailBeats == null;

    const makeWait = (src) => {
      const box = { list: null };
      if (src == null) return { box, wait: null };
      const wait = Promise.resolve(src).then(
        (v) => {
          box.list = Array.isArray(v) ? v : [];
          return box.list;
        },
        () => {
          box.list = [];
          return box.list;
        }
      );
      return { box, wait };
    };
    const extra = makeWait(moreBeats);
    const tail = makeWait(tailBeats);

    const finishDone = () => {
      remember?.(lines.slice());
      return "done";
    };

    const mergePending = async (state) => {
      if (state.merged) return;
      state.merged = true;
      if (!state.wait) return;
      let extraLines = state.box.list;
      if (extraLines == null) {
        window.GalDialogue?.showGenerating?.({ slots });
        try {
          extraLines = await state.wait;
        } finally {
          window.GalDialogue?.hideGenerating?.();
        }
      }
      const extraClean =
        window.GalAI?.dropRepeatFlavorBeats?.(extraLines, lines) || extraLines;
      for (const b of extraClean || []) {
        if (!replay && b?.type === "horror") window.HorrorMeter?.applyBeat?.(b);
        if (b?.text) lines.push(b);
      }
    };

    const extraState = { merged: extraMerged, wait: extra.wait, box: extra.box };
    const tailState = { merged: tailMerged, wait: tail.wait, box: tail.box };

    while (true) {
      if (token?.cancelled || pendingBack) return "back";
      if (fromIndex >= lines.length) {
        await mergePending(extraState);
        if (fromIndex >= lines.length) await mergePending(tailState);
        if (fromIndex >= lines.length) return finishDone();
      }

      const slice = lines.slice(fromIndex);
      const result = await window.GalDialogue.showBeat(
        { lines: slice, slots: slice[0].slots || slots },
        { recordHistory: !isReplay }
      );
      isReplay = false;

      if (token?.cancelled) return "back";
      if (result === "back" || result === "aborted" || pendingBack) {
        window.GalDialogue?.popHistory?.(1);
        if (fromIndex <= 0) return "back";
        fromIndex -= 1;
        isReplay = true;
        continue;
      }

      fromIndex = lines.length;
      await mergePending(extraState);
      if (fromIndex >= lines.length) await mergePending(tailState);
      if (fromIndex >= lines.length) return finishDone();
    }
  }

  async function handleChoice(beat) {
    const token = cancelToken;
    // 再次进入岔路时，惊悚值应对齐到该 choice beat（不含失败支线）
    restoreHorrorAtBeat(beatIndex);

    let option = null;
    const choiceWait = window.GalDialogue?.showChoices?.({
      prompt: beat.prompt,
      options: beat.options,
      slots: beat.slots,
    });
    // 岔路面板等待期间点「回退」：取消选项并交给主循环还原世界
    if (choiceWait && typeof choiceWait.then === "function") {
      option = await new Promise((resolve) => {
        let settled = false;
        const done = (v) => {
          if (settled) return;
          settled = true;
          clearInterval(poll);
          resolve(v);
        };
        choiceWait.then((v) => done(v));
        const poll = setInterval(() => {
          if (pendingBack || token.cancelled) {
            window.GalDialogue?.hideChoices?.();
            done(null);
          }
        }, 80);
      });
    }

    if (pendingBack) {
      // 保留 pendingBack，主循环 choice-retry 后走 handleBackToPrevDialogue
      restoreHorrorAtBeat(beatIndex);
      return "choice-retry";
    }
    if (!option || token.cancelled) {
      restoreHorrorAtBeat(beatIndex);
      return "choice-retry";
    }
    if (option.canon) return;

    const ending =
      window.STORY_ENDINGS?.[option.ending] || window.STORY_ENDINGS.sisi_kill;
    window.GalDialogue?.showGenerating?.({ slots: beat.slots });
    let gen;
    try {
      gen = await window.GalAI?.generateFailBeats?.({
        prompt: beat.prompt,
        optionId: option.id,
        optionLabel: option.label,
        ending,
        plotHint: beat.plotHint,
        context: flavorStoryContext(beatIndex) || recentContext(8),
      });
    } finally {
      window.GalDialogue?.hideGenerating?.();
    }
    if (token.cancelled || pendingBack) {
      pendingBack = false;
      restoreHorrorAtBeat(beatIndex);
      return "choice-retry";
    }
    const beats =
      gen?.beats?.length > 0
        ? gen.beats
        : window.STORY_BRANCH_FALLBACKS?.[option.id] || [];
    const genResult = await playGeneratedQueue(beats, token, { slots: beat.slots });
    if (token.cancelled || genResult === "back" || pendingBack) {
      pendingBack = false;
      restoreHorrorAtBeat(beatIndex);
      window.GalDialogue?.hideChoices?.();
      return "choice-retry";
    }
    if (ending.horror != null) {
      window.HorrorMeter?.set?.(ending.horror, { animate: true });
    }
    if (ending.text) {
      const result = await runDialogueBeat({
        type: "narration",
        text: ending.text,
        clearSprites: true,
      });
      if (result === "back" || pendingBack) {
        pendingBack = false;
        restoreHorrorAtBeat(beatIndex);
        window.GalDialogue?.hideChoices?.();
        return "choice-retry";
      }
    }
    if (ending.system) {
      const result = await runDialogueBeat({ type: "system", text: ending.system });
      if (result === "back" || pendingBack) {
        pendingBack = false;
        restoreHorrorAtBeat(beatIndex);
        window.GalDialogue?.hideChoices?.();
        return "choice-retry";
      }
    }
    await waitFailRetry(ending);
    // 「回到岔路」或失败面板上的「回退」：回到 choice，并还原失败支线前的惊悚值
    pendingBack = false;
    restoreHorrorAtBeat(beatIndex);
    window.GalDialogue?.hideChoices?.();
    return "choice-retry";
  }

  async function playStory(
    story,
    { fromIndex = 0, replay = false, resetHorror = true, unlockOnEnd = true } = {}
  ) {
    if (!story?.beats?.length) return;
    const gen = ++playGen;
    cancelToken.cancelled = true;
    window.GalDialogue?.abort?.(true);
    window.GalDialogue?.hideChoices?.();
    window.GalDialogue?.hideGenerating?.();
    cancelToken = { cancelled: false };
    const token = cancelToken;
    pendingBack = false;
    hideFailPanel();

    playing = true;
    currentStory = story;
    beatIndex = Math.max(0, fromIndex);
    // 新开局清空旧缓存，重新后台预生成（保证选项不永远同一套）
    if (fromIndex === 0 && !replay && resetHorror) {
      clearFlavorOptCache();
      lastFlavorPlayback = null;
    }
    prefetchFlavorOptions(story, fromIndex);
    if (fromIndex === 0 && !replay && resetHorror) {
      window.HorrorMeter?.set?.(0, { animate: false });
      window.GalAudio?.stop?.({ fadeMs: 0 });
      farthestBeatIndex = 0;
      window.CharInfoUI?.rebuildFromStory?.(story.beats, -1);
    } else if (fromIndex > 0) {
      window.HorrorMeter?.set?.(computeHorrorUpTo(fromIndex - 1), { animate: false });
      window.CharInfoUI?.rebuildFromStory?.(story.beats, fromIndex - 1);
    } else {
      window.CharInfoUI?.rebuildFromStory?.(story.beats, Math.max(0, fromIndex));
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
      window.CharInfoUI?.applyBeat?.(beat);

      if (!isDialogueBeat(beat)) {
        const metaResult = await runMetaBeat(beat);
        if (token.cancelled) break;
        if (metaResult === "pause") {
          farthestBeatIndex = Math.max(farthestBeatIndex, beatIndex);
          break;
        }
        if (metaResult === "choice-retry") {
          farthestBeatIndex = Math.max(farthestBeatIndex, beatIndex);
          // 失败支线可能把惊悚拉到 100；回到岔路时必须按时间线重算
          restoreHorrorAtBeat(beatIndex);
          // 在岔路上点「回退」：退到上一对话框（restoreWorldUpTo 会还原惊悚）
          if (pendingBack) {
            pendingBack = false;
            clearFlavorPlaybackAt(beatIndex);
            const ok = await handleBackToPrevDialogue(beatIndex, {
              popHistory: false,
            });
            if (ok) {
              suppressHistoryOnce = true;
              continue;
            }
          }
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
        prefetchFlavorOptions(story, beatIndex);
        continue;
      }

      lastDialogueIndex = beatIndex;
      const recordHistory = !suppressHistoryOnce;
      suppressHistoryOnce = false;
      const result = await runDialogueBeat(beat, { recordHistory });
      if (token.cancelled) break;

      if (result === "back" || pendingBack) {
        pendingBack = false;
        const choiceIdx = findOwningChoiceIndex(beatIndex);
        if (choiceIdx != null) {
          window.GalDialogue?.popHistory?.(1);
          await restoreWorldUpTo(choiceIdx);
          const stored = lastFlavorPlayback;
          if (stored?.beatIndex === choiceIdx && stored.lines.length) {
            const replayed = await playGeneratedQueue(stored.lines, token, {
              slots: stored.slots,
              startAt: stored.lines.length - 1,
              replay: true,
            });
            if (token.cancelled) break;
            if (replayed === "back" || pendingBack) {
              pendingBack = false;
              beatIndex = choiceIdx;
              restoreHorrorAtBeat(choiceIdx);
              continue;
            }
            suppressHistoryOnce = true;
            continue;
          }
          beatIndex = choiceIdx;
          restoreHorrorAtBeat(choiceIdx);
          continue;
        }
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

    if (gen !== playGen) return;
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
    window.GalDialogue?.abort?.(true);
    window.GalDialogue?.hideChoices?.();
    window.GalDialogue?.hideGenerating?.();
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
      charInfo: window.CharInfoUI?.getState?.() || null,
      pause: pauseState.active
        ? {
            checkpointId: pauseState.checkpointId,
            resumeFromIndex: pauseState.resumeFromIndex,
            unlock: pauseState.unlock,
            resumeNpc: pauseState.resumeNpc,
            hint: pauseState.hint,
            ambientNpcs: pauseState.ambientNpcs || [],
          }
        : null,
      exploration: !!pauseState.active,
      savedAt: Date.now(),
    };
  }

  async function loadSaveData(data) {
    if (!data) return false;
    stopStory();
    lastFlavorPlayback = null;
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

    if (story?.beats) {
      if (data.charInfo) {
        window.CharInfoUI?.syncFromSets?.(data.charInfo);
      }
      window.CharInfoUI?.rebuildFromStory?.(
        story.beats,
        Math.max(0, farthestBeatIndex)
      );
    }

    if (data.pause?.resumeFromIndex != null && story) {
      const savedAmbient = Array.isArray(data.pause.ambientNpcs)
        ? data.pause.ambientNpcs
        : null;
      const ambient =
        savedAmbient ||
        window.AmbientNpcs?.rollForPause?.(
          data.pause.checkpointId,
          data.pause.resumeNpc,
          data.pause.unlock || resolveUnlockList("home")
        ) ||
        [];
      pauseState = {
        active: true,
        checkpointId: data.pause.checkpointId || null,
        resumeFromIndex: data.pause.resumeFromIndex,
        unlock: data.pause.unlock || resolveUnlockList("home"),
        resumeNpc: data.pause.resumeNpc || null,
        hint: data.pause.hint || "自由探索中。",
        ambientNpcs: ambient,
      };
      window.Game?.setUnlockedScenes?.(pauseState.unlock);
      window.Game?.setResumeNpc?.(pauseState.resumeNpc);
      window.Game?.setAmbientNpcs?.(pauseState.ambientNpcs);
      window.Game?.setExplorationEnabled?.(true);
      const dest =
        data.sceneId ||
        pauseState.resumeNpc?.scene ||
        pauseState.unlock[0];
      if (dest) await window.Game?.goToScene?.(dest, { force: true, withFade: false });
      window.MenuUI?.toast?.(pauseState.hint);
      return true;
    }

    lastDialogueIndex = Number.isFinite(data.lastDialogueIndex)
      ? data.lastDialogueIndex
      : null;

    if (story?.beats?.length) {
      const offset = resolved.indexOffset || 0;
      let idx = Number.isFinite(data.beatIndex) ? data.beatIndex : 0;
      idx = Math.max(0, idx + offset);
      const beat = story.beats[idx];
      const canShow =
        isDialogueBeat(beat) ||
        beat?.type === "choice" ||
        beat?.type === "flavorChoice";
      const lastDlg =
        lastDialogueIndex != null ? lastDialogueIndex + offset : null;
      // 保存在换景/等待等 meta 上时，读档先回到上一句对白，避免只剩空场景
      if (!canShow && lastDlg != null && lastDlg >= 0 && lastDlg < story.beats.length) {
        idx = lastDlg;
      }
      await playStory(story, {
        fromIndex: idx,
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

    const choiceOpen = (() => {
      if (window.GalDialogue?.isChoicesOpen?.()) return true;
      const el = document.getElementById("storyChoicePanel");
      return el && !el.hidden;
    })();

    if (playing && choiceOpen) {
      pendingBack = true;
      window.GalDialogue?.hideChoices?.();
      return true;
    }

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

  function findPauseIndex(id) {
    const story = currentStory || buildMainStory();
    if (!story?.beats) return null;
    const index = story.beats.findIndex((b) => b.type === "pause" && b.id === id);
    return index < 0 ? null : index;
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
    lastFlavorPlayback = null;
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
    prefetchFlavorOptions,
    isPlaying: () => playing,
    isPaused: () => pauseState.active,
    getPauseState: () => ({ ...pauseState }),
    getBeatIndex: () => beatIndex,
    getFarthestBeatIndex: () => farthestBeatIndex,
    listProgressNodes,
    jumpTo,
    findPauseIndex,
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

  // 合流选项只在 playStory 开局预拉一次，避免与此处重复请求互相覆盖
})();
