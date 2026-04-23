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

function formatPeriod(period, locale) {
  if (!Array.isArray(period) || !period.length) return "";
  const [start, end] = period;
  const fmt = (s) => formatDate(s, locale);
  return end ? `${fmt(start)} ~ ${fmt(end)}` : `${fmt(start)} ~`;
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

function badge(text) {
  const color = getTagColor(text);
  return `<div class="tag" style="border:0.1rem solid ${color}">
    <small style="color:${color}">${text}</small>
  </div>`;
}

function badges(items) {
  return (items || []).map(badge).join("");
}

function getActiveTag() {
  return new URLSearchParams(window.location.search).get("tag") || "all";
}

function setActiveTag(tag) {
  const params = new URLSearchParams(window.location.search);
  tag === "all" ? params.delete("tag") : params.set("tag", tag);
  const newUrl = [window.location.pathname, params.toString()]
    .filter(Boolean)
    .join("?");
  window.history.pushState({}, "", newUrl);
  updateTagButtons();
  DATA_SOURCES.forEach(({ key, listId }) => {
    if (window[key]?.length) renderList(listId);
  });
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

const DATA_SOURCES = [
  {
    key: "__POSTS__",
    file: "/posts.json",
    listId: "posts",
    tagFields: (p) => p.tags || [],
    filterByTag: (p, tag) => p.tags?.includes(tag),
    render: renderPostItem,
  },
  {
    key: "__PROJECTS__",
    file: "/projects.json",
    listId: "projects",
    tagFields: (p) => [...(p.skills || []), ...(p.platform || [])],
    filterByTag: (p, tag) =>
      p.skills?.includes(tag) || p.platform?.includes(tag),
    render: renderProjectItem,
  },
  {
    key: "__CERTIFICATIONS__",
    file: "/certifications.json",
    listId: "certifications",
    tagFields: (p) => [p.type].filter(Boolean),
    filterByTag: (p, tag) => p.type === tag,
    render: renderCertificationItem,
  },
  {
    key: "__ACTIVITIES__",
    file: "/co-curricular-activities.json",
    listId: "activities",
    tagFields: (p) => [p.type, ...(p.organization || [])].filter(Boolean),
    filterByTag: (p, tag) =>
      p.type === tag || (p.organization || []).includes(tag),
    render: renderActivityItem,
  },
  {
    key: "__EDUCATION__",
    file: "/education.json",
    listId: "education",
    tagFields: (p) => [p.status].filter(Boolean),
    filterByTag: (p, tag) => p.status === tag,
    render: renderEducationItem,
  },
  {
    key: "__EXPERIENCE__",
    file: "/experience.json",
    listId: "experience",
    tagFields: (p) => [p.type, p.status].filter(Boolean),
    filterByTag: (p, tag) => p.type === tag || p.status === tag,
    render: renderExperienceItem,
  },
  {
    key: "__RESEARCH__",
    file: "/research-publications.json",
    listId: "research",
    tagFields: (p) => [p.type].filter(Boolean),
    filterByTag: (p, tag) => p.type === tag,
    render: renderResearchItem,
  },
];

function loadTags(listId) {
  const source = DATA_SOURCES.find((s) => s.listId === listId);
  if (!source || !window[source.key]?.length) return;

  const tagsList = document.querySelector("ul#tags");
  if (!tagsList) return;

  tagsList
    .querySelectorAll("button.tag:not(#all)")
    .forEach((el) => el.remove());

  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");

  const allTags = [
    ...new Set(
      window[source.key]
        .filter((p) => !langFilter || p.lang === langFilter)
        .flatMap(source.tagFields),
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

function getItemSortKey(item) {
  if (item.period?.[0]) return new Date(item.period[0]).getTime();
  if (item.year) return new Date(String(item.year)).getTime();
  if (item.edited) return new Date(item.edited).getTime();
  if (item.date) return new Date(item.date).getTime();
  return 0;
}

function renderList(listId) {
  const source = DATA_SOURCES.find((s) => s.listId === listId);
  if (!source || !window[source.key]) return;

  const list = document.querySelector(`ul#${listId}`);
  if (!list) return;

  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");
  const activeTag = getActiveTag();
  const locale = window.__LANG__?.[langFilter]?.locale || "en-US";

  const filtered = window[source.key]
    .filter((p) => !langFilter || p.lang === langFilter)
    .filter((p) => activeTag === "all" || source.filterByTag(p, activeTag))
    .sort((a, b) => {
      if (b.pinned !== a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return getItemSortKey(b) - getItemSortKey(a);
    });

  list.innerHTML = filtered
    .map((item) => source.render(item, langFilter, locale))
    .join("");

  const showCount = parseInt(list.getAttribute("data-show"), 10);
  if (!isNaN(showCount)) {
    list.querySelectorAll("li").forEach((item, i) => {
      if (i >= showCount) item.style.display = "none";
    });
  }
}

async function loadData(listId) {
  const source = DATA_SOURCES.find((s) => s.listId === listId);
  if (!source) return;

  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");

  document
    .querySelector("#all")
    ?.addEventListener("click", () => setActiveTag("all"));

  if (window[source.key]?.length) {
    loadTags(listId);
    renderList(listId);
    return;
  }

  try {
    const res = await fetch(source.file, { priority: "high" });
    window[source.key] = await res.json();
  } catch (err) {
    console.error(`Error fetching ${source.file}:`, err);
    const errorMsg =
      window.__LANG__?.[langFilter]?.[listId]?.error ||
      `Error loading ${listId}.`;
    const list = document.querySelector(`ul#${listId}`);
    if (list) list.innerHTML = `<li class="error">${errorMsg}</li>`;
    return;
  }

  loadTags(listId);
  renderList(listId);
}

function renderPostItem(post, langFilter, locale) {
  const isEdited = post.edited && post.edited !== post.date;
  const rawDate = post.edited || post.date || "";
  const displayDate = formatDate(rawDate, locale);
  const editedLabel = window.__LANG__?.[langFilter]?.posts?.edited || "edited";

  return `
  <li class="mt-lg">
    <a href="${post.url}">
      <h3>${post.title}</h3>
      <small>@${post.author.join(", ")}</small>
    </a>
    <p>${displayDate}${isEdited ? ` (${editedLabel})` : ""}</p>
    <div>${badges(post.tags)}</div>
    <p class="mt-xs print-content">${post.description}</p>
  </li>`;
}

function renderProjectItem(project, langFilter, locale) {
  const displayDate = formatDate(project.date || "", locale);
  const openLabel = window.__LANG__?.[langFilter]?.open || "open";

  const linkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
  const repoIcon = `<svg fill=none height=18 viewBox="0 0 18 18"width=18 xmlns=http://www.w3.org/2000/svg><path d="M9 0C4.0275 0 0 4.02975 0 9C0 12.9773 2.5785 16.35 6.15375 17.5387C6.60375 17.6235 6.76875 17.3452 6.76875 17.106C6.76875 16.8922 6.76125 16.326 6.7575 15.576C4.254 16.119 3.726 14.3685 3.726 14.3685C3.3165 13.3297 2.72475 13.0522 2.72475 13.0522C1.9095 12.4943 2.78775 12.5055 2.78775 12.5055C3.6915 12.5685 4.16625 13.4325 4.16625 13.4325C4.96875 14.8088 6.273 14.4112 6.7875 14.181C6.8685 13.599 7.10025 13.2022 7.3575 12.9772C5.35875 12.7522 3.258 11.9783 3.258 8.52975C3.258 7.54725 3.60675 6.74475 4.18425 6.11475C4.083 5.8875 3.77925 4.9725 4.263 3.73275C4.263 3.73275 5.01675 3.49125 6.738 4.65525C7.458 4.455 8.223 4.356 8.988 4.3515C9.753 4.356 10.518 4.455 11.238 4.65525C12.948 3.49125 13.7017 3.73275 13.7017 3.73275C14.1855 4.9725 13.8818 5.8875 13.7917 6.11475C14.3655 6.74475 14.7142 7.54725 14.7142 8.52975C14.7142 11.9873 12.6105 12.7485 10.608 12.9697C10.923 13.2397 11.2155 13.7917 11.2155 14.6347C11.2155 15.8392 11.2043 16.8067 11.2043 17.0993C11.2043 17.3355 11.3617 17.6167 11.823 17.5267C15.4237 16.3463 18 12.9713 18 9C18 4.02975 13.9703 0 9 0Z"fill=currentColor /></svg>`;

  const links = [
    project.url
      ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer"
           aria-label="${openLabel}">${linkIcon}</a>`
      : null,
    project.repository
      ? `<a href="${project.repository}" target="_blank" rel="noopener noreferrer"
           aria-label="${openLabel}">${repoIcon}</a>`
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
          <div class="icons wo-print-content">${links}</div>
        </div>
        <div>${badges(project.skills)}${badges(project.platform)}</div>
      </div>
    </div>
    <p class="mt-xs print-content">${project.description}</p>
    <small class="print-content">${[
      project.url ? project.url : null,
      project.repository ? project.repository : null,
    ]
      .filter(Boolean)
      .join(" · ")}</small>
  </li>`;
}

function renderCertificationItem(item, langFilter, locale) {
  return `
  <li class="mt-lg">
    <p>${item.year}</p>
    <hgroup>
      <h3>${item.title}</h3>
      <small class="mt-xs">${item.description}</small>
    </hgroup>
    <small class="mt-xs mb-xs">${item.organization}${item.country ? ` · ${item.country}` : ""}</small>
    <div>${badge(item.type)}</div>
  </li>`;
}

function renderActivityItem(item, langFilter, locale) {
  const linkIcons = {
    github: `<svg fill=none height=18 viewBox="0 0 18 18"width=18 xmlns=http://www.w3.org/2000/svg><path d="M9 0C4.0275 0 0 4.02975 0 9C0 12.9773 2.5785 16.35 6.15375 17.5387C6.60375 17.6235 6.76875 17.3452 6.76875 17.106C6.76875 16.8922 6.76125 16.326 6.7575 15.576C4.254 16.119 3.726 14.3685 3.726 14.3685C3.3165 13.3297 2.72475 13.0522 2.72475 13.0522C1.9095 12.4943 2.78775 12.5055 2.78775 12.5055C3.6915 12.5685 4.16625 13.4325 4.16625 13.4325C4.96875 14.8088 6.273 14.4112 6.7875 14.181C6.8685 13.599 7.10025 13.2022 7.3575 12.9772C5.35875 12.7522 3.258 11.9783 3.258 8.52975C3.258 7.54725 3.60675 6.74475 4.18425 6.11475C4.083 5.8875 3.77925 4.9725 4.263 3.73275C4.263 3.73275 5.01675 3.49125 6.738 4.65525C7.458 4.455 8.223 4.356 8.988 4.3515C9.753 4.356 10.518 4.455 11.238 4.65525C12.948 3.49125 13.7017 3.73275 13.7017 3.73275C14.1855 4.9725 13.8818 5.8875 13.7917 6.11475C14.3655 6.74475 14.7142 7.54725 14.7142 8.52975C14.7142 11.9873 12.6105 12.7485 10.608 12.9697C10.923 13.2397 11.2155 13.7917 11.2155 14.6347C11.2155 15.8392 11.2043 16.8067 11.2043 17.0993C11.2043 17.3355 11.3617 17.6167 11.823 17.5267C15.4237 16.3463 18 12.9713 18 9C18 4.02975 13.9703 0 9 0Z"fill=currentColor /></svg>`,
    slides: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tv-icon lucide-tv"><path d="m17 2-5 5-5-5"/><rect width="20" height="15" x="2" y="7" rx="2"/></svg>`,
    article: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-newspaper-icon lucide-newspaper"><path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="10" y="6" rx="1"/></svg>`,
  };
  const links = (item.links || [])
    .map(
      (l) =>
        `<a href="${l.URL}" target="_blank" rel="noopener noreferrer" title=${l.type}>
          ${linkIcons[l.type] || l.type}
        </a>`,
    )
    .join("");

  return `
  <li class="mt-lg">
    <p>${item.year}</p>
    <hgroup>
      <h3>${item.title}</h3>
      <small>${(item.achievement || []).join(" · ")}</small>
    </hgroup>
    <p class="mt-xs mb-xs">${(item.organization || []).join(", ")}${item.country ? ` - ${item.country}` : ""}</p>
    <hgroup>
      <div>${badge(item.type)}</div>
      ${links ? `<div class="icons">${links}</div>` : ""}
    </hgroup>
    <small class="mt-sm print-content">${(item.links || []).map((l) => l.URL).join(" · ")}</small>
  </li>`;
}

function renderEducationItem(item, langFilter, locale) {
  const period = formatPeriod(item.period, locale);
  return `
  <li class="mt-lg">
    <hgroup>
      <h3>${item.title}</h3>
      ${item.major ? `<small>${item.major}</small>` : ""}
    </hgroup>
    <p>${period}</p>
    <div>${badge(item.status)}${item.gpa ? `<small class="ml-xs">GPA ${item.gpa}</small>` : ""}</div>
  </li>`;
}

function renderExperienceItem(item, langFilter, locale) {
  const period = formatPeriod(item.period, locale);
  const responsibilities = (item.responsibilities || []).join(" · ");

  return `
  <li class="mt-lg">
    <hgroup>
      <h3>${item.company}</h3>
      <small>${[item.department, item.position].filter(Boolean).join(" · ")}</small>
    </hgroup>
    <p>${period}</p>
    <div class="mb-sm">${badge(item.type)}${badge(item.status)}</div>
    ${responsibilities ? `<small>${responsibilities}</small>` : ""}
  </li>`;
}

function renderResearchItem(item, langFilter, locale) {
  const displayDate = formatDate(item.date, locale);
  const identifiers = (item.identifiers || [])
    .map((id) => {
      if (id.URL) return `<a href="${id.URL}" target="_blank">${id.title}</a>`;
      if (id.isbn) return `${id.title} ${id.isbn}`;
      if (id.issn) return `${id.title} ${id.issn}`;
      if (id.doi)
        return `<a href="https://doi.org/${id.doi}" target="_blank">${id.title} ${id.doi}</a>`;
      return `${id.title}`;
    })
    .join(" · ");

  const identifiersPrint = (item.identifiers || [])
    .map((id) => {
      if (id.URL) return `${id.title} ${id.URL}`;
      if (id.isbn) return `${id.title} ${id.isbn}`;
      if (id.issn) return `${id.title} ${id.issn}`;
      if (id.doi) return `${id.title} ${id.doi}`;
      return `${id.title}`;
    })
    .join(" · ");

  return `
  <li class="mt-lg">
    <h3>${item.title}</h3>
    <hgroup>
      <p>${item.subtitle}</p>
      <small>${displayDate}${item.country ? ` · ${item.country}` : ""}</small>
    </hgroup>
    <div class="mb-sm">${badge(item.type)}</div>
    ${identifiers ? `<small class="wo-print-content">${identifiers}</small><small class="print-content">${identifiersPrint}</small>` : ""}
  </li>`;
}

const toggleTheme = (targetTheme) => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = targetTheme || (currentTheme === "dark" ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  DATA_SOURCES.forEach(({ key, listId }) => {
    if (window[key]) renderList(listId);
  });
};

applyLanguage();
document.body.classList.remove("noscript");
document.body.style.opacity = "1";
document.getElementById("theme-preloader")?.remove();

DATA_SOURCES.forEach(({ listId }) => {
  if (document.querySelector(`ul#${listId}`)) {
    loadData(listId);
  }
});

window.addEventListener("popstate", () => {
  DATA_SOURCES.forEach(({ key, listId }) => {
    if (window[key]?.length) renderList(listId);
  });

  updateTagButtons();
});
