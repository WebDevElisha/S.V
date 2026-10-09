document.addEventListener('DOMContentLoaded', async () => {
  const gamesGrid = document.getElementById('games-grid');
  const gameSearch = document.getElementById('game-search');
  const gameViewport = document.getElementById('game-viewport');
  const gameFrame = document.getElementById('game-frame');
  const gameTitleDisplay = document.getElementById('game-title-display');
  const btnCloseGame = document.getElementById('btn-close-game');
  const btnGameFullscreen = document.getElementById('btn-game-fullscreen');

  let allGames = [];

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
      { name: 'seraph', url: 'https://cdn.jsdelivr.net/gh/gmshelf/seraph/seraph.json' },
      { name: 'truffled', url: 'https://cdn.jsdelivr.net/gh/gmshelf/truffled/truffled.json' },
      { name: 'ugs', url: 'https://cdn.jsdelivr.net/gh/gmshelf/ugs/ugs.json' },
      { name: 'ckv', url: 'https://cdn.jsdelivr.net/gh/gmshelf/ckv/ckv.json' }
    ];

    const results = await Promise.all(sources.map(s => fetchCatalog(s.url)));
    
    let combined = [];
    results.forEach((list, idx) => {
      const sourceName = sources[idx].name;
      const baseCdn = `https://cdn.jsdelivr.net/gh/gmshelf/${sourceName}/`;
      
      list.forEach(item => {
        let rawUrl = item.url || item.link || item.path || '';
        let fullUrl = rawUrl;
        
        if (rawUrl) {
          if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
            const cleanPath = rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl;
            fullUrl = baseCdn + cleanPath;
          }
        }

        let rawImg = item.img || item.image || item.cover || '';
        let fullImg = rawImg;
        if (rawImg) {
          if (!rawImg.startsWith('http://') && !rawImg.startsWith('https://')) {
            const cleanImgPath = rawImg.startsWith('/') ? rawImg.slice(1) : rawImg;
            fullImg = baseCdn + cleanImgPath;
          }
        } else {
          fullImg = `${baseCdn}icons/${item.id || item.slug || ''}.png`;
        }

        combined.push({
          title: item.title || item.name || 'Untitled',
          url: fullUrl,
          img: fullImg
        });
      });
    });

    allGames = combined;
    renderGames(allGames);
  }

  function renderGames(games) {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = '';
    
    if (games.length === 0) {
      gamesGrid.innerHTML = `<div class="col-span-full flex items-center justify-center h-64 text-purple-400 font-bold text-base">No games found.</div>`;
      return;
    }

    games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'flex flex-col bg-[#0f0921]/60 border border-purple-500/20 hover:border-purple-400/60 rounded-2xl p-3 backdrop-blur-md shadow-[0_4px_20px_rgba(147,51,234,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all cursor-pointer group';
      
      const imgContainer = document.createElement('div');
      imgContainer.className = 'w-full aspect-square rounded-xl bg-[#06040a]/80 overflow-hidden relative border border-purple-500/20 mb-3';

      const img = document.createElement('img');
      img.className = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300';
      img.src = game.img;
      img.alt = game.title;
      img.onerror = () => {
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%239333ea" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>';
      };

      imgContainer.appendChild(img);

      const title = document.createElement('h2');
      title.className = 'text-xs font-bold text-purple-100 group-hover:text-white truncate tracking-wide text-center';
      title.textContent = game.title;

      card.appendChild(imgContainer);
      card.appendChild(title);

      card.addEventListener('click', () => {
        openGame(game);
      });

      gamesGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function openGame(game) {
    if (!game.url) return;
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
      const filtered = allGames.filter(g => g.title.toLowerCase().includes(q));
      renderGames(filtered);
    });
  }

  loadAllCatalogs();
});
