/**
 * 固定结局表：偏离原剧情只能滑向这些失败结局。
 * AI 只负责生成「怎么滑过去」的短过程，不能通关。
 */
window.STORY_ENDINGS = {
  sisi_kill: {
    id: "sisi_kill",
    title: "血衣索命",
    horror: 100,
    text: "冰凉的小手收紧。视线彻底暗下去。\n你没能成为她的家人。",
    system: "存活失败。偏离「家人」路线，被血衣萝莉抹杀。",
  },
  boss_wrath: {
    id: "boss_wrath",
    title: "断头一怒",
    horror: 100,
    text: "黑气灌满客厅。男人没有再给你找补的机会。\n下一秒，世界从脖子处断开。",
    system: "存活失败。未能让断头大 Boss 把你当家人。",
  },
  hog_slaughter: {
    id: "hog_slaughter",
    title: "养猪计划",
    horror: 100,
    text: "防护罩落下。拜访卡片被收走。\n红姐笑得很温和——像对待一头养肥的猪。",
    system: "存活失败。第九层陷阱中，你没有反杀。",
  },
};

window.STORY_BRANCH_FALLBACKS = {
  sisi_push: [
    {
      type: "narration",
      text: "我下意识尖叫，双手把那团红影猛地推开。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_daily_front.png",
      side: "right",
      text: "别过来！你、你是什么东西？！",
    },
    {
      type: "narration",
      text: "小孩摔倒在地，红裙深处渗出更多黏稠的黑红。她慢慢抬起头，笑意更深了。",
    },
    {
      type: "say",
      speaker: "？？？",
      sprite: "assets/chars/sisi_blood_enter.png",
      side: "left",
      text: "不要妈妈了吗？那……就把你做成新裙子。",
    },
  ],
  sisi_fight: [
    {
      type: "narration",
      text: "我把她当怪物，抬脚就要踢开。高度近视害我踢空，整个人摔进她怀里。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "？？？",
      sprite: "assets/chars/sisi_blood_enter.png",
      side: "left",
      text: "打思思？坏东西。",
    },
    {
      type: "narration",
      text: "指甲陷进我的喉管。走廊里只剩下拖拽声和一点点血腥味。",
    },
  ],
  boss_kneel: [
    {
      type: "narration",
      text: "我腿一软，连滚带爬往后退，语无伦次地求饶。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "对不起对不起！我不是这个家的人，你放我走——",
    },
    {
      type: "say",
      speaker: "？？？",
      sprite: "assets/chars/boss_front.png",
      side: "right",
      text: "不是家人，就该死。",
    },
  ],
  boss_insult: [
    {
      type: "narration",
      text: "我指着他破口大骂，把「怪物」「变态」一股脑砸过去。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "left",
      text: "你这种东西也配当爸爸？恶心！",
    },
    {
      type: "narration",
      text: "客厅的灯灭了一拍。再亮时，他已经站在我面前。",
    },
  ],
  hog_surrender: [
    {
      type: "narration",
      text: "我把外套里的卡片一股脑递出去，试图换一条生路。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "宁念",
      sprite: "assets/chars/ningnian_front.png",
      side: "right",
      text: "卡片都给你们……别杀我们。",
    },
    {
      type: "say",
      speaker: "红姐",
      sprite: "assets/chars/hongjie_front.png",
      side: "left",
      text: "乖。养肥了，就该收割了。",
    },
  ],
  hog_barehand: [
    {
      type: "narration",
      text: "我空着手冲上去，想跟他们拼命。防护罩纹丝不动。",
      clearSprites: true,
    },
    {
      type: "say",
      speaker: "俊哥",
      sprite: "assets/chars/junge_front.png",
      side: "right",
      text: "没有道具，还敢硬刚？",
    },
    {
      type: "narration",
      text: "红姐叹了口气，像在可惜一头跑偏的猪。",
    },
  ],
};
