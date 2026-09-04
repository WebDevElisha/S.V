document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const homeSearchForm = document.getElementById("home-search-form");
  const homeSearchInput = document.getElementById("home-search-input");

  if (homeSearchForm && homeSearchInput) {
    homeSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = homeSearchInput.value.trim();
      if (query) {
        window.location.href = `html/browse.html?q=${encodeURIComponent(query)}`;
      }
    });
  }
});
