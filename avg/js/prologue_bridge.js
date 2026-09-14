(() => {
  const FLOW_KEY = "happiness-home:prologue:v1";

  function cameFromElevator() {
    const q = new URLSearchParams(location.search);
    if (q.get("from") === "elevator") return true;
    try {
      const raw = sessionStorage.getItem(FLOW_KEY);
      const state = raw ? JSON.parse(raw) : null;
      return state?.stage === "complete";
    } catch (_) {
      return false;
    }
  }

  function dutyUrl() {
    return new URL("../duty/", document.baseURI);
  }

  async function goDuty() {
    const url = dutyUrl();
    try {
      const res = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return false;
    } catch (_) {
      return false;
    }
    window.GalAudio?.stop?.({ fadeMs: 400 });
    location.replace(url.href);
    return true;
  }

  window.PrologueBridge = {
    cameFromElevator,
    goDuty,
  };
})();
