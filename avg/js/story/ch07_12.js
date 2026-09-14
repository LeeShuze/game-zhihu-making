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
    yeye: "assets/chars/yeye_front.png",
    yeyePatched: "assets/chars/yeye_patched_front.png",
    nainai: "assets/chars/nainai_front.png",
  },
  beats: [
    // —— 7 安抚思思 / 次日 ——
    { type: "scene", scene: "master_bedroom" },
    {
      type: "narration",
      text: "我叹息一声，试图把这个小诡异的思维扳正——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "他们是谁？他们说这些是他们不对，如果妈妈以后遇到他们，无论怎样，一定会帮思思骂回去打回去。",
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
      type: "flavorChoice",
      id: "flavor_sisi_not_monster",
      mode: "chat",
      progress: "§7 岔口 · 不能说自己",
      prompt: "宁念刚劝思思别骂自己。她还会说——",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
      npcHint:
        "思思：婴儿腔、认宁念为妈妈、刚自称小怪物/小狐狸精；被劝后会黏、会委屈，也会吓人一笑。宁念当亲生女儿护短纠正，高度近视。",
      plotHint:
        "第一夜主卧。思思刚说「我也是小怪物」「他们叫我小狐狸精和小婊砸」，张嘴是被拔光牙的血口，宁念看不清。宁念正把她当女儿扳正思维。禁止宁念看清无牙血嘴或血衣真相。禁止写成没有恐怖错位的普通睡前说教。禁止抢正史下一句：她絮叨着睡着，思思裙子红了又白。肠大爷、毛衣、毛线都未出场。",
      forbid: /毛线|毛衣|肠子|肠大爷|鸡爪|尸食|黑老太|面膜|宁君安/,
      resumeHint: "后来我絮絮叨叨着，不知道怎么就睡着了。",
    },
    {
      type: "narration",
      text: "后来我絮絮叨叨着，不知道怎么就睡着了。\n我不知道的是。在我睡着后，思思紧贴着我，凝视着我的睡颜，裙子红了又白，白了又红。而后低声嘀咕——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "妈妈会伤心的，不能让妈妈伤心。",
    },
    {
      type: "narration",
      text: "弹幕也心惊胆战地刷屏——",
    },
    { type: "danmaku", text: "第一次看到血衣萝莉的鬼气波动这么大！最后裙子居然一直是白色了，没有变过。" },
    { type: "danmaku", text: "我靠，这个新玩家改变了血衣萝莉的属性，有两把刷子啊！" },
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
      hint: "自由探索中。在主卧点击思思可继续剧情（进入第二天）。家里也可能遇到其他家人闲聊。",
      progress: "§7 第一夜之后",
      resumeNpc: {
        scene: "master_bedroom",
        name: "思思",
        sprite: "assets/chars/sisi_front.png",
        area: { x: 62, y: 10, w: 24, h: 80 },
        bubble: "思思",
        prompt: "是否继续剧情？",
      },
    },
    {
      type: "narration",
      text: "第二天，我是被机械音播报吵醒的。",
      clearSprites: true,
    },
    { type: "system", text: "初始玩家：30 人；现存活：15 人。" },
    {
      type: "narration",
      text: "我迷迷糊糊地拿起手机，看到玩家群里在讨论昨晚又死了 5 个人。\n三人死于诡异之手。两人不知道经历了什么，惊悚值直达 100，也没了。",
    },
    { type: "horror", add: 3 },
    {
      type: "narration",
      text: "我忽然收到红姐给我发来的私聊——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "right",
      text: "宁念，你还好吗？昨天我一直在和二层的诡异交锋，一直没来得及跟你说——前三天，你一定要抓紧时间攻略自己的「家人」。\n我看过当初明神的直播，这是我已知的信息，就当给你的补偿了。怪我没有提前说选房规则，导致你不得不住在 30 层。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_phone.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
      ],
    },
    {
      type: "narration",
      text: "除此之外，红姐还在群里给不少新玩家提建议。俊哥则偶尔出来骂一句——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "俊哥",
      sprite: "assets/chars/junge_front.png",
      side: "right",
      text: "干吗告诉这些新玩家，我看你就是太善良，帮助他们对我们又没什么好处。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_phone.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/junge_front.png", name: "俊哥" },
      ],
    },
    {
      type: "narration",
      text: "红姐则打字劝慰——",
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "right",
      text: "相识一场不容易，别这样计较。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_phone.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
      ],
    },
    {
      type: "narration",
      text: "于是，生存下来的玩家都对红姐感恩戴德。\n这两个老玩家，有点意思。\n我微微一笑，把脸贴到屏幕上回复红姐：【我挺好的，多谢关心。】",
    },
    { type: "scene", scene: "floor30_living" },
    {
      type: "narration",
      text: "断头大 Boss 一手拎着自己的脑袋，一手拎着身穿白裙子的思思，正在举「哑铃」。\n看到我抱着手机，他似乎知道了什么，微微蹙眉——",
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
      text: "一句话没说完，他忽然捂着心口倒下。\n思思皱着小脸，一脸担忧地扶住他。\n我也快速冲过去，用身体接住他。\n副本机制限定 NPC 对玩家透露具体的通关信息。",
      clearSprites: true,
    },
    { type: "horror", set: 12 },

    // —— 8 爷爷奶奶回家 ——
    {
      type: "narration",
      text: "门外响起「咚咚咚」的脚步声，每一脚，似乎都踩在我的神经上，让我耳膜震动。",
    },
    { type: "horror", set: 26 },
    {
      type: "narration",
      text: "思思急忙扑进我怀里，试图一屁股把躺在我怀里的断头大 Boss 挤开——",
    },
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
      type: "narration",
      text: "男人不甘示弱，纹丝不动，犹豫了一下，他立刻拉住我的手，红着脸重复——",
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
      text: "真是一个纯情的大 Boss 啊！\n不怕不怕，反正我也看不清，看不清的一律视为正常人。\n反而很期待新 NPC 上线，助力我通关。看来，是很「健康」的两位老人呐。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "钥匙在锁孔里转动时，直播间的弹幕也开始针尖对麦芒——",
    },
    { type: "danmaku", text: "莫名有点期待肠大爷和黑老太，我不信没人治得了这个宁念。" },
    { type: "danmaku", text: "楼上的你什么心理？如果新玩家能首通，也给后面的我们提供了宝贵经验，不是吗？" },
    {
      type: "narration",
      text: "「啪嗒」一声，门开了。\n迎面走进来两位诡异，他们微微驼着腰，似乎背着两个巨大的蛇皮袋。\n见到断头大 Boss 倒在地上，老太太立刻尖叫着冲过来，一把推开我，嘴里怒骂——",
    },
    { type: "horror", set: 38 },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_front.png",
      side: "left",
      text: "你个黑心肝的毒妇！你怎么敢伤害我儿子的？我要你偿命！",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/yeye_front.png", name: "肠大爷" },
      ],
    },
    {
      type: "narration",
      text: "厉鬼索命，我被黑气萦绕。\n凑近了些，我才看清，老太太无比消瘦，似乎只剩一副骨架子，强撑起这身衣服般。\n头发一根不剩，五官糊成一团，只能清晰地看到嘴巴一张一合。裸露在外的皮肤全部焦黑，像是刚出炉的木炭。\n如果不靠声音，我还真是难以分辨她是一名女性。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "我急忙伸出另一只手，拉住黑老太的木炭手，心疼地说——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_soothe.png",
      side: "right",
      text: "妈，您的皮肤怎么干燥成这样？\n昨晚我自己用黄瓜做了一套面膜，要不要拿来给您试试？",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/ningnian_soothe.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "正在骂骂咧咧的黑老太一愣，而后结结巴巴地说——",
    },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_front.png",
      side: "left",
      text: "啊，也、也行……",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/ningnian_soothe.png", name: "宁念" },
      ],
    },
    { type: "horror", set: 18 },

    // —— 9 肠大爷与「毛衣」 ——
    {
      type: "narration",
      text: "果然，哪有女人不爱美呢？\n见我真的端出一盆黄瓜开始给黑老太敷面膜，老头子不乐意了。",
    },
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_front.png",
      side: "right",
      text: "死老太婆，你不是说，要好好吓唬吓唬新来的儿媳吗？",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/yeye_front.png", name: "肠大爷" },
      ],
    },
    {
      type: "narration",
      text: "我定定地看着断头大 Boss，撇撇嘴——",
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
      text: "男人立刻沉下脸，身上散发出浓浓的黑气，顺手就把黑老太的骷髅头给拧了下来。\n真是哄堂大孝啊！男人冲我扯了扯嘴角，露出一个略带委屈的笑容——",
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
      type: "narration",
      text: "黑老太尴尬地把头装回去，拍了拍脸上的黄瓜，冲老头子阴森地一瞪眼——",
    },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_front.png",
      side: "left",
      text: "死老头子，就你话多，滚去做饭。",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/yeye_front.png", name: "肠大爷" },
      ],
    },
    { type: "scene", scene: "kitchen" },
    {
      type: "narration",
      text: "老头立刻闭嘴，拖着蛇皮袋，还有肚子上的肠子，朝厨房走去。\n他走过的地方，地板又变成了血红色。",
      clearSprites: true,
    },
    { type: "horror", set: 30 },
    {
      type: "narration",
      text: "思思从地上爬起来，非常有礼貌地表示抗拒——",
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "奶奶，对不起，我认为爷爷做的饭实在难吃，还是别……",
    },
    {
      type: "narration",
      text: "话音未落，老头掏了掏肚皮，从厨房甩出来一截肠子，把思思飞速卷了进去。\n老头发出桀桀怪笑——",
    },
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_front.png",
      side: "right",
      text: "乖孙女，还是来陪爷爷做饭吧。",
    },
    {
      type: "narration",
      text: "我看着满地的肠子，回房间开始找针线——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "哎，老爸这毛衣脱线了怎么也不补补呢？",
    },
    { type: "scene", scene: "dining" },
    {
      type: "narration",
      text: "老头饭做好的时候，我针线也找到了。我殷勤地帮老头摆好饭菜，然后一把拉住老头——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "老爸，我帮您补补衣服吧？看您这拖着毛线满地跑，也挺不方便的。\n而且毛线还褪色，我昨天刚拖的地啊！",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/yeye_front.png", name: "肠大爷" },
      ],
    },
    {
      type: "narration",
      text: "四个诡异面面相觑。",
    },
    { type: "danmaku", text: "闹半天，敢情宁念不是胆子大定力强，是眼瞎？" },
    { type: "danmaku", text: "不，我看她的行动，她还是能看清路的，我猜应该是个高度近视。" },
    { type: "danmaku", text: "我愿称她为宁神，给大家开辟了一条意想不到的通关思路。" },
    { type: "danmaku", text: "安静地看，我认为，其实她还是很有智慧的。" },
    {
      type: "narration",
      text: "这句话刚飘过，我就薅住了老头的肠子，开始缝补。\n因为讲究公媳避嫌，我距离他还是有点远的。所以始终没看清是什么，只感觉湿漉漉的，于是抱怨——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_sew.png",
      side: "left",
      text: "这毛线怎么还是湿的？老爸，是不是你刚刚洗菜掉进水池了？",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_sew.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/yeye_front.png", name: "肠大爷" },
      ],
    },
    {
      type: "narration",
      text: "老头也有点不知所措了，干巴巴地应了一句——",
    },
    {
      type: "say",
      speaker: "肠大爷",
      sprite: "assets/chars/yeye_front.png",
      side: "right",
      text: "啊，应、应该吧。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_sew.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/yeye_front.png", name: "肠大爷" },
      ],
    },
    {
      type: "flavorChoice",
      id: "flavor_yeye_patch",
      mode: "chat",
      optionCount: 1,
      optionTopic: "继续动手补这件湿毛衣（缝、补、再补两针），不要改去晾、晒、洗、拧、停手",
      sampleLabel: "我帮你补补吧",
      progress: "§8 岔口 · 补毛衣",
      prompt: "宁念正薅着湿毛线缝补。肠大爷心虚说「应、应该吧」。她还会说——",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_sew.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/yeye_front.png", name: "肠大爷" },
      ],
      npcHint:
        "肠大爷：拖着肠子被宁念当毛衣缝；口吃、心虚、顺着儿媳误会，不会承认那是肠子。宁念高度近视，正坐着缝，嫌毛线湿也还是要补完。",
      plotHint:
        "餐厅。宁念已经说了「老爸，我帮您补补衣服吧」并动手缝他肚子上拖在地上的肠子，当成湿毛衣。他刚承认是洗菜弄湿的。选项和随后对白都必须是继续补/再补两针/湿也先缝上，不要整句重复正史那句，也不许改成晾干、洗净、拧一把、停手。禁止说破肠子/血。禁止抢正史「缝好后大家吃饭」。",
      forbid: /晾|晒|拧|洗干净|丢掉|不补|别补/,
      resumeHint: "等我缝好老头的肚皮后，大家才和（尴）谐（尬）地坐在桌子前准备吃饭。",
    },
    {
      type: "narration",
      text: "等我缝好老头的肚皮后，大家才和（尴）谐（尬）地坐在桌子前准备吃饭。\n见大家不动，我自来熟地夹了一筷子「鸡爪」。\n见我往嘴里送，四个诡异满脸邪恶地盯着我。",
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
      text: "楼下？楼下除了死去的玩家还能有什么？\n我立刻丢下筷子，装模作样地捂着肚子干呕了一声，朝断头大 Boss 身上靠去——",
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
      type: "narration",
      text: "血衣萝莉一脸看好戏的表情。\n肠老头和黑老太满脸惊喜，急忙叫儿子把我抱进房间休息。\n断头大 Boss 则是面红耳赤，抱着我仓皇起身，凑在我耳边低声呵斥——",
      clearSprites: true,
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
      type: "narration",
      text: "太纯情了，连「睡过」这两个字都说不出口。\n见此，我歪倒在他怀里，趁机摸了摸腹肌，也压低声音说——",
      clearSprites: true,
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
    { type: "danmaku", text: "这是我不花钱能看的吗？" },
    {
      type: "danmaku",
      text: "斯哈斯哈，其实断头大 Boss 和念念女鹅真的很配哎，一个外表邪肆内心纯情，一个外表柔弱内心狂野，我宣布，我是你们的 CP 粉！",
    },
    { type: "horror", set: 15 },

    // —— 10 卧室直球 ——
    { type: "scene", scene: "master_bedroom" },
    {
      type: "narration",
      text: "最终，我还是没能睡到断头大 Boss。\n因为一进房间，男人就强忍着脸红，跟我认真地打直球——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "宁念，很抱歉你对我的爱意，虽然时间很短，但我承认，我对你也的确也有不一样的感觉。",
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
      text: "只是，思思是我的孩子，即使这是假的，是你们口中的游戏，我也希望能取得她的赞同再生二胎，这是我身为一位父亲的责任。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "我凝视着男人脖子上的狰狞伤疤，那是他断头的相接处。凑近了，我看得更清楚了。\n其实那甚至不是一道伤疤，而是无数道，像是被一把钝刀子砍了许多次，才被砍断一般。\n这两天，他一直戴着领带，遮挡着。我扯开领带，难以克制地吻了上去。",
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
      type: "narration",
      text: "男人惊慌地想要推开我，又突然想到自己是诡异，怕自己伤了我，有些手足无措。",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "不，一点也不丑。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "我一边亲吻，一边呢喃，一边掉眼泪——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "疼吗？",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "没有哪一刻，我觉得他这样帅。我听见男人低笑，如冰雪消融——",
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
      text: "我假孕骗过了肠老头和黑老太。\n总之，这两天的饭菜都是我亲自下厨做的，用的冰箱里断头大 Boss 买的菜，并没有动老诡异们蛇皮袋里的那些「食材」。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "而为了以假乱真，第二晚开始，我和断头大 Boss 睡到了一起。\n半夜，我正琢磨着怎么勾搭他时，被窝里又适时钻出一张委屈巴巴的小脸——",
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_front.png",
      side: "left",
      text: "妈妈，你不爱思思了，爸爸有什么香的，思思才香！",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
    },
    {
      type: "flavorChoice",
      id: "flavor_sisi_jealous",
      mode: "chat",
      optionCount: 3,
      progress: "§11 岔口 · 思思才香",
      prompt: "思思钻进被窝吃醋。宁念会说——",
      slots: [
        { side: "left", sprite: "assets/chars/sisi_front.png", name: "思思" },
        { side: "right", sprite: "assets/chars/boss_front.png", name: "断头" },
      ],
      extraSlots: [
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
      npcHint:
        "思思：婴儿腔、认宁念为妈妈、对爸爸吃醋、会凶、白裙将红。断头：她亲爹，不太会哄，被瞪得疤要涨。宁念当亲生女儿哄，高度近视，正跟断头睡一起。",
      plotHint:
        "假孕第二天夜里。宁念为骗过肠大爷和黑老太，已经和断头睡到一起。思思从被窝钻出来吃醋，白裙将红、断头脖上的疤在变大，正史下一句是宁念跳起来喊住手并说一起睡。禁止宁念看清血衣/无牙/断头真相。禁止写成没有恐怖错位的普通母女争宠。禁止抢正史「住手你们不要再打了」「我跟你们两个一起睡」。肠大爷、毛衣、毛线、黑老太不在这间房。",
      forbid: /毛线|毛衣|肠子|肠大爷|鸡爪|尸食|黑老太|面膜|宁君安/,
      resumeHint: "说这话时，思思恶狠狠地瞪着男人。眼看着思思的白裙子要变红，男人脖子上的疤痕在变大。",
    },
    {
      type: "narration",
      text: "说这话时，思思恶狠狠地瞪着男人。\n眼看着思思的白裙子要变红，男人脖子上的疤痕在变大，一场恶战在所难免。\n我急忙从床上跳起来大喊——",
      clearSprites: true,
    },
    { type: "horror", set: 20 },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "住手！你们不要再打了啦！不要再打了啦！\n我跟你们两个一起睡就是了啦！",
    },
    {
      type: "narration",
      text: "头三天，安全度过。\n根据系统的实时播报，现在存活玩家只有 12 人了。",
      clearSprites: true,
    },
    { type: "horror", set: 4 },
    { type: "system", text: "初始玩家：30 人；现存活：12 人。" },
    {
      type: "narration",
      text: "第三天晚上，我忽然收到红姐的私聊消息——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "right",
      text: "宁念，明天开始就要拜访邻居了。听说只有拜访完这栋楼 30 层的全部诡异，才能解锁全部楼层，然后或许会出现最终的通关提示。\n你在最难的 30 层，一定要帮助大家成功拜访 30 楼的诡异啊。当然，除去那些已经死去的玩家，剩下的玩家也会帮你说话，帮你拜访他们的「家人」。\n可惜了，当时明神死在第六天，拜访断头大 Boss 时被杀，我们也不知道第七天会发生什么。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_phone.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
      ],
    },
    {
      type: "narration",
      text: "看着红姐关切的话语和透露的信息，我伸了个懒腰，淡定无比地回了一句：【多谢，我当然愿意互帮互助啦。】\n既然不知道第七天会发生什么，那就先好好完成接下来三天的任务吧。\n出门拜访前，还可以再在家里准备一下。",
    },
    {
      type: "bgm",
      src: "assets/music/obaachan-no-ie.mp3",
      loop: true,
    },
    {
      type: "pause",
      id: "before_departure",
      unlock: "home",
      exploreScene: "floor30_living",
      hint: "自由探索中。在客厅点击断头可继续剧情（领取家人馈赠）。可先与其他家人闲聊。",
      progress: "§12 出门前",
      resumeNpc: {
        scene: "floor30_living",
        name: "断头",
        sprite: "assets/chars/boss_front.png",
        area: { x: 58, y: 6, w: 28, h: 88 },
        bubble: "断头",
        prompt: "是否继续剧情？",
      },
    },

    // —— 12 出门前的馈赠 ——
    { type: "scene", scene: "floor30_living" },
    {
      type: "narration",
      text: "出门前，思思特意走到断头大 Boss 面前，仰着脸道——",
    },
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
      type: "narration",
      text: "断头大 Boss 敲了敲她的脑袋——",
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
      type: "narration",
      text: "肠老头爱不释手地摸着自己缝好的肚皮，一边接话——",
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
      type: "narration",
      text: "黑老太一边敷蔬菜面膜，一边探出骷髅头泼冷水——",
    },
    {
      type: "say",
      speaker: "黑老太",
      sprite: "assets/chars/nainai_front.png",
      side: "right",
      text: "不是，你们没有读《幸福之家居民管理条例》吗？\n我们身为原住民，这三天是不能下楼跟着儿媳的，只能靠她自己。",
      slots: [
        { side: "left", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
        { side: "right", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
      ],
    },
    {
      type: "narration",
      text: "三个诡异瞬间偃旗息鼓。还是断头大 Boss 漆黑的眼珠子转了转，忽然想到了什么。\n一言不合就把脑袋拔了下来，伸出手在脖子上的伤疤里掏啊掏，掏出了一把刀柄。\n然后他抓着刀柄扯啊扯啊扯，扯出了一把满是铁锈的……大菜刀，刀身还冒着浓浓黑气。\n当然，我是没有看清他这一连串炫酷的动作的。我只恍惚看到，两老一小看到菜刀后，尖叫着退了三步。\n男人走到我面前，温柔地把菜刀递给我——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_head.png",
      side: "right",
      text: "念念，拿着它，没人敢对你动手。\n论实力，我应当算幸福之家最强，它能断我的头，定然也能断楼下所有诡异的头。",
      slots: [
        { side: "left", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
        { side: "right", sprite: "assets/chars/boss_head.png", name: "断头" },
      ],
    },
    {
      type: "narration",
      text: "机械音忽然在我耳边响起，这种私人播报没有公放。",
    },
    { type: "system", text: "恭喜玩家，获得 SSSSS 级道具「爱的屠刀」。" },
    {
      type: "narration",
      text: "他……他居然能为我做到这种地步。\n死人最是忌讳曾经杀死自己的东西，可他偏偏将它拔了出来，虔诚地送给我当武器。\n只有弹幕在发疯——",
    },
    { type: "danmaku", text: "卧槽！杀死断头大 Boss 的菜刀居然是顶级道具！" },
    { type: "danmaku", text: "离了个大谱！S 级副本里居然有 5S 级道具，还被一个新人获得了。" },
    { type: "danmaku", text: "好好好！各大公会的会长已经来直播间了，这是来抢人的吗？宁念一出来就能直接进大公会了吧，我酸了。" },
    {
      type: "narration",
      text: "思思一见男人出尽风头，立刻冲进衣柜里翻箱倒柜，然后挑出一件最整洁的毫无折痕的白裙子捧在手上，对着我手里菜刀就冲了过来。\n或许因为惧怕，思思身上和手里的白裙子都立刻变成了血红。\n思思把手里的红裙子对着我一抛，红裙登时穿到了我身上，而且完美变大，刚好贴合我的身材。\n思思搂住我的腰蹭了蹭，满脸眷恋——",
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
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "机械音再度响起——",
    },
    { type: "system", text: "恭喜玩家，获得 SSSS 级道具「天使之裙」。" },
    {
      type: "narration",
      text: "不等我感动，肠老头扯开我好不容易给他缝好的「毛衣」，在肚子上掏啊掏啊掏，掏出一个毛线团递给我，让我防身。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "机械音又一次响起——",
    },
    { type: "system", text: "恭喜玩家，获得 SSS 级道具「宰相肚肠」。" },
    {
      type: "narration",
      text: "黑老太紧随其后，干脆利落地扯下一只焦炭胳膊，说必要时刻可以助我一臂之力。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "机械音再一次响起——",
    },
    { type: "system", text: "恭喜玩家，获得 SS 级道具「枯木逢春」。" },
    { type: "danmaku", text: "人麻了。" },
    {
      type: "flavorChoice",
      id: "flavor_family_thanks",
      mode: "round",
      optionCount: 3,
      roundSpeakers: ["思思", "断头", "肠大爷", "黑老太"],
      progress: "§12 岔口 · 谢家人",
      prompt: "一家四口刚把防身的东西塞给宁念。她当面感谢大家——",
      slots: [
        { side: "left", sprite: "assets/chars/nainai_front.png", name: "黑老太" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
      extraSlots: [
        { side: "left", sprite: "assets/chars/sisi_blood_front.png", name: "思思" },
        { side: "left", sprite: "assets/chars/boss_front.png", name: "断头" },
        { side: "left", sprite: "assets/chars/yeye_patched_front.png", name: "肠大爷" },
      ],
      npcHint:
        "思思：婴儿腔、黏妈妈、刚把血红裙子套在她身上，会邀功撒娇。断头：少话、护短、刚给了菜刀，被谢会别扭。肠大爷：心虚把肠子当毛线团送出，会顺着毛衣误会。黑老太：泼冷水、骨架干，刚扯下焦炭胳膊，口吻硬、不认煽情。",
      plotHint:
        "出门前客厅。四人刚送完礼物。选项必须是宁念当面感谢全家人（你们/大家/一家），三条都是谢所有人，禁止拆成「谢思思」「谢断头」「谢肠大爷」这种一人一句，禁止只夸一件礼物。随后四人轮流接话。宁念看不清尸衣/断头/肠子真相。禁止写成普通温情送礼。禁止抢正史送到楼梯口。",
      forbid: /宁君安|异世之门|幸福之心|爱的屠刀|宰相肚肠|枯木逢春|天使之裙/,
      resumeHint: "四个大 Boss 整齐出动，依依不舍地把我送到了……30 层往下的楼梯口。",
    },
    { type: "horror", set: 8 },
    { type: "scene", scene: "floor30_stairs" },
    {
      type: "narration",
      text: "四个大 Boss 整齐出动，依依不舍地把我送到了……30 层往下的楼梯口。\n我拿着一堆道具，看着身上的红裙，感动得稀里哗啦。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "谁说这是恐怖游戏的诡异？这不就是我最亲密可爱的家人吗？",
    },
    { type: "danmaku", text: "要是给我这些道具，我也觉得他们可爱。" },
    { type: "danmaku", text: "不得不承认，宁神有本事，至少她能在 30 层活到现在，还取得了大 Boss 们的喜爱。" },
    { type: "danmaku", text: "说得也对，以前的玩家连 30 层的大门都进不去，刚走到门口就被血衣萝莉杀了。" },
    { type: "danmaku", text: "依我看，有四个大 Boss 当靠山，又有这么多牛逼道具，宁神这次必定能完成首通！" },
    { type: "danmaku", text: "有种吾家有女初长成的感觉，呜呜呜~" },
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
      progress: "§13 拜访邻居",
      resumeNpc: {
        scene: "floor29_outside",
        hotspotId: "aptDoor",
        bubble: "敲门",
        prompt: "是否拜访 29 层？",
      },
    },
  ],
};
