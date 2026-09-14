/**
 * 全文第 7～12 节（家中弧）
 *
 * 暂停点（不必只在日终）：
 *  - after_night1：第一夜睡着之后 → 第二天醒来之前
 *  - before_departure：红姐告知拜访之后 → 出门馈赠之前
 *  - before_neighbors：送到楼梯口之后 → 29 层敲门拜访
 */
window.STORY_CH07_12 = {
  id: "ch07_12",
  chars: {
    ningnian: "assets/chars/ningnian_front.png",
    boss: "assets/chars/boss_front.png",
    sisi: "assets/chars/sisi_front.png",
    sisiBlood: "assets/chars/sisi_blood_front.png",
    yeye: "assets/chars/yeye_enter.png",
    yeyePatched: "assets/chars/yeye_patched_front.png",
    nainai: "assets/chars/nainai_front.png",
  },
  beats: [
    // —— 7 安抚思思 / 次日 ——
    { type: "scene", scene: "master_bedroom" },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "他们是谁？他们说这些是他们不对。\n如果妈妈以后遇到他们，无论怎样，一定会帮思思骂回去、打回去。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "可是思思，你不能这样说你自己，妈妈也会伤心的。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "后来我絮絮叨叨着，不知道怎么就睡着了。\n睡着后，思思紧贴着我，裙子红了又白，白了又红——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "妈妈会伤心的……不能让妈妈伤心。",
    },
    { type: "danmaku", text: "第一次看到血衣萝莉的鬼气波动这么大！最后裙子居然一直是白色了！" },
    { type: "danmaku", text: "我靠，这个新玩家改变了血衣萝莉的属性？" },
    { type: "horror", set: 1 },
    {
      type: "narration",
      text: "第一夜，就这样沉入黑暗。\n天亮前，你可以在家里走动。",
      clearSprites: true,
    },
    {
      type: "pause",
      id: "after_night1",
      unlock: "home",
      exploreScene: "master_bedroom",
      hint: "自由探索中。在主卧点击思思可继续剧情（进入第二天）。",
      resumeNpc: {
        scene: "master_bedroom",
        name: "思思",
        sprite: "assets/chars/sisi_front.png",
        area: { x: 58, y: 18, w: 30, h: 72 },
        bubble: "思思",
        prompt: "是否继续剧情？",
      },
    },
    { type: "system", text: "初始玩家：30 人；现存活：15 人。" },
    {
      type: "narration",
      text: "第二天，我被机械音吵醒。\n群里说昨晚又死了五人——三人死于诡异，两人惊悚值冲到 100。",
      clearSprites: true,
    },
    { type: "horror", add: 3 },
    {
      type: "system",
      text: "【红姐私聊】宁念，你还好吗？前三天一定要抓紧攻略自己的「家人」。\n怪我没提前说选房规则，害你住进 30 层——就当补偿啦。",
    },
    {
      type: "system",
      text: "【俊哥】干吗告诉这些新玩家？帮助他们对我们又没好处。\n【红姐】相识一场不容易，别这样计较。",
    },
    {
      type: "narration",
      text: "这两个老玩家，有点意思。\n我把脸贴到屏幕上回复：【我挺好的，多谢关心。】",
    },
    { type: "scene", scene: "floor30_living" },
    {
      type: "narration",
      text: "断头一手拎着自己的脑袋，一手拎着穿白裙的思思，正在举「哑铃」。\n看到我抱着手机，他微微蹙眉——",
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_head.png",
      side: "right",
      text: "不要过于相……",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_phone.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_head.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "话没说完，他忽然捂着心口倒下。\n思思急忙扶住他，我也冲过去用身体接住——\n副本机制禁止 NPC 向玩家透露具体通关信息。",
      clearSprites: true,
    },
    { type: "horror", set: 12 },

    // —— 8 爷爷奶奶回家 ——
    {
      type: "narration",
      text: "门外响起「咚咚咚」的脚步声，每一步都像踩在神经上。",
    },
    { type: "horror", set: 26 },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "妈妈，是爷爷奶奶从老家回来了，别怕。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "别怕。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "真是个纯情大 Boss。\n反正我也看不清——看不清的一律视为正常人。\n反而很期待新 NPC 上线。",
      clearSprites: true,
    },
    { type: "danmaku", text: "莫名有点期待肠大爷和黑老太，我不信没人治得了这个宁念。" },
    { type: "danmaku", text: "如果新玩家能首通，也给后面的我们提供宝贵经验啊。" },
    {
      type: "narration",
      text: "「啪嗒」一声，门开了。\n迎面走进两位驼背的诡异，背上像是巨大的蛇皮袋。",
    },
    { type: "horror", set: 38 },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_enter.png",
      side: "left",
      text: "你个黑心肝的毒妇！你怎么敢伤害我儿子？我要你偿命！",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_enter.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/yeye_enter.png", name: "肠大爷" },
      ],
    },
    {
      type: "narration",
      text: "厉鬼索命，黑气萦绕。\n凑近才看清：老太太瘦得只剩骨架，头发一根不剩，皮肤焦黑如木炭。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_soothe.png",
      side: "right",
      text: "妈，您的皮肤怎么干燥成这样？\n昨晚我自己用黄瓜做了一套面膜，要不要拿来给您试试？",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_enter.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/ningnian_soothe.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_mask.png",
      side: "left",
      text: "啊，也、也行……",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_mask.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/ningnian_soothe.png", name: "宁念" },
      ],
    },
    { type: "horror", set: 18 },

    // —— 9 肠大爷与「毛衣」 ——
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_enter.png",
      side: "right",
      text: "死老太婆，你不是说，要好好吓唬吓唬新来的儿媳吗？",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/yeye_enter.png", name: "肠大爷" },
      ],
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "原来你还有旧媳妇。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "男人沉下脸，黑气翻涌，顺手把黑老太的骷髅头拧了下来。\n真是哄堂大孝啊！",
      clearSprites: true,
    },
    { type: "horror", add: 8 },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "没有。她们没进门，就被思思杀了。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_front.png",
      side: "left",
      text: "死老头子，就你话多，滚去做饭。",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/yeye_enter.png", name: "肠大爷" },
      ],
    },
    { type: "scene", scene: "kitchen" },
    {
      type: "narration",
      text: "老头拖着蛇皮袋，还有肚子上的肠子朝厨房走去。\n他走过的地方，地板又变成血红色。",
      clearSprites: true,
    },
    { type: "horror", set: 30 },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "奶奶，对不起，我认为爷爷做的饭实在难吃，还是别……",
    },
    {
      type: "narration",
      text: "话音未落，老头从肚皮甩出一截肠子，把思思飞速卷进厨房。\n「乖孙女，还是来陪爷爷做饭吧。」",
    },
    {
      type: "narration",
      text: "我看着满地的「毛线」，回房间找针线：\n「哎，老爸这毛衣脱线了怎么也不补补呢？」",
    },
    { type: "scene", scene: "dining" },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "老爸，我帮您补补衣服吧？看您这拖着毛线满地跑，也挺不方便的。\n而且毛线还褪色，我昨天刚拖的地啊！",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/yeye_enter.png", name: "肠大爷" },
      ],
    },
    { type: "danmaku", text: "闹半天，敢情宁念不是胆子大，是眼瞎？" },
    { type: "danmaku", text: "我愿称她为宁神，开辟了一条意想不到的通关思路。" },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_sew.png",
      side: "left",
      text: "这毛线怎么还是湿的？是不是刚刚洗菜掉进水池了？",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_sew.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/yeye_enter.png", name: "肠大爷" },
      ],
    },
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_enter.png",
      side: "right",
      text: "啊，应、应该吧。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_sew.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/yeye_enter.png", name: "肠大爷" },
      ],
    },
    {
      type: "narration",
      text: "缝好后，大家才尴尬地坐到桌前。\n见大家不动，我自来熟夹了一筷子「鸡爪」。",
    },
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_patched_front.png",
      side: "right",
      text: "乖儿媳，这可是你爸今天从楼下带上来的新鲜食物，都是昨晚刚死的。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
      ],
    },
    { type: "horror", set: 42 },
    {
      type: "narration",
      text: "楼下？楼下除了死去的玩家还能有什么？\n我立刻丢下筷子，捂着肚子干呕，朝断头身上靠去——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "呕！不行，我不能吃荤腥。大抵是昨晚一夜风流，我怀了。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "你、你胡说，我们明明都没有……",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "没事，如果你愿意，我们现在睡也不是不可以。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    { type: "danmaku", text: "宁念，女流氓！" },
    { type: "danmaku", text: "一个外表邪肆内心纯情，一个外表柔弱内心狂野——我是你们的 CP 粉！" },
    { type: "horror", set: 15 },

    // —— 10 卧室直球 ——
    { type: "scene", scene: "master_bedroom" },
    {
      type: "narration",
      text: "最终我还是没能「睡到」他。\n一进房间，男人强忍着脸红，认真打直球——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "宁念，很抱歉你对我的爱意。虽然时间很短，但我对你也的确有不一样的感觉。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "只是，思思是我的孩子。即使这是游戏，我也希望取得她的赞同再生二胎——\n这是我身为父亲的责任。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "我凝视他脖子上狰狞的相接处——那不是一道疤，是无数道。\n像被钝刀砍了许多次。我扯开领带，难以克制地吻了上去。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "别，丑。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "不，一点也不丑。……疼吗？",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "疼过了，现在不疼了。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    { type: "horror", set: 6 },

    // —— 11 假孕三日 ——
    {
      type: "narration",
      text: "我假孕骗过了肠大爷和黑老太。\n这两天饭菜都是我下厨，用的是冰箱里断头买的菜，没动蛇皮袋里的「食材」。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "为了以假乱真，第二晚起我和断头睡到了一起。\n半夜，被窝里又钻出一张委屈的小脸——",
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "妈妈，你不爱思思了！爸爸有什么香的，思思才香！",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "思思白裙将红，男人脖上的疤在变大——一场恶战在所难免。\n我从床上跳起来大喊：",
      clearSprites: true,
    },
    { type: "horror", set: 20 },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "住手！你们不要再打了啦！\n我跟你们两个一起睡就是了啦！",
    },
    {
      type: "narration",
      text: "头三天，安全度过。\n系统播报：现存活玩家 12 人。",
      clearSprites: true,
    },
    { type: "horror", set: 4 },
    { type: "system", text: "初始玩家：30 人；现存活：12 人。" },
    {
      type: "system",
      text: "【红姐私聊】明天开始就要拜访邻居了。听说拜访完 30 层全部诡异，才能解锁全部楼层。\n你在最难的 30 层，一定要帮大家……可惜明神死在第六天，拜访断头大 Boss 时被杀，我们也不知道第七天会发生什么。",
    },
    {
      type: "narration",
      text: "我伸了个懒腰，淡定回复：【多谢，我当然愿意互帮互助啦。】\n既然不知道第七天，那就先完成接下来三天的任务吧——\n出门拜访前，还可以再在家里准备一下。",
    },
    {
      type: "pause",
      id: "before_departure",
      unlock: "home",
      exploreScene: "floor30_living",
      hint: "自由探索中。在客厅点击断头可继续剧情（领取家人馈赠）。",
      resumeNpc: {
        scene: "floor30_living",
        name: "断头",
        sprite: "assets/chars/boss_front.png",
        area: { x: 62, y: 14, w: 28, h: 74 },
        bubble: "断头",
        prompt: "是否继续剧情？",
      },
    },

    // —— 12 出门前的馈赠 ——
    { type: "scene", scene: "floor30_living" },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "快惹我，我要变成红裙子。白裙子没有气场，等会吓唬不住那些东西。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "你只需要负责开心就行。有你爹在，谁敢动你妈？",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_patched_front.png",
      side: "left",
      text: "是啊，实在不行我出绝招，把肠子重新扯出来，去他们家门口讹他们。",
      slots: [
        { side: "left", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
        { side: "right", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
      ],
    },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_front.png",
      side: "right",
      text: "你们没读《幸福之家居民管理条例》吗？\n原住民这三天不能下楼跟着儿媳，只能靠她自己。",
      slots: [
        { side: "left", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
        { side: "right", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
      ],
    },
    {
      type: "narration",
      text: "三个诡异瞬间偃旗息鼓。\n断头忽然拔下脑袋，从脖颈伤疤里掏出一把锈迹斑斑、冒着黑气的大菜刀——\n递到我面前。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_head.png",
      side: "right",
      text: "念念，拿着它，没人敢对你动手。\n它能断我的头，定然也能断楼下所有诡异的头。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_head.png", name: "断头" },
      ],
    },
    { type: "system", text: "恭喜玩家，获得 SSSSS 级道具「爱的屠刀」。" },
    { type: "danmaku", text: "卧槽！杀死断头大 Boss 的菜刀居然是顶级道具！" },
    { type: "danmaku", text: "S 级副本里居然有 5S 级道具，还被一个新人获得了。" },
    {
      type: "narration",
      text: "思思冲进衣柜，捧出最整洁的白裙——惧怕之下，裙子瞬间血红，\n红裙抛到我身上，完美贴合。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_blood_front.png",
      side: "left",
      text: "妈妈，这是我被杀时穿的裙子，你穿着，能保护你。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_blood_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    { type: "system", text: "恭喜玩家，获得 SSSS 级道具「天使之裙」。" },
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_patched_front.png",
      side: "right",
      text: "（掏出毛线团）拿着，防身。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
      ],
    },
    { type: "system", text: "恭喜玩家，获得 SSS 级道具「宰相肚肠」。" },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_front.png",
      side: "left",
      text: "（扯下一只焦炭胳膊）必要时刻，可以助你一臂之力。",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    { type: "system", text: "恭喜玩家，获得 SS 级道具「枯木逢春」。" },
    { type: "danmaku", text: "人麻了。" },
    { type: "horror", set: 8 },
    { type: "scene", scene: "floor30_stairs" },
    {
      type: "narration",
      text: "四个大 Boss 整齐出动，依依不舍把我送到 30 层往下的楼梯口。\n我拿着一堆道具，看着身上的红裙，感动得稀里哗啦。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "谁说这是恐怖游戏的诡异？这不就是我最亲密可爱的家人吗？",
    },
    { type: "danmaku", text: "要是给我这些道具，我也觉得他们可爱。" },
    { type: "danmaku", text: "不得不承认，宁神有本事——至少她能在 30 层活到现在。" },
    { type: "danmaku", text: "以前的玩家连 30 层大门都进不去，刚走到门口就被血衣萝莉杀了。" },
    { type: "danmaku", text: "有四个大 Boss 当靠山，又有这么多道具，宁神这次必定能完成首通！" },
    { type: "horror", set: 5 },
    {
      type: "narration",
      text: "接下来要拜访邻居。\n可以先在家里转转，再下到 29 层——敲门即可继续。",
      clearSprites: true,
    },
    {
      type: "pause",
      id: "before_neighbors",
      unlock: "visit",
      exploreScene: "floor30_outside",
      hint: "自由探索中。下到 29 层门外，将鼠标移到门上显示「敲门」后点击可继续。",
      resumeNpc: {
        scene: "floor29_outside",
        hotspotId: "aptDoor",
        bubble: "敲门",
        prompt: "是否拜访 29 层？",
      },
    },
  ],
};
