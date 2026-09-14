/**
 * 全文第 13～16 节（拜访 29 / 28 / 27 层）
 *
 * 暂停点：
 *  - after_floor29：离开 29 层后 → 28 层敲门
 *  - after_floor28：离开 28 层后 → 27 层敲门
 *  27 层拜访结束后不再暂停，直接进入第 17 节。
 */
window.STORY_CH13_16 = {
  id: "ch13_16",
  chars: {
    ningnian: "assets/chars/ningnian_coat_dress.png",
    twinSister: "assets/chars/twin_sister_front.png",
    twinBrother: "assets/chars/twin_brother_front.png",
    girl28: "assets/chars/girl28_front.png",
    mom27: "assets/chars/mom27_front.png",
    boy27: "assets/chars/boy27_front.png",
  },
  beats: [
    // —— 13 抵达 29 层 ——
    { type: "scene", scene: "floor29_outside" },
    {
      type: "narration",
      text: "刚抵达 29 层。\n通过群消息得知，这层的玩家早就嘎了。",
      clearSprites: true,
      progress: "§13 29 层",
    },
    { type: "scene", scene: "floor29_door_open" },
    {
      type: "narration",
      text: "我礼貌地敲门，才敲一声，门就开了。",
    },
    { type: "horror", set: 14 },
    { type: "scene", scene: "floor29_living" },
    {
      type: "narration",
      text: "门内露出一对龙凤胎姐弟的脸，少年模样。\n他们警惕地看了看我手里的道具，尤其是那把钝了的菜刀，讨好地抿唇微笑——",
    },
    {
      type: "say",
      speaker: "龙凤胎姐姐",
      sprite: "assets/chars/twin_sister_front.png",
      side: "left",
      text: "是 30 层的邻居吧？拜访就拜访，您还带什么武器呢？见外了不是。\n这是 29 层的拜访卡片，请您拿好。",
      slots: [
        { side: "left", sprite: "assets/chars/twin_sister_front.png", name: "龙凤胎姐姐" },
        { side: "right", sprite: "assets/chars/twin_brother_front.png", name: "龙凤胎弟弟" },
      ],
    },
    {
      type: "narration",
      text: "如果不是他们碎掉的脑袋、辨不出形状的五官和发臭的衣服，肯定更有亲和力。\n我捏住朴素的卡片——上面只有一点点黑色图案，看不出具体是什么。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_coat_dress.png",
      side: "right",
      text: "可以请我进去喝一杯茶吗？\n我想，或许可以跟你们聊聊你们的母亲和仇人的结局。",
      slots: [
        { side: "left", sprite: "assets/chars/twin_sister_front.png", name: "龙凤胎姐姐" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "其实刚进副本站在楼底下时，我并不是什么也没干。\n大家都去抢楼层之后，我无聊地围着大楼转了五圈——\n终于在黑气萦绕的垃圾堆里，翻出一张脏污废旧的报纸。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "幸好，这是我这种社会底层的老本行。\n我是孤儿，小时候最常干的事就是翻垃圾堆。\n而这种地方，最容易被玩家忽略。",
    },
    {
      type: "narration",
      text: "报纸上清楚地记录着「幸福之家」副本 30 个诡异进来的原因，还附带着他们的照片。",
    },
    { type: "horror", set: 8 },

    // —— 14 姐弟的故事 ——
    { type: "danmaku", text: "我靠，我错过了什么？之前这姐们趴在地上翻垃圾堆，我以为她饿了。" },
    { type: "danmaku", text: "不怪你，怪直播间当时死活不切近景，我们都没看见她手里的报纸。" },
    { type: "danmaku", text: "为什么那份报纸，宁神一个近视眼都能看到，我们却看不到？" },
    { type: "danmaku", text: "因为她半瞎的是眼，我们全盲的是心。" },
    {
      type: "narration",
      text: "29 层这对龙凤胎姐弟，十八岁生日前一天，被亲爸骗上天台，\n然后被亲爸和情妇联手推下高楼。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "因为他们的爸爸是入赘，一直想谋夺他们妈妈的财产。\n为了防止两个孩子成年继承家产，情妇出此毒计，亲爸点头通过。",
    },
    {
      type: "narration",
      text: "他们姐弟死后的第三年，亲爸和情妇被判处死刑立即执行。\n而他们的妈妈，也关闭了公司，带着两个孩子的照片，开始周游世界。",
    },
    {
      type: "narration",
      text: "一杯茶喝完，故事也说到了尽头。\n龙凤胎姐弟热泪盈眶地看着我，目送我起身。",
    },
    { type: "scene", scene: "floor29_outside" },
    {
      type: "narration",
      text: "走出 29 层大门后，我忽然伸手拍了拍他们衣服的尘土——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_coat_dress.png",
      side: "right",
      text: "从今天开始，好好「活」着吧，即使是在这里。\n只要彼此思念，总有一天，你们会和你们的妈妈重逢。",
      slots: [
        { side: "left", sprite: "assets/chars/twin_sister_front.png", name: "龙凤胎姐姐" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "看着他们重重点头，我欣慰地转身往下走。\n下一站是 28 层——可以先四处转转，再到门前敲门。",
      clearSprites: true,
    },
    { type: "horror", set: 4 },
    {
      type: "pause",
      id: "after_floor29",
      unlock: "visit29",
      exploreScene: "floor29_outside",
      hint: "自由探索中。到 28 层门外显示「敲门」后点击可继续。",
      resumeNpc: {
        scene: "floor28_outside",
        hotspotId: "aptDoor",
        bubble: "敲门",
        prompt: "是否拜访 28 层？",
      },
    },

    // —— 15 拜访 28 层 ——
    { type: "scene", scene: "floor28_outside" },
    {
      type: "narration",
      text: "我来到 28 层。这层的玩家也早就嘎了。",
      clearSprites: true,
    },
    { type: "scene", scene: "floor28_door_open" },
    {
      type: "narration",
      text: "屈服于道具的淫威……哦不是，折服于我的美貌下——\n这层诡异在我刚敲门的瞬间，就打开了门，恭敬地递上一张拜访卡片。",
    },
    { type: "horror", set: 12 },
    { type: "scene", scene: "floor28_room" },
    {
      type: "narration",
      text: "她是一名穿着夸张 cos 服、化着夸张妆容，身体看起来却很健全的年轻女孩。\n我并没有丝毫惊讶——她不是出意外死的，她是吞安眠药自杀的。",
    },
    {
      type: "say",
      speaker: "28层女孩",
      sprite: "assets/chars/girl28_front.png",
      side: "left",
      text: "……请拿好。",
      slots: [
        { side: "left", sprite: "assets/chars/girl28_front.png", name: "28层女孩" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "死的那年，她 19 岁，正值青春年华。\n却因为一次偶然的衣服事件，被逼到自杀。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "她在网上刷到一件好看的衣服，以图找图买了同款，美滋滋拍照上传——\n然后迎来上万条辱骂：没戴假发、没化妆、不尊重二次元、辱没 cos 圈……\n最后还对她的朋友、父母开盒骚扰，P 她的遗照和黄图传给父母。",
    },
    {
      type: "narration",
      text: "女孩慌了，也怕了。她不懂什么圈子，只是单纯觉得那件衣服很漂亮。\n可后来她觉得自己有罪，应该以死结束这场「罪恶」。\n甚至吞药前都穿着那件衣服，化了全妆，戴了假发——\n生怕到了阴曹地府再被骂一顿，甚至不准投胎。",
    },
    { type: "horror", set: 18 },
    {
      type: "narration",
      text: "我从她房间拿出卸妆棉，一点点擦去她脸上浓重的妆容，温柔地开导——",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_coat_dress.png",
      side: "right",
      text: "你知道吗？被圈住的从来都不是你，而是他们。\n你去世后那些年，他们或长大、或结婚、或生子，但总归不幸福——有些人甚至进了精神病院，因为他们过于偏执。",
      slots: [
        { side: "left", sprite: "assets/chars/girl28_front.png", name: "28层女孩" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_coat_dress.png",
      side: "right",
      text: "这里没有任何圈子，只有生与死。\n所以在这里，你可以想穿什么就穿什么，想素颜就素颜，想浓妆就浓妆。\n等他们死后万一来了这里，你也可以疯狂折磨他们。\n当然，我认为他们即使死了，也不配再拥有一次复活机会。",
      slots: [
        { side: "left", sprite: "assets/chars/girl28_front.png", name: "28层女孩" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "听着我讲述的后续，女孩咧嘴笑了。\n她缓缓从背后抽出一对双环九节鞭，眼里泛起嗜血的光——\n那赫然就是她 cos 那个二次元角色的武器。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "28层女孩",
      sprite: "assets/chars/girl28_front.png",
      side: "left",
      text: "好的，姐姐，我做自己。\n若有一日他们当真来了，死在自己崇敬的神之武器手中，将是他们的荣幸。",
      slots: [
        { side: "left", sprite: "assets/chars/girl28_front.png", name: "28层女孩" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "这才对嘛，这才符合 28 层 Boss 该有的气质。\n接下来是 27 层——可先自由活动，再到门前敲门。",
      clearSprites: true,
    },
    { type: "horror", set: 6 },
    {
      type: "pause",
      id: "after_floor28",
      unlock: "visit28",
      exploreScene: "floor28_outside",
      hint: "自由探索中。到 27 层门外显示「敲门」后点击可继续。",
      resumeNpc: {
        scene: "floor27_outside",
        hotspotId: "aptDoor",
        bubble: "敲门",
        prompt: "是否拜访 27 层？",
      },
    },

    // —— 16 拜访 27 层 ——
    { type: "scene", scene: "floor27_outside" },
    {
      type: "narration",
      text: "我来到 27 层。",
      clearSprites: true,
    },
    { type: "scene", scene: "floor27_dining" },
    {
      type: "narration",
      text: "这层的诡异是一位穿着制服、化着妆、戴着围裙的女白领，有些不伦不类。\n她手中还牵着一个浑身被压碎的小男孩。",
    },
    { type: "horror", set: 16 },
    {
      type: "say",
      speaker: "27层母亲",
      sprite: "assets/chars/mom27_front.png",
      side: "left",
      text: "……",
      slots: [
        { side: "left", sprite: "assets/chars/mom27_front.png", name: "27层母亲" },
        { side: "right", sprite: "assets/chars/boy27_front.png", name: "小男孩" },
      ],
    },
    {
      type: "narration",
      text: "即使我不看报纸，我也知道他们是谁。\n当初，小男孩在学校出了车祸，妈妈情急之下穿着工作服去学校，\n却被有心之人传到网上，骂她是坐台女，说儿子都死了还有心情化妆……",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "这个妈妈悲痛之下，承受不住网暴，选择了跳楼自杀。\n原来，在这个世界，她和孩子相遇了。",
    },
    {
      type: "narration",
      text: "我正想开口安慰这位年轻的妈妈，没想到一脸恐怖的小男孩突然奶声奶气地开口——",
    },
    {
      type: "say",
      speaker: "小男孩",
      sprite: "assets/chars/boy27_front.png",
      side: "left",
      text: "阿姨，我已经把妈妈安慰好啦，嘻嘻。\n如果看到那些人出现，我会把他们都杀光光哦。",
      slots: [
        { side: "left", sprite: "assets/chars/boy27_front.png", name: "小男孩" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "小男孩",
      sprite: "assets/chars/boy27_front.png",
      side: "left",
      text: "嘿嘿，偷偷告诉你，其实三天前入住我家的那个人，就是曾经欺负过妈妈的人。\n临死之前他苦苦哀求，说只是在网上转发了一条相关动态，没有骂过妈妈。\n可我还是杀了他——因为我觉得，他是帮凶。",
      slots: [
        { side: "left", sprite: "assets/chars/boy27_front.png", name: "小男孩" },
        { side: "right", sprite: "assets/chars/mom27_front.png", name: "27层母亲" },
      ],
    },
    {
      type: "say",
      speaker: "小男孩",
      sprite: "assets/chars/boy27_front.png",
      side: "left",
      text: "我的妈妈我知道，她打扮漂亮是工作需要。\n其实，只要妈妈高兴，哪怕她穿着工作服做饭，我也会觉得妈妈是超人。",
      slots: [
        { side: "left", sprite: "assets/chars/boy27_front.png", name: "小男孩" },
        { side: "right", sprite: "assets/chars/mom27_front.png", name: "27层母亲" },
      ],
    },
    {
      type: "narration",
      text: "我看向女人此时的打扮，慈爱地摸了摸小男孩的头——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_coat_dress.png",
      side: "right",
      text: "你也是超人。",
      slots: [
        { side: "left", sprite: "assets/chars/boy27_front.png", name: "小男孩" },
        { side: "right", sprite: "assets/chars/ningnian_coat_dress.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "你的超能力，就是让你的妈妈变开心。",
      clearSprites: true,
    },
    { type: "danmaku", text: "我就说，我们宁神是有大智慧的人！我的女神！" },
    { type: "danmaku", text: "好感人，念念真的是天使，是来救赎大家的天使。" },
    { type: "horror", set: 3 },
    {
      type: "narration",
      text: "拜访卡片到手。\n再往下，还有许多熟悉又陌生的诡异等着我。",
      clearSprites: true,
    },
  ],
};
