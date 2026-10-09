document.addEventListener('DOMContentLoaded', async () => {
  const gamesGrid = document.getElementById('games-grid');
  const gameSearch = document.getElementById('game-search');
  const gameViewport = document.getElementById('game-viewport');
  const gameFrame = document.getElementById('game-frame');
  const gameTitleDisplay = document.getElementById('game-title-display');
  const btnCloseGame = document.getElementById('btn-close-game');
  const btnGameFullscreen = document.getElementById('btn-game-fullscreen');

  let allGames = [];

  function buildGameUrl(item, sourceBase) {
    let url = item.url || item.link || item.path || '';

    if (!url) return '';

    if (/^https?:\/\//.test(url)) return url;
    if (/^\/\//.test(url)) return 'https:' + url;

    url = url.replace(/^\/+/, '');
    url = url.replace(/\.json$/, '.html');

    return `${sourceBase}/${url}`;
  }

  function buildImageUrl(item, sourceBase, sourceName) {
    let img = item.img || item.image || item.cover || item.icon || '';

    if (/^https?:\/\//.test(img)) return img;
    if (/^\/\//.test(img)) return 'https:' + img;

    if (img) {
      img = img.replace(/^\/+/, '');
      return `${sourceBase}/${img}`;
    }

    const fallbackId = item.id || item.slug || 'game';
    return `${sourceBase}/icons/${fallbackId}.png`;
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
      { name: 'seraph', catalog: 'https://cdn.jsdelivr.net/gh/gmshelf/seraph/seraph.json', base: 'https://cdn.jsdelivr.net/gh/gmshelf/seraph' },
      { name: 'truffled', catalog: 'https://cdn.jsdelivr.net/gh/gmshelf/truffled/truffled.json', base: 'https://cdn.jsdelivr.net/gh/gmshelf/truffled' },
      { name: 'ugs', catalog: 'https://cdn.jsdelivr.net/gh/gmshelf/ugs/ugs.json', base: 'https://cdn.jsdelivr.net/gh/gmshelf/ugs' },
      { name: 'ckv', catalog: 'https://cdn.jsdelivr.net/gh/gmshelf/ckv/ckv.json', base: 'https://cdn.jsdelivr.net/gh/gmshelf/ckv' }
    ];

    const results = await Promise.all(sources.map(s => fetchCatalog(s.catalog)));
    const combined = [];

    results.forEach((list, idx) => {
      const source = sources[idx];
      list.forEach(item => {
        const gameUrl = buildGameUrl(item, source.base);
        const imageUrl = buildImageUrl(item, source.base, source.name);

        if (gameUrl) {
          combined.push({
            title: item.title || item.name || 'Untitled',
            url: gameUrl,
            img: imageUrl
          });
        }
      });
    });

    allGames = combined;
    renderGames(allGames);
  }

  function renderGames(games) {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = '';

    if (games.length === 0) {
      gamesGrid.innerHTML = '<div class=\"col-span-full flex items-center justify-center h-64 text-purple-400 font-bold text-base\">No games found.</div>';
      return;
    }

    games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'group flex flex-col bg-[#0f0921]/60 border border-purple-500/20 hover:border-purple-400/60 rounded-2xl p-3 backdrop-blur-md shadow-[0_4px_20px_rgba(147,51,234,0.15)] hover:shadow-[0_0_30px_rgba(147,51,234,0.25)] cursor-pointer transition-all duration-200';

      const imgContainer = document.createElement('div');
      imgContainer.className = 'w-full aspect-square rounded-xl bg-[#06040a]/80 overflow-hidden relative border border-purple-500/20 mb-3';

      const img = document.createElement('img');
      img.className = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300';
      img.src = game.img;
      img.alt = game.title;
      img.onerror = () => {
        img.src = 'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%239333ea\" stroke-width=\"1.5\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M8 8h8v8H8z\"/><path d=\"M8 16l8-8\"/></svg>';
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
    if (gameFrame) {
      gameFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-presentation');
      gameFrame.src = game.url;
    }
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
          gameViewport.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen();
        }
      }
    });
  }

  if (gameSearch) {
    gameSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = allGames.filter(g => g.title.toLowerCase().includes(q));
      renderGames(filtered);
    });
  }

  loadAllCatalogs();
});
