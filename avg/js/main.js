(() => {
  const STORAGE_KEY = "galgame-aspect";

  const settingsBtn = document.getElementById("settingsBtn");
  const settingsPanel = document.getElementById("settingsPanel");
  const ratioButtons = [...document.querySelectorAll(".ratio-option")];

  function applyAspect(aspect, w, h) {
    document.body.dataset.aspect = aspect;
    document.body.style.setProperty("--aspect-w", String(w));
    document.body.style.setProperty("--aspect-h", String(h));

    ratioButtons.forEach((btn) => {
      btn.setAttribute("aria-checked", String(btn.dataset.aspect === aspect));
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ aspect, w: Number(w), h: Number(h) })
    );
  }

  function loadAspect() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && saved.aspect) {
        applyAspect(saved.aspect, saved.w, saved.h);
        return;
      }
    } catch (_) {
      /* ignore */
    }
    applyAspect("16-9", 16, 9);
  }

  function toggleSettings(force) {
    if (!settingsPanel || !settingsBtn) return;
    const open = typeof force === "boolean" ? force : settingsPanel.hidden;
    settingsPanel.hidden = !open;
    settingsBtn.setAttribute("aria-expanded", String(open));
  }

  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSettings();
    });

    document.addEventListener("click", (e) => {
      if (settingsPanel.hidden) return;
      if (settingsPanel.contains(e.target) || settingsBtn.contains(e.target)) return;
      toggleSettings(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggleSettings(false);
    });
  }

  ratioButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyAspect(btn.dataset.aspect, btn.dataset.w, btn.dataset.h);
    });
  });

  // Keyboard activation for SVG hotspots
  document.querySelectorAll(".hotspot").forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const link = el.closest("a");
        if (link) link.click();
      }
    });
  });

  loadAspect();
})();
