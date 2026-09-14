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
      progress: "§1 入局",
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
      text: "很快，我们要选房间了。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "left",
      text: "虽然之前这个副本无人通关，但前面死的那些玩家也摸索了一点经验。\n这栋楼一共三十层，一梯一户，每层只能住一名玩家。",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/junge_front.png", name: "俊哥" },
      ],
    },
    {
      type: "narration",
      text: "幸福之家其实属于角色扮演类恐怖副本。\n每个房子里都有一些诡异入住，他们会扮演玩家的各种亲密关系，同吃同住七天。",
      clearSprites: true,
    },
    { type: "horror", add: 4 },
    {
      type: "narration",
      text: "俊哥急忙打断红姐，拉着她选了一楼和二楼。明眼人跟着抢低层。\n因为近视，我跑不过，最后只剩 30 层。",
      clearSprites: true,
    },
    { type: "horror", set: 16 },
    { type: "danmaku", text: "楼层越高 Boss 越强！30 层号称死亡之家，她死定了。" },
    {
      type: "pause",
      id: "before_knock",
      unlock: "outside",
      exploreScene: "downstairs",
      hint: "自由探索中。乘电梯到 30 层，将鼠标移到门上显示「敲门」后点击可继续。大厅或 1 层外可能遇到仍滞留的玩家闲聊。",
      progress: "§2 选房 / 敲门",
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
      text: "其实是他们不懂我的脑回路。\n既然是角色扮演，要和诡异成为一家人，那肯定是怎么自然怎么相处啊。\n难道现实中回自己家，还要非常礼貌地说：「你好，有人在吗？请帮我开门。」",
      clearSprites: true,
    },
    { type: "scene", scene: "floor30_door_open" },
    {
      type: "narration",
      text: "敲门声落，门「咯吱」一声打开，凉意席卷全身。\n我舒服地喟叹一声——简直是避暑胜地，夏天都不用开空调。",
    },
    { type: "horror", add: 8 },
    {
      type: "narration",
      text: "我低头，看到了一个矮小的红色「人影」。\n虽然视线一直模糊不清，但两条辫子一甩一甩的，应该是个穿着红裙的小孩。",
    },
    {
      type: "narration",
      text: "小孩阴森一笑，猛地朝我扑来，冰凉的小手掐住了我的脖子。",
    },
    { type: "horror", set: 28 },
    {
      type: "choice",
      id: "branch_sisi_strangle",
      progress: "§3 岔路 · 见思思",
      prompt: "她掐住了你的脖子。你打算——",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_blood_enter.png", name: "？？？" },
        { side: "right", sprite: "assets/chars/ningnian_daily_front.png", name: "宁念" },
      ],
      options: [
        {
          id: "canon",
          label: "顺势把她搂进怀里，摸到湿漉漉的裙子。",
          canon: true,
        },
        {
          id: "sisi_push",
          label: "尖叫着把她推开。",
          ending: "sisi_kill",
        },
        {
          id: "sisi_fight",
          label: "把她当怪物打回去。",
          ending: "sisi_kill",
        },
      ],
    },
    {
      type: "narration",
      text: "我顺势把她搂在怀里，摸到她裙子是湿漉漉的，立刻不满地说——",
    },
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
      type: "narration",
      text: "鼻子动了动，闻到一阵血腥味，又焦急地问——",
      clearSprites: true,
    },
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
    {
      type: "danmaku",
      text: "大姐，睁开你的狗眼看看，这可是死亡之家的 Boss 之一！她穿的不是湿漉漉的红裙，那是把玩家杀人分尸染红的！血腥味也不是她受伤了，是裙子上玩家的血。",
    },
    { type: "scene", scene: "sisi_room" },
    {
      type: "narration",
      text: "我一边抱着小孩走进家门，一边帮她脱下红裙子，从精致的公主房翻出新的白裙子给她穿上。\n她掐在我脖子上的小手，不知不觉松开了。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "感受到她的无措，我拿起热毛巾，凑近了些，一点一点把她脸上的血污擦了个干净。\n这才看清，原来是个可爱的小萝莉。",
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
      type: "narration",
      text: "小萝莉扭捏地扯着白裙子，悄悄凑到我脸上，「啪叽」一口又快速离开——",
      clearSprites: true,
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
      text: "啥？妈妈？\n俺无痛当妈啦！这简直是泰裤辣！\n要知道，我现实中就听惯了各种死在生产台上的事情——我虽然渴望家庭，但最怕的就是生孩子了。",
      clearSprites: true,
    },
    { type: "horror", set: 4 },
    { type: "scene", scene: "floor30_living" },
    { type: "variant", scene: "floor30_living", variant: "dirty" },
    {
      type: "narration",
      text: "我刚哄好小萝莉，让她午休一会，就听耳边传来机械音播报——",
    },
    { type: "system", text: "初始玩家：30 人；现存活：20 人。" },
    {
      type: "narration",
      text: "没想到，仅仅是选房子，居然就死了 10 名玩家。\n我打开手机，把手机捧到眼睛前，这才勉强看清屏幕上的字。\n群里说：黄毛住进 3 楼，被狗头诡异吞了；还有人惊悚值直接飙到 100……当然，这些都跟我无关。",
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
      type: "choice",
      id: "branch_boss_scold",
      progress: "§4 岔路 · 断头登场",
      prompt: "断头大 Boss 把思思打飞了。你接下来——",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "？？？" },
      ],
      options: [
        {
          id: "canon",
          label: "冲上去护娃，顺手薅住他的腹肌认亲。",
          canon: true,
        },
        {
          id: "boss_kneel",
          label: "立刻求饶，说自己不是这家人。",
          ending: "boss_wrath",
        },
        {
          id: "boss_insult",
          label: "骂他是怪物、变态。",
          ending: "boss_wrath",
        },
      ],
    },
    {
      type: "narration",
      text: "我忍不了了，一骨碌从沙发上爬起来。\n本想给他一巴掌，手一滑——薅住了他的腹肌。啧，这手感，没忍住多摸了两把。",
    },
    {
      type: "narration",
      text: "眼见他濒临暴怒，浑身冒黑气，我急忙找补——",
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
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "没事，现在我来了，我以后每天都给你们做好吃的，保证你们父女都长得高高的。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "？？？" },
      ],
    },
    { type: "danmaku", text: "她怎么敢在断头大 Boss 面前说这些的！！" },
    {
      type: "narration",
      text: "没想到，下一秒，男人抬手，忽然把手里拎着的脑袋安在了脖子上。",
      clearSprites: true,
    },
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
      type: "narration",
      text: "我猛地拽住他的领带，让他完全压在我身上，一边呢喃——",
      clearSprites: true,
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
      text: "下一秒，骨头刚拼好的思思冲来，一脚把男人踹上天花板。\n随后她过来和我贴贴脸，眼神湿润——",
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
      text: "这谁顶得住啊！\n我立刻从冰箱里翻出食材，眯着眼睛，屁颠屁颠去给小萝莉……和老公做饭了。\n父女俩把碗盆舔得干干净净。",
      clearSprites: true,
    },
    { type: "horror", set: 4 },
    {
      type: "narration",
      text: "我去浴室洗澡时，似乎听到他们父慈女孝地在交谈——",
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "思思，其实留着这个女人也行，她做饭挺好吃的。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "可是，爸爸，明天那两位回来，知道我们以后不吃他们做的饭会爆炸的。",
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
      text: "那也叫饭？他们敢有疑问，我先杀了他们。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "好的，我给你放风。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    { type: "scene", scene: "master_bedroom" },
    {
      type: "narration",
      text: "洗完澡的我很自觉地占领主卧，鬼鬼祟祟地从被窝里探出脑袋，看那道黑影一直坐在沙发上不动。\n于是，我柔声柔气地开始展示自己的贤惠——",
      clearSprites: true,
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
      text: "更离谱的是，断头大 Boss 居然同意了。最终，我和他进行了分头行动。\n我在厨房一边洗着男人的头，一边哼着歌。\n对我这个高度近视而言，手里其实就是在洗一个长了毛的黑皮西瓜而已。",
      clearSprites: true,
    },
    { type: "danmaku", text: "依我看，不是一家人，不进一家门，这宁念也是个死变态。" },
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
      type: "narration",
      text: "黑皮西瓜凝视着我，忽然咧嘴一笑，诡异又俊俏——",
      clearSprites: true,
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
      type: "narration",
      text: "我温柔地看着他……其实也看不清，不要在意这些细节。",
      clearSprites: true,
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
      type: "narration",
      text: "话音刚落，他的头忽然飞出厨房，与刚走出浴室的身体完美衔接，又变成那个帅气逼人的一米八六大个子。",
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
      text: "说完，男人快速离开，情绪低沉地去客房睡觉。\n啧，这老公真小气，就不能让我摸着腹肌睡觉吗？",
      clearSprites: true,
    },
    { type: "scene", scene: "master_bedroom" },
    {
      type: "narration",
      text: "正思索时，下一秒，一双漆黑的眼睛在我被子里出现，小脸散发着幽光——简直是咒怨现场。\n幸好我看不清，只看到一团模糊的白影。",
    },
    { type: "horror", set: 18 },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "妈妈，别理那个断头老怪物，今晚，思思要跟妈妈睡。",
    },
    {
      type: "narration",
      text: "原来是思思，不知道她什么时候钻进我被窝里了。\n我捏了捏她的小脸，把她提溜到我怀里，轻声教导——",
      clearSprites: true,
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
      type: "narration",
      text: "思思不解地看着我，张了张嘴，露出被拔光牙齿的血淋淋光秃秃的嘴——",
      clearSprites: true,
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
