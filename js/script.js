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

  const openOverlayBtn = document.getElementById("openOverlay");
  const closeOverlayBtn = document.getElementById("closeOverlay");
  const overlay = document.getElementById("overlay");

  if (openOverlayBtn && overlay) {
    openOverlayBtn.addEventListener("click", () => {
      overlay.classList.remove("opacity-0", "pointer-events-none");
      overlay.classList.add("opacity-100", "pointer-events-auto");
    });
  }

  if (closeOverlayBtn && overlay) {
    closeOverlayBtn.addEventListener("click", () => {
      overlay.classList.remove("opacity-100", "pointer-events-auto");
      overlay.classList.add("opacity-0", "pointer-events-none");
    });
  }
});
