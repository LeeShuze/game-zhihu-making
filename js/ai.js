(() => {
  const STORAGE_KEY = "galgame-ai-config";
  const FORBIDDEN = /通关|幸福之心|宁君安|异世之门|爱的屠刀|首通成功/;
  const SPOILER = /幸福之心|宁君安|异世之门|爱的屠刀|首通成功/;
  const FLAVOR_WORLD = [
    "作者必须懂本作铁律，禁止当成普通家庭伦理剧：",
    "1) 宁念高度近视，把诡异现场误认成家庭日常。她开口只能用她看见的词，禁止突然看清或说出右边的真相词。",
    "2) 在场诡异知道真相，会心虚、顺着她的误会敷衍。禁止把她的误会写成客观事实（真的护理羊毛、真的护肤、真的普通串门）。",
    "3) 旁支是误会喜剧：她越当家人，场面越恐怖，对方越慌。禁止写成正常生活，禁止 Bad End。",
    "4) 禁止剧透通关钥匙、异世之门、幸福之心、红姐真实图谋、第七天结局、宁君安。",
    "5) 误会对照只解释本场已经出现的东西。禁止把尚未出场的后文人物/道具写进台词（没看见毛衣就不要提毛线、肠子、肠大爷）。",
    "误会对照（作者必记，未出场禁用）：湿红裙/血衣裙=思思杀玩家染红的尸衣；黑皮西瓜=断头的头；皮肤干燥=焦黑鬼皮；毛衣/毛线=肠大爷的肠子；湿毛线=血；鸡爪=尸食；毛线团防身=宰相肚肠；龙凤胎=碎头发臭的邻居（宁念未看清前不要让她说碎头）。",
  ].join("\n");

  const DEFAULTS = {
    enabled: false,
    endpoint:
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    model: "qwen-plus",
    apiKey: "",
  };

  let lastError = "";
  let skipUntilOk = false;
  const FLAVOR_DBG_KEY = "galgame-ai-flavor-debug";

  function setFlavorDebug(rec) {
    try {
      localStorage.setItem(
        FLAVOR_DBG_KEY,
        JSON.stringify({ ...rec, at: Date.now() })
      );
    } catch (_) {
      /* ignore */
    }
  }

  function getFlavorDebug() {
    try {
      return JSON.parse(localStorage.getItem(FLAVOR_DBG_KEY) || "null");
    } catch (_) {
      return null;
    }
  }

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

  function sanitizeBeats(beats, { maxBeats = 8, maxText = 180, ban = FORBIDDEN } = {}) {
    const banRe = ban || FORBIDDEN;
    if (!Array.isArray(beats)) return [];
    return beats
      .map((b) => {
        if (!b || typeof b !== "object") return null;
        const text = String(b.text || b.content || b.line || b.say || "").trim();
        if (!text) return null;
        return { ...b, text };
      })
      .filter(Boolean)
      .slice(0, maxBeats)
      .map((b) => {
        const type = ["say", "narration", "system", "danmaku"].includes(b.type)
          ? b.type
          : b.speaker
            ? "say"
            : "narration";
        const text = String(b.text).replace(banRe, "……").slice(0, maxText);
        const out = { type, text };
        if (type === "say") {
          out.speaker = String(b.speaker || "宁念").slice(0, 12);
          if (b.sprite) out.sprite = b.sprite;
          if (b.side) out.side = b.side;
        }
        if (b.clearSprites) out.clearSprites = true;
        return out;
      })
      .filter((b) => !banRe.test(b.text));
  }

  function extractBeatsArray(obj) {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    for (const k of ["beats", "lines", "dialogue", "script", "messages"]) {
      if (Array.isArray(obj[k])) return obj[k];
    }
    return [];
  }

  function extractOptionsArray(obj) {
    if (!obj) return [];
    for (const k of ["options", "choices", "sides", "branches"]) {
      if (Array.isArray(obj[k])) return obj[k];
    }
    return [];
  }

  /** 去掉类型前缀和台词引号，只留宁念说出口的那句 */
  function cleanFlavorLabel(raw) {
    let s = String(raw || "").trim();
    s = s.replace(/^(纠正称呼|温柔追问|得寸进尺|正史选项|旁支)\s*[：:]\s*/, "");
    s = s.replace(/^[「“"'‘]+|[」”"'’]+$/g, "").trim();
    return s.replace(SPOILER, "……").slice(0, 40);
  }

  /** 内心独白、类型标签都不能当旁支按钮 */
  function isWeakFlavorLabel(label) {
    const s = String(label || "").trim();
    if (s.length < 4) return true;
    if (/^(正史|旁支|选项|继续|默认|主线)$/.test(s)) return true;
    if (/心里|心想|偷着乐|美滋滋|心里一软/.test(s)) return true;
    if (/^(对她说|开口|喊道|说道|心想)/.test(s)) return true;
    return false;
  }

  function forbidHint(forbid) {
    if (!forbid) return "";
    const src =
      forbid instanceof RegExp ? forbid.source.replace(/\\/g, "") : String(forbid);
    return src ? `禁止出现这些后文词：${src}` : "";
  }

  function hitsForbid(text, forbid) {
    if (!forbid || !text) return false;
    const re =
      forbid instanceof RegExp
        ? new RegExp(forbid.source, forbid.flags.replace("g", ""))
        : typeof forbid === "string"
          ? new RegExp(forbid)
          : null;
    if (!re) return false;
    return re.test(String(text));
  }

  function splitPresentNames(presentChars) {
    return String(presentChars || "")
      .split(/[、,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function normalizeFlavorSpeaker(name, presentChars) {
    const s = String(name || "").trim();
    const names = splitPresentNames(presentChars);
    if (names.includes(s)) return s;
    const aliases = [
      { re: /宁念|^我$/, keys: ["宁念"] },
      { re: /思思|小萝莉/, keys: ["思思"] },
      { re: /红姐|苏小沫/, keys: ["红姐"] },
      { re: /俊哥|方圆/, keys: ["俊哥"] },
      { re: /断头|老公/, keys: ["断头", "？？？"] },
      { re: /黑老太|奶奶|李翠兰/, keys: ["黑老太"] },
      { re: /肠大爷|爷爷|老爸|刘爱国/, keys: ["肠大爷"] },
      { re: /龙凤胎姐姐|双生姐姐/, keys: ["龙凤胎姐姐"] },
      { re: /龙凤胎弟弟|双生弟弟/, keys: ["龙凤胎弟弟"] },
    ];
    for (const { re, keys } of aliases) {
      if (!re.test(s)) continue;
      const hit = names.find((n) => keys.includes(n) || re.test(n));
      if (hit) return hit;
    }
    if (/宁念|^我$/.test(s)) return "宁念";
    return s;
  }

  function normalizeFlavorBeats(beats, presentChars) {
    return (beats || []).map((b) => {
      if (b.type !== "say") return b;
      const speaker = normalizeFlavorSpeaker(b.speaker, presentChars);
      return speaker ? { ...b, speaker } : b;
    });
  }

  function pickQaAnswer(list, others) {
    const names = splitPresentNames(others);
    const hit = (list || []).find(
      (b) => b?.type === "say" && names.includes(b.speaker)
    );
    return hit ? [hit] : [];
  }

  function pickRoundAnswers(list, speakers) {
    const names = (speakers || []).filter(Boolean);
    const seen = new Set();
    const out = [];
    for (const b of list || []) {
      if (b?.type !== "say" || !b.speaker || seen.has(b.speaker)) continue;
      if (!names.includes(b.speaker)) continue;
      seen.add(b.speaker);
      out.push({ type: "say", speaker: b.speaker, text: b.text });
    }
    return out;
  }

  function shuffleNames(names) {
    const a = (names || []).slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function flavorHasNpcTalk(beats, phase, presentChars, { spokenAlready = false } = {}) {
    const says = (beats || []).filter((b) => b.type === "say");
    const ning = says.some((b) => b.speaker === "宁念");
    const others = splitPresentNames(presentChars).filter((n) => n !== "宁念");
    const npcTalk = others.length
      ? says.some((b) => others.includes(b.speaker))
      : says.some((b) => b.speaker && b.speaker !== "宁念");
    if (phase === "close") return npcTalk || ning;
    if (spokenAlready) return npcTalk;
    return ning && npcTalk;
  }

  function normFlavorText(s) {
    return String(s || "")
      .replace(/\s+/g, "")
      .replace(/[，。！？、…—~\s「」""'‘’]/g, "");
  }

  function flavorTextOverlap(a, b) {
    const x = normFlavorText(a);
    const y = normFlavorText(b);
    if (!x || !y) return false;
    if (x === y) return true;
    const [lo, hi] = x.length <= y.length ? [x, y] : [y, x];
    return lo.length >= 8 && hi.includes(lo);
  }

  /** 去掉与已播/同段重复的旁支句，避免展开+收束两遍戏 */
  function dropRepeatFlavorBeats(beats, against = []) {
    const kept = [];
    const poolStart = (against || []).filter((b) => b && b.text);
    for (const b of beats || []) {
      if (!b?.text) continue;
      const pool = poolStart.concat(kept);
      if (pool.some((p) => flavorTextOverlap(p.text, b.text))) continue;
      kept.push(b);
    }
    return kept;
  }

  /** 可选意图种子；没有则让 AI 自拟类别，不强行纠正/追问/要亲亲 */
  function flavorIntentSeeds(payload = {}) {
    const fromOpts = Array.isArray(payload.sideOptions) ? payload.sideOptions : [];
    const hints = Array.isArray(payload.sideIntents)
      ? payload.sideIntents
      : Array.isArray(payload.sideHints)
        ? payload.sideHints
        : [];
    const n = Math.max(fromOpts.length, hints.length, 0);
    const out = [];
    for (let i = 0; i < Math.min(3, n); i += 1) {
      const o = fromOpts[i] || {};
      const intent = String(o.intent || hints[i] || "")
        .replace(SPOILER, "……")
        .slice(0, 100);
      if (!intent) continue;
      out.push({
        id: String(o.id || `side_${i + 1}`).slice(0, 24),
        intent,
      });
    }
    return out;
  }

  function buildPrompt({ prompt, optionLabel, ending, context, plotHint }) {
    return [
      "你在为中文恐怖 Galgame「幸福之家」写一段短暂失败支线。",
      "硬性规则：",
      "1) 玩家已偏离原剧情正确选项，后续必须导向失败，禁止通关、禁止获得关键道具、禁止长篇日常。",
      '2) 只输出 JSON：{"beats":[{"type":"narration|say|danmaku","speaker":"可选","text":"中文"}]}',
      "3) 3～6 条 beats，每条不超过 80 字，口吻贴近原文：宁念高度近视、误会式喜剧转瞬变恐怖。",
      "4) 不要写结局结算句（系统会另接固定失败结局）。",
      FLAVOR_WORLD,
      plotHint ? `本场真相：${plotHint}` : "",
      `场景：${prompt}`,
      `玩家选择：${optionLabel}`,
      `固定失败结局：${ending.title} —— ${ending.system}`,
      context ? `前文（按时间顺序）：\n${context}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function extractMessageContent(data) {
    const msg = data?.choices?.[0]?.message;
    if (!msg) return "";
    let text = "";
    if (typeof msg.content === "string") {
      text = msg.content;
    } else if (Array.isArray(msg.content)) {
      text = msg.content
        .map((part) => (typeof part === "string" ? part : part?.text || ""))
        .join("");
    }
    return String(text)
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .trim();
  }

  function isAbortErr(err) {
    const name = err?.name || "";
    const msg = String(err?.message || err || "");
    return (
      name === "AbortError" ||
      name === "TimeoutError" ||
      err?.code === 20 ||
      /aborted|AbortError|The user aborted/i.test(msg)
    );
  }

  /**
   * 整段请求共用一个 abort：包含重试和读 body。
   * Qwen3 默认开思考时，不关 enable_thinking 会一直不返回直到被掐断。
   */
  async function chatCompletions(
    cfg,
    userPrompt,
    { timeoutMs = 20000, temperature, maxTokens, jsonMode = false, model } = {}
  ) {
    lastError = "";
    const endpoint = normalizeEndpoint(cfg.endpoint);
    const waitMs = Math.max(4000, timeoutMs || 20000);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), waitMs);
    const started = Date.now();
    try {
      const body = {
        model: model || cfg.model || DEFAULTS.model,
        temperature: typeof temperature === "number" ? temperature : 0.8,
        stream: false,
        enable_thinking: false,
        messages: [
          {
            role: "system",
            content: "只输出合法 JSON 对象，不要 Markdown 代码块。",
          },
          { role: "user", content: userPrompt },
        ],
      };
      if (typeof maxTokens === "number" && maxTokens > 0) {
        body.max_tokens = maxTokens;
      }
      if (jsonMode) {
        body.response_format = { type: "json_object" };
      }

      const send = () =>
        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cfg.apiKey}`,
          },
          body: JSON.stringify(body),
          signal: ctrl.signal,
        });

      let res = await send();
      let rawText = await res.text();

      async function retry() {
        res = await send();
        rawText = await res.text();
      }

      if (!res.ok && res.status === 400 && body.response_format) {
        delete body.response_format;
        await retry();
      }
      if (!res.ok && res.status === 400 && body.max_tokens) {
        delete body.max_tokens;
        await retry();
      }

      if (!res.ok && res.status === 429 && Date.now() - started < waitMs - 3000) {
        await new Promise((r) => setTimeout(r, 800));
        await retry();
      }
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
      if (isAbortErr(err) || ctrl.signal.aborted) {
        lastError = `请求超时（>${Math.round(waitMs / 1000)}s）`;
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

  /** 合流：关思考、短输出；默认 qwen-turbo，避免 plus（Qwen3）开思考后一直不返回。 */
  function flavorChatOpts(extra = {}) {
    const cfg = getConfig();
    const rawModel = String(cfg.model || DEFAULTS.model);
    return {
      timeoutMs: 25000,
      temperature: 0.85,
      maxTokens: 500,
      jsonMode: false,
      model: /turbo|flash/i.test(rawModel) ? rawModel : "qwen-turbo",
      ...extra,
    };
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
      return sanitizeBeats(extractBeatsArray(obj));
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

  function canFlavorAi() {
    const cfg = getConfig();
    return Boolean(cfg.apiKey) && !skipUntilOk;
  }

  function parseJsonObject(raw) {
    if (!raw) return null;
    const trimmed = String(raw)
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start < 0 || end < start) return null;
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch (_) {
      return null;
    }
  }

  function wantedFlavorCount(payload = {}) {
    const n = Number(payload.optionCount);
    if (n >= 1 && n <= 3) return n | 0;
    return 3;
  }

  /** 谢家人：不能只点名一个人或只夸一件礼物 */
  function isSoloThanksLabel(label) {
    const s = String(label || "").trim();
    if (/大家|你们|全家|一家|各位|都/.test(s)) return false;
    const hits = [/思思/, /断头|老公/, /肠大爷|爷爷|老爸/, /黑老太|奶奶/].filter((re) =>
      re.test(s)
    );
    if (hits.length >= 2) return false;
    if (hits.length === 1) return true;
    if (/裙子|菜刀|毛线|胳膊|毛衣/.test(s)) return true;
    return false;
  }

  /** 会化成黑雾的是宁念自己，不能对家人说「你别变成黑雾」。 */
  function isInvertedFogLabel(text) {
    const s = String(text || "");
    if (!s) return false;
    if (/你别变成|你不要变成|你可别变成/.test(s)) return true;
    if (/你(会|要|别)?(变成|化成|化作)(四周的)?(一缕)?黑雾/.test(s)) return true;
    if (/别让(你|思思|断头|她|他)(变成|化成|化作)/.test(s)) return true;
    if (/(思思|断头).{0,8}(变成|化成|化作).{0,8}黑雾/.test(s)) return true;
    if (/把你变成/.test(s)) return true;
    return false;
  }

  function sanitizeFlavorOptions(obj, payload = {}) {
    const { canon, sideIntents = [], sideHints = [], sideOptions = [], forbid } = payload;
    const seeds = flavorIntentSeeds({ sideIntents, sideHints, sideOptions });
    const canonText = String(canon?.label || "").trim();
    const maxOpts = wantedFlavorCount(payload);
    const rawOpts = extractOptionsArray(obj).filter((o) => {
      if (typeof o === "object" && (o.canon === true || o.id === "canon")) return false;
      return true;
    });
    const options = rawOpts
      .map((o, i) => {
        const seed = seeds[i];
        const raw =
          typeof o === "string"
            ? o
            : o?.label || o?.text || o?.title || o?.content || "";
        const label = cleanFlavorLabel(raw);
        if (isWeakFlavorLabel(label)) return null;
        if (canonText && label === canonText) return null;
        if (payload.mode === "round" && isSoloThanksLabel(label)) return null;
        if (payload.mode === "farewell" && isInvertedFogLabel(label)) return null;
        const intent = String(
          (typeof o === "object" && (o.intent || o.meaning)) ||
            seed?.intent ||
            label
        )
          .replace(SPOILER, "……")
          .slice(0, 100);
        if (hitsForbid(label, forbid) || hitsForbid(intent, forbid)) return null;
        return {
          id: String(
            (typeof o === "object" && o.id) || seed?.id || `side_${i + 1}`
          ).slice(0, 24),
          label,
          intent,
          canon: false,
        };
      })
      .filter(Boolean)
      .slice(0, maxOpts);
    if (!options.length) return null;
    return {
      canonLabel: String(canon?.label || "继续。"),
      options,
    };
  }

  /**
   * 原神式合流岔路：只返回 AI 选项。失败不回落本地按钮稿。
   */
  async function generateFlavorOptions(payload = {}) {
    const seeds = flavorIntentSeeds(payload);
    if (!canFlavorAi()) {
      lastError = skipUntilOk ? "账号异常" : "未填写 API Key";
      setFlavorDebug({ stage: "options", source: "error", error: lastError });
      return { ok: false, source: "error", options: [], error: lastError };
    }
    const cfg = getConfig();
    const salt = `${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`;
    const present = payload.presentChars || "";
    const others = splitPresentNames(present)
      .filter((n) => n !== "宁念")
      .join("、");
    const qaOnly = payload.mode === "qa";
    const farewellOnly = payload.mode === "farewell";
    const chatOnly = payload.mode === "chat";
    const roundOnly = payload.mode === "round";
    const wantN = wantedFlavorCount(payload);
    const oneLine = wantN === 1;
    const sample = String(payload.sampleLabel || "").trim();
    const topic = String(payload.optionTopic || "").trim();
    const seedLines = qaOnly
      ? "三条必须是宁念会问出口的问句，角度互不相同；禁止复述她刚问过的话，禁止把正史下一句写成选项。"
      : farewellOnly
        ? "必须正好 3 条。都是宁念舍不得离开、舍不得失去对方的话，不是问句；三条角度不同（不想走/不想失去对方/想留下陪对方），每次措辞要新；禁止把正史下一句旁白写成选项。会化成黑雾的是宁念自己，对方是诡异家人不会化雾；禁止说「你别变成黑雾」「别让思思/断头变成黑雾」。若提黑雾，只能说自己怕化雾、或不想走。"
      : oneLine
        ? [
            "必须正好 1 条。",
            topic ? `主题锁定：${topic}。禁止另起别的事。` : "",
            sample
              ? `口气类似「${sample}」，每次措辞要新；不要整句照抄例句，但主题必须仍是补/缝，禁止改去晾、晒、洗、拧、停手。`
              : "禁止复述她刚说过的正史整句。",
            "禁止把正史下一句旁白写成选项。",
          ]
            .filter(Boolean)
            .join("")
      : roundOnly
        ? "必须正好 3 条。都是宁念当面感谢全家人的话：每条都要用「你们/大家/一家」谢所有人，禁止只点名思思或断头或肠大爷或黑老太其中一人，禁止只夸裙子/菜刀/毛线/胳膊其中一件。三条角度不同（谢礼物/谢护着/出门道别），每次措辞要新；禁止把正史下一句旁白写成选项。"
      : chatOnly
        ? [
            "必须正好 3 条。都是宁念当场说出口的话，角度互不相同；禁止把正史下一句旁白写成选项。",
            topic ? `主题锁定：${topic}。禁止另起吃饭、找人、打听妈妈这种无关类别。` : "",
          ]
            .filter(Boolean)
            .join("")
      : seeds.length
        ? `可参考这些意图（不必照搬类别，也可以完全另起）：\n${seeds
            .map((h, i) => `${i + 1}. ${h.intent}`)
            .join("\n")}`
        : "旁支类别不要固定：按在场角色和当前场面另起 2～3 句宁念会说出口的话，禁止每次都是纠正称呼/追问原因/再亲一口。";
    const prompt = qaOnly
      ? [
          "为恐怖 Gal「幸福之家」写宁念的追问选项（每次措辞都要新）。",
          '格式：{"options":[{"id":"side_1","label":"...","intent":"..."}]}',
          "必须正好 3 条。label 是宁念当场问出口的一句（8～24字，带疑问），直球、好奇、有点愣。",
          "intent 写谁来答更合适（红姐或俊哥）以及对方会怎么简短作答。",
          "本场是进楼前规则问答，禁止套用家里诡异误会，禁止剧透幸福之心、异世之门、宁君安、红姐图谋、第七天结局。",
          "禁止 Bad End，禁止把正史下一句旁白写成选项。",
          present ? `在场：${present}` : "",
          others ? `可回答的人：${others}` : "",
          payload.plotHint ? `本场已知规则：${payload.plotHint}` : "",
          payload.npcHint ? `人物口吻：${payload.npcHint}` : "",
          payload.resumeHint ? `正史下一句（禁止写成选项）：${payload.resumeHint}` : "",
          seedLines,
          `场景：${payload.prompt || ""}`,
          payload.context ? `前文（按时间顺序）：\n${payload.context}` : "",
          `盐：${salt}`,
        ]
          .filter(Boolean)
          .join("\n")
      : farewellOnly
      ? [
          "为恐怖 Gal「幸福之家」写宁念的不舍选项（每次措辞都要新）。",
          '格式：{"options":[{"id":"side_1","label":"...","intent":"..."}]}',
          "必须正好 3 条。label 是宁念当场说出口的一句（8～24字），舍不得走、舍不得失去对方、想留下来陪对方。直球、心软，不是问句。",
          `intent 写${others || "对方"}会怎么短短接一句：温柔、决绝，不会答应让宁念留下变成黑雾。`,
          "铁律：活人留下才会化成黑雾，化雾的是宁念；对方是诡异，不会变成黑雾。禁止对对方说「你别变成黑雾」。禁止把掏心/开锁再演一遍。禁止答应让她留下并真的化雾。禁止 Bad End。禁止把正史下一句旁白写成选项。",
          present ? `在场：${present}` : "",
          payload.plotHint ? `本场情境：${payload.plotHint}` : "",
          payload.npcHint ? `人物口吻：${payload.npcHint}` : "",
          payload.resumeHint ? `正史下一句（禁止写成选项）：${payload.resumeHint}` : "",
          forbidHint(payload.forbid),
          seedLines,
          `场景：${payload.prompt || ""}`,
          payload.context ? `前文（按时间顺序）：\n${payload.context}` : "",
          `盐：${salt}`,
        ]
          .filter(Boolean)
          .join("\n")
      : [
          "为恐怖 Gal「幸福之家」写可合流岔路的选项按钮（每次措辞要新）。",
          '格式：{"options":[{"id":"side_1","label":"...","intent":"..."}]}',
          oneLine
            ? "不要写正史按钮。options 必须正好 1 条旁支。主题锁定，不要另起类别。"
            : roundOnly || chatOnly
            ? "不要写正史按钮。options 必须正好 3 条旁支。"
            : "不要写正史按钮。options 必须 2～3 条旁支。",
          FLAVOR_WORLD,
          "label 是宁念当场说出口的一句台词，用她的误会口吻；intent 写清作者层面的真相反应（对方心虚/顺着误会）。",
          topic && !oneLine ? `三条都必须围绕：${topic}。禁止另起无关类别。` : "",
          oneLine
            ? [
                "像日常对话短句，8～24 字；禁止类型标签。能接回正史，禁止 Bad End。",
                topic ? `她开口必须是：${topic}。` : "",
                sample
                  ? `口气类似「${sample}」。不要整句照抄，也不要因为「不要重复」就改去做晾、晒、洗、拧、停针。`
                  : "",
              ]
                .filter(Boolean)
                .join("")
            : roundOnly
            ? "像日常对话短句，8～24 字；禁止类型标签。三条都是当面感谢全家人，必须对着「你们/大家」说，禁止拆成三个人各谢一次；能接回正史，禁止 Bad End。"
            : "像日常对话短句，8～24 字；禁止类型标签。三条旁支口气或意图要不同；能接回正史，禁止 Bad End。",
          present ? `在场：${present}` : "",
          others ? `可互动对象：${others}` : "",
          payload.plotHint ? `本场情境：${payload.plotHint}` : "",
          payload.npcHint ? `人物口吻：${payload.npcHint}` : "",
          `正史意图（旁支最终要回到，但不要复述正史按钮）：${payload.canon?.intent || ""}`,
          payload.resumeHint ? `正史下一句（禁止写成选项）：${payload.resumeHint}` : "",
          forbidHint(payload.forbid),
          seedLines,
          `场景：${payload.prompt || ""}`,
          payload.context ? `前文（按时间顺序）：\n${payload.context}` : "",
          `盐：${salt}`,
        ]
          .filter(Boolean)
          .join("\n");
    try {
      let raw = await chatCompletions(cfg, prompt, flavorChatOpts({ maxTokens: 700 }));
      let parsed = sanitizeFlavorOptions(parseJsonObject(raw), payload);
      if (!parsed?.options?.length && (oneLine || topic || roundOnly || farewellOnly)) {
        raw = await chatCompletions(
          cfg,
          roundOnly
            ? `${prompt}\n上一稿错了：不要按人拆开谢。三条都必须谢全家人，用你们/大家，禁止只点一个人或一件礼物。`
            : farewellOnly
            ? `${prompt}\n上一稿把黑雾搞反了。会化雾的是宁念自己，禁止对对方说你别变成黑雾。三条仍是舍不得走/舍不得失去对方/想留下陪对方。`
            : `${prompt}\n上一稿跑题了。必须仍是「${topic || sample || "当前场面该说的那句"}」，禁止改去做别的事。`,
          flavorChatOpts({ maxTokens: 700 })
        );
        parsed = sanitizeFlavorOptions(parseJsonObject(raw), payload);
      }
      if (!parsed?.options?.length) {
        lastError = "AI 选项无法解析";
        setFlavorDebug({
          stage: "options",
          source: "error",
          error: lastError,
          sample: String(raw || "").slice(0, 80),
        });
        return { ok: false, source: "error", options: [], error: lastError };
      }
      lastError = "";
      setFlavorDebug({
        stage: "options",
        source: "ai",
        error: "",
        sample: parsed.options.map((o) => o.label).join(" / "),
      });
      return { ok: true, source: "ai", ...parsed };
    } catch (err) {
      const msg = lastError || err?.message || "选项生成失败";
      lastError = msg;
      setFlavorDebug({ stage: "options", source: "error", error: msg });
      return { ok: false, source: "error", options: [], error: msg };
    }
  }

  /**
   * 旁支分段生成。失败返回空 beats，不使用本地罐头对白。
   */
  async function generateFlavorSegment(payload = {}) {
    if (!canFlavorAi()) {
      lastError = skipUntilOk ? "账号异常" : "未填写 API Key";
      setFlavorDebug({
        stage: `segment-${payload.phase || "open"}`,
        source: "error",
        error: lastError,
      });
      return { ok: false, beats: [], source: "error", error: lastError };
    }
    const cfg = getConfig();
    const phase = payload.phase === "close" ? "close" : "open";
    const spokenAlready = !!payload.spokenAlready;
    const qaOnly = payload.mode === "qa";
    const farewellOnly = payload.mode === "farewell";
    const oneReply = qaOnly || farewellOnly;
    const roundNames = (
      Array.isArray(payload.roundSpeakers) && payload.roundSpeakers.length
        ? payload.roundSpeakers
        : splitPresentNames(payload.presentChars).filter((n) => n !== "宁念")
    ).filter(Boolean);
    const roundOnly = payload.mode === "round" && roundNames.length > 0;
    const roundOrder = roundOnly ? shuffleNames(roundNames) : roundNames;
    const maxN = oneReply
      ? 1
      : roundOnly
        ? roundNames.length + 2
        : phase === "open"
          ? spokenAlready
            ? 5
            : 6
          : 2;
    const minN = oneReply ? 1 : roundOnly ? roundNames.length : phase === "open" ? (spokenAlready ? 3 : 4) : 1;
    const prevBeats = payload.previousBeats || [];
    const prev = prevBeats
      .map((b) => `${b.speaker || b.type}：${b.text}`)
      .join(" / ")
      .slice(0, 280);
    const present = payload.presentChars || "宁念、思思";
    const others =
      splitPresentNames(present)
        .filter((n) => n !== "宁念")
        .join("、") || "在场角色";

    if ((roundOnly || farewellOnly) && phase === "close") {
      return { ok: true, beats: [], source: "ai" };
    }

    const buildPrompt = (extra = "") =>
      qaOnly
        ? [
            "为恐怖 Gal「幸福之家」写一问一答的答句 JSON。",
            `格式：{"beats":[{"type":"say","speaker":"${others.split("、")[0] || "红姐"}","text":"..."}]}`,
            "必须恰好 1 条 type=say。只能红姐或俊哥其中一人回答，禁止宁念再说话，禁止旁白，禁止第二轮。",
            "本场是进楼前规则问答。答句≤50字，口吻符合角色；禁止 Bad End，禁止剧透后文家人/室内诡异。",
            `可发言：${others}。选更合适的人答。`,
            payload.plotHint ? `已知规则：${payload.plotHint}` : "",
            `宁念已经问了：「${payload.optionLabel || ""}」。禁止再写这句。`,
            payload.npcHint ? `人物口吻：${payload.npcHint}` : "",
            extra,
            `场景：${payload.prompt || ""}`,
            payload.context ? `前文（按时间顺序）：\n${payload.context}` : "",
            `意图：${payload.optionIntent || ""}`,
            payload.resumeHint ? `正史下一句（禁止写成答句）：${payload.resumeHint}` : "",
            `盐：${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`,
          ]
            .filter(Boolean)
            .join("\n")
        : farewellOnly
        ? [
            "为恐怖 Gal「幸福之家」写一句诀别接话 JSON。",
            `格式：{"beats":[{"type":"say","speaker":"${others.split("、")[0] || "断头"}","text":"..."}]}`,
            "必须恰好 1 条 type=say。只能对方回答，禁止宁念再说话，禁止旁白，禁止第二轮。",
            `可发言：${others || "断头"}。`,
            "本场不是误会喜剧。答句≤50字：温柔、决绝，接她的不舍，但不会答应让宁念留下变成黑雾。会化雾的是宁念，不是对方；禁止说自己要变成黑雾。禁止把掏心/开锁再演一遍。禁止 Bad End。",
            payload.plotHint ? `本场情境：${payload.plotHint}` : "",
            `宁念已经说了：「${payload.optionLabel || ""}」。禁止再写这句。`,
            payload.npcHint ? `人物口吻：${payload.npcHint}` : "",
            extra,
            `场景：${payload.prompt || ""}`,
            payload.context ? `前文（按时间顺序）：\n${payload.context}` : "",
            `意图：${payload.optionIntent || ""}`,
            payload.resumeHint ? `正史下一句（禁止写成答句）：${payload.resumeHint}` : "",
            forbidHint(payload.forbid),
            `盐：${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`,
          ]
            .filter(Boolean)
            .join("\n")
        : roundOnly
        ? [
            "为恐怖 Gal「幸福之家」写家人轮流接话的 JSON。",
            '格式：{"beats":[{"type":"say","speaker":"...","text":"..."}]}',
            `必须恰好 ${roundNames.length} 条 type=say。speaker 必须正好覆盖且仅覆盖：${roundOrder.join("、")}（每人恰好一句，按此顺序写）。`,
            "禁止宁念再说话，禁止旁白，禁止第二轮，禁止两人抢同一句。",
            "每人接她刚才的感谢，口吻符合角色；可以心虚、顺着误会、互相抢功。每条≤50字。禁止 Bad End。",
            "不要写道具系统名，用菜刀、裙子、毛线团、胳膊这类她看见的词。",
            FLAVOR_WORLD,
            `在场：${present}`,
            payload.plotHint ? `本场真相（只给作者，宁念不知道）：${payload.plotHint}` : "",
            `宁念已经把这句说出口了：「${payload.optionLabel || ""}」。禁止再写这句话。`,
            payload.npcHint ? `人物口吻：${payload.npcHint}` : "",
            extra,
            `场景：${payload.prompt || ""}`,
            payload.context ? `前文（按时间顺序）：\n${payload.context}` : "",
            `意图：${payload.optionIntent || ""}`,
            payload.resumeHint ? `正史下一句（禁止写成答句）：${payload.resumeHint}` : "",
            forbidHint(payload.forbid),
            `盐：${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`,
          ]
            .filter(Boolean)
            .join("\n")
        : [
            "为恐怖 Gal「幸福之家」写可合流旁支 JSON。",
            `格式：{"beats":[{"type":"narration|say","speaker":"宁念或${others}","text":"..."}]}`,
            `本段=${phase === "open" ? "展开" : "收束"}，写 ${minN}～${maxN} 条；每条≤70字；误会喜剧；禁止 Bad End。`,
            FLAVOR_WORLD,
            `在场角色：${present}。这是宁念和「${others}」的互动戏。`,
            `speaker 只能是：宁念、${others}。不要让不在场的人开口。`,
            "宁念只能按误会说话；对方必须按真相心虚地接，禁止OOC，禁止把误会写成真事。",
            payload.plotHint ? `本场情境：${payload.plotHint}` : "",
            payload.optionTopic
              ? `对白必须围绕：${payload.optionTopic}。禁止跑题。`
              : "",
            spokenAlready
              ? `宁念已经把这句说出口了：「${payload.optionLabel || ""}」。禁止再写这句话或同义改写。`
              : "选项是宁念说出口的台词，展开时可以由她先说，但不要一字不差念按钮两次。",
            payload.npcHint ? `人物口吻：${payload.npcHint}` : "",
            phase === "open"
              ? spokenAlready
                ? `从「${others}」type=say 接话开始；后面宁念可以再说话。对方至少 1 句 say。内心独白最多 1 条，且不能和相邻台词同义重复。`
                : `必须有对白：宁念 type=say 对「${others}」说话，对方 type=say 接话；至少两轮。内心独白最多 1 条，且不能和相邻台词同义重复。`
              : "只补已播之后尚未发生的收束，禁止把已播对白再写一遍或同义改写，禁止再开一轮完整对白，禁止写出正史下一句原文。",
            extra,
            `场景：${payload.prompt || ""}`,
            payload.context ? `前文（按时间顺序）：\n${payload.context}` : "",
            `宁念刚才说的是：${payload.optionLabel || ""}`,
            `意图：${payload.optionIntent || ""}`,
            `要回到：${payload.canonIntent || ""}`,
            payload.resumeHint ? `正史入口（不要把这句写进 beats）：${payload.resumeHint}` : "",
            forbidHint(payload.forbid),
            prev ? `已播（禁止再输出）：${prev}` : "",
            `盐：${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`,
          ]
            .filter(Boolean)
            .join("\n");

    const parseBeats = (raw) =>
      dropRepeatFlavorBeats(
        normalizeFlavorBeats(
          sanitizeBeats(extractBeatsArray(parseJsonObject(raw)), {
            maxBeats: maxN,
            maxText: oneReply || roundOnly ? 80 : 100,
            ban: SPOILER,
          }),
          present
        ),
        prevBeats.concat(
          payload.resumeHint ? [{ text: payload.resumeHint }] : [],
          payload.optionLabel ? [{ text: payload.optionLabel }] : []
        )
      ).filter((b) => !hitsForbid(b?.text, payload.forbid));

    const pickQa = (list) => pickQaAnswer(list, others);

    try {
      let raw = await chatCompletions(
        cfg,
        buildPrompt(),
        flavorChatOpts({
          maxTokens: oneReply ? 220 : roundOnly ? 700 : phase === "open" ? 900 : 280,
        })
      );
      let beats = parseBeats(raw);
      if (oneReply) beats = pickQa(beats);
      if (roundOnly) beats = pickRoundAnswers(beats, roundNames);
      if (
        !oneReply &&
        !roundOnly &&
        phase === "open" &&
        beats.length >= 2 &&
        !flavorHasNpcTalk(beats, phase, present, { spokenAlready })
      ) {
        raw = await chatCompletions(
          cfg,
          buildPrompt(
            spokenAlready
              ? `上一稿缺少对方接话。必须有 speaker=${others} 的 say。禁止重复宁念已经说出口的那句，禁止不在场的人开口。`
              : `上一稿缺少角色对白。必须同时有 speaker=宁念 和 speaker=${others} 的 say。禁止重复同一句，禁止不在场的人开口。`
          ),
          flavorChatOpts({ maxTokens: 900 })
        );
        const retry = parseBeats(raw);
        if (retry.length && flavorHasNpcTalk(retry, phase, present, { spokenAlready })) beats = retry;
        else if (retry.length > beats.length) beats = retry;
      }
      if (oneReply && !beats.length) {
        raw = await chatCompletions(
          cfg,
          buildPrompt(`上一稿没有可用答句。必须恰好 1 条 speaker 为 ${others} 之一的 say。`),
          flavorChatOpts({ maxTokens: 220 })
        );
        beats = pickQa(parseBeats(raw));
      }
      if (roundOnly && beats.length < roundNames.length) {
        raw = await chatCompletions(
          cfg,
          buildPrompt(
            `上一稿没有让这些人各说一句。必须恰好 ${roundNames.length} 条 say，speaker 正好是：${roundOrder.join("、")}。禁止宁念，禁止旁白，禁止漏人。`
          ),
          flavorChatOpts({ maxTokens: 700 })
        );
        const retry = pickRoundAnswers(parseBeats(raw), roundNames);
        if (retry.length >= beats.length) beats = retry;
      }
      if (phase === "close") {
        lastError = "";
        setFlavorDebug({
          stage: "segment-close",
          source: "ai",
          error: "",
          sample: beats.map((b) => b.text).join(" / ").slice(0, 80),
        });
        return { ok: true, beats, source: "ai" };
      }
      if (!oneReply && !roundOnly && beats.length < 2) {
        lastError = "AI 旁支过短或无法解析";
        setFlavorDebug({
          stage: `segment-${phase}`,
          source: "error",
          error: lastError,
        });
        return { ok: false, beats: [], source: "error", error: lastError };
      }
      if (oneReply && !beats.length) {
        lastError = "AI 答句无法解析";
        setFlavorDebug({
          stage: "segment-qa",
          source: "error",
          error: lastError,
        });
        return { ok: false, beats: [], source: "error", error: lastError };
      }
      if (roundOnly && beats.length < roundNames.length) {
        lastError = "家人轮流回应不完整";
        setFlavorDebug({
          stage: "segment-round",
          source: "error",
          error: lastError,
        });
        return { ok: false, beats: [], source: "error", error: lastError };
      }
      lastError = "";
      setFlavorDebug({
        stage: `segment-${phase}`,
        source: "ai",
        error: flavorHasNpcTalk(beats, phase, present, { spokenAlready }) ? "" : "对白偏少",
        sample: beats
          .slice(0, 3)
          .map((b) => `${b.speaker || b.type}:${b.text}`)
          .join(" / ")
          .slice(0, 80),
      });
      return { ok: true, beats, source: "ai" };
    } catch (_) {
      const err = lastError || "旁支生成失败";
      setFlavorDebug({ stage: `segment-${phase}`, source: "error", error: err });
      return { ok: false, beats: [], source: "error", error: err };
    }
  }

  async function testConnection() {
    const cfg = getConfig();
    if (!cfg.apiKey) {
      lastError = "未填写 API Key";
      return { ok: false, error: lastError };
    }
    try {
      const raw = await chatCompletions(cfg, '只输出 JSON：{"ok":true}', {
        timeoutMs: 20000,
        jsonMode: false,
        maxTokens: 40,
      });
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
            stream: false,
            enable_thinking: false,
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
    getFlavorDebug,
    normalizeEndpoint,
    generateFailBeats,
    generateFlavorOptions,
    generateFlavorSegment,
    dropRepeatFlavorBeats,
    flavorIntentSeeds,
    canFlavorAi,
    chatNpc,
    testConnection,
    DEFAULTS,
  };
})();
