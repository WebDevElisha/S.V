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
          
          let encoded = targetUrl;
          try {
            if (typeof __scramjet$encodeUrl === "function") {
              encoded = __scramjet$encodeUrl(targetUrl);
            }
          } catch (err) {}

          window.location.href = `html/browse.html?q=` + encodeURIComponent(encoded);
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

window.addEventListener("load", async () => {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    } catch (err) {}
  }

  try {
    if (window.BareMux && window.BareMux.BareMuxConnection) {
      const connection = new window.BareMux.BareMuxConnection("/bare-mux/worker.js");
      await connection.setTransport("EpoxyTransport", [{ wisp: "wss://nocturne.lol/" }]);
    }
  } catch (err) {}
});
