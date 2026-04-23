(() => {
  const SHORTCUT_KEY = "k";
  const SHORTCUT_KEY_ALT = "/";
  const DEBOUNCE_MS = 150;
  const MAX_RESULTS = 12;

  function t(key, ...args) {
    const lang = getLang();
    const dict = window.__LANG__[lang].spotlight;
    const val = dict[key];
    return typeof val === "function" ? val(...args) : (val ?? key);
  }

  let allItems = [];
  let loaded = false;
  let loading = false;
  let debTimer = null;
  let activeIdx = -1;

  function getLang() {
    return new URLSearchParams(window.location.search).get("lang") || "ko";
  }

  function esc(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stripTags(s = "") {
    return s
      .replace(/<[^>]+>/g, "")
      .replace(/&[a-z]+;/gi, " ")
      .trim();
  }

  function cleanCDATA(s = "") {
    return stripTags(s.replace(/<!\[CDATA\[|\]\]>/g, ""));
  }

  function guessType(url = "") {
    if (url.includes("/posts")) return "post";
    if (url.includes("/projects")) return "project";
    if (url.includes("/certifications")) return "cert";
    if (url.includes("/education")) return "edu";
    if (url.includes("/experience")) return "exp";
    if (url.includes("/research")) return "research";
    if (url.includes("/activities")) return "activity";
    return "page";
  }

  const TYPE_LABEL = {
    post: "Post",
    project: "Project",
    cert: "Cert",
    edu: "Education",
    exp: "Experience",
    research: "Research",
    activity: "Activity",
    page: "Page",
  };

  const TYPE_ICON = {
    post: "💾",
    project: "💿",
    cert: "🪪",
    edu: "🎓",
    exp: "🛠️",
    research: "📜",
    activity: "🏆",
    page: "📄",
  };

  const CHO = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  function getChosung(str = "") {
    return [...str]
      .map((ch) => {
        const c = ch.charCodeAt(0) - 0xac00;
        return c >= 0 && c <= 11171 ? CHO[Math.floor(c / 588)] : ch;
      })
      .join("");
  }

  function isChosungOnly(s) {
    return /^[ㄱ-ㅎ]+$/.test(s);
  }

  function koreanMatch(text = "", query = "") {
    const t = text.toLowerCase(),
      q = query.toLowerCase();
    if (t.includes(q)) return true;
    if (isChosungOnly(q)) return getChosung(t).includes(q);
    return false;
  }

  function buildIdx(item) {
    return [
      item.title || "",
      item.description || "",
      (item.tags || []).join(" "),
      (item.url || "").split("/").filter(Boolean).pop() || "",
    ]
      .join(" ")
      .toLowerCase();
  }

  function tryMath(expr) {
    const raw = expr.replace(/^=/, "").trim();
    if (!raw) return null;

    if (window.math) {
      try {
        const result = window.math.evaluate(raw);
        if (typeof result === "number" && isFinite(result)) {
          return { expr: raw, val: String(result) };
        }
        if (
          result &&
          typeof result === "object" &&
          result.constructor?.name === "Unit"
        ) {
          return { expr: raw, val: result.toString() };
        }
        return null;
      } catch {
        return null;
      }
    }

    if (/[가-힣ㄱ-ㅎa-zA-Z]/.test(raw)) return null;
    if (!/[\d]/.test(raw)) return null;
    if (!/[+\-*/^%()]/.test(raw)) return null;

    try {
      const safe = raw.replace(/\^/g, "**").replace(/[^0-9+\-*/().\s%eE]/g, "");
      // eslint-disable-next-line no-new-func
      const val = new Function(`"use strict";return(${safe})`)();
      if (typeof val === "number" && isFinite(val))
        return { expr: raw, val: String(val) };
    } catch {
      /* noop */
    }
    return null;
  }

  function highlight(text = "", query = "") {
    if (!query) return esc(text);
    const re = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    return esc(text).replace(re, '<mark class="sp-hl">$1</mark>');
  }

  const JSON_SOURCES = [
    {
      key: "__POSTS__",
      file: "/posts.json",
      type: "post",
      titleFn: (p) => p.title,
      descFn: (p) => p.description,
      urlFn: (p) => p.url,
      tagsFn: (p) => p.tags || [],
    },
    {
      key: "__PROJECTS__",
      file: "/projects.json",
      type: "project",
      titleFn: (p) => p.title,
      descFn: (p) => p.description,
      urlFn: (p) => p.projectUrl,
      tagsFn: (p) => [...(p.skills || []), ...(p.platform || [])],
    },
    {
      key: "__CERTIFICATIONS__",
      file: "/certifications.json",
      type: "cert",
      titleFn: (p) => p.title,
      descFn: (p) => p.description,
      urlFn: () => null,
      tagsFn: (p) => [p.type].filter(Boolean),
    },
    {
      key: "__ACTIVITIES__",
      file: "/co-curricular-activities.json",
      type: "activity",
      titleFn: (p) => p.title,
      descFn: (p) => (p.achievement || []).join(" "),
      urlFn: () => null,
      tagsFn: (p) => [p.type].filter(Boolean),
    },
    {
      key: "__EDUCATION__",
      file: "/education.json",
      type: "edu",
      titleFn: (p) => p.title,
      descFn: (p) => p.major || "",
      urlFn: () => null,
      tagsFn: (p) => [p.status].filter(Boolean),
    },
    {
      key: "__EXPERIENCE__",
      file: "/experience.json",
      type: "exp",
      titleFn: (p) => p.company,
      descFn: (p) => [p.department, p.position].filter(Boolean).join(" · "),
      urlFn: () => null,
      tagsFn: (p) => [p.type, p.status].filter(Boolean),
    },
    {
      key: "__RESEARCH__",
      file: "/research-publications.json",
      type: "research",
      titleFn: (p) => p.title,
      descFn: (p) => p.subtitle || "",
      urlFn: () => null,
      tagsFn: (p) => [p.type].filter(Boolean),
    },
  ];

  function mapItems(src, raw, langFilter) {
    return (Array.isArray(raw) ? raw : [])
      .filter((p) => !langFilter || p.lang === langFilter)
      .map((p) => ({
        title: src.titleFn(p) || "",
        description: src.descFn(p) || "",
        url: src.urlFn(p) || "",
        date: p.date || p.period?.[0] || "",
        type: src.type,
        tags: src.tagsFn(p),
      }))
      .filter((item) => item.title);
  }

  async function fetchJSON(src) {
    if (window[src.key]) return window[src.key];
    try {
      const res = await fetch(src.file);
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  }

  async function fetchRSS(lang) {
    try {
      const res = await fetch(`/${lang}/rss.xml`);
      if (!res.ok) return [];
      const doc = new DOMParser().parseFromString(
        await res.text(),
        "application/xml",
      );
      return [...doc.querySelectorAll("item")].map((item) => {
        const url =
          item.querySelector("link")?.textContent?.trim() ||
          item.querySelector("guid")?.textContent?.trim() ||
          "";
        return {
          title: cleanCDATA(item.querySelector("title")?.textContent || ""),
          url,
          description: cleanCDATA(
            item.querySelector("description")?.textContent || "",
          ),
          date: item.querySelector("pubDate")?.textContent || "",
          type: guessType(url),
          tags: [],
        };
      });
    } catch {
      return [];
    }
  }

  async function loadData() {
    if (loaded || loading) return;
    loading = true;

    const lang = getLang();
    const langFilter = new URLSearchParams(window.location.search).get("lang");

    const [jsonResults, rssItems] = await Promise.all([
      Promise.all(
        JSON_SOURCES.map(async (src) =>
          mapItems(src, await fetchJSON(src), langFilter),
        ),
      ),
      fetchRSS(lang),
    ]);

    const map = new Map();
    rssItems.forEach((item) => {
      if (item.url) map.set(item.url, item);
    });
    jsonResults.flat().forEach((item) => {
      const key = item.url || `__nurl__${item.type}__${item.title}`;
      const prev = map.get(key);
      if (!item.description && prev?.description)
        item.description = prev.description;
      map.set(key, item);
    });

    allItems = [...map.values()].map((item) => ({
      ...item,
      _idx: buildIdx(item),
    }));
    loaded = true;
    loading = false;
  }

  function search(q) {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const results = [];
    for (const item of allItems) {
      if (koreanMatch(item._idx, query)) {
        results.push(item);
        if (results.length >= MAX_RESULTS) break;
      }
    }
    return results;
  }

  function renderResults(query) {
    const container = document.getElementById("sp-results");
    activeIdx = -1;
    const q = query.trim();

    if (!q) {
      container.innerHTML = `<div class="sp-empty">${t("empty")}</div>`;
      return;
    }

    let html = "";

    const mathResult = tryMath(q);
    if (mathResult) {
      html += `
        <div class="sp-sect">${t("calcSection")}</div>
        <div class="sp-math">
          <span class="sp-math-expr">${esc(mathResult.expr)} =</span>
          <span class="sp-math-val">${esc(mathResult.val)}</span>
        </div>`;
    }

    if (!loaded) {
      html += `<div class="sp-loading">${t("loading")}</div>`;
      container.innerHTML = html;
      loadData().then(() => {
        const cur = document.getElementById("sp-input")?.value;
        if (cur) renderResults(cur);
      });
      return;
    }

    const results = search(q);

    if (!results.length && !mathResult) {
      container.innerHTML = `<div class="sp-empty">${t("noResult", esc(q))}</div>`;
      return;
    }

    if (results.length) {
      html += `<div class="sp-sect">${t("searchSection")} · ${t("resultCount", results.length)}</div>`;
      results.forEach((item, i) => {
        const desc = item.description
          ? highlight(item.description.slice(0, 90), q)
          : esc(item.url || "");
        const linkAttr = item.url
          ? `href="${esc(item.url)}"`
          : `href="#" onclick="return false"`;
        html += `
          <a class="sp-item" ${linkAttr} role="option" data-idx="${i}" tabindex="-1">
            <div class="sp-icon">${TYPE_ICON[item.type] || "→"}</div>
            <div class="sp-body">
              <div class="sp-title">${highlight(item.title, q)}</div>
              <div class="sp-desc">${desc}</div>
            </div>
            <span class="sp-badge">${TYPE_LABEL[item.type] || item.type}</span>
          </a>`;
      });
    }

    container.innerHTML = html;
  }

  function getItems() {
    return [...document.querySelectorAll("#sp-results .sp-item")];
  }

  function setActive(i) {
    const items = getItems();
    items.forEach((el) => el.classList.remove("sp-active"));
    if (i < 0 || i >= items.length) {
      activeIdx = -1;
      return;
    }
    activeIdx = i;
    items[i].classList.add("sp-active");
    items[i].scrollIntoView({ block: "nearest" });
  }

  function onKeydown(e) {
    const items = getItems();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIdx + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      items[activeIdx]?.click();
    } else if (e.key === "Escape") {
      close();
    }
  }

  function onInput() {
    clearTimeout(debTimer);
    const q = document.getElementById("sp-input").value;
    debTimer = setTimeout(() => renderResults(q), DEBOUNCE_MS);
  }

  function buildDOM() {
    if (document.getElementById("sp-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "sp-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", t("ariaLabel"));

    const hints = t("navHint");
    overlay.innerHTML = `
      <div id="sp-modal">
        <div id="sp-handle"></div>
        <div id="sp-input-row">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input id="sp-input" type="text" placeholder="${t("placeholder")}" autocomplete="off" spellcheck="false"/>
          <button id="sp-esc-btn" aria-label="${hints[2]}">esc</button>
        </div>
        <div id="sp-results" role="listbox"></div>
        <div id="sp-footer">
          <span class="sp-kh"><kbd>↑</kbd><kbd>↓</kbd> ${hints[0]}</span>
          <span class="sp-kh"><kbd>↵</kbd> ${hints[1]}</span>
          <span class="sp-kh"><kbd>esc</kbd> ${hints[2]}</span>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.getElementById("sp-esc-btn").addEventListener("click", close);
    document.getElementById("sp-input").addEventListener("input", onInput);
    document.getElementById("sp-input").addEventListener("keydown", onKeydown);

    let ty0 = 0;
    const modal = document.getElementById("sp-modal");
    modal.addEventListener(
      "touchstart",
      (e) => {
        ty0 = e.touches[0].clientY;
      },
      { passive: true },
    );
    modal.addEventListener(
      "touchend",
      (e) => {
        if (e.changedTouches[0].clientY - ty0 > 64) close();
      },
      { passive: true },
    );
  }

  function open() {
    buildDOM();
    document.getElementById("sp-overlay").classList.add("sp-open");
    const input = document.getElementById("sp-input");
    input.value = "";
    renderResults("");
    requestAnimationFrame(() => input.focus());
    if (!loaded && !loading) loadData();
  }

  function close() {
    document.getElementById("sp-overlay")?.classList.remove("sp-open");
    document.getElementById("sp-input")?.blur();
  }

  function toggle() {
    const o = document.getElementById("sp-overlay");
    !o || !o.classList.contains("sp-open") ? open() : close();
  }

  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    if (
      (tag === "INPUT" || tag === "TEXTAREA") &&
      document.activeElement.id !== "sp-input"
    )
      return;
    const mod = /mac/i.test(navigator.platform || "") ? e.metaKey : e.ctrlKey;
    if (mod && (e.key === SHORTCUT_KEY || e.key === SHORTCUT_KEY_ALT)) {
      e.preventDefault();
      toggle();
    }
  });

  window.spotlight = { open, close, toggle };
})();
