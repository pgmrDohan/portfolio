applyLanguage();
document.body.classList.remove("noscript");
document.body.style.opacity = "1";
document.getElementById("theme-preloader")?.remove();

const toggleTheme = (targetTheme) => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = targetTheme || (currentTheme === "dark" ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
};
