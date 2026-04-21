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
    const response = await fetch(url);
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
            <li>
                <a href="${post.url}">
                    <h3>${post.title}</h3>
                    <small>@${post.author.join(", ")}</small>
                </a>
                <p>${displayDate}${isEdited ? ` (${window.__LANG__?.[langFilter]?.posts.edited})` : ""}</p>
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

const toggleTheme = (targetTheme) => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = targetTheme || (currentTheme === "dark" ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  loadPosts();
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
