loadPosts();

window.addEventListener("popstate", () => {
  renderPosts();
  updateTagButtons();
});
