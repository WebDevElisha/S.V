document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const savedBg = localStorage.getItem('sv_bg');
  const savedAccent = localStorage.getItem('sv_accent');
  const savedTheme = localStorage.getItem('sv_theme');

  if (savedBg) {
    document.body.style.backgroundImage = `url('${savedBg}')`;
  }

  if (savedAccent) {
    document.documentElement.style.setProperty('--accent-color', savedAccent);
    const elementsToAccent = document.querySelectorAll('.bg-purple-600\\/30, .bg-purple-600\\/40, .bg-purple-950\\/40, .bg-purple-900\\/40');
    elementsToAccent.forEach(el => {
      el.style.backgroundColor = savedAccent + '40';
      el.style.borderColor = savedAccent + '80';
    });
  }

  if (savedTheme === 'light') {
    document.body.classList.remove('bg-[#06040a]', 'text-white');
    document.body.classList.add('bg-gray-100', 'text-gray-900');
  }

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
