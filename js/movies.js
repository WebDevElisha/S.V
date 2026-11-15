document.addEventListener('DOMContentLoaded', async () => {
  const savedBg = localStorage.getItem('sv_bg');
  const savedAccent = localStorage.getItem('sv_accent');
  const savedTheme = localStorage.getItem('sv_theme');
  const bgOverlay = document.getElementById('bg-overlay');

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
    if (bgOverlay) bgOverlay.className = 'absolute inset-0 bg-white/80 z-0 transition-colors duration-300';
  }

  const moviesGrid = document.getElementById('movies-grid');
  const movieSearch = document.getElementById('movie-search');
  const movieModal = document.getElementById('movie-modal');
  const modalContent = document.getElementById('modal-content');
  const closeModal = document.getElementById('close-modal');
  const playerModal = document.getElementById('player-modal');
  const playerFrame = document.getElementById('player-frame');
  const playerTitle = document.getElementById('player-title');
  const closePlayer = document.getElementById('close-player');
  const btnPlayerFullscreen = document.getElementById('btn-player-fullscreen');

  let allMovies = [];

  async function fetchMovies(query = '') {
    try {
      const url = query 
        ? `https://moviebackend-gold.vercel.app/api/movies?q=${encodeURIComponent(query)}`
        : `https://moviebackend-gold.vercel.app/api/movies`;
      
      const res = await fetch(url);
      const data = await res.json();
      allMovies = data.results || [];
      renderMovies(allMovies);
    } catch (e) {
      if (moviesGrid) {
        moviesGrid.innerHTML = '<div class="col-span-full flex items-center justify-center h-64 text-purple-400 font-bold text-base">Failed to load movies.</div>';
      }
    }
  }

  function renderMovies(movies) {
    if (!moviesGrid) return;
    moviesGrid.innerHTML = '';

    if (movies.length === 0) {
      moviesGrid.innerHTML = '<div class="col-span-full flex items-center justify-center h-64 text-purple-400 font-bold text-base">No movies found.</div>';
      return;
    }

    movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'group flex flex-col bg-[#0f0921]/60 border border-purple-500/20 hover:border-purple-400/60 rounded-2xl p-3 backdrop-blur-md shadow-[0_4px_20px_rgba(147,51,234,0.15)] hover:shadow-[0_0_30px_rgba(147,51,234,0.25)] cursor-pointer transition-all duration-200';

      const imgContainer = document.createElement('div');
      imgContainer.className = 'w-full aspect-[2/3] rounded-xl bg-[#06040a]/80 overflow-hidden relative border border-purple-500/20 mb-3';

      const img = document.createElement('img');
      img.className = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300';
      img.src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
      img.alt = movie.title || movie.name;
      img.onerror = () => {
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%239333ea" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 8h8v8H8z"/><path d="M8 16l8-8"/></svg>';
      };

      imgContainer.appendChild(img);

      const title = document.createElement('h2');
      title.className = 'text-xs font-bold text-purple-100 group-hover:text-white truncate tracking-wide text-center';
      title.textContent = movie.title || movie.name;

      card.appendChild(imgContainer);
      card.appendChild(title);
      card.addEventListener('click', () => openMovieModal(movie));
      moviesGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function openMovieModal(movie) {
    if (!modalContent || !movieModal) return;
    const title = movie.title || movie.name;
    const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
    const overview = movie.overview || 'No description available.';
    const releaseDate = movie.release_date || movie.first_air_date || 'Unknown';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    modalContent.innerHTML = `
      <img src="${poster}" alt="${title}" class="w-full md:w-48 aspect-[2/3] object-cover rounded-2xl border border-purple-500/30 shrink-0">
      <div class="flex flex-col justify-between flex-1 gap-4">
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl font-black text-white tracking-wide">${title}</h2>
          <div class="flex items-center gap-4 text-xs font-bold text-purple-300">
            <span>Released: ${releaseDate}</span>
            <span>Rating: ★ ${rating}</span>
          </div>
          <p class="text-sm text-purple-200/80 font-medium leading-relaxed mt-2">${overview}</p>
        </div>
        <button id="play-movie-btn" class="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
          <i data-lucide="play" class="w-5 h-5"></i>
          Play Movie
        </button>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    movieModal.classList.remove('hidden');

    const playBtn = document.getElementById('play-movie-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        movieModal.classList.add('hidden');
        openPlayer(movie);
      });
    }
  }

  function openPlayer(movie) {
    if (!playerModal || !playerFrame) return;
    const title = movie.title || movie.name;
    if (playerTitle) playerTitle.textContent = title;
    playerFrame.src = `https://vidsrc.sbs/embed/movie/${movie.id}`;
    playerModal.classList.remove('hidden');
  }

  if (closeModal && movieModal) {
    closeModal.addEventListener('click', () => {
      movieModal.classList.add('hidden');
    });
  }

  if (closePlayer && playerModal) {
    closePlayer.addEventListener('click', () => {
      playerModal.classList.add('hidden');
      playerFrame.src = '';
    });
  }

  if (btnPlayerFullscreen && playerModal) {
    btnPlayerFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        playerModal.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    });
  }

  if (movieSearch) {
    let debounceTimer;
    movieSearch.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim();
      debounceTimer = setTimeout(() => {
        fetchMovies(query);
      }, 300);
    });
  }

  fetchMovies();
});
