const PAGE_TYPE = (() => {
  const path = window.location.pathname;
  if (path.startsWith("/projects")) return "projects";
  if (path.startsWith("/posts")) return "posts";
  return null;
})();

function renderKaTeX(element) {
  if (typeof renderMathInElement === "undefined") return;
  renderMathInElement(element, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
  });
}

function setupMarked() {
  const renderer = {
    code({ text, lang }) {
      const language = lang && Prism.languages[lang] ? lang : "plaintext";
      const grammar = Prism.languages[language];
      const html = Prism.highlight(text, grammar, language);
      return `<pre class="language-${language}"><code class="language-${language}">${html}</code></pre>`;
    },

    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const escapedText = text
        .toLowerCase()
        .replace(/[^\w\uAC00-\uD7A3\u4E00-\u9FFF]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return `
        <h${depth} id="${escapedText}">
          <a class="anchor" href="#${escapedText}" aria-hidden="true">
            <span class="octicon-link"></span>
          </a>
          ${text}
        </h${depth}>`;
    },

    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const isExternal = href && href.startsWith("http");
      const target = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      const titleAttr = title ? ` title="${title}"` : "";
      return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
    },

    image({ href, title, text }) {
      const titleAttr = title ? ` title="${title}"` : "";
      return `<figure>
        <img src="${href}" alt="${text}"${titleAttr} loading="lazy" />
        ${title ? `<figcaption>${title}</figcaption>` : ""}
      </figure>`;
    },
  };

  marked.use({ renderer });
}

function stripFrontMatter(raw) {
  if (!raw.trimStart().startsWith("---")) return { content: raw, meta: {} };

  const lines = raw.split("\n");
  let end = -1;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trimEnd() === "---") {
      end = i;
      break;
    }
  }

  if (end === -1) return { content: raw, meta: {} };

  const yamlLines = lines.slice(1, end);
  const content = lines
    .slice(end + 1)
    .join("\n")
    .trimStart();

  const meta = {};
  for (const line of yamlLines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (!match) continue;
    const [, key, val] = match;
    meta[key] = val.replace(/^"|"$/g, "").trim();
  }

  return { content, meta };
}

async function loadMarkdown(type, slug) {
  const url = `/${type}/${slug}.md`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.text();
    const { content, meta } = stripFrontMatter(raw);
    const html = marked.parse(content);

    const postView = document.getElementById("markdown-view");
    const postContent = document.getElementById("markdown-content");
    const postSection =
      document.getElementById("posts") || document.getElementById("projects");

    postContent.innerHTML = html;
    Prism.highlightAllUnder(postContent);
    renderKaTeX(postContent);

    postView.style.display = "block";
    if (postSection) postSection.style.display = "none";

    const urlParams = new URLSearchParams(window.location.search);
    const langFilter = urlParams.get("lang") || "ko";
    document.title = window.__LANG__?.[langFilter]?.head.title.replace(
      /::.*/,
      `:: ${meta.title}`,
    );
    document.getElementById("markdown-title").textContent = meta.title;
  } catch (err) {
    console.error("Failed to load markdown:", err);
    const postContent = document.getElementById("markdown-content");
    if (postContent) {
      postContent.innerHTML = `<p style="color:var(--color-error,red)">
           Could not load <code>${url}</code>: ${err.message}
         </p>`;
      document.getElementById("markdown-view").style.display = "block";
    }
  }
}

function closeRenderer() {
  const params = new URLSearchParams(window.location.search);
  params.delete("p");
  const base = window.location.pathname;
  const qs = params.toString();
  window.history.pushState({}, "", qs ? `${base}?${qs}` : base);

  document.getElementById("markdown-view").style.display = "none";
  const postSection =
    document.getElementById("posts") || document.getElementById("projects");
  if (postSection) postSection.style.display = "block";
  document.title = document.querySelector("title")?.dataset?.i18n ?? "Posts";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!PAGE_TYPE) return;

  setupMarked();

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("p");

  if (slug) {
    loadMarkdown(PAGE_TYPE, slug);
  }

  window.addEventListener("popstate", () => {
    const p = new URLSearchParams(window.location.search).get("p");
    if (p) {
      loadMarkdown(PAGE_TYPE, p);
    } else {
      document.getElementById("markdown-view").style.display = "none";
      const postSection =
        document.getElementById("posts") || document.getElementById("projects");
      if (postSection) postSection.style.display = "block";
    }
  });
});
