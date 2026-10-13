document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const homeSearchForm = document.getElementById("home-search-form");
  const homeSearchInput = document.getElementById("home-search-input");

  if (homeSearchInput) {
    homeSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = homeSearchInput.value.trim();
        if (query) {
          let targetUrl = query;
          if (!query.startsWith("http://") && !query.startsWith("https://")) {
            if (query.includes(".") && !query.includes(" ")) {
              targetUrl = "https://" + query;
            } else {
              targetUrl = "https://duckduckgo.com/?q=" + encodeURIComponent(query);
            }
          }

          window.location.href = `html/browse.html?q=` + encodeURIComponent(targetUrl);
        }
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
