/**
 * 全文第 16 尾～19 节（中层开解 → 回 30 层日常 → 第六天：10 层狗头 / 9 层红姐俊哥）
 *
 * 本章接在 27 层之后连续播放，中间不停；
 * 结束后直接进入第 20 节（回 30 层讲故事）。
 */
window.STORY_CH17_19 = {
  id: "ch17_19",
  chars: {
    ningnian: "assets/chars/ningnian_coat_dress.png",
    doghead: "assets/chars/doghead10_front.png",
    suxiaomo: "assets/chars/suxiaomo_front.png",
    fangyuan: "assets/chars/fangyuan_front.png",
    hongjie: "assets/chars/hongjie_front.png",
    junge: "assets/chars/junge_front.png",
  },
  beats: [
    // —— 16 尾：中层开解 → 回 30 层日常 → 第六天 10 层 ——
    {
      type: "narration",
      text: "我一路往下，看到了很多熟悉又陌生的诡异。\n有寻亲路上惨死的男孩，有被校园霸凌致死的少年。\n我选择一一开解他们，并宽慰了他们。\n……",
      clearSprites: true,
      progress: "§16 中层开解",
    },
    { type: "scene", scene: "floor30_living" },
    {
      type: "narration",
      text: "这两天下来，我严格按照朝九晚五的作息做任务。\n每天一回 30 层，思思就像个小猫咪一样扑来，在我脸上蹭啊蹭，亲昵地说——",
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_hug.png",
      side: "left",
      text: "妈妈，我好想你。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_hug.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "flavorChoice",
      id: "flavor_sisi_miss_you",
      mode: "chat",
      optionCount: 3,
      optionTopic: "回应思思想妈妈：宁念就是她妈妈，说想她、抱抱、回来了；禁止问妈妈在哪，禁止改去问吃饭",
      progress: "§16 岔口 · 好想你",
      prompt: "思思扑上来喊想妈妈。宁念会说——",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_hug.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
      npcHint:
        "思思：婴儿腔、黏人、认宁念为妈妈，像小猫一样扑上来蹭脸。宁念就是她口中的妈妈，当亲生女儿哄，高度近视，刚从楼下拜访回来。",
      plotHint:
        "拜访邻居两天后回到 30 层客厅。思思扑进怀里喊「妈妈我好想你」。宁念就是她妈妈，只会顺着哄，绝对不会问「你妈妈在哪儿」。选项必须是回应想念（我也想你/回来了/抱一下），禁止打听她亲妈、禁止突然改去问饿不饿吃饭（正史下一句才是断头端饭）。本场只有思思和宁念；禁止断头开口，禁止抢正史萌化旁白和「其实我也想你」。禁止宁念看清血衣真相。肠大爷、黑老太、楼下邻居都不要出场。",
      forbid: /你妈妈|她妈妈|妈妈在哪|妈妈呢|妈妈去哪|谁是你妈|亲妈|饿了|吃饭|煮面|肠大爷|黑老太|面膜|鸡爪|尸食|人身狗头|宁君安|异世之门|幸福之心/,
      resumeHint: "我简直都要萌化了。",
    },
    {
      type: "narration",
      text: "我简直都要萌化了。\n而断头大 Boss 则主动做好饭菜，一脸哀怨地拉着我的小手，不甘示弱地低语——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "其实我也想你。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "flavorChoice",
      id: "flavor_boss_miss_you",
      mode: "chat",
      optionCount: 3,
      progress: "§16 岔口 · 我也想你",
      prompt: "断头哀怨地说也想她。宁念会说——",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
      npcHint:
        "断头：话少、别扭、护短，刚做好饭、拉着宁念的手不甘示弱。宁念当老公直球哄，高度近视，刚被思思扑过。",
      plotHint:
        "30 层客厅。思思刚喊完「妈妈我好想你」，断头端着饭哀怨接话「其实我也想你」。本场只有宁念和断头；禁止思思再开口，禁止抢正史旁白「救命！父女争锋，我享清福」。禁止宁念看清断头/无头真相。禁止写成没有恐怖错位的普通夫妻。肠大爷、黑老太、楼下邻居不要出场。",
      forbid: /肠大爷|黑老太|面膜|鸡爪|尸食|人身狗头|宁君安|异世之门|幸福之心/,
      resumeHint: "救命！父女争锋，我享清福。",
    },
    {
      type: "narration",
      text: "救命！父女争锋，我享清福。\n多来点，我好爱。",
      clearSprites: true,
    },
    { type: "danmaku", text: "死丫头，命真好，让我演两集！" },
    { type: "danmaku", text: "别想了，你上 30 层，我看你活不过一集（天）。" },
    {
      type: "narration",
      text: "这样插科打诨，时间来到了第六天。\n我也来到了第 10 层。",
    },
    { type: "scene", scene: "floor10_outside" },
    { type: "horror", set: 22 },
    {
      type: "narration",
      text: "此时，我手里已经收集了一堆拜访卡片。\n其实从 20 层开始往下，Boss 没有那么恐怖了，我发现了两名幸存玩家——\n不过，他们都不敢跟我作对。当然，也轮不到他们帮我攻略邻居。",
    },
    {
      type: "narration",
      text: "因为这些邻居都很热情，也很可爱啊，主动开门，主动把拜访卡片送到我手中哎！\n后来，他们也跟着我一起拜访其他邻居，我们一路往下，来到了第 10 层。",
    },
    { type: "danmaku", text: "30 层四尊大佛盯着呢，敢不送吗？" },
    {
      type: "narration",
      text: "我们一行三人刚到 10 层，就见到一个两米高的人身狗头怪物伫立在走廊上。\n门大敞着，里面全是玩家的森森白骨。",
    },
    {
      type: "narration",
      text: "人身狗头怪物给我们递过来三张拜访卡片。我张了张嘴，正想说点什么，人身狗头怪物突然面向我，微微俯下身——\n即使我高度近视，我也看清了它犬齿间的碎肉，甚至还卡着人类的指头。",
    },
    { type: "horror", set: 38 },
    {
      type: "say",
      speaker: "人身狗头",
      sprite: "assets/chars/doghead10_front.png",
      side: "left",
      text: "人类女孩，不要以为 30 层那四个家伙庇护着你，我就会畏惧你。\n至少在这件事情上，我绝不妥协。",
      slots: [
        { side: "left", sprite: "assets/chars/doghead10_front.png", name: "人身狗头" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "人身狗头",
      sprite: "assets/chars/doghead10_front.png",
      side: "left",
      text: "第 10 层，但凡有人入住，永远都无人生还。\n看在你的面子上，我可以给看得顺眼的人类一张拜访卡片。\n不要妄想更多。",
      slots: [
        { side: "left", sprite: "assets/chars/doghead10_front.png", name: "人身狗头" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "我沉默了。努力按下蠢蠢欲动的菜刀，低声安抚某人——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_soothe.png",
      side: "right",
      text: "好啦，不气不气，好男不跟狗斗。",
    },
    {
      type: "narration",
      text: "菜刀这才气哼哼地安稳下来。\n人身狗头怪物和人类的恩怨，或许要不仅追溯到它活着时，更要追溯到如今的现实。\n部分人类大肆虐杀猫、狗等动物，所以在这个世界，出现一个人身狗头怪物，只在第 10 层，虐杀人类。\n听起来，这似乎是一件很公平的事情呢。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_coat_dress.png",
      side: "right",
      text: "这种杀戮什么时候会结束呢？",
      slots: [
        { side: "left", sprite: "assets/chars/doghead10_front.png", name: "人身狗头" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "人身狗头怪物回我——",
    },
    {
      type: "say",
      speaker: "人身狗头",
      sprite: "assets/chars/doghead10_front.png",
      side: "left",
      text: "人类什么时候停止对动物的虐杀？",
      slots: [
        { side: "left", sprite: "assets/chars/doghead10_front.png", name: "人身狗头" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "气氛正尴尬时，楼下传来凄厉的呼救声。\n人身狗头怪物狰狞一笑——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "人身狗头",
      sprite: "assets/chars/doghead10_front.png",
      side: "left",
      text: "瞧，你们卑劣的人类，不仅杀异类，还杀同类，又开始自相残杀咯。",
      slots: [
        { side: "left", sprite: "assets/chars/doghead10_front.png", name: "人身狗头" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    { type: "horror", set: 28 },

    // —— 18 9 层陷阱 ——
    { type: "scene", scene: "floor09_outside" },
    {
      type: "narration",
      text: "与此同时，楼下惨叫停止，机械音响起播报——",
      clearSprites: true,
    },
    { type: "system", text: "初始玩家：30 人；存活玩家：5 人。" },
    { type: "horror", set: 32 },
    {
      type: "narration",
      text: "仅剩 5 人？\n我和在场两名新玩家面面相觑。其中一名还是当初在楼底哭泣的学生妹。\n我们这里占了 3 人，这意味着，9 层到 1 层，仅剩 2 人存活。",
    },
    {
      type: "narration",
      text: "我联想到一些不好的事情，打开手机，玩家群里死一般的沉寂。\n我打头阵，学生妹紧随其后，健身教练断后，我们一行三人小心翼翼地朝下走去。",
    },
    {
      type: "bgm",
      src: "assets/music/echoes_of_lumen-horror-ambient-dark-atmosphere-586983.mp3",
      loop: true,
    },
    {
      type: "narration",
      text: "刚踩上 9 层的地板，一个透明罩子就朝我们三人罩下。\n与此同时，墙后走出一男一女。他们手持绚丽的枪支，脸上露出张狂的笑意——",
      clearSprites: true,
    },
    { type: "horror", set: 45 },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "left",
      text: "交出你们全部的拜访卡片。\n否则，我们就把你们和楼下这些愚蠢的家伙一样，都给弄死！",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/junge_front.png", name: "俊哥" },
      ],
    },
    {
      type: "narration",
      text: "正是红姐和俊哥。\n从一开始，红姐和俊哥就是一个唱红脸，一个唱白脸，试图博得玩家们的信任。",
      clearSprites: true,
    },
    {
      type: "choice",
      id: "branch_floor09",
      progress: "§18 岔路 · 九层陷阱",
      prompt: "红姐命令你交出全部拜访卡片。你打算——",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
      options: [
        {
          id: "canon",
          label: "解开外套，掏出家人给的菜刀反杀。",
          canon: true,
        },
        {
          id: "hog_surrender",
          label: "把卡片交出去求饶。",
          ending: "hog_slaughter",
        },
        {
          id: "hog_barehand",
          label: "空着手硬刚。",
          ending: "hog_slaughter",
        },
      ],
      plotHint:
        "九层是陷阱：红姐俊哥要卡片是为了屠宰。正史用家人给的「爱的屠刀」反杀。交卡片或空手硬刚都会被宰。禁止写成还能通关或靠嘴炮过关。",
    },
    {
      type: "narration",
      text: "红姐给我发私信，其实有后半段没说。\n当初明神并非枉死，至少给后面的玩家提供了一条截至第六天的游戏思路。",
    },
    {
      type: "narration",
      text: "让玩家尽可能多地存活到第四天，其实不一定依靠要攻略邻居拿到所有拜访卡片。\n因为并不是所有玩家都和我一样好运，一下子能拥有这么多杀伤力道具震慑住诡异。甚至也没有看到楼底的报纸，无法从心灵层面说服诡异们。\n所以，还有另外一种办法。抢夺与吞噬。\n从第四天开始，只要玩家 A 杀死玩家 B，则玩家 A 同样会获得 B 层诡异的拜访卡片，并且会继承玩家 B 已经拥有的拜访卡片。",
    },
    {
      type: "narration",
      text: "所以，这就跟养猪一样。\n只要 A 把这头叫 B 的猪养肥养大，然后又弱于 A，最后 A 就能捡漏。\n而我们所有人，都是红姐和俊哥养的猪。\n我意外成了猪王。",
    },
    { type: "horror", set: 20 },

    // —— 19 反杀 ——
    {
      type: "narration",
      text: "呸呸呸！\n说白了，在恐怖游戏的规则里，是允许且支持自相残杀的。\n只是，这次，红姐和俊哥看走眼了。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "我解开外套，露出红色长裙，从裙摆下拎出断头 Boss 的菜刀、肠子、枯手。",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_red_dress.png",
      side: "right",
      text: "说来听听，你们想怎么弄死我？",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "我举着菜刀随意挥了挥，S 级防护罩道具破损毁灭。\n红姐和俊哥的脸也一寸寸龟裂。\n直到最后，他们彻底瘫倒在地。",
      clearSprites: true,
    },
    { type: "horror", set: 12 },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "left",
      text: "宁念，我错了，我错了，我只是太想复活了，求求你不要杀我们，饶我们一命！",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/junge_front.png", name: "俊哥" },
      ],
    },
    {
      type: "narration",
      text: "我丝毫没有留情，也不顾他们的求饶，只是淡淡地问——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_red_dress.png",
      side: "right",
      text: "楼下那些玩家，也这样求过你们的吧？你们放过他们了吗？",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "最后，生锈菜刀仿佛有自主意识一般，朝着他们挥去。钝刀子割肉，一刀一刀都能把他们砍死。\n可刀还没碰到他们，看到这个 SSSSS 级的道具朝自己飞来，红姐和俊哥的惊悚值就直接飙升至 100，爆体而亡，魂飞魄散，甚至没有留下一丝血腥味。",
      clearSprites: true,
    },
    {
      type: "bgm",
      src: "assets/music/obaachan-no-ie.mp3",
      loop: true,
    },
    {
      type: "narration",
      text: "最后，我把那杀气腾腾的菜刀搂在怀里，低声安抚某人——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_red_dress.png",
      side: "right",
      text: "好啦，不气不气，我没有受伤。",
    },
    {
      type: "narration",
      text: "我把红姐和俊哥两人依靠杀同伴收集的拜访卡片让给了学生妹和健身教练。\n好心交代他们现在还有时间，可以去拜访 20 层-30 层的诡异。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_red_dress.png",
      side: "right",
      text: "如果诡异针对你们，就说你们是 30 层宁念的朋友，她叫你们上来拿卡片的。",
    },
    {
      type: "narration",
      text: "我相信，我苦口婆心和诡异们谈了这么久，应该能给我一分薄面吧？\n学生妹和健身教练感激不已，连连对我鞠躬。我急忙避开，三个人搁这跳探戈一样。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "我独自往下，收集自己需要的拜访卡片。\n再往下就更容易了。我一路几乎畅通无阻，几分钟集齐全部卡片。\n可是，我的耳边并没有响起游戏提示音。我知道，我还缺了最关键的那一张：30 层的卡片，30 层的故事。\n可是，我不是傻瓜。",
      clearSprites: true,
    },
    { type: "horror", set: 5 },
    {
      type: "narration",
      text: "这些天相处，他们的故事我早就知道了啊。",
      clearSprites: true,
    },
  ],
};
