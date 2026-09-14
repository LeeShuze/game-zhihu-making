(() => {
  const STORAGE_KEY = "galgame-ai-config";
  const FORBIDDEN = /通关|幸福之心|宁君安|异世之门|爱的屠刀|首通成功/;

  const DEFAULTS = {
    enabled: false,
    endpoint:
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    model: "qwen-plus",
    apiKey: "",
  };

  let lastError = "";

  function getConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        return { ...DEFAULTS, ...saved };
      }
    } catch (_) {
      /* ignore */
    }
    return { ...DEFAULTS };
  }

  function setConfig(patch) {
    const next = { ...getConfig(), ...patch };
    if (typeof next.endpoint === "string") {
      next.endpoint = normalizeEndpoint(next.endpoint);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function getLastError() {
    return lastError;
  }

  /** 兼容只填 Base URL 的情况，自动补 /chat/completions */
  function normalizeEndpoint(raw) {
    let url = String(raw || "").trim();
    if (!url) return DEFAULTS.endpoint;
    url = url.replace(/\/+$/, "");
    if (/\/chat\/completions$/i.test(url)) return url;
    if (/\/compatible-mode\/v1$/i.test(url) || /\/v1$/i.test(url)) {
      return `${url}/chat/completions`;
    }
    if (/dashscope\.aliyuncs\.com$/i.test(url)) {
      return `${url}/compatible-mode/v1/chat/completions`;
    }
    return url;
  }

  function fallbackBeats(optionId) {
    const list = window.STORY_BRANCH_FALLBACKS?.[optionId];
    return Array.isArray(list) ? list.map((b) => ({ ...b })) : [];
  }

  function sanitizeBeats(beats) {
    if (!Array.isArray(beats)) return [];
    return beats
      .filter((b) => b && typeof b.text === "string" && b.text.trim())
      .slice(0, 8)
      .map((b) => {
        const type = ["say", "narration", "system", "danmaku"].includes(b.type)
          ? b.type
          : b.speaker
            ? "say"
            : "narration";
        const text = String(b.text).replace(FORBIDDEN, "……").slice(0, 180);
        const out = { type, text };
        if (type === "say") {
          out.speaker = String(b.speaker || "宁念").slice(0, 12);
          if (b.sprite) out.sprite = b.sprite;
          if (b.side) out.side = b.side;
        }
        if (b.clearSprites) out.clearSprites = true;
        return out;
      })
      .filter((b) => !FORBIDDEN.test(b.text));
  }

  function buildPrompt({ prompt, optionLabel, ending, context }) {
    return [
      "你在为中文恐怖 Galgame「幸福之家」写一段短暂失败支线。",
      "硬性规则：",
      "1) 玩家已偏离原剧情正确选项，后续必须导向失败，禁止通关、禁止获得关键道具、禁止长篇日常。",
      '2) 只输出 JSON：{"beats":[{"type":"narration|say|danmaku","speaker":"可选","text":"中文"}]}',
      "3) 3～6 条 beats，每条不超过 80 字，口吻贴近原文：宁念高度近视、误会式喜剧转瞬变恐怖。",
      "4) 不要写结局结算句（系统会另接固定失败结局）。",
      "",
      `场景：${prompt}`,
      `玩家选择：${optionLabel}`,
      `固定失败结局：${ending.title} —— ${ending.system}`,
      context ? `前文摘要：${context}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function extractMessageContent(data) {
    const msg = data?.choices?.[0]?.message;
    if (!msg) return "";
    if (typeof msg.content === "string") return msg.content;
    if (Array.isArray(msg.content)) {
      return msg.content
        .map((part) => (typeof part === "string" ? part : part?.text || ""))
        .join("");
    }
    // 部分思考模型可能把正文放在别处
    if (typeof msg.reasoning_content === "string" && !msg.content) {
      return "";
    }
    return "";
  }

  async function chatCompletions(cfg, userPrompt) {
    lastError = "";
    const endpoint = normalizeEndpoint(cfg.endpoint);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);
    try {
      const body = {
        model: cfg.model || DEFAULTS.model,
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content: "只输出合法 JSON 对象，不要 Markdown 代码块。",
          },
          { role: "user", content: userPrompt },
        ],
      };
      // 通义兼容：尽量约束 JSON；不支持时下面会降级重试
      body.response_format = { type: "json_object" };

      let res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cfg.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });

      if (!res.ok && res.status === 400) {
        // 部分模型不支持 response_format，去掉后重试
        delete body.response_format;
        res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cfg.apiKey}`,
          },
          body: JSON.stringify(body),
          signal: ctrl.signal,
        });
      }

      const rawText = await res.text();
      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (_) {
        data = null;
      }

      if (!res.ok) {
        const msg =
          data?.error?.message ||
          data?.message ||
          data?.code ||
          rawText.slice(0, 160) ||
          `HTTP ${res.status}`;
        throw new Error(msg);
      }

      const content = extractMessageContent(data);
      if (!content) {
        throw new Error("接口有返回，但没有正文内容（检查模型名是否可用）");
      }
      return content;
    } catch (err) {
      if (err?.name === "AbortError") {
        lastError = "请求超时";
      } else if (
        String(err?.message || "").includes("Failed to fetch") ||
        err?.name === "TypeError"
      ) {
        lastError = "网络/CORS 失败（请确认地址完整且含 /chat/completions）";
      } else {
        lastError = err?.message || String(err);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  function parseJsonBeats(raw) {
    if (!raw) return [];
    const trimmed = String(raw)
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start < 0 || end < start) return [];
    try {
      const obj = JSON.parse(trimmed.slice(start, end + 1));
      return sanitizeBeats(obj.beats);
    } catch (_) {
      return [];
    }
  }

  async function generateFailBeats(payload) {
    const local = fallbackBeats(payload.optionId);
    const cfg = getConfig();
    if (!cfg.enabled) {
      lastError = "未启用 AI";
      return { beats: local, source: "fallback", error: lastError };
    }
    if (!cfg.apiKey) {
      lastError = "未填写 API Key";
      return { beats: local, source: "fallback", error: lastError };
    }
    try {
      const raw = await chatCompletions(cfg, buildPrompt(payload));
      const beats = parseJsonBeats(raw);
      if (!beats.length) {
        lastError = "AI 返回无法解析为剧情 JSON";
        return { beats: local, source: "fallback", error: lastError };
      }
      lastError = "";
      return { beats, source: "ai" };
    } catch (_) {
      return { beats: local, source: "fallback", error: lastError };
    }
  }

  async function testConnection() {
    const cfg = getConfig();
    if (!cfg.apiKey) {
      lastError = "未填写 API Key";
      return { ok: false, error: lastError };
    }
    try {
      const raw = await chatCompletions(cfg, '只输出 JSON：{"ok":true}');
      lastError = "";
      return { ok: true, preview: String(raw).slice(0, 120) };
    } catch (_) {
      return { ok: false, error: lastError || "测试失败" };
    }
  }

  window.GalAI = {
    getConfig,
    setConfig,
    getLastError,
    normalizeEndpoint,
    generateFailBeats,
    testConnection,
    DEFAULTS,
  };
})();
