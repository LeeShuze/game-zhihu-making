/**
 * 自由探索中断点：除续播 NPC/热区外，按剧情阶段随机刷可闲聊 NPC（立绘站桩）。
 * 出现房间不固定：从场景池随机；不推进主线。
 */
(() => {
  const CATALOG = {
    huangmao: {
      id: "huangmao",
      name: "黄毛",
      sprite: "assets/chars/huangmao_front.png",
      role: "你是楼里爱出风头的黄毛玩家，嘴碎、怂又逞强。只聊选房、楼层危险、别的玩家，禁止剧透通关与第七天。",
      greeting: "哟，还在逛啊？低层的人可没几个像你这么闲。",
      fallback: ["30 层？你真敢啊。", "兄弟，低层才是王道。", "我先溜了哈。"],
    },
    hongjie: {
      id: "hongjie",
      name: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      role: "你是红姐，老玩家，表面热心可靠。可给模糊生存建议，禁止透露真实图谋、通关钥匙与幸福之心。",
      greeting: "正好碰到你。有事就说，红姐听着。",
      fallback: ["先活下来最重要。", "有事可以找我。", "别太逞强。"],
    },
    junge: {
      id: "junge",
      name: "俊哥",
      sprite: "assets/chars/junge_front.png",
      role: "你是俊哥，护着红姐，语气冲。少透露情报，可抱怨新玩家。禁止剧透。",
      greeting: "看什么看？别挡路。",
      fallback: ["少管闲事。", "跟紧红姐就行。", "哼。"],
    },
    sisi: {
      id: "sisi",
      name: "思思",
      sprite: "assets/chars/sisi_front.png",
      role: "你是秦思思，血衣萝莉，认宁念为妈妈。粘人、阴森又依赖。禁止谈拜访任务细节以外的未来通关。",
      greeting: "妈妈……你来找思思玩了吗？",
      fallback: ["……妈妈？", "思思听不懂。", "陪陪我。"],
    },
    boss: {
      id: "boss",
      name: "断头",
      sprite: "assets/chars/boss_front.png",
      role: "你是30层断头诡异，高冷护短，在意身高。可谈思思与家事，禁止谈通关方法与钥匙。",
      greeting: "……找我有事？",
      fallback: ["……有趣。", "看着我。", "我一米八六。"],
    },
    yeye: {
      id: "yeye",
      name: "爷爷",
      sprite: "assets/chars/yeye_front.png",
      role: "你是肠老头刘爱国，怪异慈祥，爱做饭。把宁念当儿媳。禁止剧透钥匙与异世之门。",
      greeting: "哟，乖儿媳回来啦？厨房还有热汤。",
      fallback: ["乖儿媳，吃饭没有？", "肠子……毛衣有点脱线。"],
    },
    nainai: {
      id: "nainai",
      name: "奶奶",
      sprite: "assets/chars/nainai_front.png",
      role: "你是黑老太李翠兰，护短，可被面膜哄住。禁止剧透后续天数。",
      greeting: "来了就好好站着，别学那死老头子瞎晃。",
      fallback: ["死老头子少说话。", "面膜……也行。"],
    },
    twin_sister: {
      id: "twin_sister",
      name: "双生姐姐",
      sprite: "assets/chars/twin_sister_front.png",
      role: "你是29层双生姐姐，热情过界、语气甜腻。可谈拜访卡片，禁止强行推进主线。",
      greeting: "哎呀，是你～再陪姐姐说两句好不好？",
      fallback: ["再坐一会儿嘛。", "姐姐喜欢你。"],
    },
    twin_brother: {
      id: "twin_brother",
      name: "双生弟弟",
      sprite: "assets/chars/twin_brother_front.png",
      role: "你是29层双生弟弟，沉默、偶尔附和姐姐。少说话。",
      greeting: "……你来了。",
      fallback: ["……嗯。", "姐姐说的对。"],
    },
    girl28: {
      id: "girl28",
      name: "28层女孩",
      sprite: "assets/chars/girl28_front.png",
      role: "你是28层 cos 女孩，夸张妆容，情绪不稳但客气。可闲聊服装与寂寞，禁止剧透。",
      greeting: "啊……你真的停下来了。想听听我的新造型吗？",
      fallback: ["你……还愿意跟我说话。", "妆花了吗？"],
    },
    mom27: {
      id: "mom27",
      name: "27层母亲",
      sprite: "assets/chars/mom27_front.png",
      role: "你是27层母亲诡异，制服围裙，牵着孩子。表面贤惠。禁止剧透。",
      greeting: "贵客上门呀。要不要先喝口茶？",
      fallback: ["要喝茶吗？", "孩子怕生。"],
    },
    boy27: {
      id: "boy27",
      name: "27层男孩",
      sprite: "assets/chars/boy27_front.png",
      role: "你是27层被压碎感的男孩诡异，话少、怯怯的。",
      greeting: "……你好。妈妈说，可以……跟你打招呼。",
      fallback: ["……妈妈。", "好痛……不，没事。"],
    },
  };

  /** 场景组：必须与原剧情位置一致，勿把已选低层的玩家刷到 30 层 */
  const ROOM_GROUPS = {
    /** 选房后仍滞留的公共区：大厅 / 1 层外（不含 30 层） */
    lobby_low: ["downstairs", "floor01_outside"],
    /** 红姐俊哥已占 1–2 层，主要在 1 层外活动 */
    floor01_area: ["floor01_outside", "downstairs"],
    home: [
      "floor30_living",
      "kitchen",
      "bathroom",
      "dining",
      "corridor",
      "sisi_room",
      "master_bedroom",
      "balcony",
    ],
    /** 家里走动，略避开主卧（续播思思时常在主卧） */
    home_roam: [
      "floor30_living",
      "kitchen",
      "bathroom",
      "dining",
      "corridor",
      "sisi_room",
      "balcony",
    ],
    visit29: ["floor29_outside", "floor29_living"],
    visit28: ["floor28_outside", "floor28_room"],
    visit27: ["floor27_outside", "floor27_dining"],
  };

  /**
   * 各场景「门」视觉高度（背景图百分比，非热区）。
   * 用网格叠图从门楣量到门槛；角色身高 = 门高 × 4/5 × 角色修正。
   * doorTop / doorBottom：画面自上而下 0–100。
   */
  const CHAR_TO_DOOR = 4 / 5;
  const SCENE_DOOR_REF = {
    // 走廊门外：以深处木门为准（电梯门更近、更大，不作本场景统一参照）
    floor30_outside: { doorTop: 20, doorBottom: 60, note: "30层公寓门" },
    floor29_outside: { doorTop: 20, doorBottom: 62, note: "29层公寓门" },
    floor28_outside: { doorTop: 20, doorBottom: 62, note: "28层公寓门" },
    floor27_outside: { doorTop: 20, doorBottom: 62, note: "27层公寓门" },
    floor01_outside: { doorTop: 20, doorBottom: 95, note: "101室门" },
    // 室内：以画面中主要门洞为准
    floor30_living: { doorTop: 10, doorBottom: 65, note: "客厅右侧卧室门" },
    corridor: { doorTop: 15, doorBottom: 85, note: "走廊尽头浴室门" },
    dining: { doorTop: 12, doorBottom: 100, note: "餐厅通向厨房门洞" },
    kitchen: { doorTop: 5, doorBottom: 100, note: "厨房右侧门洞" },
    bathroom: { doorTop: 0, doorBottom: 95, note: "浴室出门" },
    sisi_room: { doorTop: 15, doorBottom: 85, note: "思思房门" },
    master_bedroom: { doorTop: 5, doorBottom: 90, note: "主卧门" },
    balcony: { doorTop: 5, doorBottom: 93, note: "阳台落地门" },
    floor29_living: { doorTop: 10, doorBottom: 100, note: "29层室内门洞" },
    floor28_room: { doorTop: 15, doorBottom: 85, note: "28层室内门" },
    floor27_dining: { doorTop: 10, doorBottom: 74, note: "27层厨房门洞" },
    downstairs: { doorTop: 67, doorBottom: 88, note: "楼外大门" },
    elevator: { doorTop: 2, doorBottom: 98, note: "电梯门扇" },
    default: { doorTop: 15, doorBottom: 85, note: "默认门" },
  };

  /** 个别场景人物额外倍率（相对门高×4/5） */
  const SCENE_SCALE_MULT = {
    balcony: 2,
  };

  /**
   * 站位：cx 水平中心；可选 floorY / doorTop / doorBottom 覆盖透视深度。
   * 门外走廊勿把前景人钉在远处门槛上（会像站墙上）。
   */
  const SCENE_FLOOR_SPOTS = {
    bathroom: [{ cx: 24, w: 18 }, { cx: 38, w: 18 }],
    kitchen: [{ cx: 28, w: 18 }, { cx: 48, w: 18 }, { cx: 62, w: 17 }],
    dining: [{ cx: 26, w: 18 }, { cx: 70, w: 18 }],
    floor30_living: [
      { cx: 24, w: 18, floorY: 78, doorTop: 12, doorBottom: 78 },
      { cx: 48, w: 18, floorY: 72, doorTop: 14, doorBottom: 72 },
      { cx: 70, w: 18, floorY: 68, doorTop: 12, doorBottom: 68 },
    ],
    corridor: [
      { cx: 28, w: 18, floorY: 94, doorTop: 8, doorBottom: 94 },
      { cx: 55, w: 18, floorY: 88, doorTop: 12, doorBottom: 88 },
    ],
    sisi_room: [{ cx: 28, w: 18 }, { cx: 62, w: 18 }],
    master_bedroom: [{ cx: 22, w: 18 }, { cx: 74, w: 18 }],
    balcony: [{ cx: 32, w: 17 }, { cx: 58, w: 17 }],
    downstairs: [
      { cx: 42, w: 12, floorY: 92, doorTop: 70, doorBottom: 92 },
      { cx: 50, w: 12, floorY: 90, doorTop: 68, doorBottom: 90 },
      { cx: 58, w: 12, floorY: 90, doorTop: 68, doorBottom: 90 },
    ],
    floor01_outside: [
      { cx: 28, w: 18, floorY: 96, doorTop: 12, doorBottom: 96 },
      { cx: 62, w: 18, floorY: 95, doorTop: 18, doorBottom: 95 },
    ],
    elevator: [{ cx: 40, w: 20 }, { cx: 56, w: 20 }],
    // 门外：左近景大、右偏门洞略小；脚必须落在瓷砖地面
    floor30_outside: [
      { cx: 26, w: 18, floorY: 94, doorTop: 10, doorBottom: 94 },
      { cx: 54, w: 16, floorY: 78, doorTop: 18, doorBottom: 78 },
    ],
    floor29_outside: [
      { cx: 26, w: 18, floorY: 94, doorTop: 10, doorBottom: 94 },
      { cx: 54, w: 16, floorY: 78, doorTop: 18, doorBottom: 78 },
    ],
    floor29_living: [{ cx: 26, w: 18 }, { cx: 68, w: 18 }],
    floor28_outside: [
      { cx: 26, w: 18, floorY: 94, doorTop: 10, doorBottom: 94 },
      { cx: 52, w: 16, floorY: 80, doorTop: 18, doorBottom: 80 },
    ],
    floor28_room: [{ cx: 28, w: 18 }, { cx: 66, w: 18 }],
    floor27_outside: [
      { cx: 26, w: 18, floorY: 94, doorTop: 10, doorBottom: 94 },
      { cx: 54, w: 16, floorY: 78, doorTop: 18, doorBottom: 78 },
    ],
    floor27_dining: [
      { cx: 26, w: 18, floorY: 86, doorTop: 12, doorBottom: 86 },
      { cx: 68, w: 18, floorY: 86, doorTop: 12, doorBottom: 86 },
    ],
  };

  const DEFAULT_FLOOR_SPOTS = [
    { cx: 28, w: 18 },
    { cx: 55, w: 18 },
  ];

  /** 相对「门高×4/5」的角色体型修正（儿童更矮等） */
  const CHAR_SCALE = {
    sisi: 0.92,
    boy27: 0.78,
    twin_brother: 0.9,
    twin_sister: 0.92,
    girl28: 0.94,
    nainai: 0.94,
    yeye: 0.98,
    huangmao: 0.98,
    hongjie: 0.98,
    junge: 1.0,
    boss: 1.05,
    mom27: 0.96,
    default: 1.0,
  };

  const SCENE_LABEL = {
    downstairs: "楼下",
    floor01_outside: "1层外",
    elevator: "电梯",
    floor30_outside: "30层门外",
    floor30_living: "客厅",
    kitchen: "厨房",
    bathroom: "浴室",
    dining: "餐厅",
    corridor: "走廊",
    sisi_room: "思思房",
    master_bedroom: "主卧",
    balcony: "阳台",
    floor29_outside: "29层门外",
    floor29_living: "29层室内",
    floor28_outside: "28层门外",
    floor28_room: "28层室内",
    floor27_outside: "27层门外",
    floor27_dining: "27层室内",
  };

  /**
   * candidates: { id, scenes: 组名|场景数组 }
   * 位置须符合原剧情：已选低层者不得出现在 30 层门外
   */
  const PAUSE_POOLS = {
    before_knock: {
      stage: "OUTSIDE_ARRIVE",
      count: [1, 2],
      candidates: [
        // 黄毛等抢低层，只会在大厅/1 层晃，不会跟到 30 层
        { id: "huangmao", scenes: "lobby_low" },
        // 红姐俊哥选了 1–2 层
        { id: "hongjie", scenes: "floor01_area" },
        { id: "junge", scenes: "floor01_area" },
      ],
    },
    after_night1: {
      stage: "D1_NIGHT",
      count: [1, 2],
      candidates: [
        { id: "boss", scenes: "home_roam" },
        { id: "boss", scenes: "home" },
      ],
    },
    before_departure: {
      stage: "D3_PREP",
      count: [1, 3],
      candidates: [
        { id: "sisi", scenes: "home" },
        { id: "yeye", scenes: "home" },
        { id: "nainai", scenes: "home" },
        { id: "sisi", scenes: "home_roam" },
        { id: "yeye", scenes: "home_roam" },
        { id: "nainai", scenes: "home_roam" },
      ],
    },
    before_neighbors: {
      stage: "D4_VISIT",
      count: [1, 3],
      candidates: [
        { id: "sisi", scenes: "home" },
        { id: "boss", scenes: "home" },
        { id: "yeye", scenes: "home" },
        { id: "nainai", scenes: "home" },
      ],
    },
    after_floor29: {
      stage: "D4_VISIT",
      count: [1, 3],
      candidates: [
        { id: "twin_sister", scenes: "visit29" },
        { id: "twin_brother", scenes: "visit29" },
        { id: "sisi", scenes: "home" },
        { id: "boss", scenes: "home" },
        { id: "yeye", scenes: "home_roam" },
        { id: "nainai", scenes: "home_roam" },
      ],
    },
    after_floor28: {
      stage: "D4_VISIT",
      count: [1, 3],
      candidates: [
        { id: "girl28", scenes: "visit28" },
        { id: "twin_sister", scenes: "visit29" },
        { id: "twin_brother", scenes: "visit29" },
        { id: "sisi", scenes: "home" },
        { id: "boss", scenes: "home" },
        { id: "mom27", scenes: "visit27", always: true },
        { id: "boy27", scenes: "visit27", always: true },
      ],
    },
  };

  /** 27 层：室内可进时偏室内；拜访前敲门占用大门，则只刷门外。 */
  const SCENE_SPAWN_WEIGHT = {
    floor27_dining: 5,
    floor27_outside: 1,
  };

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pickOne(list) {
    if (!list?.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  function resumeBlocksScene(sceneId, resumeNpc) {
    if (!resumeNpc?.hotspotId || !resumeNpc.scene) return false;
    const doorScene = window.SCENE_GRAPH?.scenes?.[resumeNpc.scene];
    const spot = (doorScene?.hotspots || []).find((h) => h.id === resumeNpc.hotspotId);
    return !!(spot?.goTo && spot.goTo === sceneId);
  }

  function resolveScenes(spec, unlockList, resumeNpc) {
    let scenes = [];
    if (typeof spec.scenes === "string") {
      scenes = (ROOM_GROUPS[spec.scenes] || []).slice();
    } else if (Array.isArray(spec.scenes)) {
      scenes = spec.scenes.slice();
    } else if (spec.scene) {
      scenes = [spec.scene];
    }
    if (Array.isArray(unlockList) && unlockList.length) {
      const allow = new Set(unlockList);
      scenes = scenes.filter((s) => allow.has(s));
    }
    if (resumeNpc) {
      scenes = scenes.filter((s) => !resumeBlocksScene(s, resumeNpc));
    }
    return scenes;
  }

  function sceneSpawnWeight(sceneId) {
    return SCENE_SPAWN_WEIGHT[sceneId] || 1;
  }

  function sceneOccupancyCap(sceneId) {
    return Math.min(2, listFloorSpots(sceneId).length || 2);
  }

  function pickSpawnScene(scenes, usedScenes) {
    const available = (scenes || []).filter(
      (s) => (usedScenes[s] || 0) < sceneOccupancyCap(s)
    );
    if (!available.length) return null;
    const hasBias = available.some((s) => SCENE_SPAWN_WEIGHT[s] != null);
    if (hasBias) {
      const weights = available.map((s) => sceneSpawnWeight(s));
      const total = weights.reduce((sum, w) => sum + w, 0);
      let roll = Math.random() * total;
      for (let i = 0; i < available.length; i += 1) {
        roll -= weights[i];
        if (roll <= 0) return available[i];
      }
      return available[available.length - 1];
    }
    const ranked = shuffle(available).sort(
      (a, b) => (usedScenes[a] || 0) - (usedScenes[b] || 0)
    );
    return ranked[0] || null;
  }

  function doorRef(sceneId) {
    return SCENE_DOOR_REF[sceneId] || SCENE_DOOR_REF.default;
  }

  function areaCenter(area) {
    return {
      x: (area?.x || 50) + (area?.w || 20) / 2,
      y: (area?.y || 30) + (area?.h || 50) / 2,
    };
  }

  /** 角色站姿：身高 = 该深度门高 × 4/5 × 修正；脚对齐该深度地面 */
  function spotToArea(spot, charId, sceneId) {
    const ref = doorRef(sceneId);
    const scale = CHAR_SCALE[charId] ?? CHAR_SCALE.default;
    const sceneMult = SCENE_SCALE_MULT[sceneId] ?? 1;
    const doorTop = spot.doorTop != null ? Number(spot.doorTop) : Number(ref.doorTop);
    const doorBottom =
      spot.doorBottom != null ? Number(spot.doorBottom) : Number(ref.doorBottom);
    const doorH = Math.max(8, doorBottom - doorTop);
    const h = Math.max(10, Math.min(96, doorH * CHAR_TO_DOOR * scale * sceneMult));
    const baseW = spot.w != null ? spot.w : Math.max(12, Math.min(22, h * 0.32));
    const w = Math.max(
      10,
      Math.min(36, baseW * Math.min(1.12, scale) * Math.min(1.35, Math.sqrt(sceneMult)))
    );
    const foot = spot.floorY != null ? Number(spot.floorY) : doorBottom;
    const cx = spot.cx ?? 50;
    return {
      x: Math.max(1, Math.min(99 - w, cx - w / 2)),
      y: Math.max(1, Math.min(99 - h, foot - h)),
      w,
      h,
      cx,
    };
  }

  function resolveCharId(npc) {
    if (!npc) return "default";
    if (npc.id && CATALOG[npc.id]) return npc.id;
    const sprite = String(npc.sprite || "").replace(/\?.*$/, "");
    for (const id of Object.keys(CATALOG)) {
      const cat = CATALOG[id];
      if (cat.sprite.replace(/\?.*$/, "") === sprite) return id;
      if (npc.name && cat.name === npc.name) return id;
    }
    return "default";
  }

  /** 按场景门高生成区域；可指定水平中心 */
  function areaFor(sceneId, charId, cx) {
    const spots = listFloorSpots(sceneId);
    let spot = spots[0] || DEFAULT_FLOOR_SPOTS[0];
    if (cx != null && spots.length) {
      spot = spots.slice().sort((a, b) => Math.abs(a.cx - cx) - Math.abs(b.cx - cx))[0];
      spot = { ...spot, cx };
    }
    return spotToArea(spot, charId || "default", sceneId);
  }

  /** 旧存档：始终按当前门高重算，保留水平偏好 */
  function ensureNpcArea(npc) {
    if (!npc?.scene) {
      return npc?.area || spotToArea(DEFAULT_FLOOR_SPOTS[0], npc?.id || "default");
    }
    const charId = resolveCharId(npc);
    const cx =
      npc.area != null
        ? (Number(npc.area.x) || 50) + (Number(npc.area.w) || 18) / 2
        : null;
    return areaFor(npc.scene, charId, cx);
  }

  function listFloorSpots(sceneId) {
    return (SCENE_FLOOR_SPOTS[sceneId] || DEFAULT_FLOOR_SPOTS).slice();
  }

  function pickFloorArea(sceneId, charId, resumeNpc, usedCx = []) {
    let spots = listFloorSpots(sceneId);
    if (!spots.length) spots = DEFAULT_FLOOR_SPOTS.slice();

    // 避开续播 NPC 水平位置
    if (resumeNpc?.scene === sceneId && resumeNpc.area) {
      const rx = areaCenter(resumeNpc.area).x;
      spots = spots.slice().sort((a, b) => Math.abs(b.cx - rx) - Math.abs(a.cx - rx));
    } else {
      spots = shuffle(spots);
    }

    // 同场景已占用的站位尽量错开
    const free = spots.filter((s) =>
      usedCx.every((ux) => Math.abs(ux - s.cx) > 12)
    );
    const chosen = free[0] || spots[0];
    return spotToArea(chosen, charId, sceneId);
  }

  function excludeResumeIds(candidates, resumeNpc) {
    if (!resumeNpc) return candidates;
    return candidates.filter((c) => {
      const cat = CATALOG[c.id];
      if (!cat) return false;
      if (resumeNpc.name && cat.name === resumeNpc.name) return false;
      if (
        resumeNpc.sprite &&
        cat.sprite.replace(/\?.*$/, "") ===
          String(resumeNpc.sprite).replace(/\?.*$/, "")
      ) {
        return false;
      }
      return true;
    });
  }

  function materialize(id, scene, area, stage) {
    const cat = CATALOG[id];
    if (!cat || !scene) return null;
    return {
      id: cat.id,
      name: cat.name,
      sprite: cat.sprite,
      scene,
      area: area || spotToArea(DEFAULT_FLOOR_SPOTS[0], id, scene),
      bubble: cat.name,
      tag: cat.name,
      stage: stage || "FREE",
      role: cat.role,
      greeting: cat.greeting,
      fallback: cat.fallback,
      sceneLabel: SCENE_LABEL[scene] || scene,
    };
  }

  /**
   * @param {string} pauseId
   * @param {object} resumeNpc
   * @param {string[]} [unlockList] 当前中断点可进入的场景
   */
  function rollForPause(pauseId, resumeNpc, unlockList) {
    const pool = PAUSE_POOLS[pauseId];
    if (!pool?.candidates?.length) return [];

    const alwaysIds = new Set();
    const byId = new Map();
    excludeResumeIds(pool.candidates, resumeNpc).forEach((spec) => {
      if (!CATALOG[spec.id]) return;
      if (spec.always) alwaysIds.add(spec.id);
      if (!byId.has(spec.id)) byId.set(spec.id, []);
      resolveScenes(spec, unlockList, resumeNpc).forEach((s) => byId.get(spec.id).push(s));
    });

    const expanded = [];
    byId.forEach((scenes, id) => {
      const uniqueScenes = [...new Set(scenes)];
      if (!uniqueScenes.length) return;
      expanded.push({ id, scenes: uniqueScenes });
    });
    if (!expanded.length) return [];

    const always = expanded.filter((p) => alwaysIds.has(p.id));
    const rest = shuffle(expanded.filter((p) => !alwaysIds.has(p.id)));
    const [minC, maxC] = pool.count || [1, 1];
    const lo = Math.max(0, Math.min(minC, expanded.length));
    const hi = Math.max(lo, Math.min(maxC, expanded.length));
    let n = lo + Math.floor(Math.random() * (hi - lo + 1));
    n = Math.max(n, always.length);
    n = Math.min(n, expanded.length);
    const picks = [...always, ...rest].slice(0, n);

    const usedScenes = {};
    const usedCxByScene = {};
    const usedIds = new Set();
    const out = [];

    for (const p of picks) {
      if (usedIds.has(p.id)) continue;
      const scene = pickSpawnScene(p.scenes, usedScenes);
      if (!scene) continue;
      usedScenes[scene] = (usedScenes[scene] || 0) + 1;
      usedIds.add(p.id);
      usedCxByScene[scene] = usedCxByScene[scene] || [];
      const area = pickFloorArea(
        scene,
        p.id,
        resumeNpc,
        usedCxByScene[scene]
      );
      if (area.cx != null) usedCxByScene[scene].push(area.cx);
      const m = materialize(p.id, scene, area, pool.stage);
      if (m) out.push(m);
    }
    return out;
  }

  function getCatalogEntry(id) {
    return CATALOG[id] || null;
  }

  function formatAmbientHint(list) {
    if (!list?.length) return "";
    return `闲聊：${list
      .map((n) => `${n.sceneLabel || n.scene}·${n.name}`)
      .join("、")}。`;
  }

  window.AmbientNpcs = {
    CATALOG,
    ROOM_GROUPS,
    PAUSE_POOLS,
    SCENE_DOOR_REF,
    SCENE_SCALE_MULT,
    CHAR_TO_DOOR,
    rollForPause,
    getCatalogEntry,
    formatAmbientHint,
    SCENE_LABEL,
    pickFloorArea,
    ensureNpcArea,
    areaFor,
    resolveCharId,
    doorRef,
  };
})();
