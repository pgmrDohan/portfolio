applyLanguage();
document.body.classList.remove("noscript");
document.body.style.opacity = "1";
document.getElementById("theme-preloader")?.remove();

function formatDate(dateStr, locale) {
  if (!dateStr) return "";

  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function getTagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const theme = document.documentElement.getAttribute("data-theme") || "dark";
  const [s, l] = theme === "dark" ? [100, 70] : [100, 30];
  return `hsl(${hue}, ${s}%, ${l}%)`;
}

function getActiveTag() {
  return new URLSearchParams(window.location.search).get("tag") || "all";
}

function setActiveTag(tag) {
  const params = new URLSearchParams(window.location.search);
  if (tag === "all") {
    params.delete("tag");
  } else {
    params.set("tag", tag);
  }
  const newUrl = [window.location.pathname, params.toString()]
    .filter(Boolean)
    .join("?");
  window.history.pushState({}, "", newUrl);
  updateTagButtons();
  if (window.__POSTS__?.length) renderPosts();
  if (window.__POSTS__?.length) renderProjects();
}

function updateTagButtons() {
  const active = getActiveTag();
  document.querySelectorAll("ul#tags button.tag").forEach((btn) => {
    const isActive = btn.id === active;
    btn.style.backgroundColor = isActive ? "var(--theme-color)" : "";
    btn.style.borderColor = "var(--theme-color)";
    btn.querySelector("small").style.color = isActive
      ? "var(--theme-background)"
      : "var(--theme-color)";
  });
}

function loadPostsTags() {
  if (!window.__POSTS__?.length) return;
  const tagsList = document.querySelector("ul#tags");
  if (!tagsList) return;

  tagsList
    .querySelectorAll("button.tag:not(#all)")
    .forEach((el) => el.remove());

  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");

  const allTags = [
    ...new Set(
      window.__POSTS__
        .filter((p) => p.lang === langFilter)
        .flatMap((p) => p.tags),
    ),
  ].sort();

  allTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "tag";
    btn.id = tag;
    btn.style.border = "0.1rem solid var(--theme-color)";
    btn.innerHTML = `<small style="color:var(--theme-color)">${tag}</small>`;
    btn.addEventListener("click", () => setActiveTag(tag));
    tagsList.appendChild(btn);
  });

  updateTagButtons();
}

function loadProjectsTags() {
  if (!window.__PROJECTS__?.length) return;
  const tagsList = document.querySelector("ul#tags");
  if (!tagsList) return;

  tagsList
    .querySelectorAll("button.tag:not(#all)")
    .forEach((el) => el.remove());

  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");

  const allTags = [
    ...new Set(
      window.__PROJECTS__
        .filter((p) => p.lang === langFilter)
        .flatMap((p) => [...(p.skills || []), ...(p.platform || [])]),
    ),
  ].sort();

  allTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "tag";
    btn.id = tag;
    btn.style.border = "0.1rem solid var(--theme-color)";
    btn.innerHTML = `<small style="color:var(--theme-color)">${tag}</small>`;
    btn.addEventListener("click", () => setActiveTag(tag));
    tagsList.appendChild(btn);
  });

  updateTagButtons();
}

function renderPosts() {
  if (!window.__POSTS__) return;
  const postsList = document.querySelector("ul#posts");
  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");
  const activeTag = getActiveTag();
  const locale = window.__LANG__?.[langFilter]?.locale || "en-US";

  const filtered = window.__POSTS__
    .filter((p) => !langFilter || p.lang === langFilter)
    .filter((p) => activeTag === "all" || p.tags.includes(activeTag))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  postsList.innerHTML = filtered
    .map((post) => {
      const isEdited = post.edited && post.edited !== post.date;
      const rawDate = post.edited || post.date || "";
      const displayDate = formatDate(rawDate, locale);
      const editedLabel =
        window.__LANG__?.[langFilter]?.posts?.edited || "edited";
      return `
        <li class="mt-lg">
          <a href="${post.url}">
            <h3>${post.title}</h3>
            <small>@${post.author.join(", ")}</small>
          </a>
          <p>${displayDate}${isEdited ? ` (${editedLabel})` : ""}</p>
          <div>${post.tags
            .map(
              (tag) =>
                `<div class='tag' style="border:0.1rem solid ${getTagColor(tag)}">
              <small style="color:${getTagColor(tag)}">${tag}</small>
            </div>`,
            )
            .join("")}</div>
          <p class="mt-xs print-content">${post.description}</p>
        </li>`;
    })
    .join("");

  const showCount = parseInt(postsList.getAttribute("data-show"), 10);
  postsList.querySelectorAll("li").forEach((item, i) => {
    if (i >= showCount) item.style.display = "none";
  });
}

async function loadPosts() {
  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");

  document
    .querySelector("#all")
    ?.addEventListener("click", () => setActiveTag("all"));

  try {
    const res = await fetch("/posts.json", { priority: "high" });
    window.__POSTS__ = await res.json();
  } catch (err) {
    console.error("Error fetching posts:", err);
    const postsList = document.querySelector("ul#posts");
    const errorMsg =
      window.__LANG__?.[langFilter]?.posts?.error || "Error loading posts.";
    postsList.innerHTML = `<li class='error'>${errorMsg}</li>`;
    return;
  }

  loadPostsTags();
  renderPosts();
}

