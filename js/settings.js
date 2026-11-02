document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const bgOverlay = document.getElementById('bg-overlay');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const customBgInput = document.getElementById('custom-bg-input');
  const accentColorInput = document.getElementById('accent-color-input');
  const cloakBtn = document.getElementById('cloak-btn');
  const themePresets = document.querySelectorAll('.theme-preset');

  const savedBg = localStorage.getItem('sv_bg');
  const savedTheme = localStorage.getItem('sv_theme') || 'dark';
  const savedAccent = localStorage.getItem('sv_accent');

  function applyAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    const elementsToAccent = document.querySelectorAll('.bg-purple-600\\/30, .bg-purple-600\\/40, .bg-purple-950\\/40, .bg-purple-900\\/40');
    elementsToAccent.forEach(el => {
      el.style.backgroundColor = color + '40';
      el.style.borderColor = color + '80';
    });
  }

  if (savedBg) {
    document.body.style.backgroundImage = `url('${savedBg}')`;
  }

  if (savedAccent) {
    if (accentColorInput) accentColorInput.value = savedAccent;
    applyAccentColor(savedAccent);
  }

  if (savedTheme === 'light') {
    document.body.classList.remove('bg-[#06040a]', 'text-white');
    document.body.classList.add('bg-gray-100', 'text-gray-900');
    if (bgOverlay) bgOverlay.className = 'absolute inset-0 bg-white/80 z-0 transition-colors duration-300';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('bg-[#06040a]');
      if (isDark) {
        document.body.classList.remove('bg-[#06040a]', 'text-white');
        document.body.classList.add('bg-gray-100', 'text-gray-900');
        if (bgOverlay) bgOverlay.className = 'absolute inset-0 bg-white/80 z-0 transition-colors duration-300';
        localStorage.setItem('sv_theme', 'light');
      } else {
        document.body.classList.remove('bg-gray-100', 'text-gray-900');
        document.body.classList.add('bg-[#06040a]', 'text-white');
        if (bgOverlay) bgOverlay.className = 'absolute inset-0 bg-black/75 z-0 transition-colors duration-300';
        localStorage.setItem('sv_theme', 'dark');
      }
    });
  }

  themePresets.forEach(btn => {
    btn.addEventListener('click', () => {
      const themeUrl = btn.getAttribute('data-theme');
      document.body.style.backgroundImage = `url('../${themeUrl}')`;
      localStorage.setItem('sv_bg', `../${themeUrl}`);
    });
  });

  if (customBgInput) {
    customBgInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target.result;
          document.body.style.backgroundImage = `url('${result}')`;
          localStorage.setItem('sv_bg', result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (accentColorInput) {
    accentColorInput.addEventListener('input', (e) => {
      const val = e.target.value;
      localStorage.setItem('sv_accent', val);
      applyAccentColor(val);
    });
  }

  if (cloakBtn) {
    cloakBtn.addEventListener('click', () => {
      const win = window.open('about:blank', '_blank');
      if (win) {
        const doc = win.document;
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Google Drive</title>
            <link rel="icon" href="https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png">
          </head>
          <body style="margin:0;padding:0;overflow:hidden;width:100vw;height:100vh;">
            <iframe src="${window.location.origin}/index.html" style="border:none;width:100%;height:100%;"></iframe>
          </body>
          </html>
        `);
        doc.close();
        window.location.replace('https://drive.google.com');
      }
    });
  }
});
