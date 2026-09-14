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
  let skipUntilOk = false;

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
    const timer = setTimeout(() => ctrl.abort(), 8000);
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
        if (/overdue|good standing|欠费|Access denied/i.test(msg)) {
          skipUntilOk = true;
        }
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
    if (skipUntilOk) {
      lastError = "账号异常（欠费/未开通），已改用本地失败线";
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
      skipUntilOk = false;
      return { ok: true, preview: String(raw).slice(0, 120) };
    } catch (_) {
      return { ok: false, error: lastError || "测试失败" };
    }
  }

  function pickFallback(npc) {
    const list =
      npc?.fallback ||
      window.AmbientNpcs?.getCatalogEntry?.(npc?.id)?.fallback ||
      ["……"];
    return list[Math.floor(Math.random() * list.length)] || "……";
  }

  /** 无 AI 时也尽量接住玩家原话，避免答非所问的罐头感 */
  function contextualFallback(npc, userText) {
    const tip = pickFallback(npc);
    const short = String(userText || "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 18);
    if (!short) return tip;
    if (/^(你好|您好|嗨|哈喽|在吗|早上好|晚安)/.test(short)) {
      return npc?.greeting || tip;
    }
    if (/(\?|？|为什么|怎么|什么|哪|谁|吗$|么$)/.test(short)) {
      const asks = [
        `……你问「${short}」，我只能说：${tip}`,
        `这种问题不便细说。${tip}`,
        `哼，问这个？${tip}`,
      ];
      return asks[Math.floor(Math.random() * asks.length)];
    }
    const bridges = [
      `「${short}」……${tip}`,
      `我听见了。${tip}`,
      `嗯。${tip}`,
    ];
    return bridges[Math.floor(Math.random() * bridges.length)];
  }

  /**
   * 自由探索闲聊：返回 { ok, text, source, error? }
   * history: [{role:'user'|'assistant', content}]
   */
  async function chatNpc({ npc, userText, history = [], stage } = {}) {
    const text = String(userText || "").trim().slice(0, 200);
    if (!text) {
      return { ok: false, text: "……", source: "empty" };
    }
    const cat = window.AmbientNpcs?.getCatalogEntry?.(npc?.id);
    const role =
      npc?.role || cat?.role || "你是幸福之家的诡异家人，简短中文回复。";
    const greeting = npc?.greeting || cat?.greeting || "";
    const cfg = getConfig();
    // 闲聊：有 Key 即可（不必依赖「启用 AI 失败支线」开关）；欠费熔断除外
    const canAi = Boolean(cfg.apiKey) && !skipUntilOk;

    if (!canAi) {
      lastError = skipUntilOk
        ? "账号异常，已改用本地短句"
        : !cfg.apiKey
          ? "未填写 API Key"
          : "未启用 AI";
      return {
        ok: false,
        text: contextualFallback(npc, text),
        source: "fallback",
        error: lastError,
      };
    }

    const hist = (history || [])
      .filter((m) => m && (m.role === "assistant" || m.role === "user") && m.content)
      .slice(-10);

    const sys = [
      "你正在恐怖 Galgame「幸福之家」里与玩家实时闲聊（不推进主线）。",
      "玩家叫宁念：高度近视，常把诡异当家人；口语回复，1～3 句，不要长篇，不要提自己是 AI。",
      "硬性：必须直接回应当前玩家这句话，承接上文，禁止答非所问、禁止复读开场白原文。",
      "禁止剧透：通关钥匙、异世之门、幸福之心、红姐真实图谋、第七天结局、宁君安。",
      `当前阶段：${stage || npc?.stage || "FREE"}`,
      `你的角色设定：${role}`,
      greeting ? `你的开场白是「${greeting}」（已说过，勿原样再念一遍）。` : "",
      `你的称呼：${npc?.name || cat?.name || "对方"}。`,
    ]
      .filter(Boolean)
      .join("\n");

    const messages = [
      { role: "system", content: sys },
      ...hist.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 300),
      })),
      { role: "user", content: text },
    ];

    try {
      const endpoint = normalizeEndpoint(cfg.endpoint);
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      let res;
      try {
        res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cfg.apiKey}`,
          },
          body: JSON.stringify({
            model: cfg.model || DEFAULTS.model,
            temperature: 0.8,
            messages,
          }),
          signal: ctrl.signal,
        });
      } finally {
        clearTimeout(timer);
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
          rawText.slice(0, 120) ||
          `HTTP ${res.status}`;
        if (/overdue|good standing|欠费|Access denied/i.test(msg)) {
          skipUntilOk = true;
        }
        lastError = msg;
        return {
          ok: false,
          text: contextualFallback(npc, text),
          source: "fallback",
          error: msg,
        };
      }
      const content = extractMessageContent(data).trim();
      if (!content) {
        lastError = "接口无正文";
        return {
          ok: false,
          text: contextualFallback(npc, text),
          source: "fallback",
          error: lastError,
        };
      }
      const cleaned = content.replace(FORBIDDEN, "……").slice(0, 240);
      lastError = "";
      return {
        ok: true,
        text: cleaned || contextualFallback(npc, text),
        source: "ai",
      };
    } catch (err) {
      if (err?.name === "AbortError") lastError = "请求超时";
      else lastError = err?.message || String(err);
      return {
        ok: false,
        text: contextualFallback(npc, text),
        source: "fallback",
        error: lastError,
      };
    }
  }

  window.GalAI = {
    getConfig,
    setConfig,
    getLastError,
    normalizeEndpoint,
    generateFailBeats,
    chatNpc,
    testConnection,
    DEFAULTS,
  };
})();
