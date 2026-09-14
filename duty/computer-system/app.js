const app = document.querySelector("#app");
const floors = Array.from({ length: 30 }, (_, index) => {
  const floor = String(index + 1).padStart(2, "0") + "F";
  return `<li class="floor${index === 29 ? ' floor--available' : ''}"><strong>${floor}</strong><span>${index === 29 ? '待入住' : '已入住'}</span></li>`;
}).join("");
app.innerHTML = `<section class="residence" aria-labelledby="terminal-title">
  <header><p class="eyebrow">物业终端 · 入住登记</p><h1 id="terminal-title">幸福之家入住管理终端</h1></header>
  <dl class="status"><div><dt>副本进度</dt><dd>第 1 天</dd></div><div><dt>当前玩家</dt><dd>30 人</dd></div><div><dt>已分配楼层</dt><dd>29 / 30</dd></div><div><dt>待分配楼层</dt><dd>1</dd></div></dl>
  <section aria-labelledby="floor-title"><h2 id="floor-title">楼层入住状态</h2><ul class="floors">${floors}</ul></section>
  <section class="guidance"><h2>当前可入住房间：<strong>30F</strong></h2><p>其余楼层均已完成分配。</p><p>请前往值班台领取对应房间钥匙。</p></section>
  <footer><div class="system-note"><h2>系统提示：</h2><p>楼层分配完成后不可更换。<br>请妥善保管房间钥匙。</p><p id="family-note" aria-live="polite"></p></div><button id="confirm" type="button">确认</button></footer>
</section>`;
let familyTimer;
function startNote() {
  clearTimeout(familyTimer);
  document.querySelector("#family-note").textContent = "";
  familyTimer = setTimeout(() => {
    document.querySelector("#family-note").textContent = '请与您的“家人”和睦相处。';
  }, 2200);
}
function requestClose() {
  clearTimeout(familyTimer);
  window.parent.postMessage({ type: "big-pengu-computer-close-request" }, window.location.origin);
}
document.querySelector("#confirm").addEventListener("click", requestClose);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { event.preventDefault(); requestClose(); }
});
window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin || event.source !== window.parent) return;
  if (event.data?.type === "big-pengu-computer-open") startNote();
  if (event.data?.type === "big-pengu-computer-close") clearTimeout(familyTimer);
});
window.parent.postMessage({ type: "big-pengu-computer-system-ready" }, window.location.origin);
