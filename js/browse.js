document.addEventListener("DOMContentLoaded", () => {
  let tabs = [];
  let activeTabId = null;
  let tabCounter = 0;

  const tabsList = document.getElementById('tabs-list');
  const addTabBtn = document.getElementById('add-tab-btn');
  const urlInput = document.getElementById('url-input');
  const browserFrame = document.getElementById('browser-frame');
  const welcomeScreen = document.getElementById('welcome-screen');
  const btnReload = document.getElementById('btn-reload');
  const btnBack = document.getElementById('btn-back');
  const btnForward = document.getElementById('btn-forward');

  function createTab() {
    tabCounter++;
    const tabId = `tab-${tabCounter}`;
    const newTab = {
      id: tabId,
      url: '',
      title: 'New Tab',
      displayUrl: ''
    };
    tabs.push(newTab);
    renderTabs();
    switchTab(tabId);
  }

  function closeTab(e, tabId) {
    e.stopPropagation();
    tabs = tabs.filter(t => t.id !== tabId);
    
    if (tabs.length === 0) {
      createTab();
    } else if (activeTabId === tabId) {
      switchTab(tabs[tabs.length - 1].id);
    } else {
      renderTabs();
    }
  }

  function switchTab(tabId) {
    activeTabId = tabId;
    renderTabs();
    
    const activeTab = tabs.find(t => t.id === tabId);
    if (activeTab.url) {
      welcomeScreen.classList.add('hidden');
      browserFrame.classList.remove('hidden');
      if (browserFrame.src !== activeTab.url) {
        browserFrame.src = activeTab.url;
      }
      urlInput.value = activeTab.displayUrl;
    } else {
      welcomeScreen.classList.remove('hidden');
      browserFrame.classList.add('hidden');
      browserFrame.src = '';
      urlInput.value = '';
    }
  }

  function renderTabs() {
    tabsList.innerHTML = '';
    tabs.forEach(tab => {
      const isActive = tab.id === activeTabId;
      
      const tabEl = document.createElement('div');
      tabEl.className = `flex items-center gap-3 border border-purple-500/30 border-b-0 px-4 py-2 rounded-t-xl min-w-[150px] max-w-[200px] justify-between browser-tab ${isActive ? 'active-tab' : 'bg-[#1a1033]/50'}`;
      
      tabEl.onclick = () => switchTab(tab.id);

      const titleSpan = document.createElement('span');
      titleSpan.className = 'text-xs font-bold text-purple-200 tracking-wide truncate';
      titleSpan.textContent = tab.title;

      const closeBtn = document.createElement('button');
      closeBtn.className = 'text-purple-400 hover:text-white transition-colors ml-2';
      closeBtn.onclick = (e) => closeTab(e, tab.id);
      
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'x');
      icon.className = 'w-3.5 h-3.5';
      
      closeBtn.appendChild(icon);
      tabEl.appendChild(titleSpan);
      tabEl.appendChild(closeBtn);
      tabsList.appendChild(tabEl);
    });
    lucide.createIcons();
  }

  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      let inputVal = urlInput.value.trim();
      if (inputVal) {
        let finalUrl = '';
        
        if (!inputVal.startsWith('http://') && !inputVal.startsWith('https://')) {
          if (inputVal.includes('.') && !inputVal.includes(' ')) {
            finalUrl = 'https://' + inputVal;
          } else {
            finalUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(inputVal);
          }
        } else {
          finalUrl = inputVal;
        }

        let proxyUrl = finalUrl;
        if (typeof __uv$config !== 'undefined') {
          proxyUrl = __uv$config.prefix + __uv$config.encodeUrl(finalUrl);
        }

        const activeTab = tabs.find(t => t.id === activeTabId);
        if (activeTab) {
          activeTab.url = proxyUrl;
          activeTab.displayUrl = inputVal;
          activeTab.title = inputVal;
          switchTab(activeTabId);
        }
      }
    }
  });

  btnReload.addEventListener('click', () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab && activeTab.url) {
      browserFrame.src = browserFrame.src;
    }
  });

  btnBack.addEventListener('click', () => {
    try { browserFrame.contentWindow.history.back(); } catch(e) {}
  });

  btnForward.addEventListener('click', () => {
    try { browserFrame.contentWindow.history.forward(); } catch(e) {}
  });

  addTabBtn.addEventListener('click', createTab);

  createTab();
});