function renderProjects() {
  if (!window.__PROJECTS__) return;
  const projectsList = document.querySelector("ul#projects");
  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");
  const activeTag = getActiveTag();
  const locale = window.__LANG__?.[langFilter]?.locale || "en-US";

  const filtered = window.__PROJECTS__
    .filter((p) => !langFilter || p.lang === langFilter)
    .filter(
      (p) =>
        activeTag === "all" ||
        (p.skills || []).includes(activeTag) ||
        (p.platform || []).includes(activeTag),
    )
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const linkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
  const repoIcon = `<svg fill=none height=18 viewBox="0 0 18 18"width=18 xmlns=http://www.w3.org/2000/svg><path d="M9 0C4.0275 0 0 4.02975 0 9C0 12.9773 2.5785 16.35 6.15375 17.5387C6.60375 17.6235 6.76875 17.3452 6.76875 17.106C6.76875 16.8922 6.76125 16.326 6.7575 15.576C4.254 16.119 3.726 14.3685 3.726 14.3685C3.3165 13.3297 2.72475 13.0522 2.72475 13.0522C1.9095 12.4943 2.78775 12.5055 2.78775 12.5055C3.6915 12.5685 4.16625 13.4325 4.16625 13.4325C4.96875 14.8088 6.273 14.4112 6.7875 14.181C6.8685 13.599 7.10025 13.2022 7.3575 12.9772C5.35875 12.7522 3.258 11.9783 3.258 8.52975C3.258 7.54725 3.60675 6.74475 4.18425 6.11475C4.083 5.8875 3.77925 4.9725 4.263 3.73275C4.263 3.73275 5.01675 3.49125 6.738 4.65525C7.458 4.455 8.223 4.356 8.988 4.3515C9.753 4.356 10.518 4.455 11.238 4.65525C12.948 3.49125 13.7017 3.73275 13.7017 3.73275C14.1855 4.9725 13.8818 5.8875 13.7917 6.11475C14.3655 6.74475 14.7142 7.54725 14.7142 8.52975C14.7142 11.9873 12.6105 12.7485 10.608 12.9697C10.923 13.2397 11.2155 13.7917 11.2155 14.6347C11.2155 15.8392 11.2043 16.8067 11.2043 17.0993C11.2043 17.3355 11.3617 17.6167 11.823 17.5267C15.4237 16.3463 18 12.9713 18 9C18 4.02975 13.9703 0 9 0Z"fill=currentColor /></svg>`;

  const badges = (items) =>
    (items || [])
      .map(
        (item) =>
          `<div class='tag' style="border:0.1rem solid ${getTagColor(item)}"><small style="color:${getTagColor(item)}">${item}</small></div>`,
      )
      .join("");

  projectsList.innerHTML = filtered
    .map((project) => {
      const displayDate = formatDate(project.date || "", locale);
      const openLabel = window.__LANG__?.[langFilter]?.open || "open";
      const links = [
        project.url
          ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer" aria-label="${openLabel}">${linkIcon}</a>`
          : null,
        project.repository
          ? `<a href="${project.repository}" target="_blank" rel="noopener noreferrer" aria-label="${openLabel}">${repoIcon}</a>`
          : null,
      ]
        .filter(Boolean)
        .join("");

      return `
        <li class="mt-lg">
          <div>
            <img src="${project.cover}" alt="${project.title}"/>
            <div style="flex-grow:1">
              <a href="${project.projectUrl}">
                <h3>${project.title}</h3>
                <small>@${project.contribution}</small>
              </a>
              <div class="mt-xs">
                <p>${displayDate}</p>
                <div class="icons">${links}</div>
              </div>
              <div>${badges(project.skills)}${badges(project.platform)}</div>
            </div>
          </div>
          <p class="mt-xs print-content">${project.description}</p>
        </li>`;
    })
    .join("");

  const showCount = parseInt(projectsList.getAttribute("data-show"), 10);
  projectsList.querySelectorAll("li").forEach((item, i) => {
    if (i >= showCount) item.style.display = "none";
  });
}

async function loadProjects() {
  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");

  document
    .querySelector("#all")
    ?.addEventListener("click", () => setActiveTag("all"));

  try {
    const res = await fetch("/projects.json", { priority: "high" });
    window.__PROJECTS__ = await res.json();
  } catch (err) {
    console.error("Error fetching projects:", err);
    const errorMsg =
      window.__LANG__?.[langFilter]?.projects?.error ||
      "Error loading projects.";
    document.querySelector("ul#projects").innerHTML =
      `<li class='error'>${errorMsg}</li>`;
    return;
  }

  loadProjectsTags();
  renderProjects();
}

const toggleTheme = (targetTheme) => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = targetTheme || (currentTheme === "dark" ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  if (window.__POSTS__) renderPosts();
  if (window.__PROJECTS__) renderProjects();
};

const sentinel = document.querySelector(".sentinel");
const observer = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) {
      document.querySelector("nav").classList.add("is-sticky");
    } else {
      document.querySelector("nav").classList.remove("is-sticky");
    }
  },
  { threshold: 0 },
);
observer.observe(sentinel);
