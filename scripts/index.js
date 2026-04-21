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
    saturation = 80;
    lightness = 65;
  } else {
    saturation = 55;
    lightness = 90;
  }

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

async function loadPosts() {
  const postsList = document.querySelector("ul#posts");
  const url =
    "https://raw.githubusercontent.com/pgmrDohan/portfolio/refs/heads/master/posts.json";

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
                </a>
                <p>${displayDate}${isEdited ? ` (${window.__LANG__?.[langFilter]?.posts.edited})` : ""}</p>
                <div>${post.tags
                  .map(
                    (tag) =>
                      `<div class='tag' style="background:${getTagColor(tag)}">${tag}</div>`,
                  )
                  .join("")}</div>
                <div>${post.author.map((author) => `<div class='author'>${author}</div`).join("")}</div>
            </li>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error fetching posts:", error);
    postsList.innerHTML = `<li class='error'>${window.__LANG__?.[langFilter]?.posts.error}</li>`;
  }
}

loadPosts();
