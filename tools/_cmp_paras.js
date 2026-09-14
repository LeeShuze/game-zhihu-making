const fs = require("fs");
const path = require("path");

const novel = fs.readFileSync(
  "D:/Leeshuze/complite/game_making/相关资料/全文_去水印.md",
  "utf8"
);
const storyDir = "D:/Leeshuze/interesting/game-zhihu-making/js/story";
const story = [
  "ch01_06.js",
  "ch07_12.js",
  "ch13_16.js",
  "ch17_19.js",
  "ch20_end.js",
]
  .map((f) => fs.readFileSync(path.join(storyDir, f), "utf8"))
  .join("\n");

function norm(s) {
  return String(s)
    .replace(/\s+/g, "")
    .replace(/[「」『』“”‘’【】]/g, "")
    .replace(/[，。！？、：；…—·]/g, "")
    .replace(/\\n/g, "");
}

const storyN = norm(story);
const paras = novel
  .split(/\n+/)
  .map((l) => l.trim())
  .filter(
    (l) =>
      l &&
      !l.startsWith("#") &&
      !l.startsWith("把血裙") &&
      !l.startsWith("初次见面") &&
      !l.startsWith("Boss 气笑") &&
      !l.startsWith("我进入恐怖")
  );

const missing = [];
for (const p of paras) {
  if (p.startsWith("「") && p.endsWith("」") && p.length < 40) continue;
  const n = norm(p);
  if (n.length < 18) continue;
  if (!storyN.includes(n)) {
    let hits = 0;
    let total = 0;
    for (let i = 0; i + 12 <= n.length; i += 12) {
      total += 1;
      if (storyN.includes(n.slice(i, i + 12))) hits += 1;
    }
    const ratio = total ? hits / total : 0;
    if (ratio < 0.7) missing.push({ ratio: ratio.toFixed(2), p: p.slice(0, 180) });
  }
}

console.log("weak match", missing.length);
missing.forEach((x, i) =>
  console.log(String(i + 1).padStart(3, " ") + " [" + x.ratio + "] " + x.p)
);
