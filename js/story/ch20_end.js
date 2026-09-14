/**
 * 全文第 20～25 节（30 层故事 / 第七天 / 异世之门通关）
 *
 * 本章连续播放至通关，无探索暂停。
 */
window.STORY_CH20_END = {
  id: "ch20_end",
  chars: {
    ningnian: "assets/chars/ningnian_front.png",
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
      text: "肠老头是坐公交被污蔑的「老色狼」，最后担心女孩安全，还不计前嫌帮她制服坏人，\n自己却被捅穿肚子，肠子流了一地。",
    },
    {
      type: "narration",
      text: "黑老太是小区着火——儿子明明懂灭火，却因为消防栓没水，\n不得不亲眼看着母亲被活生生烧死。",
    },
    {
      type: "narration",
      text: "断头是邪神组织成员的亲生儿子，成绩优异，名校毕业，好不容易逃离原生家庭。\n可父母被洗脑，听说吃亲生儿子脑髓能长生不老，趁他不备，用钝刀子砍下他的头，当真去敲骨取髓。",
    },
    {
      type: "narration",
      text: "而我能和他们在这里重逢，组成怪异又别扭的一家人，或许也不是意外。\n车祸前一天，我发了工资，路过公墓，买了四束花，随机送给四座连在一起的墓——",
    },
    {
      type: "narration",
      text: "墓碑上的名字：秦思思。刘爱国。李翠兰。吴名。\n原来，他真的是无名。",
    },
    { type: "horror", set: 2 },

    // —— 21 回家 ——
    { type: "scene", scene: "floor30_door_open" },
    {
      type: "narration",
      text: "回到 30 层，我恢复正常，又没心没肺地笑起来。\n走到门口一看，门开着——从我出门起，这扇门就没有锁过。他们一直在等我回来。",
      clearSprites: true,
    },
    { type: "scene", scene: "floor30_living" },
    { type: "variant", scene: "floor30_living", variant: "clean", withFade: false },
    {
      type: "narration",
      text: "客厅里坐着面带笑容的老老少少，做了一桌子美食，泡着我最爱喝的茶饮。\n几个人拉着我的手，让我众星捧月般坐下——",
    },
    {
      type: "say",
      speaker: "断头",
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
      text: "一天何其快乐，可一天又何其短暂。\n晚饭过后，夜幕降临。黑老太挥臂在夜空划过星火，如同烟花。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "老妈可真厉……",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "一双手轻轻捧起我的脸，温软的唇落在额头上。\n他脸红得要滴血，却还盯着我的唇，踟蹰着问——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "我可以吗？",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "要命，这种事还要问。\n我快速踮脚，一把搭住他的肩，狠狠咬住他的唇，随后缓缓加深这个吻。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "气息交融时，断头猛地推开我，眼疾手快拔下自己的头，塞到我手里，眼神真诚得像一只大狗狗——",
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_head.png",
      side: "right",
      text: "这、这样做，你就不用踮脚那么累了。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_head.png", name: "断头" },
      ],
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
      text: "恩爱过后，断头朝我手里塞了一张卡片。\n30 张卡，集齐。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "我看着手中卡片图案，拼拼凑凑，顺着纹路在地上摆好——\n一扇漆黑的门的图案，在面前徐徐展开。",
    },
    {
      type: "system",
      text: "恭喜玩家宁念，获得「幸福之家」全部居民的喜爱，成功召唤异世之门。\n异世之门将在今晚十一点出现，请幸存玩家带着家人，准时前往一楼打开异世之门离开。过时不候，否则将永久迷失在该副本。",
    },
    { type: "danmaku", text: "明天要见证历史了！「幸福之家」的首通！" },
    {
      type: "narration",
      text: "可是，想到要离开，我似乎并没有想象中那么开心。\n时间很快到了晚上十一点——四大「护法」拉着我前往一楼。",
      clearSprites: true,
    },

    // —— 23～25 三道门 ——
    { type: "scene", scene: "floor01_outside" },
    {
      type: "narration",
      text: "我们抵达一楼楼梯间。",
      clearSprites: true,
    },
    { type: "scene", scene: "three_doors" },
    { type: "variant", scene: "three_doors", variant: "locked", withFade: false },
    {
      type: "narration",
      text: "原本铜墙铁壁的院墙，现在赫然开着三扇古朴的黑色大门。\n每一扇门上挂着不同数量的锁。",
    },
    {
      type: "narration",
      text: "我上面挂了 4 把，学生妹挂了 1 把，健身教练挂了 2 把。\n门上写着玩家名字，下方标记着惊悚值——",
    },
    { type: "system", text: "【宁念，惊悚值：0。】\n【苏小茉，惊悚值：99.9。】\n【方远，惊悚值：90。】" },
    {
      type: "narration",
      text: "其余两人皆震惊地看着我，似乎不理解我是怎么做到的。\n这……诡异明明很可爱也很温柔啊，有什么好怕的？",
    },
    {
      type: "system",
      text: "请问，各位玩家，是否要喂食钥匙，打开异世之门呢？\n仅限今晚十二点之前哦，各位还有一个小时时间，否则将永远迷失在该副本。",
    },
    {
      type: "narration",
      text: "钥匙？除了 30 层家门钥匙，我没有别的。\n可大门上的锁孔都是心形的，一看就插不进去。",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "哎呀，怎么办呢？没有钥匙，我回不去了，我可以永远留下来陪你们了。",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "嘻嘻，真开心。",
      clearSprites: true,
    },
    { type: "horror", set: 8 },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "left",
      text: "宁念，你猜到了钥匙是什么，所以才这么抗拒，对吗？\n可是如果你迷失在这里，你并不会变成我们诡异中的一员，你只会变成四周的一缕黑雾。",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
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
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_chest.png",
      side: "left",
      text: "宁念，那样，我将会永远失去你。\n如果这样，还不如，你先短暂地失去我一段时间。",
      slots: [
        { side: "left", sprite: "assets/chars/boss_chest.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "话音刚落，他抬起掌心猛地插进自己胸口，掏出一颗跳动的火红心脏，\n随手丢进我门上其中一个锁眼——锁变成大头怪兽，把心脏吞噬干净。「啪嗒」，第一把锁开了。",
      clearSprites: true,
    },
    {
      type: "system",
      text: "请问其余尊贵的诡异大人们，是否愿意奉献您的「幸福之心」，帮助您的家人打开这扇异世之门呢？",
    },
    {
      type: "narration",
      text: "打开门的钥匙，就是诡异家人们的心——必须是「幸福之心」。\n方远和苏小茉哀求地看向他们的诡异家人。\n可那三只诡异齐齐摇头：心不是红色的，不是幸福之心。剖开胸膛，果然是三颗死寂的黑心。",
    },
    {
      type: "narration",
      text: "玩家总抱着害怕、恐惧、忍耐去做任务，七天下来，诡异心里并没有得到真正的幸福。\n这也是副本的歹毒之处。",
    },
    { type: "horror", set: 25 },
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
      text: "他不敢对诡异动手，趁苏小茉不察，直接把她整个人丢向自己的门。\n其中一把锁变成大头怪兽，一口把尖叫着的苏小茉吞了下去——连皮带骨。\n我甚至没来得及阻止。",
      clearSprites: true,
    },
    { type: "horror", set: 40 },
    {
      type: "narration",
      text: "方远又癫狂地投向我。思思嗤笑一声，白裙无限变大，变成活体绞肉机，一口咬住方远。\n不消片刻，漫天飞舞的都是红色碎肉，鲜血把白裙染红。",
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
      type: "narration",
      text: "她忽然扬起小脸，掏出心脏，朝我门上第二把锁丢去——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_blood_front.png",
      side: "left",
      text: "妈妈，思思也舍不得你，但是思思更希望你鲜活地活着——\n即使那个地方没有思思，而不是变成一缕黑雾。",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_blood_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "肠老头和黑老太也如法炮制，打开第三把和第四把锁。",
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
      text: "我的眼泪一滴一滴落下。漆黑的铁门里爆发刺眼白光。\n我依旧高度近视——可这次精准扑向他们，死死抱住，哭着问——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "没了心脏，你们会不会死？",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "left",
      text: "不会的，我们只是会失去所有记忆，不知道被丢到哪个副本打工而已。\n但是，只要再次重逢，我一定会想起你。",
      slots: [
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
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
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
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
      text: "十二点的钟声敲响，四双大手齐齐把我推向铁门。\n我听见四道温柔眷恋的声音同时响起——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "家人",
      text: "好好照顾自己，别害怕，下次再见。",
    },
    {
      type: "system",
      text: "恭喜玩家宁念在「幸福之家」副本圆满通关，获得 100 积分。\n恭喜玩家宁念在「幸福之家」副本达成首通成就，额外获得 500 积分。",
    },
    {
      type: "narration",
      text: "我没搭理机械音，贪婪地看向光外模糊不清的身影，视线定格在那道黑影上。\n这次，我看清了——他眼角染着泪痕，在对我笑。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "我想好了！你的名字！\n宁！君！安！",
    },
    {
      type: "narration",
      text: "万里迢迢，唯念君安。\n\n——「幸福之家」· 完 ——",
      clearSprites: true,
    },
    { type: "horror", set: 0 },
  ],
};
