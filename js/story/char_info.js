/**
 * 人物信息：随剧情里程碑动态切换（列表大头照 → 详情档案）
 */
(() => {
  const SPEAKER_TO_ID = {
    宁念: "ningnian",
    思思: "sisi",
    断头: "boss",
    "？？？": "boss",
    肠大爷: "yeye",
    爷爷: "yeye",
    刘爱国: "yeye",
    黑老太: "nainai",
    奶奶: "nainai",
    李翠兰: "nainai",
    红姐: "hongjie",
    俊哥: "junge",
    黄毛: "huangmao",
    学生妹: "huangmao",
    双生姐姐: "twin_sister",
    双生弟弟: "twin_brother",
    "28层女孩": "girl28",
    "27层母亲": "mom27",
    "27层男孩": "boy27",
    苏小茉: "suxiaomo",
    方远: "fangyuan",
    狗头: "doghead",
  };

  const DOSSIERS = {
    ningnian: {
      id: "ningnian",
      name: "宁念",
      portrait: "assets/chars/ningnian_front.png",
      profile: {
        gender: "女",
        age: "二十出头",
        personality: "大胆、直球、高度近视带来的乐天滤镜",
        relation: "玩家本人",
      },
      stages: [
        {
          at: null,
          title: "入局玩家",
          text: "孤儿，敢把诡异当家人。",
          experience: "刚被拉进「幸福之家」副本。别人看见恐怖，她往往看见「亲戚」。",
        },
        {
          at: "meet_sisi",
          title: "新晋妈妈",
          text: "开始在 30 层安家。",
          experience: "住进 30 层后认下思思，收拾血衣、应对扑抱——惊悚值不升反降。",
        },
        {
          at: "night1",
          title: "家庭支柱（自封）",
          text: "第一夜熬过去了。",
          experience: "与思思同床、与断头周旋，她觉得这就是过日子；弹幕觉得这是找死。",
        },
        {
          at: "grandparents",
          title: "儿媳上线",
          text: "婆家成员到齐。",
          experience: "面对肠老头与黑老太，仍按「一家人」逻辑相处，偶尔还要劝架。",
        },
        {
          at: "before_neighbors",
          title: "拜访执行者",
          text: "带着馈赠出门串门。",
          experience: "领取家人道具后下楼拜访，目标是活着收集卡片、摸清规则。",
        },
      ],
    },
    sisi: {
      id: "sisi",
      name: "秦思思",
      portrait: "assets/chars/sisi_front.png",
      profile: {
        gender: "女",
        age: "外表约十岁上下",
        personality: "粘人、阴森、情绪来得快",
        relation: "30 层「女儿」",
      },
      stages: [
        {
          at: null,
          title: "血衣萝莉",
          text: "白裙易染血。",
          experience: "刚见面就扑上来，像拥抱也像索命。身份与来历尚未完全弄清。",
          profile: { personality: "警惕、阴冷，偶有依赖的苗头" },
        },
        {
          at: "meet_sisi",
          title: "叫你妈妈",
          text: "已被攻略成功。",
          experience: "认下宁念为妈妈。红裙是战斗/失控形态，白裙时更像孩子。",
          profile: { personality: "粘人、阴森，认家后会撒娇也会吓你" },
        },
        {
          at: "boss_enter",
          title: "护着新妈妈",
          text: "夹在爸爸与妈妈中间。",
          experience: "断头归来后，她既护着新妈妈，又在意爸爸的态度，语气又软又硬。",
        },
        {
          at: "night1",
          title: "同床小棉袄",
          text: "夜里也要贴着你。",
          experience: "第一夜不许把妈妈让给爸爸，睡觉也要挨着宁念。",
        },
        {
          at: "before_visit",
          title: "想撑场面",
          text: "出门前要红裙。",
          experience: "拜访将至，吵着变红裙「有气场」，其实舍不得妈妈离开 30 层。",
        },
      ],
    },
    boss: {
      id: "boss",
      name: "断头",
      portrait: "assets/chars/boss_front.png",
      profile: {
        gender: "男",
        age: "外表青壮年",
        personality: "高冷护短，在意身高",
        relation: "30 层家主",
      },
      stages: [
        {
          at: null,
          title: "？？？",
          displayName: "？？？",
          text: "身影高大，说话少。",
          experience: "只见轮廓与压迫感，尚未确认身份。",
          profile: {
            gender: "？？？",
            age: "？？？",
            personality: "沉默、危险",
            relation: "未知",
          },
        },
        {
          at: "boss_enter",
          title: "30 层家主",
          text: "断头诡异，暂无名字。",
          experience: "以断头形象现身。护着思思，对宁念兴趣复杂，却很少长话。",
          profile: {
            gender: "男",
            age: "外表青壮年（诡异）",
            personality: "高冷、护短、在意一米八六",
            relation: "「丈夫」候选人 / 家主",
          },
        },
        {
          at: "night1",
          title: "纯情大 Boss",
          text: "会脸红，会举哑铃。",
          experience: "会把脑袋和思思当「哑铃」举。机制限制他不能说破通关情报，只能模糊提醒。",
        },
        {
          at: "before_visit",
          title: "馈赠者",
          text: "出门前塞给你沉重的关心。",
          experience: "拜访前把「爱的屠刀」等物交给宁念，关心方式很不人类。",
        },
        {
          at: "before_neighbors",
          title: "留守的丈夫",
          text: "你出门时他守家。",
          experience: "多半留守 30 层，惦记宁念安危，对红姐一行怀有敌意却说不破。",
        },
      ],
    },
    yeye: {
      id: "yeye",
      name: "刘爱国（爷爷）",
      portrait: "assets/chars/yeye_front.png",
      profile: {
        gender: "男",
        age: "老年（诡异）",
        personality: "慈祥古怪、爱做饭",
        relation: "公公 / 肠老头",
      },
      stages: [
        {
          at: null,
          title: "肠老头",
          text: "肠子外露却把你当儿媳。",
          experience: "从「老家」归来。肠子外露，仍热衷做饭与家庭称呼。",
        },
        {
          at: "before_visit",
          title: "会送礼的公公",
          text: "也可能塞古怪道具。",
          experience: "拜访前会准备「礼物」。思思常嫌弃他的厨艺。",
        },
      ],
    },
    nainai: {
      id: "nainai",
      name: "李翠兰（奶奶）",
      portrait: "assets/chars/nainai_front.png",
      profile: {
        gender: "女",
        age: "老年（诡异）",
        personality: "护短、嘴凶，吃软也吃面膜",
        relation: "婆婆 / 黑老太",
      },
      stages: [
        {
          at: null,
          title: "黑老太",
          text: "焦黑皮肤，护短。",
          experience: "与刘爱国一同归来。对宁念又审又护，可用面膜之类哄住。",
        },
        {
          at: "before_visit",
          title: "出门前的叮嘱",
          text: "嘴上凶，手里会塞东西。",
          experience: "拜访将至时，嘴上不饶人，实际会为宁念准备保命用物。",
        },
      ],
    },
    hongjie: {
      id: "hongjie",
      name: "红姐",
      portrait: "assets/chars/hongjie_front.png",
      profile: {
        gender: "女",
        age: "约三十岁上下",
        personality: "热心、沉稳、情报多",
        relation: "老玩家",
      },
      stages: [
        {
          at: null,
          title: "热心老玩家",
          text: "选房时提醒过你。",
          experience: "入局时提醒规则与风险，私聊里也会塞情报，看起来可靠。",
        },
        {
          at: "night1",
          title: "远程军师",
          text: "催你攻略家人。",
          experience: "持续私聊宁念，催促攻略「家人」，对 30 层情况「很关心」。",
        },
        {
          at: "before_neighbors",
          title: "拜访倡议者",
          text: "鼓动互帮互助。",
          experience: "推动全楼拜访与互助。真实动机是否纯良，此时仍未揭穿。",
          profile: { personality: "热心可靠的表象下，意图未明" },
        },
      ],
    },
    junge: {
      id: "junge",
      name: "俊哥",
      portrait: "assets/chars/junge_front.png",
      profile: {
        gender: "男",
        age: "约三十岁上下",
        personality: "冲、护短、嫌麻烦",
        relation: "红姐同伴",
      },
      stages: [
        {
          at: null,
          title: "红姐身旁",
          text: "语气冲，护着红姐。",
          experience: "选房阶段跟在红姐身边，嫌她对新人太善良。",
        },
        {
          at: "before_neighbors",
          title: "同队老玩家",
          text: "拜访期可能同行。",
          experience: "拜访阶段多半与红姐一起行动，对宁念话不多。",
        },
      ],
    },
    huangmao: {
      id: "huangmao",
      name: "黄毛",
      portrait: "assets/chars/huangmao_front.png",
      profile: {
        gender: "男",
        age: "青年",
        personality: "逞强、嘴碎、怂",
        relation: "其他玩家",
      },
      stages: [
        {
          at: null,
          title: "爱出风头的玩家",
          text: "选房时吵吵嚷嚷。",
          experience: "大楼选房时出尽风头。楼层越高越危险——他未必能活很久。",
        },
      ],
    },
    twin_sister: {
      id: "twin_sister",
      name: "双生姐姐",
      portrait: "assets/chars/twin_sister_front.png",
      profile: {
        gender: "女",
        age: "外表少女",
        personality: "热情过界、甜腻",
        relation: "29 层诡异",
      },
      stages: [
        {
          at: null,
          title: "29 层 · 姐姐",
          text: "卡片好拿，人难甩开。",
          experience: "拜访 29 层时遇上。热情得过分，弟弟多半跟着她。",
        },
      ],
    },
    twin_brother: {
      id: "twin_brother",
      name: "双生弟弟",
      portrait: "assets/chars/twin_brother_front.png",
      profile: {
        gender: "男",
        age: "外表少年",
        personality: "沉默、附和姐姐",
        relation: "29 层诡异",
      },
      stages: [
        {
          at: null,
          title: "29 层 · 弟弟",
          text: "话少。",
          experience: "几乎不主动开口，行动与情绪多跟随姐姐。",
        },
      ],
    },
    girl28: {
      id: "girl28",
      name: "28 层女孩",
      portrait: "assets/chars/girl28_front.png",
      profile: {
        gender: "女",
        age: "年轻女性",
        personality: "客气、寂寞、情绪不稳",
        relation: "28 层诡异",
      },
      stages: [
        {
          at: null,
          title: "Cos 诡异",
          text: "夸张妆容与服装。",
          experience: "吞药自杀而来。对宁念客气，渴望被看见，但不强行推进冲突。",
        },
      ],
    },
    mom27: {
      id: "mom27",
      name: "27 层母亲",
      portrait: "assets/chars/mom27_front.png",
      profile: {
        gender: "女",
        age: "外表白领年龄",
        personality: "表面贤惠、气质不伦不类",
        relation: "27 层诡异",
      },
      stages: [
        {
          at: null,
          title: "围裙白领",
          text: "牵着孩子。",
          experience: "制服、妆容与围裙混搭。以「母亲」姿态待客，手中牵着男孩。",
        },
      ],
    },
    boy27: {
      id: "boy27",
      name: "27 层男孩",
      portrait: "assets/chars/boy27_front.png",
      profile: {
        gender: "男",
        age: "儿童外表",
        personality: "怯怯、依赖",
        relation: "27 层诡异",
      },
      stages: [
        {
          at: null,
          title: "被牵着的孩子",
          text: "身体有被压碎感。",
          experience: "很少说话，紧跟着「母亲」。靠近时能感到不对劲的伤残感。",
        },
      ],
    },
    suxiaomo: {
      id: "suxiaomo",
      name: "苏小茉",
      portrait: "assets/chars/suxiaomo_front.png",
      profile: {
        gender: "女",
        age: "青年",
        personality: "谨慎求生",
        relation: "存活玩家",
      },
      stages: [
        {
          at: null,
          title: "中层相遇",
          text: "仍在存活的玩家之一。",
          experience: "在中层或相关事件中与宁念产生交集，后续可能影响去留。",
        },
      ],
    },
    fangyuan: {
      id: "fangyuan",
      name: "方远",
      portrait: "assets/chars/fangyuan_front.png",
      profile: {
        gender: "男",
        age: "青年",
        personality: "寻找同伴、立场摇摆",
        relation: "存活玩家",
      },
      stages: [
        {
          at: null,
          title: "寻找活人的人",
          text: "在较低楼层活动。",
          experience: "寻找其他存活者。态度与立场会随天数和局势变化。",
        },
      ],
    },
    doghead: {
      id: "doghead",
      name: "狗头",
      portrait: "assets/chars/doghead10_front.png",
      profile: {
        gender: "？？？",
        age: "不可测",
        personality: "压迫、蛮横",
        relation: "10 层诡异",
      },
      stages: [
        {
          at: null,
          title: "10 层压迫",
          text: "体型巨大的狗头诡异。",
          experience: "走廊遭遇即是高压。体型与恶意都远超普通邻居。",
        },
      ],
    },
  };

  function milestonesFromProgress(title) {
    const t = String(title || "");
    const out = [];
    if (/§\s*1\b/.test(t) || /入局/.test(t)) out.push("intro");
    if (/§\s*2\b/.test(t) || /选房|敲门/.test(t)) out.push("before_knock");
    if (/§\s*3\b/.test(t) || /见思思/.test(t)) out.push("meet_sisi");
    if (/§\s*4\b/.test(t) || /断头登场/.test(t)) out.push("boss_enter");
    if (/§\s*7\b/.test(t) || /第一夜/.test(t)) out.push("night1");
    if (/§\s*12\b/.test(t) || /出门前/.test(t)) out.push("before_visit");
    if (/§\s*13\b/.test(t) || /拜访|29\s*层/.test(t)) {
      out.push("before_neighbors");
      if (/29/.test(t)) out.push("visit29");
    }
    if (/28/.test(t) && /层|拜访/.test(t)) out.push("visit28");
    if (/27/.test(t) && /层|拜访/.test(t)) out.push("visit27");
    if (/中层|开解/.test(t)) out.push("mid_floors");
    if (/九层|陷阱/.test(t)) out.push("floor9");
    if (/结局|君安/.test(t)) out.push("ending");
    return out;
  }

  function milestonesFromPause(id) {
    const map = {
      before_knock: ["before_knock"],
      after_night1: ["night1", "meet_sisi", "boss_enter"],
      before_departure: ["before_visit", "grandparents", "night1"],
      before_neighbors: ["before_neighbors", "before_visit"],
      after_floor29: ["visit29", "before_neighbors"],
      after_floor28: ["visit28", "visit29"],
    };
    return map[id] || (id ? [id] : []);
  }

  function createState() {
    return { known: [], milestones: [] };
  }

  function ensureSets(state) {
    return {
      known: new Set(state?.known || []),
      milestones: new Set(state?.milestones || []),
    };
  }

  function toSave(sets) {
    return {
      known: [...sets.known],
      milestones: [...sets.milestones],
    };
  }

  function noteSpeaker(sets, speaker) {
    const id = SPEAKER_TO_ID[speaker];
    if (!id || !DOSSIERS[id]) return false;
    sets.known.add(id);
    if (id === "yeye" || id === "nainai") sets.milestones.add("grandparents");
    if (id === "sisi") sets.milestones.add("meet_sisi");
    if (id === "boss" && speaker === "断头") sets.milestones.add("boss_enter");
    return true;
  }

  function noteProgress(sets, title) {
    milestonesFromProgress(title).forEach((m) => sets.milestones.add(m));
    if (sets.milestones.has("meet_sisi")) sets.known.add("sisi");
    if (sets.milestones.has("boss_enter")) sets.known.add("boss");
    if (sets.milestones.has("intro")) sets.known.add("ningnian");
    if (sets.milestones.has("before_knock")) {
      sets.known.add("hongjie");
      sets.known.add("junge");
      sets.known.add("huangmao");
    }
    if (sets.milestones.has("grandparents")) {
      sets.known.add("yeye");
      sets.known.add("nainai");
    }
    if (sets.milestones.has("visit29")) {
      sets.known.add("twin_sister");
      sets.known.add("twin_brother");
    }
    if (sets.milestones.has("visit28")) sets.known.add("girl28");
    if (sets.milestones.has("visit27")) {
      sets.known.add("mom27");
      sets.known.add("boy27");
    }
  }

  function notePause(sets, pauseId) {
    milestonesFromPause(pauseId).forEach((m) => sets.milestones.add(m));
    if (pauseId === "after_night1" || pauseId === "before_departure") {
      sets.known.add("sisi");
      sets.known.add("boss");
      sets.known.add("ningnian");
    }
    if (pauseId === "before_departure" || pauseId === "before_neighbors") {
      sets.known.add("yeye");
      sets.known.add("nainai");
    }
    if (pauseId === "after_floor29") {
      sets.known.add("twin_sister");
      sets.known.add("twin_brother");
    }
    if (pauseId === "after_floor28") sets.known.add("girl28");
  }

  function applyBeat(sets, beat) {
    if (!beat) return;
    if (beat.progress) noteProgress(sets, beat.progress);
    if (beat.type === "pause" && beat.id) notePause(sets, beat.id);
    if (beat.speaker) noteSpeaker(sets, beat.speaker);
    if (Array.isArray(beat.slots)) {
      beat.slots.forEach((s) => {
        if (s?.name) noteSpeaker(sets, s.name);
      });
    }
    if (beat.type === "charInfo" && beat.id) {
      sets.known.add(beat.id);
      if (beat.milestone) sets.milestones.add(beat.milestone);
    }
  }

  function rebuildFromBeats(beats, upToIndex) {
    const sets = ensureSets(createState());
    sets.known.add("ningnian");
    const end = Math.min(upToIndex, (beats?.length || 1) - 1);
    for (let i = 0; i <= end; i += 1) applyBeat(sets, beats[i]);
    return sets;
  }

  function resolveEntry(id, sets) {
    const d = DOSSIERS[id];
    if (!d || !sets.known.has(id)) return null;
    let stage = d.stages[0];
    for (const s of d.stages) {
      if (!s.at || sets.milestones.has(s.at)) stage = s;
    }
    const profile = { ...(d.profile || {}), ...(stage.profile || {}) };
    return {
      id: d.id,
      name: stage.displayName || d.name,
      portrait: stage.portrait || d.portrait,
      title: stage.title,
      text: stage.text,
      experience: stage.experience || stage.text,
      gender: profile.gender || "？？？",
      age: profile.age || "？？？",
      personality: profile.personality || "尚不明确",
      relation: profile.relation || "",
      stageAt: stage.at,
    };
  }

  function listEntries(sets, { includeUnknown = true } = {}) {
    const order = [
      "ningnian",
      "sisi",
      "boss",
      "yeye",
      "nainai",
      "hongjie",
      "junge",
      "huangmao",
      "twin_sister",
      "twin_brother",
      "girl28",
      "mom27",
      "boy27",
      "suxiaomo",
      "fangyuan",
      "doghead",
    ];
    return order
      .map((id) => {
        if (sets.known.has(id)) {
          const e = resolveEntry(id, sets);
          return e ? { ...e, known: true } : null;
        }
        if (!includeUnknown || !DOSSIERS[id]) return null;
        return {
          id,
          name: "？？？",
          title: "尚未出现",
          portrait: null,
          known: false,
        };
      })
      .filter(Boolean);
  }

  window.CharInfo = {
    DOSSIERS,
    SPEAKER_TO_ID,
    createState,
    ensureSets,
    toSave,
    applyBeat,
    rebuildFromBeats,
    listEntries,
    resolveEntry,
    noteSpeaker,
    noteProgress,
    notePause,
  };
})();
