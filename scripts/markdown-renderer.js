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
  const renderer = new marked.Renderer();

  renderer.code = function (code, language) {
    if (typeof code === "object") {
      language = code.lang;
      code = code.text;
    }
    const lang = language && Prism.languages[language] ? language : "plaintext";
    const grammar = Prism.languages[lang] || Prism.languages.plaintext;
    const html = Prism.highlight(code, grammar, lang);
    return `<pre class="language-${lang}"><code class="language-${lang}">${html}</code></pre>`;
  };

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
  });
}

async function loadMarkdown(type, slug) {
  const url = `/${type}/${slug}.md`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.text();
    const html = marked.parse(raw);

    const postView = document.getElementById("post-view");
    const postContent = document.getElementById("post-content");
    const postSection =
      document.getElementById("posts") || document.getElementById("projects");

    postContent.innerHTML = html;
    Prism.highlightAllUnder(postContent);
    renderKaTeX(postContent);

    postView.style.display = "block";
    if (postSection) postSection.style.display = "none";

    const h1 = postContent.querySelector("h1");
    if (h1) document.title = h1.textContent;
  } catch (err) {
    console.error("Failed to load markdown:", err);
    const postContent = document.getElementById("post-content");
    if (postContent) {
      postContent.innerHTML = `<p style="color:var(--color-error,red)">
           Could not load <code>${url}</code>: ${err.message}
         </p>`;
      document.getElementById("post-view").style.display = "block";
    }
  }
}

function closePost() {
  const params = new URLSearchParams(window.location.search);
  params.delete("p");
  const base = window.location.pathname;
  const qs = params.toString();
  window.history.pushState({}, "", qs ? `${base}?${qs}` : base);

  document.getElementById("post-view").style.display = "none";
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
      document.getElementById("post-view").style.display = "none";
      const postSection =
        document.getElementById("posts") || document.getElementById("projects");
      if (postSection) postSection.style.display = "block";
    }
  });
});
