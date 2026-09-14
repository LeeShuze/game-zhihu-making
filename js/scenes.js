/**
 * 场景图配置（数据驱动）
 *
 * hotspot: area(%) + bubble + goTo
 * variants: 同一场景多套底图（如客厅打扫前/后），热区共用
 */
window.STORY_UNLOCK_PRESETS = {
  /** 30 层住宅 + 电梯往返（楼下 / 1 层楼梯间） */
  home: [
    "downstairs",
    "floor01_outside",
    "elevator",
    "floor30_outside",
    "floor30_living",
    "dining",
    "kitchen",
    "balcony",
    "corridor",
    "sisi_room",
    "master_bedroom",
    "bathroom",
  ],
  /** 仅大楼外、1 层楼梯间、电梯、30 层门外 */
  outside: ["downstairs", "floor01_outside", "elevator", "floor30_outside"],
  /**
   * 出门拜访：可走邻层门外，但室内需剧情拜访后才解锁进门
   * visit / visit29 / visit28 / visit27 递进开放室内
   */
  visit: [
    "downstairs",
    "floor01_outside",
    "elevator",
    "floor28_outside",
    "floor29_outside",
    "floor30_outside",
    "floor30_living",
    "dining",
    "kitchen",
    "balcony",
    "corridor",
    "sisi_room",
    "master_bedroom",
    "bathroom",
  ],
  visit29: [
    "downstairs",
    "floor01_outside",
    "elevator",
    "floor28_outside",
    "floor29_outside",
    "floor29_living",
    "floor30_outside",
    "floor30_living",
    "dining",
    "kitchen",
    "balcony",
    "corridor",
    "sisi_room",
    "master_bedroom",
    "bathroom",
  ],
  visit28: [
    "downstairs",
    "floor01_outside",
    "elevator",
    "floor27_outside",
    "floor28_outside",
    "floor28_room",
    "floor29_outside",
    "floor29_living",
    "floor30_outside",
    "floor30_living",
    "dining",
    "kitchen",
    "balcony",
    "corridor",
    "sisi_room",
    "master_bedroom",
    "bathroom",
  ],
  visit27: [
    "downstairs",
    "floor01_outside",
    "elevator",
    "floor27_outside",
    "floor27_dining",
    "floor28_outside",
    "floor28_room",
    "floor29_outside",
    "floor29_living",
    "floor30_outside",
    "floor30_living",
    "dining",
    "kitchen",
    "balcony",
    "corridor",
    "sisi_room",
    "master_bedroom",
    "bathroom",
  ],
  visit10: [
    "downstairs",
    "floor01_outside",
    "elevator",
    "floor10_outside",
    "floor27_outside",
    "floor27_dining",
    "floor28_outside",
    "floor28_room",
    "floor29_outside",
    "floor29_living",
    "floor30_outside",
    "floor30_living",
    "dining",
    "kitchen",
    "balcony",
    "corridor",
    "sisi_room",
    "master_bedroom",
    "bathroom",
  ],
  visit09: [
    "downstairs",
    "floor01_outside",
    "elevator",
    "floor09_outside",
    "floor10_outside",
    "floor27_outside",
    "floor27_dining",
    "floor28_outside",
    "floor28_room",
    "floor29_outside",
    "floor29_living",
    "floor30_outside",
    "floor30_living",
    "dining",
    "kitchen",
    "balcony",
    "corridor",
    "sisi_room",
    "master_bedroom",
    "bathroom",
  ],
  /** 第七天：异世之门仅剧情进入，不放探索入口 */
  finale: [
    "downstairs",
    "floor01_outside",
    "elevator",
    "three_doors",
    "family_photo",
    "floor09_outside",
    "floor10_outside",
    "floor27_outside",
    "floor27_dining",
    "floor28_outside",
    "floor28_room",
    "floor29_outside",
    "floor29_living",
    "floor30_outside",
    "floor30_living",
    "dining",
    "kitchen",
    "balcony",
    "corridor",
    "sisi_room",
    "master_bedroom",
    "bathroom",
  ],
  /** 兼容旧名：邻层全开 */
  neighbors: [
    "downstairs",
    "floor01_outside",
    "elevator",
    "floor09_outside",
    "floor10_outside",
    "floor27_outside",
    "floor27_dining",
    "floor28_outside",
    "floor28_room",
    "floor29_outside",
    "floor29_living",
    "floor30_outside",
  ],
};

