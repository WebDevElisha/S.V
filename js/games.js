document.addEventListener('DOMContentLoaded', async () => {
  const gamesGrid = document.getElementById('games-grid');
  const gameSearch = document.getElementById('game-search');
  const gameViewport = document.getElementById('game-viewport');
  const gameFrame = document.getElementById('game-frame');
  const gameTitleDisplay = document.getElementById('game-title-display');
  const btnCloseGame = document.getElementById('btn-close-game');
  const btnGameFullscreen = document.getElementById('btn-game-fullscreen');

  let allGames = [];

  function normalizeGameUrl(rawUrl, baseUrl) {
    if (!rawUrl) return '';
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    if (/^\/\//.test(rawUrl)) return 'https:' + rawUrl;
    if (/^data:/i.test(rawUrl)) return rawUrl;

    const trimmed = rawUrl.replace(/^\/+/, '');
    return `${baseUrl.replace(/\/+$/, '')}/${trimmed}`;
  }

  function normalizeGameImg(rawImg, baseUrl) {
    if (!rawImg) return `${baseUrl.replace(/\/+$/, '')}/icons/default.png`;
    if (/^https?:\/\//i.test(rawImg)) return rawImg;
    if (/^\/\//.test(rawImg)) return 'https:' + rawImg;
    if (/^data:/i.test(rawImg)) return rawImg;

    const trimmed = rawImg.replace(/^\/+/, '');
    return `${baseUrl.replace(/\/+$/, '')}/${trimmed}`;
  }

  async function fetchCatalog(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : (data.games || data.items || []);
    } catch (e) {
      return [];
    }
  }

  async function loadAllCatalogs() {
    const sources = [
      { name: 'seraph', url: 'https://cdn.jsdelivr.net/gh/gmshelf/seraph/seraph.json', base: 'https://cdn.jsdelivr.net/gh/gmshelf/seraph' },
      { name: 'truffled', url: 'https://cdn.jsdelivr.net/gh/gmshelf/truffled/truffled.json', base: 'https://cdn.jsdelivr.net/gh/gmshelf/truffled' },
      { name: 'ugs', url: 'https://cdn.jsdelivr.net/gh/gmshelf/ugs/ugs.json', base: 'https://cdn.jsdelivr.net/gh/gmshelf/ugs' },
      { name: 'ckv', url: 'https://cdn.jsdelivr.net/gh/gmshelf/ckv/ckv.json', base: 'https://cdn.jsdelivr.net/gh/gmshelf/ckv' }
    ];

    const results = await Promise.all(sources.map((source) => fetchCatalog(source.url)));
    const combined = [];

    results.forEach((list, index) => {
      const source = sources[index];
      list.forEach((item) => {
        const normalizedUrl = normalizeGameUrl(item.url || item.link || item.path || item.src || '', source.base);
        const fallbackImg = `${source.base.replace(/\/+$/, '')}/icons/${item.id || item.slug || 'game'}.png`;
        const normalizedImg = normalizeGameImg(item.img || item.image || item.cover || item.icon || '', source.base);

        combined.push({
          title: item.title || item.name || 'Untitled',
          url: normalizedUrl || fallbackImg,
          img: normalizedImg || fallbackImg
        });
      });
    });

    allGames = combined.filter((game) => game.title && game.url);
    renderGames(allGames);
  }

  function renderGames(games) {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = '';

    if (games.length === 0) {
      gamesGrid.innerHTML = '<div class="col-span-full flex items-center justify-center h-64 text-purple-400 font-bold text-base">No games found.</div>';
      return;
    }

    games.forEach((game) => {
      const card = document.createElement('div');
      card.className = 'group flex flex-col bg-[#0f0921]/60 border border-purple-500/20 hover:border-purple-400/60 rounded-2xl p-3 backdrop-blur-md shadow-[0_4px_20px_rgba(147,51,234,0.15)] hover:shadow-[0_0_30px_rgba(147,51,234,0.25)] cursor-pointer transition-all duration-200';

      const imgContainer = document.createElement('div');
      imgContainer.className = 'w-full aspect-square rounded-xl bg-[#06040a]/80 overflow-hidden relative border border-purple-500/20 mb-3';

      const img = document.createElement('img');
      img.className = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300';
      img.src = game.img;
      img.alt = game.title;
      img.onerror = () => {
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%239333ea" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 8h8v8H8z"/><path d="M8 16l8-8"/></svg>';
      };

      imgContainer.appendChild(img);

      const title = document.createElement('h2');
      title.className = 'text-xs font-bold text-purple-100 group-hover:text-white truncate tracking-wide text-center';
      title.textContent = game.title;

      card.appendChild(imgContainer);
      card.appendChild(title);
      card.addEventListener('click', () => openGame(game));
      gamesGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function openGame(game) {
    if (!game || !game.url) return;
    if (gameTitleDisplay) gameTitleDisplay.textContent = game.title;
    if (gameFrame) gameFrame.src = game.url;
    if (gameViewport) gameViewport.classList.remove('hidden');
  }

  if (btnCloseGame) {
    btnCloseGame.addEventListener('click', () => {
      if (gameViewport) gameViewport.classList.add('hidden');
      if (gameFrame) gameFrame.src = '';
    });
  }

  if (btnGameFullscreen) {
    btnGameFullscreen.addEventListener('click', () => {
      if (gameViewport) {
        if (!document.fullscreenElement) {
          gameViewport.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    });
  }

  if (gameSearch) {
    gameSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = allGames.filter((game) => game.title.toLowerCase().includes(q));
      renderGames(filtered);
    });
  }

  loadAllCatalogs();
});
