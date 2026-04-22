loadProjects();

window.addEventListener("popstate", () => {
  renderProjects();
  updateTagButtons();
});
