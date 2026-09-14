(() => {
  const MAX = 100;
  let value = 0;

  function clamp(n) {
    return Math.max(0, Math.min(MAX, Number(n) || 0));
  }

  function format(n) {
    const shown = Math.round(n * 10) / 10;
    return Number.isInteger(shown) ? String(shown) : shown.toFixed(1);
  }

  function render() {
    const root = document.getElementById("horrorMeter");
    const valueEl = document.getElementById("horrorValue");
    if (!root || !valueEl) return;

    const t = value / MAX;
    valueEl.textContent = format(value);
    root.style.setProperty("--horror", String(t));
    root.style.setProperty("--horror-pct", `${Math.round(t * 100)}%`);

    root.classList.toggle("is-warn", value >= 60 && value < 90);
    root.classList.toggle("is-danger", value >= 90);
    root.classList.toggle("is-mid", value >= 30 && value < 60);
    root.setAttribute("aria-label", `惊悚值 ${format(value)}`);
  }

  function bump(delta) {
    const root = document.getElementById("horrorMeter");
    if (!root) return;
    root.classList.remove("is-bump", "is-drop");
    void root.offsetWidth;
    root.classList.add(delta < 0 ? "is-drop" : "is-bump");
  }

  function set(n, { animate = true } = {}) {
    const prev = value;
    const next = clamp(n);
    const changed = next !== value;
    value = next;
    render();
    if (changed && animate) bump(next - prev);
    window.dispatchEvent(new CustomEvent("gal-horror-change", { detail: { value } }));
    return value;
  }

  function add(delta, opts) {
    return set(value + (Number(delta) || 0), opts);
  }

  function get() {
    return value;
  }

  function applyBeat(beat) {
    if (!beat || beat.type !== "horror") return value;
    if (beat.set != null) return set(beat.set);
    if (beat.add != null) return add(beat.add);
    return value;
  }

  function init() {
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.HorrorMeter = { get, set, add, applyBeat, MAX };
})();
