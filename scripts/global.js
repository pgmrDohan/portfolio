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

  let saturation, lightness;

  if (theme === "dark") {
    saturation = 100;
    lightness = 70;
  } else {
    saturation = 100;
    lightness = 30;
  }

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

async function loadPosts() {
  const postsList = document.querySelector("ul#posts");
  const url = "/posts.json";

  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");
  const locale = window.__LANG__?.[langFilter]?.locale || "en-US";

  try {
    const response = await fetch(url, { priority: "high" });
    const posts = await response.json();

    const filteredPosts = langFilter
      ? posts.filter((post) => post.lang === langFilter)
      : posts;

    postsList.innerHTML = filteredPosts
      .map((post) => {
        const isEdited = post.edited && post.edited !== post.date;
        const rawDate = post.edited || post.date || "";
        const displayDate = formatDate(rawDate, locale);

        return `
            <li class="mt-lg">
                <a href="${post.url}">
                    <h3>${post.title}</h3>
                    <small>@${post.author.join(", ")}</small>
                </a>
                <p>${displayDate}${isEdited ? ` (${window.__LANG__?.[langFilter] ? window.__LANG__?.[langFilter].posts.edited : "edited"})` : ""}</p>
                <div>${post.tags
                  .map(
                    (tag) =>
                      `<div class='tag' style="border:0.1rem solid ${getTagColor(tag)}"><small style="color:${getTagColor(tag)}">${tag}</small></div>`,
                  )
                  .join("")}</div>
            </li>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error fetching posts:", error);
    postsList.innerHTML = `<li class='error'>${window.__LANG__?.[langFilter]?.posts.error}</li>`;
  }

  const showCount = parseInt(postsList.getAttribute("data-show"), 10);
  const items = postsList.querySelectorAll("li");
  items.forEach((item, index) => {
    if (index >= showCount) {
      item.style.display = "none";
    }
  });
}

async function loadProjects() {
  const projectsList = document.querySelector("ul#projects");
  const url = "/projects.json";

  const urlParams = new URLSearchParams(window.location.search);
  const langFilter = urlParams.get("lang");
  const locale = window.__LANG__?.[langFilter]?.locale || "en-US";

  try {
    const response = await fetch(url, { priority: "high" });
    const projects = await response.json();

    const filteredProjects = langFilter
      ? projects.filter((project) => project.lang === langFilter)
      : projects;

    projectsList.innerHTML = filteredProjects
      .map((project) => {
        const rawDate = project.date || "";
        const displayDate = formatDate(rawDate, locale);

        const linkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
        const repoIcon = `<svg fill=none height=18 viewBox="0 0 18 18"width=18 xmlns=http://www.w3.org/2000/svg><path d="M9 0C4.0275 0 0 4.02975 0 9C0 12.9773 2.5785 16.35 6.15375 17.5387C6.60375 17.6235 6.76875 17.3452 6.76875 17.106C6.76875 16.8922 6.76125 16.326 6.7575 15.576C4.254 16.119 3.726 14.3685 3.726 14.3685C3.3165 13.3297 2.72475 13.0522 2.72475 13.0522C1.9095 12.4943 2.78775 12.5055 2.78775 12.5055C3.6915 12.5685 4.16625 13.4325 4.16625 13.4325C4.96875 14.8088 6.273 14.4112 6.7875 14.181C6.8685 13.599 7.10025 13.2022 7.3575 12.9772C5.35875 12.7522 3.258 11.9783 3.258 8.52975C3.258 7.54725 3.60675 6.74475 4.18425 6.11475C4.083 5.8875 3.77925 4.9725 4.263 3.73275C4.263 3.73275 5.01675 3.49125 6.738 4.65525C7.458 4.455 8.223 4.356 8.988 4.3515C9.753 4.356 10.518 4.455 11.238 4.65525C12.948 3.49125 13.7017 3.73275 13.7017 3.73275C14.1855 4.9725 13.8818 5.8875 13.7917 6.11475C14.3655 6.74475 14.7142 7.54725 14.7142 8.52975C14.7142 11.9873 12.6105 12.7485 10.608 12.9697C10.923 13.2397 11.2155 13.7917 11.2155 14.6347C11.2155 15.8392 11.2043 16.8067 11.2043 17.0993C11.2043 17.3355 11.3617 17.6167 11.823 17.5267C15.4237 16.3463 18 12.9713 18 9C18 4.02975 13.9703 0 9 0Z"fill=currentColor /></svg>`;

        const links = [
          project.url
            ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer" aria-label="${window.__LANG__?.[langFilter]?.open}">${linkIcon}</a>`
            : null,
          project.repository
            ? `<a href="${project.repository}" target="_blank" rel="noopener noreferrer" aria-label="${window.__LANG__?.[langFilter]?.open}">${repoIcon}</a>`
            : null,
        ]
          .filter(Boolean)
          .join("");

        const badges = (items) =>
          items
            .map(
              (item) =>
                `<div class='tag' style="border:0.1rem solid ${getTagColor(item)}"><small style="color:${getTagColor(item)}">${item}</small></div>`,
            )
            .join("");

        return `
          <li class="mt-lg">
            <div>
              <img src="${project.cover}" alt="${project.title}"/>
              <div style="flex-grow: 1;">
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
          </li>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error fetching projects:", error);
    projectsList.innerHTML = `<li class='error'>${window.__LANG__?.[langFilter]?.projects.error}</li>`;
  }

  const showCount = parseInt(projectsList.getAttribute("data-show"), 10);
  const items = projectsList.querySelectorAll("li");
  items.forEach((item, index) => {
    if (index >= showCount) {
      item.style.display = "none";
    }
  });
}

const toggleTheme = (targetTheme) => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = targetTheme || (currentTheme === "dark" ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  loadPosts();
  loadProjects();
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
