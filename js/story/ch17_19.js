/**
 * 全文第 16 尾～19 节（中层开解 → 回 30 层日常 → 第六天：10 层狗头 / 9 层红姐俊哥）
 *
 * 本章接在 27 层之后连续播放，中间不停；
 * 结束后直接进入第 20 节（回 30 层讲故事）。
 */
window.STORY_CH17_19 = {
  id: "ch17_19",
  chars: {
    ningnian: "assets/chars/ningnian_front.png",
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
    },
    { type: "scene", scene: "floor30_living" },
    {
      type: "narration",
      text: "这两天下来，我严格按照朝九晚五的作息做任务。\n每天一回 30 层，思思就像个小猫咪一样扑来，在我脸上蹭啊蹭——",
    },
    {
      type: "say",
      speaker: "思思",
      sprite: "assets/chars/sisi_hug.png",
      side: "left",
      text: "妈妈，我好想你。",
    },
    {
      type: "narration",
      text: "我简直都要萌化了。\n断头则主动做好饭菜，一脸哀怨地拉着我的小手，不甘示弱地低语——",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "断头",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "其实我也想你。",
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
      type: "say",
      speaker: "人身狗头",
      sprite: "assets/chars/doghead10_front.png",
      side: "left",
      text: "……",
      slots: [
        { side: "left", sprite: "assets/chars/doghead10_front.png", name: "人身狗头" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "它递过来三张拜访卡片。我张了张嘴，正想说点什么，它忽然面向我，微微俯下身——\n即使高度近视，我也看清了犬齿间的碎肉，甚至还卡着人类的指头。",
      clearSprites: true,
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
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
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
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "我沉默了，按下蠢蠢欲动的菜刀，低声安抚某人——",
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
      text: "菜刀这才气哼哼安稳下来。\n人身狗头怪物和人类的恩怨，或许要不仅追溯到它活着时，更要追溯到如今的现实。\n部分人类大肆虐杀猫狗，所以在这个世界，出现只在第 10 层虐杀人类的人身狗头——听起来，似乎很公平。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "这种杀戮什么时候会结束呢？",
      slots: [
        { side: "left", sprite: "assets/chars/doghead10_front.png", name: "人身狗头" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "say",
      speaker: "人身狗头",
      sprite: "assets/chars/doghead10_front.png",
      side: "left",
      text: "人类什么时候停止对动物的虐杀？",
      slots: [
        { side: "left", sprite: "assets/chars/doghead10_front.png", name: "人身狗头" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
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
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
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
      text: "仅剩 5 人？\n我和在场两名新玩家面面相觑——其中一名还是当初在楼底哭泣的学生妹。\n我们这里占了 3 人，意味着 9 层到 1 层仅剩 2 人存活。",
    },
    {
      type: "narration",
      text: "玩家群里死一般沉寂。\n我打头阵，学生妹紧随其后，健身教练断后，小心翼翼朝下走去。",
    },
    {
      type: "narration",
      text: "刚踩上 9 层的地板，一个透明罩子就朝我们三人罩下。\n与此同时，墙后走出一男一女——",
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
      text: "正是红姐和俊哥。\n从一开始，一个唱红脸，一个唱白脸，试图博得玩家们的信任。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "红姐给我发私信，其实有后半段没说。\n明神并非枉死——至少给后面的玩家提供了一条截至第六天的思路。",
    },
    {
      type: "narration",
      text: "让玩家尽可能多地活到第四天，不一定全靠攻略邻居拿卡片。\n还有另一种办法：抢夺与吞噬。\n从第四天开始，玩家 A 杀死玩家 B，就能获得 B 层诡异的拜访卡片，并继承 B 已有的卡片。",
    },
    {
      type: "narration",
      text: "所以这就跟养猪一样——把猪养肥，再捡漏。\n而我们所有人，都是红姐和俊哥养的猪。\n我意外成了猪王。",
    },
    { type: "horror", set: 20 },

    // —— 19 反杀 ——
    {
      type: "narration",
      text: "呸呸呸！\n说白了，规则允许自相残杀。只是这次，他们看走眼了。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "我解开外套，露出红色长裙，从裙摆下拎出断头的菜刀、肠子、枯手。",
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "说来听听，你们想怎么弄死我？",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "我举着菜刀随意挥了挥，S 级防护罩破损毁灭。\n红姐和俊哥的脸一寸寸龟裂，彻底瘫倒在地。",
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
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "楼下那些玩家，也这样求过你们的吧？你们放过他们了吗？",
      slots: [
        { side: "left", sprite: "assets/chars/hongjie_front.png", name: "红姐" },
        { side: "right", sprite: "assets/chars/ningnian_front.png", name: "宁念" },
      ],
    },
    {
      type: "narration",
      text: "生锈菜刀仿佛有自主意识，朝他们挥去。\n刀还没碰到，看到这 SSSSS 级道具飞来，两人惊悚值直接飙到 100，爆体而亡，连血腥味都没留下。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "好啦，不气不气，我没有受伤。",
    },
    {
      type: "narration",
      text: "我把红姐俊哥靠杀同伴收集的拜访卡片，让给了学生妹和健身教练，并交代他们可以去拜访 20～30 层。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "如果诡异针对你们，就说你们是 30 层宁念的朋友，她叫你们上来拿卡片的。",
    },
    {
      type: "narration",
      text: "学生妹和健身教练感激不已，连连对我鞠躬。",
      clearSprites: true,
    },
    {
      type: "narration",
      text: "我独自往下，收集还缺的拜访卡片。\n再往下几乎畅通无阻，几分钟就集齐——可耳边没有游戏提示音。\n我知道，还缺最关键的一张：30 层的卡片，30 层的故事。",
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