window.SCENE_GRAPH = {
  start: "downstairs",
  scenes: {
    /** 楼下：大楼外观 */
    downstairs: {
      id: "downstairs",
      image: "assets/scenes/downstairs.png",
      hotspots: [
        {
          id: "mainGate",
          area: { x: 36, y: 40, w: 28, h: 45 },
          bubble: "进楼",
          bubblePos: { x: 50, y: 70 },
          goTo: "floor01_outside",
        },
      ],
    },
    /** 1 层楼梯间 / 电梯间（异世之门仅剧情进入，无探索入口） */
    floor01_outside: {
      id: "floor01_outside",
      image: "assets/scenes/floor01_outside.png",
      hotspots: [
        {
          id: "elevatorDoor",
          area: { x: 0, y: 12, w: 24, h: 72 },
          bubble: "电梯",
          bubblePos: { x: 55, y: 48 },
          goTo: "elevator",
        },
        {
          id: "toOutside",
          area: { x: 38, y: 86, w: 24, h: 12 },
          bubble: "楼下",
          bubblePos: { x: 50, y: 40 },
          goTo: "downstairs",
        },
        {
          id: "stairsUp",
          area: { x: 84, y: 20, w: 16, h: 70 },
          bubble: "上楼",
          bubblePos: { x: 40, y: 45 },
          goTo: "floor09_outside",
        },
      ],
    },
    /** 剧情专用：三道门（上锁 / 开启后） */
    three_doors: {
      id: "three_doors",
      defaultVariant: "locked",
      variants: {
        locked: "assets/scenes/three_doors.png",
        open: "assets/scenes/three_doors_open.png",
      },
      hotspots: [],
    },
    /** 剧情专用：结局合影 */
    family_photo: {
      id: "family_photo",
      image: "assets/scenes/family_photo.png",
      hotspots: [],
    },
    elevator: {
      id: "elevator",
      image: "assets/scenes/elevator.png",
      /** 电梯内用选项卡选层，不用气泡热区 */
      floorChoices: [
        { id: "toFloor30", label: "30层", goTo: "floor30_outside" },
        { id: "toFloor29", label: "29层", goTo: "floor29_outside" },
        { id: "toFloor28", label: "28层", goTo: "floor28_outside" },
        { id: "toFloor27", label: "27层", goTo: "floor27_outside" },
        { id: "toFloor10", label: "10层", goTo: "floor10_outside" },
        { id: "toFloor9", label: "9层", goTo: "floor09_outside" },
        { id: "toFloor1", label: "1层", goTo: "floor01_outside" },
      ],
      hotspots: [],
    },
    floor09_outside: {
      id: "floor09_outside",
      image: "assets/scenes/floor09_outside.png",
      hotspots: [
        {
          id: "elevatorDoor",
          area: { x: 0, y: 12, w: 24, h: 72 },
          bubble: "电梯",
          bubblePos: { x: 55, y: 48 },
          goTo: "elevator",
        },
        {
          id: "stairsUp",
          area: { x: 84, y: 20, w: 16, h: 35 },
          bubble: "上楼",
          bubblePos: { x: 40, y: 40 },
          goTo: "floor10_outside",
        },
        {
          id: "stairsDown",
          area: { x: 84, y: 55, w: 16, h: 35 },
          bubble: "下楼",
          bubblePos: { x: 40, y: 55 },
          goTo: "floor01_outside",
        },
      ],
    },
    floor10_outside: {
      id: "floor10_outside",
      image: "assets/scenes/floor10_outside.png",
      hotspots: [
        {
          id: "elevatorDoor",
          area: { x: 0, y: 12, w: 24, h: 72 },
          bubble: "电梯",
          bubblePos: { x: 55, y: 48 },
          goTo: "elevator",
        },
        {
          id: "stairsUp",
          area: { x: 84, y: 20, w: 16, h: 35 },
          bubble: "上楼",
          bubblePos: { x: 40, y: 40 },
          goTo: "floor27_outside",
        },
        {
          id: "stairsDown",
          area: { x: 84, y: 55, w: 16, h: 35 },
          bubble: "下楼",
          bubblePos: { x: 40, y: 55 },
          goTo: "floor09_outside",
          showWhenLocked: true,
          lockedHint: "还没到下 9 层的时候。",
        },
      ],
    },
    floor27_outside: {
      id: "floor27_outside",
      image: "assets/scenes/floor27_outside.png",
      hotspots: [
        {
          id: "elevatorDoor",
          area: { x: 0, y: 12, w: 24, h: 72 },
          bubble: "电梯",
          bubblePos: { x: 55, y: 48 },
          goTo: "elevator",
        },
        {
          id: "aptDoor",
          area: { x: 56.5, y: 19, w: 13.5, h: 42 },
          bubble: "2701",
          bubblePos: { x: 50, y: 52 },
          goTo: "floor27_dining",
          showWhenLocked: true,
          lockedHint: "还没到拜访 27 层的时候，门打不开。",
        },
        {
          id: "stairsUp",
          area: { x: 84, y: 20, w: 16, h: 35 },
          bubble: "上楼",
          bubblePos: { x: 40, y: 40 },
          goTo: "floor28_outside",
        },
        {
          id: "stairsDown",
          area: { x: 84, y: 55, w: 16, h: 35 },
          bubble: "下楼",
          bubblePos: { x: 40, y: 55 },
          goTo: "floor10_outside",
          showWhenLocked: true,
          lockedHint: "还没到下 10 层的时候。",
        },
      ],
    },
    floor27_dining: {
      id: "floor27_dining",
      image: "assets/scenes/floor27_dining.png",
      hotspots: [
        {
          id: "toOutside",
          area: { x: 0, y: 12, w: 14, h: 72 },
          bubble: "门外",
          bubblePos: { x: 60, y: 45 },
          goTo: "floor27_outside",
        },
      ],
    },
    floor28_outside: {
      id: "floor28_outside",
      image: "assets/scenes/floor28_outside.png",
      hotspots: [
        {
          id: "elevatorDoor",
          area: { x: 0, y: 12, w: 24, h: 72 },
          bubble: "电梯",
          bubblePos: { x: 55, y: 48 },
          goTo: "elevator",
        },
        {
          id: "aptDoor",
          area: { x: 56.5, y: 19, w: 13.5, h: 42 },
          bubble: "2801",
          bubblePos: { x: 50, y: 52 },
          goTo: "floor28_room",
          showWhenLocked: true,
          lockedHint: "还没到拜访 28 层的时候，门打不开。",
        },
        {
          id: "stairsUp",
          area: { x: 84, y: 20, w: 16, h: 35 },
          bubble: "上楼",
          bubblePos: { x: 40, y: 40 },
          goTo: "floor29_outside",
        },
        {
          id: "stairsDown",
          area: { x: 84, y: 55, w: 16, h: 35 },
          bubble: "下楼",
          bubblePos: { x: 40, y: 55 },
          goTo: "floor27_outside",
        },
      ],
    },
    floor28_room: {
      id: "floor28_room",
      image: "assets/scenes/floor28_room.png",
      hotspots: [
        {
          id: "toOutside",
          // 右侧敞开房门
          area: { x: 72, y: 8, w: 26, h: 58 },
          bubble: "门外",
          bubblePos: { x: 40, y: 45 },
          goTo: "floor28_outside",
        },
      ],
    },
    /** 剧情专用：28 层开门 */
    floor28_door_open: {
      id: "floor28_door_open",
      image: "assets/scenes/floor28_door_open.png",
      hotspots: [],
    },
    floor29_outside: {
      id: "floor29_outside",
      image: "assets/scenes/floor29_outside.png",
      hotspots: [
        {
          id: "elevatorDoor",
          area: { x: 0, y: 12, w: 24, h: 72 },
          bubble: "电梯",
          bubblePos: { x: 55, y: 48 },
          goTo: "elevator",
        },
        {
          id: "aptDoor",
          area: { x: 56.5, y: 19, w: 13.5, h: 42 },
          bubble: "2901",
          bubblePos: { x: 50, y: 52 },
          goTo: "floor29_living",
          showWhenLocked: true,
          lockedHint: "还没到拜访 29 层的时候，门打不开。",
        },
        {
          id: "stairsUp",
          area: { x: 84, y: 20, w: 16, h: 35 },
          bubble: "上楼",
          bubblePos: { x: 40, y: 40 },
          goTo: "floor30_outside",
        },
        {
          id: "stairsDown",
          area: { x: 84, y: 55, w: 16, h: 35 },
          bubble: "下楼",
          bubblePos: { x: 40, y: 55 },
          goTo: "floor28_outside",
        },
      ],
    },
    floor29_living: {
      id: "floor29_living",
      image: "assets/scenes/floor29_living.png",
      hotspots: [
        {
          id: "toOutside",
          // 画面前景左侧为入户门视角，底部退出
          area: { x: 0, y: 70, w: 28, h: 28 },
          bubble: "门外",
          bubblePos: { x: 55, y: 40 },
          goTo: "floor29_outside",
        },
      ],
    },
    /** 剧情专用：29 层开门 */
    floor29_door_open: {
      id: "floor29_door_open",
      image: "assets/scenes/floor29_door_open.png",
      hotspots: [],
    },
    floor30_outside: {
      id: "floor30_outside",
      image: "assets/scenes/floor30_outside.png",
      hotspots: [
        {
          id: "elevatorDoor",
          // 左侧电梯门
          area: { x: 0, y: 12, w: 24, h: 72 },
          bubble: "电梯",
          bubblePos: { x: 55, y: 48 },
          goTo: "elevator",
        },
        {
          id: "aptDoor",
          area: { x: 56.5, y: 19, w: 13.5, h: 42 },
          bubble: "家",
          bubblePos: { x: 50, y: 52 },
          goTo: "floor30_living",
          showWhenLocked: true,
          lockedHint: "还不能进屋。",
        },
        {
          id: "stairsDown",
          area: { x: 84, y: 20, w: 16, h: 70 },
          bubble: "下楼",
          bubblePos: { x: 40, y: 45 },
          goTo: "floor29_outside",
        },
      ],
    },
    /** 仅剧情强制进入（家人送行等）；探索不解锁，无上楼/下楼热区 */
    floor30_stairs: {
      id: "floor30_stairs",
      image: "assets/scenes/floor_stairs.png",
      hotspots: [],
    },
    /** 剧情专用：30 层开门 */
    floor30_door_open: {
      id: "floor30_door_open",
      image: "assets/scenes/floor30_door_open.png",
      hotspots: [],
    },
    floor30_living: {
      id: "floor30_living",
      defaultVariant: "dirty",
      variants: {
        dirty: "assets/scenes/floor30_living_dirty.png",
        clean: "assets/scenes/floor30_living_clean.png",
      },
      hotspots: [
        {
          id: "toDining",
          // 对准左侧拱门通道（避开前景柜）
          area: { x: 8, y: 24, w: 20, h: 54 },
          bubble: "餐厅",
          bubblePos: { x: 50, y: 48 },
          goTo: "dining",
        },
        {
          id: "toCorridor",
          area: { x: 82, y: 18, w: 16, h: 58 },
          bubble: "走廊",
          bubblePos: { x: 45, y: 48 },
          goTo: "corridor",
        },
        {
          id: "toBalcony",
          // 客厅前方落地窗/阳台门
          area: { x: 46, y: 12, w: 26, h: 42 },
          bubble: "阳台",
          bubblePos: { x: 50, y: 48 },
          goTo: "balcony",
        },
        {
          id: "toOutside",
          area: { x: 38, y: 86, w: 24, h: 12 },
          bubble: "门外",
          bubblePos: { x: 50, y: 40 },
          goTo: "floor30_outside",
        },
      ],
    },
    dining: {
      id: "dining",
      image: "assets/scenes/dining.png",
      hotspots: [
        {
          id: "toKitchen",
          // 右前方厨房门洞（上移，少占地面）
          area: { x: 78, y: 10, w: 20, h: 55 },
          bubble: "厨房",
          bubblePos: { x: 48, y: 48 },
          goTo: "kitchen",
        },
        {
          id: "toLiving",
          area: { x: 0, y: 18, w: 14, h: 65 },
          bubble: "客厅",
          bubblePos: { x: 60, y: 48 },
          goTo: "floor30_living",
        },
      ],
    },
    balcony: {
      id: "balcony",
      image: "assets/scenes/balcony.png",
      hotspots: [
        {
          id: "toLiving",
          // 右侧落地窗回客厅
          area: { x: 48, y: 8, w: 48, h: 78 },
          bubble: "客厅",
          bubblePos: { x: 45, y: 48 },
          goTo: "floor30_living",
        },
      ],
    },
    kitchen: {
      id: "kitchen",
      image: "assets/scenes/kitchen.png",
      hotspots: [
        {
          id: "toDining",
          // 右侧通往餐厅的门（上移）
          area: { x: 82, y: 8, w: 17, h: 58 },
          bubble: "餐厅",
          bubblePos: { x: 45, y: 48 },
          goTo: "dining",
        },
      ],
    },
    corridor: {
      id: "corridor",
      image: "assets/scenes/corridor.png",
      hotspots: [
        {
          id: "toSisiRoom",
          area: { x: 2, y: 12, w: 28, h: 78 },
          bubble: "思思的公主房",
          bubblePos: { x: 55, y: 45 },
          goTo: "sisi_room",
        },
        {
          id: "toBathroom",
          // 走廊尽头浴室门洞
          area: { x: 43, y: 17, w: 16, h: 58 },
          bubble: "浴室",
          bubblePos: { x: 50, y: 45 },
          goTo: "bathroom",
        },
        {
          id: "toMasterBedroom",
          area: { x: 70, y: 12, w: 28, h: 78 },
          bubble: "主卧",
          bubblePos: { x: 45, y: 45 },
          goTo: "master_bedroom",
        },
        {
          id: "toLiving",
          area: { x: 38, y: 86, w: 24, h: 12 },
          bubble: "客厅",
          bubblePos: { x: 50, y: 40 },
          goTo: "floor30_living",
        },
      ],
    },
    sisi_room: {
      id: "sisi_room",
      image: "assets/scenes/sisi_room.png",
      hotspots: [
        {
          id: "toCorridor",
          // 右侧敞开房门
          area: { x: 82, y: 0, w: 17, h: 72 },
          bubble: "走廊",
          bubblePos: { x: 28, y: 42 },
          goTo: "corridor",
        },
      ],
    },
    master_bedroom: {
      id: "master_bedroom",
      image: "assets/scenes/master_bedroom.png",
      hotspots: [
        {
          id: "toCorridor",
          // 右侧敞开房门（避开立柜前站位）
          area: { x: 85, y: 1, w: 14, h: 86 },
          bubble: "走廊",
          bubblePos: { x: 28, y: 40 },
          goTo: "corridor",
        },
      ],
    },
    bathroom: {
      id: "bathroom",
      image: "assets/scenes/bathroom.png",
      hotspots: [
        {
          id: "toCorridor",
          // 左侧返回走廊的门
          area: { x: 0, y: 12, w: 16, h: 72 },
          bubble: "走廊",
          bubblePos: { x: 55, y: 45 },
          goTo: "corridor",
        },
      ],
    },
  },
};
