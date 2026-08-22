document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const openBtn = document.getElementById("openOverlay");
  const closeBtn = document.getElementById("closeOverlay");
  const overlay = document.getElementById("overlay");

  openBtn.addEventListener("click", () => {
    overlay.classList.add("overlay-active");
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("overlay-active");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("overlay-active")) {
      overlay.classList.remove("overlay-active");
    }
  });
});
