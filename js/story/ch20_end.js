/**
 * 全文第 20～25 节（30 层故事 / 第七天 / 异世之门通关）
 *
 * 本章连续播放至通关，无探索暂停。
 */
window.STORY_CH20_END = {
  id: "ch20_end",
  chars: {
    ningnian: "assets/chars/ningnian_red_dress.png",
    boss: "assets/chars/boss_front.png",
    sisi: "assets/chars/sisi_front.png",
    sisiBlood: "assets/chars/sisi_blood_front.png",
    yeye: "assets/chars/yeye_patched_front.png",
    nainai: "assets/chars/nainai_front.png",
    suxiaomo: "assets/chars/suxiaomo_front.png",
    fangyuan: "assets/chars/fangyuan_front.png",
  },
  beats: [
    // —— 19 尾～20 三十层的故事（回忆，尚未归家）——
    { type: "scene", scene: "floor09_outside" },
    {
      type: "narration",
      text: "他们的确曾经是四个毫不相干的陌生人。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "思思是在雨天放学后，好心帮成年男性撑伞，最后却被伤害被杀死的小女孩。",
    },
    {
      type: "narration",
      text: "肠老头是坐公交被污蔑的「老色狼」，最后担心女孩安全，还不计前嫌帮那个女孩制服真正的坏人，最后自己却被捅穿了肚子，肠子流了一地。",
    },
    {
      type: "narration",
      text: "黑老太是小区着火，儿子明明懂怎么用灭火器和消防器材，却因为消防栓没水，不得不亲眼看着自己的母亲被活生生地烧死。",
    },
    {
      type: "narration",
      text: "断头大 Boss 是大型邪神组织成员的亲生儿子，成绩优异，名校毕业，好不容易逃离原生家庭。\n可他的父母被洗脑，听说吃亲生儿子的脑髓，能长生不老。于是趁儿子不备，夫妻俩拿钝刀子砍下儿子的头，当真去敲骨取髓。",
    },
    {
      type: "narration",
      text: "而我能和他们在这里重逢，组成怪异又别扭的一家人，或许也不是意外。\n其实，在我车祸前一天，我发了工资，蹦蹦跳跳路过一座公墓。不知怎的，我突发奇想，就去附近的花店买了四束花，随机挑选了四座连在一起的墓，送给了故去的人。",
    },
    {
      type: "narration",
      text: "我记得，那四个墓碑上的名字，分别是：秦思思。刘爱国。李翠兰。吴名。\n原来，他真的是无名。",
    },
    { type: "horror", set: 2 },

    // —— 21 回家 ——
    { type: "scene", scene: "floor30_door_open" },
    {
      type: "narration",
      text: "回到 30 层，我恢复正常，又没心没肺地笑起来。\n走到门口一看，门开着。\n也是，从我出门开始，这扇门就没有锁过。\n他们一直在等我回来。",
      clearSprites: true,
    },
    { type: "scene", scene: "floor30_living" },
    { type: "variant", scene: "floor30_living", variant: "clean", withFade: false },
    {
      type: "narration",
      text: "客厅里坐着面带笑容的老老少少，他们做了一桌子美食，泡着我最爱喝的茶饮。\n几个人拉着我的手，让我众星捧月般地坐下。然后笑眯眯地说——",
    },
    {
      type: "say",
      speaker: "家人",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "刚刚你那两位朋友上来，我们已经把拜访卡片给他们啦。\n接下来，你的第七天属于我们。让我们做一天真正的一家人吧！",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    { type: "horror", set: 0 },

    // —— 22 第七天 ——
    {
      type: "narration",
      text: "一天何其快乐，可一天又何其短暂。\n晚饭过后，夜幕降临。黑老太挥了挥手臂，在夜空划过星火，如同烟花。我急忙吹彩虹屁——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_red_dress.png",
      side: "right",
      text: "老妈可真厉……",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "一双手轻轻捧起我的脸，一个温软的唇落在我额头上。\n他的脸红得似乎要滴血，却还盯着我的唇，踟蹰着问——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "我可以吗？",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "要命，这种事还要问。非要人家一个女孩子主动，真是羞死个人了。\n我快速踮起脚，一把搭住他的肩，狠狠咬住他的唇。随后，缓缓加深这个吻。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "气息交融时，只见断头大 Boss 猛地推开我，眼疾手快地一把拔下他的头。\n猛地塞到我手里，眼神真诚得像一只大狗狗——",
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_head.png",
      side: "right",
      text: "这、这样做，你就不用踮脚那么累了。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_head.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "我星星眼地捧起他的头颅，温柔地亲吻，唇齿交融——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_soothe.png",
      side: "left",
      text: "唔，老公真的好聪明呢。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_soothe.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_head.png", name: "断头" },
      ],
    },
    { type: "danmaku", text: "……" },
    { type: "danmaku", text: "不是，哥，我嗑得正欢呢！你想吓死谁？" },
    { type: "danmaku", text: "这对臭情侣什么都好，就是过于变态而不自知。" },
    {
      type: "narration",
      text: "恩爱过后，断头大 Boss 朝我手里塞了一张卡片。\n30 张卡，集齐。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "我看着手中的卡片图案，拼拼凑凑，顺着纹路，快速在地上把它们摆好。\n一扇漆黑的门的图案，在面前徐徐展开。",
    },
    {
      type: "narration",
      text: "与此同时，机械音在我耳边欢快地响起——",
    },
    {
      type: "system",
      text: "恭喜玩家宁念，获得「幸福之家」全部居民的喜爱，成功召唤异世之门。\n异世之门将在今晚十一点出现，请幸存玩家带着家人，准时前往一楼，打开异世之门离开。过时不候，否则玩家将永久迷失在该副本。",
    },
    {
      type: "narration",
      text: "弹幕激动得大吼——",
    },
    { type: "danmaku", text: "明天要见证历史了！「幸福之家」的首通！" },
    {
      type: "narration",
      text: "可是，想到要离开，我似乎并没有想象中那么开心呢。",
      clearSprites: true,
    },
    { type: "bgm", stop: true },

    // —— 23～25 三道门 ——
    { type: "scene", scene: "floor01_outside" },
    {
      type: "bgm",
      src: "assets/music/forget_me_not.mp3",
      loop: true,
    },
    {
      type: "narration",
      text: "晚上十一点，四大「护法」拉着我，抵达了一楼。",
      clearSprites: true,
    },
    { type: "scene", scene: "three_doors" },
    { type: "variant", scene: "three_doors", variant: "locked", withFade: false },
    {
      type: "narration",
      text: "原本是铜墙铁壁的一楼院墙，现在上面赫然开着三扇古朴的黑色大门。\n每一扇门上面挂着不同数量的锁。",
    },
    {
      type: "narration",
      text: "我上面挂了 4 把，学生妹挂了 1 把，健身教练挂了 2 把。\n我隐隐猜到了什么。门上面分别写着玩家的名字，名字下方，还标记着惊悚值。",
    },
    {
      type: "narration",
      text: "我的：【宁念，惊悚值：0。】\n学生妹的：【苏小茉，惊悚值：99.9。】\n健身教练的：【方远，惊悚值：90。】",
    },
    {
      type: "narration",
      text: "其余两人皆震惊地看着我，似乎不理解我是怎么做到的。\n这……诡异明明很可爱也很温柔啊，有什么好怕的？",
    },
    {
      type: "narration",
      text: "机械音再度响起，语气有些幸灾乐祸的味道——",
    },
    {
      type: "system",
      text: "请问，各位玩家，是否要喂食钥匙，打开异世之门呢？\n仅限今晚十二点之前哦，各位还有一个小时时间，否则将永远迷失在该副本。",
    },
    {
      type: "narration",
      text: "钥匙？除了 30 层的家门钥匙，我没有别的钥匙。\n可是，大门上的锁孔都是心形的，一看就插不进去。\n我有些颓废地蹲在地上，托着下巴，可怜兮兮地对断头大 Boss、思思、肠老头和黑老头撒娇——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_red_dress.png",
      side: "right",
      text: "哎呀，怎么办呢？没有钥匙，我回不去了，我可以永远留下来陪你们了。",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "嘻嘻，真开心。",
      clearSprites: true,
    },
    { type: "horror", set: 8 },
    {
      type: "narration",
      text: "断头大 Boss 忽然抬起我的下巴，半蹲下身体，平视着我，眼中一片诡异的赤红——",
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "left",
      text: "宁念，你猜到了钥匙是什么，所以才这么抗拒，对吗？\n可是，你不知道，如果你迷失在这里，你并不会变成我们诡异中的一员，你只会变成四周的一缕黑雾。",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "left",
      text: "而你们所谓的恐怖游戏世界，全都充斥着这样的黑雾。\n它们没有情感，没有灵识，没有思想，甚至不能算一个东西。",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "left",
      text: "宁念，那样，我将会永远失去你。\n如果这样，还不如，你先短暂地失去我一段时间。",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "flavorChoice",
      id: "flavor_boss_farewell",
      mode: "farewell",
      optionCount: 3,
      progress: "§24 岔口 · 不舍",
      prompt: "断头说宁可让她短暂失去他。宁念舍不得——",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
      npcHint:
        "断头：平视她、眼中赤红，认真、温柔、决绝。宁念舍不得走、直球心软，刚说想留下来陪他们。",
      plotHint:
        "异世之门前。宁念刚说没有钥匙、可以永远留下。断头刚说：活人留下不会变成诡异，只会化成没有情感的黑雾；化雾的是宁念，断头不会化雾。宁可让她先短暂失去他。正史下一句是他掏出火红心脏喂进锁眼。本场不是误会喜剧。禁止已经掏心。禁止答应让她留下并真的化雾。禁止宁念对他说「你别变成黑雾」。禁止写成普通分手拌嘴。思思、肠大爷、黑老太、方远、苏小茉不要开口。",
      forbid: /你别变成|你变成黑雾|别让你变成|断头变成|宁君安|幸福之心|爱的屠刀|宰相肚肠/,
      resumeHint: "话音刚落，他抬起掌心猛地插进自己胸口，掏出一颗跳动的火红心脏。",
    },
    {
      type: "narration",
      text: "话音刚落，男人忽然抬起掌心，猛地插进自己胸口，掏出了一颗跳动的、火红的心脏，随手丢进了我门上的其中一个锁眼里。\n那把锁突然变成一个大头怪兽，把心脏吞噬得干干净净。「啪嗒」一声，锁开了第一把。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "机械音此时也有些愣住了，语气带着莫名的恐惧——",
    },
    {
      type: "system",
      text: "那么，请问其余尊贵的诡异大人们，是否愿意奉献您的「幸福之心」，帮助您的家人打开这扇异世之门呢？",
    },
    {
      type: "narration",
      text: "是的，其实打开门的钥匙，就是诡异家人们的心。而且，必须是所谓的「幸福之心」。",
      clearSprites: true,
    },
    {
      type: "bgm",
      src: "assets/music/echoes_of_lumen-horror-ambient-dark-atmosphere-586983.mp3",
      loop: true,
    },
    {
      type: "narration",
      text: "方远和苏小茉哀求地看向他们的诡异家人。",
    },
    {
      type: "narration",
      text: "可那三只诡异齐齐摇头——",
    },
    {
      type: "say",
      speaker: "诡异家人",
      text: "抱歉，我们的心不是红色的，不是幸福之心。",
    },
    {
      type: "narration",
      text: "说着，顺手剖开自己的胸膛。\n果然，是三颗死寂的、黑色的心脏。",
    },
    {
      type: "narration",
      text: "玩家在角色扮演时，总归是抱着害怕、恐惧、忍耐的想法去做任务的。\n因此，七天下来，导致诡异们的心里并没有得到真正的幸福。\n这也是副本的歹毒之处。",
    },
    { type: "horror", set: 25 },
    {
      type: "narration",
      text: "方远忽然崩溃了，口中疯喊了一句——",
    },
    {
      type: "say",
      speaker: "方远",
      sprite: "assets/chars/fangyuan_front.png",
      side: "right",
      text: "什么狗屁幸福之心，那不就是活人的心脏吗？我也有！",
      slots: [
        { side: "left", sprite: "assets/chars/suxiaomo_front.png", name: "苏小茉" },
        { side: "right", sprite: "assets/chars/fangyuan_front.png", name: "方远" },
      ],
    },
    {
      type: "narration",
      text: "他不敢对诡异动手，于是，趁苏小茉不察，直接把她整个人丢向他自己的门。\n方远门上的其中一把锁立刻变成一个大头怪兽，一口就把尖叫着的苏小茉吞了下去。\n连皮带骨，吃了个干净。我甚至都没来得及阻止。",
      clearSprites: true,
    },
    { type: "horror", set: 40 },
    {
      type: "narration",
      text: "方远又癫狂地把目光投向我，似乎也想把我丢进去，毕竟他要开两道锁。\n思思嗤笑一声，白裙无限变大，变成了一个活体绞肉机，一口咬住方远。\n不消片刻，漫天飞舞的都是红色碎肉，鲜血把白裙染成了红色。",
    },
    {
      type: "narration",
      text: "思思对着漫天血肉低语——",
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_blood_angry.png",
      side: "left",
      text: "本来在妈妈离开之前想做一个乖孩子，可惜你非要找死。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_blood_angry.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_protect_sisi.png", name: "宁念" },
      ],
    },
    {
      type: "bgm",
      src: "assets/music/forget_me_not.mp3",
      loop: true,
    },
    {
      type: "narration",
      text: "然后，她忽然扬起可爱的小脸，伸出白嫩的手臂，迅速掏出她的心脏，朝我门上的第二把锁丢去——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_blood_front.png",
      side: "left",
      text: "妈妈，思思也舍不得你，但是，思思更希望你鲜活地活着，即使那个地方没有思思，而不是变成一缕黑雾。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_blood_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "flavorChoice",
      id: "flavor_sisi_farewell",
      mode: "farewell",
      optionCount: 3,
      progress: "§25 岔口 · 思思不舍",
      prompt: "思思说希望妈妈鲜活地活着。宁念舍不得——",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_blood_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
      npcHint:
        "思思：婴儿腔、认宁念为妈妈，刚咬死方远，血红裙子，舍不得妈妈但更要她活着。宁念当亲生女儿，直球心软。",
      plotHint:
        "异世之门前。思思已掏出心脏扔向第二把锁，边扔边说舍不得、要妈妈鲜活地活着而不是变成黑雾。化成黑雾的是宁念（活人留下会化雾），思思是诡异家人，不会变成黑雾。宁念的台词禁止说「你别变成黑雾」「别让思思变成黑雾」。正史下一句是肠大爷和黑老太同样献心开第三、四把锁。本场不是误会喜剧。禁止再写一遍掏心。禁止答应让妈妈留下并真的化雾。禁止肠大爷、黑老太、断头、方远开口。",
      forbid: /你别变成|你变成黑雾|别让你变成|别让思思变成|思思变成黑雾|宁君安|幸福之心|爱的屠刀|宰相肚肠|肠大爷|黑老太|方远/,
      resumeHint: "肠老头和黑老太也如法炮制，打开了我的第三把和第四把锁。",
    },
    {
      type: "narration",
      text: "肠老头和黑老太也如法炮制，打开了我的第三把和第四把锁。",
      clearSprites: true,
    },
    { type: "variant", scene: "three_doors", variant: "open" },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_front.png",
      side: "left",
      text: "好孩子，如果有朝一日你能见到我孩子，告诉他，消防栓没水，不是他的错。",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
      ],
    },
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_patched_front.png",
      side: "right",
      text: "也告诉我的孩子，她的爸爸是个救人的大英雄，不是老色狼。",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
      ],
    },
    {
      type: "say",
      speaker: "公婆",
      sprite: "assets/chars/nainai_front.png",
      side: "left",
      text: "好孩子，你千万别吃醋，你就仿佛是我们新生下来的孩子，爸爸妈妈永远爱你。",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
      ],
    },
    {
      type: "narration",
      text: "我的眼泪一滴一滴落下。漆黑的铁门里，爆发出刺眼的白光。\n我依旧是个高度近视眼。可这次，我精准地扑向他们，死死抱住他们，哭着问——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_red_dress.png",
      side: "right",
      text: "没了心脏，你们会不会死？",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "断头大 Boss 紧紧搂住我，黑眸中满是柔情——",
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "left",
      text: "不会的，我们只是会失去所有记忆，不知道被丢到哪个副本打工而已。\n但是，只要再次重逢，我一定会想起你。",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "妈妈，思思也是！",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_red_dress.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_patched_front.png",
      side: "left",
      text: "好孩子，我们也是！",
      slots: [
        { side: "left", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
        { side: "right", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
      ],
    },
    {
      type: "narration",
      text: "最后，十二点的钟声敲响，四双大手齐齐把我推向铁门。\n我听见四道温柔眷恋的声音同时响起——",
      clearSprites: true,
    },
    { type: "scene", scene: "family_photo" },
    {
      type: "say",
      speaker: "家人",
      text: "好好照顾自己，别害怕，下次再见。",
    },
    {
      type: "narration",
      text: "我听见聒噪的机械音在我耳边絮絮叨叨——",
    },
    {
      type: "system",
      text: "恭喜玩家宁念在「幸福之家」副本圆满通关，获得 100 积分。\n恭喜玩家宁念在「幸福之家」副本达成首通成就，额外获得 500 积分。",
    },
    {
      type: "narration",
      text: "我没搭理机械音，贪婪地看向光外模糊不清的身影，视线定格在那道黑影上。\n这次，我看清了，他眼角染着泪痕，在对我笑。\n我双手合起喇叭，冲他大喊——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_red_dress.png",
      side: "right",
      text: "我想好了！你的名字！\n宁！君！安！",
    },
    {
      type: "narration",
      text: "万里迢迢，唯念君安。",
      clearSprites: true,
      progress: "结局 · 唯念君安",
    },
    { type: "horror", set: 0 },
  ],
};
