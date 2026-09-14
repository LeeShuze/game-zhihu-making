/**
 * 全文第 1～6 节剧情脚本
 * beat 类型:
 *  - say / narration / system / danmaku  → 对话推进
 *  - scene → Game.goToScene
 *  - variant → Game.setVariant
 *  - wait → 短暂停顿
 *  - horror → { set:n } 设为绝对值 / { add:n } 增减惊悚值
 *  - pause → 自由探索；resumeNpc 可挂 NPC，或用 hotspotId 接管场景热区
 *
 * 暂停点：
 *  - before_knock：选房弹幕后 → 玩家自行乘梯到 30 层敲门
 */
window.STORY_CH01_06 = {
  id: "ch01_06",
  chars: {
    ningnian: "assets/chars/ningnian_front.png",
    ningnianDaily: "assets/chars/ningnian_daily_front.png",
    boss: "assets/chars/boss_front.png",
    sisi: "assets/chars/sisi_front.png",
    sisiBlood: "assets/chars/sisi_blood_front.png",
    hongjie: "assets/chars/hongjie_front.png",
    junge: "assets/chars/junge_front.png",
    suxiaomo: "assets/chars/suxiaomo_front.png",
    huangmao: "assets/chars/huangmao_front.png",
  },
  beats: [
    // —— 1 入局 ——
    { type: "scene", scene: "downstairs" },
    { type: "horror", set: 0 },
    { type: "system", text: "欢迎进入「幸福之家」副本。" },
    { type: "system", text: "玩家在该副本存活七天，即为通关。" },
    { type: "system", text: "初始玩家：30 人；现存活：30 人。\n祝各位玩家游戏愉快~" },
    {
      type: "narration",
      text: "车祸死后，一阵白光闪过，我来到一栋大楼前。\n耳边响起诡异的机械音。",
      clearSprites: true,
    },
    { type: "horror", set: 8 },
    {
      type: "narration",
      text: "因为我是个高度近视，三米之内，人畜不分。\n看不清大楼，也看不清周围的人，只能看到大概人影。",
    },
    {
      type: "say",
      speaker: "学生妹",
      sprite: "assets/chars/suxiaomo_front.png",
      side: "left",
      text: "呜呜呜，这是哪里啊？我想回家。",
    },
    {
      type: "say",
      speaker: "黄毛",
      sprite: "assets/chars/huangmao_front.png",
      side: "right",
      text: "谁在搞鬼？放老子回去！",
      slots: [
        { side: "left", sprite: "assets/chars/suxiaomo_front.png", name: "学生妹" },
        { side: "right", sprite: "assets/chars/huangmao_front.png", name: "黄毛" },
      ],
    },
    {
      type: "narration",
      text: "相对沉稳的一男一女走出来，自称老玩家，名叫红姐和俊哥。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "left",
      text: "这里是无限流游戏。被拉进来的，都是已经死了的人。",
    },
    {
      type: "say",
      speaker: "俊哥",
      sprite: "assets/chars/junge_front.png",
      side: "right",
      text: "通关所有副本，攒够传说中的 9999 分，就能复活。",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/junge_front.png", name: "俊哥" },
      ],
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "left",
      text: "那通关一次副本能获得多少积分啊？",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_daily_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
      ],
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "right",
      text: "跟你通关时的惊悚值有关。99 惊悚值通关，只剩 1 积分；\n100 惊悚值……直接死。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_daily_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
      ],
    },
    { type: "horror", add: 6 },
    {
      type: "narration",
      text: "所谓惊悚值，就是害怕程度。\n老玩家一般能压到 60 以内，新玩家就比较惨了。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "right",
      text: "那如果是 0 惊悚值通关呢？最后能获得 100 积分吗？",
    },
    { type: "horror", set: 5 },
    { type: "danmaku", text: "这新玩家真是大言不惭！幸福之家至今无人首通！" },
    { type: "danmaku", text: "明神都坚持到第六天嘎了……这次又是团灭局。" },

    // —— 2 选房 ——
    {
      type: "narration",
      text: "很快，我们要选房间了。\n红姐说：三十层一梯一户，每层只能住一名玩家。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "幸福之家是角色扮演类恐怖副本——\n房里的诡异会扮演你的各种亲密关系，同吃同住七天。",
    },
    { type: "horror", add: 4 },
    {
      type: "say",
      speaker: "俊哥",
      sprite: "assets/chars/junge_front.png",
      side: "right",
      text: "走。",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/junge_front.png", name: "俊哥" },
      ],
    },
    {
      type: "narration",
      text: "老玩家选了一楼和二楼，明眼人跟着抢低层。\n因为近视，我跑不过，最后只剩 30 层。",
      clearSprites: true,
    },
    { type: "horror", set: 16 },
    { type: "danmaku", text: "楼层越高 Boss 越强！30 层号称死亡之家，她死定了。" },
    {
      type: "pause",
      id: "before_knock",
      unlock: "outside",
      exploreScene: "downstairs",
      hint: "自由探索中。乘电梯到 30 层，将鼠标移到门上显示「敲门」后点击可继续。",
      resumeNpc: {
        scene: "floor30_outside",
        hotspotId: "aptDoor",
        bubble: "敲门",
        prompt: "是否敲门继续剧情？",
      },
    },
    { type: "scene", scene: "floor30_outside" },
    {
      type: "narration",
      text: "抵达 30 层。血腥味重了点，墙壁红了点，温度低了点……\n可这是大平层啊！还有梦寐以求的家人！",
    },
    { type: "horror", set: 10 },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "right",
      text: "快开门啊，宝宝我回家啦！再不开门我要饿死了！",
    },
    { type: "danmaku", text: "她纯粹在找死吧？哪个玩家不是礼貌敲门的……" },

    // —— 3 见思思 ——
    {
      type: "narration",
      text: "既然是角色扮演，要和诡异当一家人，当然怎么自然怎么来。",
      clearSprites: true,
    },
    { type: "scene", scene: "floor30_door_open" },
    {
      type: "narration",
      text: "门「咯吱」一声打开，凉意席卷全身——简直是避暑胜地。",
    },
    { type: "horror", add: 8 },
    {
      type: "say",
      speaker: "？？？",
      sprite: "assets/chars/sisi_blood_enter.png",
      side: "left",
      text: "……",
    },
    {
      type: "narration",
      text: "一个矮小的红色人影猛地扑来，冰凉的小手掐住我的脖子。",
    },
    { type: "horror", set: 28 },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "right",
      text: "小孩子怎么能穿湿衣服呢？快脱下！我带你去换干净衣服！",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_blood_enter.png", name: "？？？" },
        { side: "right", sprite: "assets/chars/ningnian_daily_front.png", name: "宁念" },
      ],
    },
    { type: "horror", set: 14 },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "right",
      text: "你是不是哪里受伤了？药箱在哪？我帮你处理。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_blood_enter.png", name: "？？？" },
        { side: "right", sprite: "assets/chars/ningnian_daily_front.png", name: "宁念" },
      ],
    },
    { type: "danmaku", text: "那是血裙啊大姐！死亡之家的 Boss 之一！" },
    { type: "scene", scene: "sisi_room" },
    {
      type: "narration",
      text: "我抱着她走进家门，从公主房翻出新的白裙子给她换上，\n又一点一点擦干净她脸上的血污。",
      clearSprites: true,
    },
    { type: "horror", set: 8 },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "right",
      text: "身为家人，互帮互助是我该做的。\n不过，你是不是得亲我一口，以表感谢？",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "小萝莉" },
        { side: "right", sprite: "assets/chars/ningnian_daily_front.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_hug.png",
      side: "left",
      text: "谢谢妈妈。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_hug.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_soothe.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "啥？妈妈？\n俺无痛当妈啦！泰裤辣！",
      clearSprites: true,
    },
    { type: "horror", set: 4 },
    { type: "scene", scene: "floor30_living" },
    { type: "variant", scene: "floor30_living", variant: "dirty" },
    {
      type: "narration",
      text: "我哄她午休。耳边忽然响起机械音——",
    },
    { type: "system", text: "初始玩家：30 人；现存活：20 人。" },
    {
      type: "narration",
      text: "仅仅选房子就死了十人。群里说：黄毛住进 3 楼，被狗头诡异吞了；\n还有人惊悚值直接飙到 100……当然，这些都跟我无关。",
    },
    { type: "horror", set: 3 },
    {
      type: "narration",
      text: "趁思思睡着，我把整间屋子打扫了一遍。\n红色地板拖成白色，铲不掉的血迹就硬铲。",
    },
    { type: "variant", scene: "floor30_living", variant: "clean", withFade: true },
    {
      type: "narration",
      text: "屋子总算像样了些。\n忙碌到下午，我累得腰疼，趴在沙发上沉沉睡去。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "醒来时，一道冰冷的气息笼罩着我——面前站着模糊的黑影。",
    },
    { type: "horror", set: 22 },

    // —— 4～5 Boss ——
    {
      type: "say",
      speaker: "？？？",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "呵，有趣。居然能在思思手里活到现在。",
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "你最好别动她。这个妈妈有点意思，我要留着好好玩。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "？？？" },
      ],
    },
    {
      type: "narration",
      text: "男人大手一挥，思思倒飞出去，撞上阳台玻璃，骨头散架的声音清晰可闻。",
      clearSprites: true,
    },
    { type: "horror", set: 35 },
    {
      type: "say",
      speaker: "？？？",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "谁允许你跟我这样说话的？真把自己当我女儿了？",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "谁允许你这样跟孩子说话的？哪有你这样当爸爸的？",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "？？？" },
      ],
    },
    { type: "horror", set: 18 },
    {
      type: "narration",
      text: "我本想给他一巴掌，手一滑——薅住了他的腹肌。\n啧，这手感，没忍住多摸了两把。",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "思思是我的小宝贝，你是我的大宝贝，我们就是相亲相爱一家人。\n老公，你身材挺不错的，就是怎么看着有点矮？",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "？？？" },
      ],
    },
    { type: "danmaku", text: "她怎么敢在断头大 Boss 面前说这些的！！" },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "我矮？我可是实实在在的一米八六，你再仔细看看呢？",
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
      text: "宁念，我劝你，好好看。",
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
      text: "看不清，再近点。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "幸好这破游戏只看惊悚值，不看心跳值。\n不然我指定死翘翘。",
      clearSprites: true,
    },
    { type: "horror", set: 6 },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "哇！你一米八六，我一米六六，最萌身高差，我们真是天生一对哎！",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "下一秒，骨头刚拼好的思思冲来，一脚把男人踹上天花板。",
    },
    { type: "horror", add: 5 },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "妈妈，思思，饿饿，饭饭。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "这谁顶得住啊！我立刻去做饭。\n父女俩把碗盆舔得干干净净。",
      clearSprites: true,
    },
    { type: "horror", set: 4 },
    {
      type: "narration",
      text: "洗澡时隐约听见——\n「留着这个女人也行，做饭挺好吃的。」",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "老公，要不你自己去浴室洗身体，我帮你在厨房洗头吧？这样快一些。",
    },
    { type: "danmaku", text: "这是什么魔鬼建议？" },

    // —— 6 洗头与收束 ——
    { type: "scene", scene: "kitchen" },
    {
      type: "narration",
      text: "更离谱的是，他居然同意了。\n对我这个高度近视而言，手里就是在洗一个长了毛的黑皮西瓜。",
      clearSprites: true,
    },
    { type: "horror", set: 3 },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "你心情很好？",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "当然啦，我觉得我和你们父女相处得非常好，肯定能顺利通关的。",
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
      text: "你会如愿的，宁念。",
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
      text: "我还不知道你的名字呢？",
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
      text: "我没有名字。如果你愿意的话，可以帮我取一个。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "他说完便去客房睡了。\n啧，这老公真小气，就不能让我摸着腹肌睡觉吗？",
      clearSprites: true,
    },
    { type: "scene", scene: "master_bedroom" },
    {
      type: "narration",
      text: "正思索时，被子里钻出一双漆黑的眼睛——简直是咒怨现场。\n幸好我看不清，只看到一团模糊的白影。",
    },
    { type: "horror", set: 18 },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "妈妈，别理那个断头老怪物，今晚，思思要跟妈妈睡。",
    },
    { type: "horror", set: 7 },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "不可以说爸爸是老怪物，他会伤心的。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "嘻嘻~可是，我也是小怪物啊，他们还叫我小狐狸精和小婊砸呢。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    { type: "horror", set: 2 },
  ],
};
