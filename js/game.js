(() => {
  const graph = window.SCENE_GRAPH;

  const stage = document.getElementById("stage");
  const sceneImage = document.getElementById("sceneImage");
  const hotspotLayer = document.getElementById("hotspotLayer");
  const fadeEl = document.getElementById("sceneFade");

  let currentSceneId = null;
  let transitioning = false;
  let explorationEnabled = true;
  /** @type {Set<string>|null} null=不限制；Set=仅允许集合内场景 */
  let unlockedScenes = null;
  /** @type {null|{scene:string,name?:string,sprite:string,area:object,bubble?:string,prompt?:string}} */
  let resumeNpc = null;
  /** @type {Array<{id:string,name:string,sprite:string,scene:string,area:object,tag?:string,stage?:string,role?:string,fallback?:string[]}>} */
  let ambientNpcs = [];
  let contentRect = { left: 0, top: 0, width: 0, height: 0 };
  /** @type {Record<string, { variant: string }>} */
  const sceneState = {};

  function getVariant(scene) {
    if (!scene?.variants) return null;
    return sceneState[scene.id]?.variant || scene.defaultVariant || Object.keys(scene.variants)[0];
  }

  function resolveSceneImage(scene) {
    if (scene.variants) {
      const key = getVariant(scene);
      return scene.variants[key] || scene.variants[scene.defaultVariant];
    }
    return scene.image;
  }

  function getContentRect(img) {
    const cw = img.clientWidth;
    const ch = img.clientHeight;
    const nw = img.naturalWidth || cw;
    const nh = img.naturalHeight || ch;
    const scale = Math.min(cw / nw, ch / nh);
    const width = nw * scale;
    const height = nh * scale;
    return {
      left: (cw - width) / 2,
      top: (ch - height) / 2,
      width,
      height,
    };
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function waitTransition(el) {
    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        el.removeEventListener("transitionend", done);
        resolve();
      };
      el.addEventListener("transitionend", done);
      setTimeout(done, 900);
    });
  }

  function clearHotspots() {
    hotspotLayer.innerHTML = "";
  }

  function createBubble(spot) {
    const bubble = document.createElement("span");
    bubble.className = "hotspot-bubble";

    const bx = spot.bubblePos?.x ?? 50;
    const by = spot.bubblePos?.y ?? 72;
    bubble.style.left = bx + "%";
    bubble.style.top = by + "%";

    const gradId = `bubbleGrad-${spot.id}`;
    bubble.innerHTML = `
      <svg class="hotspot-bubble-shape" viewBox="0 0 240 110" aria-hidden="true">
        <defs>
          <radialGradient id="${gradId}" cx="50%" cy="48%" r="70%">
            <stop offset="0%" stop-color="rgb(22, 24, 28)" stop-opacity="0.96" />
            <stop offset="32%" stop-color="rgb(42, 44, 50)" stop-opacity="0.88" />
            <stop offset="58%" stop-color="rgb(58, 60, 66)" stop-opacity="0.45" />
            <stop offset="82%" stop-color="rgb(70, 72, 78)" stop-opacity="0.12" />
            <stop offset="100%" stop-color="rgb(70, 72, 78)" stop-opacity="0" />
          </radialGradient>
        </defs>
        <path
          fill="url(#${gradId})"
          d="M120.2,10.5
             C152,9 186,18 208,34
             C228,50 232,68 218,82
             C202,98 164,106 120,105
             C78,104 42,96 24,80
             C8,66 10,46 28,31
             C48,14 86,12 120.2,10.5 Z"
        />
      </svg>
      <span class="hotspot-bubble-text"></span>
    `;
    bubble.querySelector(".hotspot-bubble-text").textContent = spot.bubble;
    return bubble;
  }

  function isSceneUnlocked(sceneId) {
    if (!unlockedScenes) return true;
    return unlockedScenes.has(sceneId);
  }

  function isResumeHotspot(scene, spot) {
    return !!(
      resumeNpc &&
      resumeNpc.hotspotId &&
      resumeNpc.scene === scene.id &&
      resumeNpc.hotspotId === spot.id
    );
  }

  function placeResumeNpc(scene) {
    if (!explorationEnabled || !resumeNpc) return;
    if (resumeNpc.hotspotId) return; // 由场景热区接管
    if (resumeNpc.scene !== scene.id) return;
    if (!resumeNpc.sprite) return;

    const spot = resumeNpc;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "story-npc";
    btn.dataset.npcName = spot.name || "角色";
    btn.setAttribute("aria-label", spot.bubble || spot.name || "继续剧情");

    const charId = window.AmbientNpcs?.resolveCharId?.(spot) || "default";
    const preferredCx =
      spot.area != null
        ? (Number(spot.area.x) || 50) + (Number(spot.area.w) || 24) / 2
        : null;
    const { x, y, w, h } =
      window.AmbientNpcs?.areaFor?.(scene.id, charId, preferredCx) ||
      spot.area ||
      { x: 60, y: 15, w: 28, h: 75 };
    btn.style.left = contentRect.left + (x / 100) * contentRect.width + "px";
    btn.style.top = contentRect.top + (y / 100) * contentRect.height + "px";
    btn.style.width = (w / 100) * contentRect.width + "px";
    btn.style.height = (h / 100) * contentRect.height + "px";

    const img = document.createElement("img");
    img.src = /\.(png|webp|jpe?g)(\?|$)/i.test(spot.sprite)
      ? `${spot.sprite}${spot.sprite.includes("?") ? "&" : "?"}v=npc2`
      : spot.sprite;
    img.alt = spot.name || "";
    img.draggable = false;
    btn.appendChild(img);

    if (spot.bubble || spot.name) {
      const tag = document.createElement("span");
      tag.className = "story-npc-tag";
      tag.textContent = spot.bubble || spot.name;
      btn.appendChild(tag);
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openStoryConfirm(spot.prompt || "是否继续剧情？", {
        chatNpc: resolveChatNpcFromResume(spot),
      });
    });

    hotspotLayer.appendChild(btn);
  }

  function placeAmbientNpcs(scene) {
    if (!explorationEnabled || !ambientNpcs?.length) return;
    ambientNpcs.forEach((npc) => {
      if (!npc || npc.scene !== scene.id || !npc.sprite) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "story-npc is-ambient";
      btn.dataset.npcName = npc.name || "角色";
      btn.dataset.npcId = npc.id || "";
      btn.setAttribute("aria-label", `${npc.name || "角色"} · 闲聊`);

      const area =
        window.AmbientNpcs?.ensureNpcArea?.(npc) ||
        npc.area ||
        { x: 60, y: 12, w: 22, h: 80 };
      btn.style.left = contentRect.left + (area.x / 100) * contentRect.width + "px";
      btn.style.top = contentRect.top + (area.y / 100) * contentRect.height + "px";
      btn.style.width = (area.w / 100) * contentRect.width + "px";
      btn.style.height = (area.h / 100) * contentRect.height + "px";

      const img = document.createElement("img");
      img.src = /\.(png|webp|jpe?g)(\?|$)/i.test(npc.sprite)
        ? `${npc.sprite}${npc.sprite.includes("?") ? "&" : "?"}v=npc2`
        : npc.sprite;
      img.alt = npc.name || "";
      img.draggable = false;
      btn.appendChild(img);

      const tag = document.createElement("span");
      tag.className = "story-npc-tag";
      tag.textContent = npc.name || npc.tag || "角色";
      btn.appendChild(tag);

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!explorationEnabled) return;
        window.AmbientChat?.open?.(npc);
      });

      hotspotLayer.appendChild(btn);
    });
  }

  let pendingConfirmChatNpc = null;

  function resolveChatNpcFromResume(spot) {
    if (!spot?.sprite) return null;
    const name = spot.name || spot.bubble || "";
    const id =
      window.CharInfo?.SPEAKER_TO_ID?.[name] ||
      Object.keys(window.AmbientNpcs?.CATALOG || {}).find(
        (k) => window.AmbientNpcs.CATALOG[k].name === name
      ) ||
      null;
    const cat = id ? window.AmbientNpcs?.getCatalogEntry?.(id) : null;
    return {
      id: id || "resume_npc",
      name: name || cat?.name || "对方",
      sprite: spot.sprite,
      stage: "FREE_RESUME",
      role: cat?.role,
      greeting: cat?.greeting,
      fallback: cat?.fallback,
    };
  }

  function promptToChoiceLabel(message) {
    let label = String(message || "是否继续剧情？")
      .trim()
      .replace(/^是否/, "")
      .replace(/[？?]+$/, "")
      .trim();
    if (!label) label = "继续剧情";
    if (!/[。！.!?]$/.test(label)) label += "。";
    return label;
  }

  function openStoryConfirm(message, { chatNpc = null } = {}) {
    const panel = document.getElementById("storyConfirm");
    const text = document.getElementById("storyConfirmText");
    const yesLabel = document.getElementById("storyConfirmYesLabel");
    const chatBtn = document.getElementById("storyConfirmChat");
    if (!panel) return;
    const prompt = message || "是否继续剧情？";
    if (text) text.textContent = prompt;
    if (yesLabel) yesLabel.textContent = promptToChoiceLabel(prompt);
    pendingConfirmChatNpc = chatNpc || null;
    if (chatBtn) {
      const showChat = Boolean(pendingConfirmChatNpc);
      chatBtn.hidden = !showChat;
      chatBtn.setAttribute("aria-hidden", showChat ? "false" : "true");
    }
    panel.hidden = false;
  }

  function closeStoryConfirm() {
    const panel = document.getElementById("storyConfirm");
    if (panel) panel.hidden = true;
    pendingConfirmChatNpc = null;
    const chatBtn = document.getElementById("storyConfirmChat");
    if (chatBtn) {
      chatBtn.hidden = true;
      chatBtn.setAttribute("aria-hidden", "true");
    }
  }

  function ensureElevatorPanel() {
    let panel = document.getElementById("elevatorFloorPanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "elevatorFloorPanel";
      panel.className = "elevator-panel";
      panel.hidden = true;
      panel.setAttribute("role", "group");
      panel.setAttribute("aria-label", "选择楼层");
      stage.appendChild(panel);
    }
    return panel;
  }

  function hideElevatorPanel() {
    const panel = document.getElementById("elevatorFloorPanel");
    if (panel) panel.hidden = true;
  }

  function placeFloorChoices(scene) {
    const choices = scene.floorChoices;
    if (!choices?.length) {
      hideElevatorPanel();
      return;
    }

    const panel = ensureElevatorPanel();
    panel.hidden = false;
    panel.innerHTML = "";

    const title = document.createElement("div");
    title.className = "elevator-panel-title";
    title.textContent = "选择楼层";
    panel.appendChild(title);

    const tabs = document.createElement("div");
    tabs.className = "elevator-tabs";

    choices.forEach((choice) => {
      const resumeHere = isResumeHotspot(scene, choice);
      const goLocked =
        !!(choice.goTo && unlockedScenes && !isSceneUnlocked(choice.goTo));

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "elevator-tab";
      btn.dataset.hotspotId = choice.id;
      btn.textContent = resumeHere
        ? resumeNpc.bubble || choice.label
        : choice.label;
      btn.setAttribute("aria-label", btn.textContent);

      // 未开放楼层仍显示为灰态，保证选项卡始终可见
      if (goLocked && !resumeHere) {
        btn.classList.add("is-locked");
      }

      btn.addEventListener("click", () => {
        if (!explorationEnabled) return;
        if (resumeHere) {
          openStoryConfirm(resumeNpc.prompt || "是否继续剧情？");
          return;
        }
        if (!choice.goTo) return;
        if (!isSceneUnlocked(choice.goTo)) {
          window.MenuUI?.toast?.(
            choice.lockedHint || "该楼层尚未开放。"
          );
          return;
        }
        goToScene(choice.goTo);
      });

      tabs.appendChild(btn);
    });

    panel.appendChild(tabs);
  }

  function placeHotspots(scene) {
    clearHotspots();
    contentRect = getContentRect(sceneImage);
    hotspotLayer.style.left = "0";
    hotspotLayer.style.top = "0";
    hotspotLayer.style.width = "100%";
    hotspotLayer.style.height = "100%";
    hotspotLayer.classList.toggle("is-locked", !explorationEnabled);

    if (!explorationEnabled) {
      hideElevatorPanel();
      return;
    }

    if (scene.floorChoices?.length) {
      placeFloorChoices(scene);
      placeResumeNpc(scene);
      placeAmbientNpcs(scene);
      return;
    }

    hideElevatorPanel();

    (scene.hotspots || []).forEach((spot) => {
      const resumeHere = isResumeHotspot(scene, spot);
      const goLocked =
        !!(spot.goTo && unlockedScenes && !isSceneUnlocked(spot.goTo));
      // 未到剧情的门：仍显示热区，点击提示；续播敲门例外
      if (goLocked && !resumeHere && !spot.showWhenLocked) return;

      const bubbleText = resumeHere
        ? resumeNpc.bubble || spot.bubble
        : spot.bubble;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hotspot";
      btn.dataset.hotspotId = spot.id;
      btn.setAttribute("aria-label", bubbleText || spot.id);

      const { x, y, w, h } = spot.area;
      btn.style.left = contentRect.left + (x / 100) * contentRect.width + "px";
      btn.style.top = contentRect.top + (y / 100) * contentRect.height + "px";
      btn.style.width = (w / 100) * contentRect.width + "px";
      btn.style.height = (h / 100) * contentRect.height + "px";

      if (bubbleText) {
        btn.appendChild(createBubble({ ...spot, bubble: bubbleText }));
      }

      btn.addEventListener("click", () => {
        if (!explorationEnabled) return;
        if (resumeHere) {
          openStoryConfirm(resumeNpc.prompt || "是否继续剧情？");
          return;
        }
        if (!spot.goTo) return;
        if (!isSceneUnlocked(spot.goTo)) {
          window.MenuUI?.toast?.(
            spot.lockedHint || "还没到拜访这层的时候，门打不开。"
          );
          return;
        }
        goToScene(spot.goTo);
      });

      hotspotLayer.appendChild(btn);
    });

    placeResumeNpc(scene);
    placeAmbientNpcs(scene);
  }

  function renderScene(sceneId, { withFade = false } = {}) {
    const scene = graph.scenes[sceneId];
    if (!scene) {
      console.warn("[scene] missing:", sceneId);
      return Promise.resolve();
    }

    const imageSrc = resolveSceneImage(scene);

    const apply = () =>
      new Promise((resolve) => {
        const onLoad = () => {
          sceneImage.removeEventListener("load", onLoad);
          currentSceneId = sceneId;
          placeHotspots(scene);
          resolve();
        };
        if (sceneImage.getAttribute("src") === imageSrc && sceneImage.complete) {
          currentSceneId = sceneId;
          placeHotspots(scene);
          resolve();
          return;
        }
        sceneImage.addEventListener("load", onLoad);
        sceneImage.src = imageSrc;
        sceneImage.alt = scene.id;
      });

    if (!withFade) return apply();

    return (async () => {
      transitioning = true;
      fadeEl.classList.add("is-on");
      await waitTransition(fadeEl);
      await apply();
      await wait(40);
      fadeEl.classList.remove("is-on");
      await waitTransition(fadeEl);
      transitioning = false;
    })();
  }

  async function goToScene(sceneId, { withFade = true, force = false } = {}) {
    if (transitioning) {
      if (!force) return;
      // 回退等强制跳转：中断未完成的淡入淡出，避免场景卡住
      fadeEl.classList.remove("is-on");
      transitioning = false;
    }
    if (!force && sceneId === currentSceneId) return;
    if (!graph.scenes[sceneId]) {
      console.warn("[scene] unknown target:", sceneId);
      return;
    }
    if (explorationEnabled && !force && !isSceneUnlocked(sceneId)) {
      window.MenuUI?.toast?.("该区域尚未开放");
      return;
    }
    if (force) currentSceneId = null;
    await renderScene(sceneId, { withFade });
  }

  async function reloadScene(sceneId, { withFade = false } = {}) {
    return goToScene(sceneId, { withFade, force: true });
  }

  /** 切换场景变体（如客厅打扫前/后），热区与控件保持不变 */
  async function setVariant(sceneId, variant, { withFade = true } = {}) {
    const scene = graph.scenes[sceneId];
    if (!scene?.variants?.[variant]) {
      console.warn("[scene] bad variant:", sceneId, variant);
      return;
    }
    sceneState[sceneId] = { ...(sceneState[sceneId] || {}), variant };
    if (currentSceneId === sceneId) {
      const prev = currentSceneId;
      currentSceneId = null;
      await renderScene(prev, { withFade });
    }
  }

  function setExplorationEnabled(on) {
    explorationEnabled = !!on;
    if (currentSceneId && graph.scenes[currentSceneId]) {
      placeHotspots(graph.scenes[currentSceneId]);
    }
  }

  function setUnlockedScenes(list) {
    if (!list) {
      unlockedScenes = null;
    } else {
      unlockedScenes = new Set(list);
    }
    if (currentSceneId && graph.scenes[currentSceneId]) {
      placeHotspots(graph.scenes[currentSceneId]);
    }
  }

  function setResumeNpc(npc) {
    resumeNpc = npc || null;
    if (currentSceneId && graph.scenes[currentSceneId]) {
      placeHotspots(graph.scenes[currentSceneId]);
    }
  }

  function setAmbientNpcs(list) {
    ambientNpcs = Array.isArray(list) ? list.slice() : [];
    if (currentSceneId && graph.scenes[currentSceneId]) {
      placeHotspots(graph.scenes[currentSceneId]);
    }
  }

  function relayout() {
    if (!currentSceneId) return;
    const scene = graph.scenes[currentSceneId];
    if (scene) placeHotspots(scene);
  }

  window.addEventListener("resize", relayout);

  document.getElementById("storyConfirmYes")?.addEventListener("click", async () => {
    closeStoryConfirm();
    await window.Story?.resumeFromPause?.();
  });
  document.getElementById("storyConfirmChat")?.addEventListener("click", () => {
    const npc = pendingConfirmChatNpc;
    closeStoryConfirm();
    if (npc) window.AmbientChat?.open?.(npc);
  });
  document.getElementById("storyConfirmNo")?.addEventListener("click", () => {
    closeStoryConfirm();
  });

  // 对外暴露，方便以后剧情/对话触发跳转与变体切换
  window.Game = {
    goToScene,
    reloadScene,
    setVariant,
    setExplorationEnabled,
    setUnlockedScenes,
    setResumeNpc,
    setAmbientNpcs,
    getCurrentScene: () => currentSceneId,
    getVariant: (sceneId) => {
      const id = sceneId || currentSceneId;
      const scene = graph.scenes[id];
      return scene ? getVariant(scene) : null;
    },
    isSceneUnlocked,
    relayout,
  };

  setExplorationEnabled(false);
  renderScene(graph.start, { withFade: false }).then(async () => {
    const story = window.Story?.buildMainStory?.();
    if (window.Story?.playStory && story) {
      await window.Story.playStory(story);
      return;
    }
    setExplorationEnabled(true);
  });
})();
