document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('url-input');
  const welcomeScreen = document.getElementById('welcome-screen');
  const browserFrame = document.getElementById('browser-frame');
  const tabsList = document.getElementById('tabs-list');
  const addTabBtn = document.getElementById('add-tab-btn');
  const btnBack = document.getElementById('btn-back');
  const btnForward = document.getElementById('btn-forward');
  const btnReload = document.getElementById('btn-reload');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  let tabs = [];
  let activeTabId = null;

  function getProxiedUrl(inputVal) {
    if (!inputVal) return '';
    let targetUrl = inputVal;
    if (!inputVal.startsWith('http://') && !inputVal.startsWith('https://')) {
      if (inputVal.includes('.') && !inputVal.includes(' ')) {
        targetUrl = 'https://' + inputVal;
      } else {
        targetUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(inputVal);
      }
    }
    try {
      return 'wss://nocturne.lol/' + __scramjet$encodeUrl(targetUrl);
    } catch (e) {
      return targetUrl;
    }
  }

  function createTab(url = '', title = 'New Tab') {
    const id = Date.now().toString();
    const tab = { id, url, title };
    tabs.push(tab);
    renderTabs();
    switchTab(id);
  }

  function renderTabs() {
    if (!tabsList) return;
    tabsList.innerHTML = '';
    tabs.forEach(tab => {
      const tabEl = document.createElement('div');
      tabEl.className = `flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all cursor-pointer group shrink-0 ${tab.id === activeTabId ? 'bg-purple-600/40 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white' : 'bg-purple-950/30 border-purple-500/20 hover:bg-purple-900/50 text-purple-300'}`;
      
      const titleSpan = document.createElement('span');
      titleSpan.className = 'text-sm font-bold tracking-wide truncate max-w-[140px]';
      titleSpan.textContent = tab.title;
      titleSpan.addEventListener('click', () => switchTab(tab.id));

      const closeBtn = document.createElement('button');
      closeBtn.className = 'text-purple-400 hover:text-white p-1 rounded-lg transition-all opacity-50 group-hover:opacity-100';
      closeBtn.innerHTML = '<i data-lucide="x" class="w-4 h-4"></i>';
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(tab.id);
      });

      tabEl.appendChild(titleSpan);
      tabEl.appendChild(closeBtn);
      tabsList.appendChild(tabEl);
    });
    if (window.lucide) lucide.createIcons();
  }

  function switchTab(id) {
    activeTabId = id;
    const tab = tabs.find(t => t.id === id);
    if (tab) {
      if (tab.url) {
        browserFrame.src = tab.url;
        browserFrame.classList.remove('hidden');
        welcomeScreen.classList.add('hidden');
        if (urlInput) urlInput.value = tab.title;
      } else {
        browserFrame.src = '';
        browserFrame.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        if (urlInput) urlInput.value = '';
      }
    }
    renderTabs();
  }

  function closeTab(id) {
    const index = tabs.findIndex(t => t.id === id);
    if (index !== -1) {
      tabs.splice(index, 1);
      if (tabs.length === 0) {
        createTab();
      } else {
        switchTab(tabs[Math.max(0, index - 1)].id);
      }
    }
  }

  function loadUrl(inputVal) {
    if (!inputVal) return;
    const proxied = getProxiedUrl(inputVal);
    const activeTab = tabs.find(t => t.id === activeTabId);
    
    if (activeTab) {
      activeTab.url = proxied;
      activeTab.title = inputVal;
    }

    browserFrame.src = proxied;
    browserFrame.classList.remove('hidden');
    welcomeScreen.classList.add('hidden');
    renderTabs();
  }

  if (urlInput) {
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        loadUrl(urlInput.value.trim());
      }
    });
  }

  if (addTabBtn) addTabBtn.addEventListener('click', () => createTab());

  if (btnReload) {
    btnReload.addEventListener('click', () => {
      if (browserFrame.src && !browserFrame.classList.contains('hidden')) {
        browserFrame.contentWindow.location.reload();
      }
    });
  }

  if (btnBack) btnBack.addEventListener('click', () => { try { browserFrame.contentWindow.history.back(); } catch(e) {} });
  if (btnForward) btnForward.addEventListener('click', () => { try { browserFrame.contentWindow.history.forward(); } catch(e) {} });
  
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  
  if (query) {
    window.history.replaceState({}, document.title, window.location.pathname);
    createTab(getProxiedUrl(query), query);
  } else {
    createTab();
  }
});
