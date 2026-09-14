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
 *  - before_knock：选房弹幕后；接入 3D 序章时改去值班室，乘电梯回来后停在 30 层门外敲门
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
    {
      type: "bgm",
      src: "assets/music/alex-morgan-ambient-horror-creepy-atmosphere-dark-587402.mp3",
      loop: true,
    },
    // —— 1 入局 ——
    { type: "scene", scene: "downstairs" },
    { type: "horror", set: 0 },
    { type: "system", text: "欢迎进入「幸福之家」副本。" },
    { type: "system", text: "玩家在该副本存活七天，即为通关。" },
    { type: "system", text: "初始玩家：30 人；现存活：30 人。\n祝各位玩家游戏愉快~" },
    {
      type: "narration",
      text: "我叫宁念。车祸死后，一阵白光闪过，我来到一栋大楼前。\n耳边响起诡异的机械音。",
      clearSprites: true,
      progress: "§1 入局",
    },
    { type: "horror", set: 8 },
    {
      type: "narration",
      text: "因为我是个高度近视，三米之内，人畜不分。\n看不清大楼啥样，也看不清周围的人具体长什么样，只能看到大概人影。",
    },
    {
      type: "narration",
      text: "这时，只听一个娇弱学生妹哭着说——",
    },
    {
      type: "say",
      speaker: "学生妹",
      sprite: "assets/chars/suxiaomo_front.png",
      side: "left",
      text: "呜呜呜，这是哪里啊？我想回家。",
    },
    {
      type: "narration",
      text: "一个黄毛暴躁地骂道——",
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
      text: "相对沉稳的一男一女走出来，他们自称老玩家，名叫红姐和俊哥，好心地给我们解释。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "left",
      text: "这里是无限流游戏，被拉进这个游戏的都是死了的人。",
    },
    {
      type: "say",
      speaker: "俊哥",
      sprite: "assets/chars/junge_front.png",
      side: "right",
      text: "如果能通关所有副本，积攒够传说中的 9999 分，就能复活。",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/junge_front.png", name: "俊哥" },
      ],
    },
    {
      type: "narration",
      text: "一听能复活，我急忙追问——",
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
      type: "narration",
      text: "红姐似乎情绪不高，低声说——",
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "right",
      text: "这跟你通关时的惊悚值有关，如果你是 99 惊悚值通关，那你最后只能获得 1 积分。如果你是 100 惊悚值，那直接死。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_daily_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
      ],
    },
    {
      type: "flavorChoice",
      id: "flavor_hongjie_horror_qa",
      mode: "qa",
      progress: "§1 追问 · 惊悚值",
      prompt: "宁念还想再问一句——",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_daily_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
      ],
      extraSlots: [
        { side: "right", sprite: "assets/chars/junge_front.png", name: "俊哥" },
      ],
      npcHint:
        "红姐：老玩家，嘴毒、讲规则不耐烦。俊哥：护着红姐，口气冲，会补积分和复活。宁念：刚死进来的新玩家，直球好奇、有点愣，还没进副本。",
      plotHint:
        "进楼前规则说明。无限流；被拉进来的都是死人；积攒够9999分复活；通关积分跟惊悚值有关；99惊悚值只剩1分；100惊悚值直接死。禁止剧透幸福之家室内家人、血衣、肠子、红姐真实图谋、异世之门、第七天结局。",
      resumeHint:
        "所谓惊悚值，顾名思义就是害怕程度。老玩家熟悉游戏后，基本能把惊悚值控制在 60 以内。而新玩家嘛，就比较惨咯。",
    },
    { type: "horror", add: 6 },
    {
      type: "narration",
      text: "所谓惊悚值，顾名思义就是害怕程度。\n老玩家熟悉游戏后，基本能把惊悚值控制在 60 以内。\n而新玩家嘛，就比较惨咯。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "我摸着下巴又问——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "right",
      text: "那如果是 0 惊悚值通关呢？最后能获得 100 积分吗？",
    },
    { type: "horror", set: 5 },
    {
      type: "narration",
      text: "这话一出，在我看不到的地方，我的一切都被直播了出去，无数弹幕在嘲笑我——",
    },
    {
      type: "danmaku",
      text: "这新玩家真是大言不惭！幸福之家虽然只是 S 级副本，等级不算最高，但因为其变态程度，至今都无人首通！",
    },
    {
      type: "danmaku",
      text: "上次第一工会的明神就栽在这里吧？都坚持到第六天了，结果嘎了。",
    },
    {
      type: "danmaku",
      text: "完蛋，这次随机匹配居然只有红姐和俊哥两个老玩家，他俩加起来都不如明神，看来这次又是团灭局。",
    },

    // —— 2 选房 ——
    {
      type: "narration",
      text: "很快，我们要选房间了。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "红姐说——",
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "left",
      text: "虽然之前这个副本无人通关，但前面死的那些玩家也摸索了一点经验。\n这栋楼一共 30 层，一梯一户，每层只能入住一名玩家。",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/junge_front.png", name: "俊哥" },
      ],
    },
    {
      type: "narration",
      text: "而且幸福之家其实属于角色扮演类恐怖副本。\n每个房子里都有一些诡异入住，他们会扮演玩家的各种亲密关系。\n所以七天的同吃同住，惊悚值怎么可能不剧烈波动呢？",
      clearSprites: true,
    },
    { type: "horror", add: 4 },
    {
      type: "narration",
      text: "俊哥急忙打断红姐的话，拉着她一起，分别选了一楼和二楼。\n一见老玩家这么选择，有明眼人紧随其后，纷纷选择了低楼层。\n因为近视，我跑不过，于是只好等大家选完。最后，只剩一个 30 层给我了。",
      clearSprites: true,
    },
    { type: "horror", set: 16 },
    {
      type: "narration",
      text: "仗着我看不到，弹幕又在叽里呱啦——",
    },
    { type: "danmaku", text: "这新玩家死定了，众所周知，楼层越高，Boss 等级越高。" },
    { type: "danmaku", text: "尤其是 30 层，全是大 Boss，号称死亡之家。" },
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
      text: "我抵达 30 层，环顾了一圈后发现和现实中没有太大区别，不就是血腥味重了点，墙壁红了点，温度低了点，灯光暗了点……\n而且，这可是大平层！还有我梦寐以求的家人哎！\n要知道，现实中我不仅是一个高度近视的废物，还是一个孤儿，更是一个穷狗！",
    },
    { type: "horror", set: 10 },
    {
      type: "narration",
      text: "我走到门口，毫不犹豫地伸手，用力拍了拍门，口中大叫——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "right",
      text: "快开门啊，宝宝我回家啦！再不开门我要饿死了！",
    },
    {
      type: "narration",
      text: "弹幕惊呆了——",
    },
    {
      type: "danmaku",
      text: "她纯粹在找死吧？哪个玩家不是礼貌地敲门，或者在门口乖乖等着诡异心情好了来开门。",
    },
    { type: "danmaku", text: "不想看这种一点脑子都没有的莽妇，我要换个直播间，我去看看红姐。" },
    { type: "danmaku", text: "看！继续看！我倒要看她怎么死的！" },

    // —— 3 见思思 ——
    {
      type: "narration",
      text: "其实是他们不懂我的脑回路。\n既然是角色扮演，要和诡异成为一家人，那肯定是怎么自然怎么相处啊。\n难道现实中回自己家，还要非常礼貌地说：「你好，有人在吗？请帮我开门。」",
      clearSprites: true,
    },
    { type: "scene", scene: "floor30_door_open" },
    {
      type: "narration",
      text: "敲门声落，门「咯吱」一声打开，凉意席卷我全身。\n我舒服地喟叹一声，这简直是避暑胜地啊，夏天都不用开空调了。",
    },
    { type: "horror", add: 8 },
    {
      type: "narration",
      text: "我低头，看到了一个矮小的红色「人影」。\n虽然我的视线一直模糊不清，但两条辫子一甩一甩的，应该是个穿着红裙的小孩。",
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
      plotHint:
        "红裙小孩是血衣萝莉，掐脖子是袭击；湿裙是玩家的血不是水。正史是搂进怀里当湿衣服。推开或当怪物打都会被杀。",
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
      text: "我的鼻子动了动，闻到了一阵血腥味，又焦急地问——",
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
      type: "narration",
      text: "弹幕恨铁不成钢的吐槽——",
    },
    {
      type: "danmaku",
      text: "大姐，睁开你的狗眼看看，这可是死亡之家的 Boss 之一，她穿的不是湿漉漉的红裙，那是她把玩家杀人分尸染红的！血腥味也不是她受伤了，是她裙子上玩家的血。",
    },
    { type: "danmaku", text: "没事，等那位回家，她死定了。" },
    { type: "bgm", stop: true },
    { type: "scene", scene: "sisi_room" },
    {
      type: "bgm",
      src: "assets/music/echoes_of_lumen-horror-ambient-dark-atmosphere-586983.mp3",
      loop: true,
    },
    {
      type: "narration",
      text: "可惜我看不到这些弹幕。我一边抱着小孩走进家门，一边帮她脱下红裙子，从她精致的公主房翻出新的白裙子给她穿上。\n小孩掐在我脖子上的小手不知不觉松开了。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "感受到她的无措，我拿起热毛巾，凑近了些，一点一点把她脸上的血污擦了个干净。\n这才看清，原来是个可爱的小萝莉。",
    },
    { type: "horror", set: 8 },
    {
      type: "narration",
      text: "我笑眯眯地指着自己的脸说——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "right",
      text: "身为家人，互帮互助是我该做的，不过，你是不是得亲我一口，以表感谢？",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "小萝莉" },
        { side: "right", sprite: "assets/chars/ningnian_daily_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "小萝莉扭捏地扯着白裙子，悄悄凑到我脸上，「啪叽」一口又快速离开。声音还软软糯糯地说——",
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
      text: "没想到，仅仅是选房子，居然就死了 10 名玩家。\n我打开手机，把手机捧到眼睛前，这才勉强看清屏幕上的字。\n原来是大家在玩家群交换信息了，比如其他玩家都是怎么死的。",
    },
    {
      type: "narration",
      text: "据说，暴躁黄毛和另外三个男人为了争夺 3 层，大打出手。最后黄毛险胜，入住 3 楼。\n只见黄毛刚敲开门，一个人身狗头的诡异就走出来，张出血盆大口，直接把黄毛整个吞了进去。\n最后还嚼吧嚼吧嘴，吐出了几根沾着皮肉的白骨。",
    },
    {
      type: "narration",
      text: "在狗头半开的门里，其他玩家看见了一大堆白骨，他们猜测，也许那全都是以前玩家的尸骨。\n目睹这些，基本上所有新玩家的肾上腺素都增高了。现在除了红姐和俊哥，每个人的惊悚值都高达 50，这才第一天！",
    },
    {
      type: "narration",
      text: "还有一个中年大叔，是在走进 10 楼大门的那一瞬间，惊悚值飙升至 100，直接死了。\n其他玩家也是各种五花八门的死法，要么被惊悚杀死，要么被吓死。\n当然，这些都跟我无关。",
    },
    { type: "horror", set: 3 },
    {
      type: "narration",
      text: "我站起身，趁着小萝莉在睡觉，勤快地从浴室里找到拖把，把整个房子都打扫了一遍。\n红色的地板砖被我硬生生地拖成了白色，我可真能干！\n墙壁上凝固的那些红色实在清理不掉，我便拿铲子把红色铲掉。",
    },
    { type: "variant", scene: "floor30_living", variant: "clean", withFade: true },
    {
      type: "narration",
      text: "等我忙碌完，已经是下午。我累得腰疼，趴在小萝莉旁边的沙发上沉沉睡去。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "等我再次醒来时，正被一道冰冷的气息笼罩着。\n房子里很是暗沉，我面前站着一道模糊不清的黑影。\n虽然看不太清，但他说的第一句话，我就被这把子嗓子拿捏了。",
    },
    { type: "horror", set: 22 },

    // —— 4～5 Boss ——
    {
      type: "narration",
      text: "他用低沉性感的嗓音轻笑——",
    },
    {
      type: "say",
      speaker: "？？？",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "呵，有趣，居然能在思思手里活到现在。",
    },
    {
      type: "narration",
      text: "紧接着，小萝莉思思阴冷的声音也响起——",
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "你最好别动她，这个妈妈有点意思，我要留着好好玩。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "？？？" },
      ],
    },
    {
      type: "narration",
      text: "男人没有回应她，大手一挥，名叫思思的小萝莉就从沙发上倒飞出去，撞上阳台的玻璃，发出「砰」的一声巨响，还有骨头散架的声音。",
      clearSprites: true,
    },
    { type: "horror", set: 35 },
    {
      type: "narration",
      text: "男人冷笑——",
    },
    {
      type: "say",
      speaker: "？？？",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "谁允许你跟我这样说话的？真把自己当我女儿了？",
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
      plotHint:
        "无头断头刚把思思打飞。正史是护娃并薅腹肌认亲。求饶说不是这家人、或骂他怪物变态会惹怒被杀。",
    },
    {
      type: "narration",
      text: "我忍不了了，一骨碌从沙发上爬起来，同时嘴里念叨——",
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
    {
      type: "narration",
      text: "我本想一巴掌拍在男人脸上，不知怎地，手一滑，一巴掌薅住了他的腹肌。\n啧，这手感，我没忍住多摸了两把。",
    },
    {
      type: "narration",
      text: "眼见男人濒临暴怒，浑身冒黑气，我急忙找补——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "思思是我的小宝贝，你是我的大宝贝，我们就是相亲相爱一家人。",
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
      text: "其实，那个，老公，你身材挺不错的，就是怎么看着有点矮？",
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
    { type: "danmaku", text: "救命，她在说什么？她怎么敢在断头大 Boss 面前说这些的！" },
    { type: "danmaku", text: "终于等到了断头大 Boss，他应该是幸福之家副本最强 Boss 了吧？当初明神就死在他手里。" },
    { type: "danmaku", text: "可是，大 Boss 脸上为什么可疑地红了？嗑到了。" },
    { type: "danmaku", text: "楼上，你真是饿了。" },
    {
      type: "narration",
      text: "直播间都在等着男人拧断我的脖子。之前的玩家都是这样的下场。",
    },
    {
      type: "narration",
      text: "没想到，下一秒，男人抬手，忽然把手里拎着的脑袋安在了脖子上。\n然后凑近我，高冷邪魅的形象不复存在，声音夹杂一股莫名的委屈——",
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
      type: "narration",
      text: "这年头，哪怕是诡异，只要他是个男的，都在意身高啊！",
      clearSprites: true,
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
      text: "男人忽然叫我名字，好听得我心脏「怦怦」直跳。\n我一边猛地拽他领带，让他完全压在我身上，一边矫揉造作地呢喃——",
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
      text: "盯着面前清晰放大的俊脸，我暗爽：幸好幸好，这个破恐怖游戏只看惊悚值，不看心跳值。\n不然，我指定死翘翘。",
      clearSprites: true,
    },
    { type: "horror", set: 6 },
    {
      type: "narration",
      text: "见男人一直不说话，我担心他生气，立刻星星眼点头，谄媚地说——",
    },
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
      text: "西装革履的男人脸色暴红，他正要说话。\n下一秒，刚把自己骨头组合好的血衣萝莉冲过来，一脚把男人踹上天花板，让他抠都抠不下来。\n然后，小萝莉无辜地看着我，和我贴贴脸，眼神湿润——",
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
      type: "flavorChoice",
      id: "flavor_sisi_hungry",
      mode: "chat",
      progress: "§5 岔口 · 饿饿饭饭",
      prompt: "思思喊饿。宁念会说——",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
      npcHint:
        "思思：粘人、婴儿腔、认宁念为妈妈；刚把断头踹上天花板，眼神湿润要吃饭。宁念当亲生女儿哄，高度近视不拆穿。",
      plotHint:
        "思思是血衣萝莉，刚拼好骨头、把断头踹上天花板，用婴儿腔喊饿要吃饭。宁念眼瞎当女儿撒娇，正史接下来是她去翻冰箱做饭。本场只有思思和宁念；肠大爷、毛衣、毛线都还没出场。禁止提毛线/毛衣/肠子/尸食/鸡爪。禁止写成没有恐怖错位的普通母女，禁止宁念看清鬼相或提血衣。断头抠在天花板上，不要让他开口。禁止抢正史下一句翻冰箱做饭的旁白原文。",
      forbid: /毛线|毛衣|肠子|肠大爷|鸡爪|尸食|黑老太|面膜/,
      resumeHint:
        "这谁顶得住啊！我立刻从冰箱里翻出食材，眯着眼睛去做饭。",
    },
    {
      type: "narration",
      text: "这谁顶得住啊！\n我立刻从冰箱里翻出食材，眯着眼睛，屁颠屁颠去给小萝莉……和老公做饭了。\n我这一手厨艺真不是吹的，父女俩把碗盆都舔得干干净净。",
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
      text: "更离谱的是，断头大 Boss 也不知道怎么想的，居然同意了我这个提议。\n最终，我和他进行了分头行动。\n我在厨房一边洗着男人的头，一边哼着歌。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "弹幕看着这诡异的一幕，鸡皮疙瘩都起来了——",
    },
    { type: "danmaku", text: "依我看，不是一家人，不进一家门，这宁念也是个死变态。" },
    { type: "horror", set: 3 },
    {
      type: "narration",
      text: "他们哪知道，对我这个高度近视而言，手里其实就是在洗一个长了毛的黑皮西瓜而已嘛。\n忽然，我手里的「黑皮西瓜」说话了——",
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "你心情很好？",
    },
    {
      type: "narration",
      text: "我坦言——",
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
      text: "黑皮西瓜，哦，不，是断头大 Boss 忽然整个头飞走，和刚走出浴室的身体完美衔接上，又变成了那个帅气逼人的一米八六大个子。\n男人似乎想起了什么不愉快的事，声音暗哑——",
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
      type: "flavorChoice",
      id: "flavor_boss_name",
      mode: "chat",
      progress: "§5 岔口 · 取名",
      prompt: "断头说没有名字，让你取一个。宁念会说——",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
      npcHint:
        "断头：高冷、话少、情绪低沉，刚把头接回身体；不能说破通关情报。被请取名时别扭、含糊。宁念当老公，直球、高度近视。",
      plotHint:
        "断头刚把头飞去接上走出浴室的身体，变成一米八六的男人。他说没有名字，请宁念取一个，随即会心情低落去客房。宁念把他当老公，看不清（刚洗完「黑皮西瓜」）。禁止她看清无头真相。禁止现在取到后文真名宁君安。禁止抢正史下一句：他快速离开去客房睡觉。肠大爷、毛衣、毛线都未出场。",
      forbid: /毛线|毛衣|肠子|肠大爷|鸡爪|尸食|黑老太|面膜|宁君安/,
      resumeHint: "说完，男人快速离开，情绪低沉地去客房睡觉。",
    },
    {
      type: "narration",
      text: "说完，男人快速离开，情绪低沉地跟我说，他去客房睡觉。\n啧，这老公，真小气，就不能让我摸着腹肌睡觉吗？\n我挠挠头，一时之间也没想到好名字，便回房间继续想了。",
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
