// Verified with GitHub Copilot - Test OK
(() => {
  const toolbar = document.querySelector('.language-bar');
  const toc = document.querySelector('.toc');
  const languageLinks = [...document.querySelectorAll('.language-bar a[data-page]')];
  const storyLinks = [...document.querySelectorAll('[data-story-group]')];
  const storyPosition = document.querySelector('#story-position');
  const progress = document.querySelector('.reading-progress');
  const readingBlocks = [...document.querySelectorAll('.chapter, .sources li[id]')];
  const viewer = document.querySelector('#poster-viewer');
  const viewerImage = document.querySelector('#viewer-image');
  const viewerTitle = document.querySelector('#viewer-title');
  const viewerOriginal = document.querySelector('#viewer-original');

  const hasToolbar = !!toolbar;
  const hasToc = !!toc;
  const hasViewerModal = !!viewer && !!viewerImage && !!viewerTitle && !!viewerOriginal;

  if (!hasToolbar) return;

  let zoom = 1;
  let imageTrigger = null;
  let returnTo = '#mundarija';
  try { returnTo = sessionStorage.getItem('kuldjuktau-source-return') || returnTo; } catch {}

  function updateReturnLinks() {
    document.querySelectorAll('.source-back').forEach(link => { link.href = returnTo; });
  }

  function syncReadingLocation() {
    if (!toolbar || !readingBlocks.length) return;

    const anchorOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0;
    const line = Math.max(toolbar.getBoundingClientRect().bottom + 20, anchorOffset + 8);
    const visible = readingBlocks.find(block => {
      const rect = block.getBoundingClientRect();
      return rect.bottom > line && rect.top < Math.max(line + 50, innerHeight / 2);
    });
    const target = visible ? '#' + visible.id : '';

    languageLinks.forEach(link => { link.href = link.dataset.page + target; });

    const currentChapter = visible?.classList.contains('chapter') ? visible :
      [...document.querySelectorAll('.chapter')].reverse().find(chapter => chapter.getBoundingClientRect().top <= line);
    const chapterNumber = currentChapter ? Number(currentChapter.id.slice(-2)) : 1;
    const currentGroup = currentChapter?.dataset.group || '0';

    storyLinks.forEach(link => {
      if (link.dataset.storyGroup === currentGroup) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    if (storyPosition) storyPosition.textContent = String(chapterNumber).padStart(2, '0') + ' / 12';

    const distance = document.documentElement.scrollHeight - innerHeight;
    const percent = distance > 0 ? Math.min(100, Math.max(0, scrollY / distance * 100)) : 0;

    if (progress) {
      progress.style.setProperty('--reading-progress', percent + '%');
      progress.setAttribute('aria-valuenow', String(Math.round(percent)));
    }
  }

  let scheduled = false;
  function scheduleSync() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; syncReadingLocation(); });
  }

  function setZoom(value) {
    if (!viewer || !viewerImage) return;

    zoom = Math.max(1, Math.min(4, value));
    viewerImage.style.width = (zoom * 100) + '%';
    viewer.querySelector('[data-zoom="out"]').disabled = zoom <= 1;
    viewer.querySelector('[data-zoom="in"]').disabled = zoom >= 4;
  }

  function openImage(link) {
    if (!hasViewerModal || !link) return;

    imageTrigger = link;
    viewerTitle.textContent = link.dataset.title || '';
    viewerImage.src = link.href;
    viewerImage.alt = link.dataset.title || '';
    viewerOriginal.href = link.dataset.original || link.href;
    setZoom(1);
    const viewerScroll = viewer.querySelector('.viewer-scroll');
    if (viewerScroll) viewerScroll.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    viewer.showModal();
  }

  if (hasViewerModal) {
    const closeButton = viewer.querySelector('.viewer-close');
    if (closeButton) closeButton.addEventListener('click', () => viewer.close());

    viewer.querySelectorAll('[data-zoom]').forEach(button => {
      button.addEventListener('click', () => setZoom(zoom + (button.dataset.zoom === 'in' ? .5 : -.5)));
    });

    viewer.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      imageTrigger?.focus({ preventScroll: true });
    });
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    if (link.matches('[data-viewer]')) {
      event.preventDefault();
      openImage(link);
      return;
    }

    const href = link.getAttribute('href');
    if (link.matches('.chapter a[href^="#ref-"]')) {
      returnTo = '#' + link.closest('.chapter').id;
      try { sessionStorage.setItem('kuldjuktau-source-return', returnTo); } catch {}
      updateReturnLinks();
    }

    if (link.closest('.cover-visual') && href?.startsWith('#ref-')) {
      returnTo = '#poster-head';
      updateReturnLinks();
    }

    if (href === '#mundarija') {
      if (window.innerWidth < 760 && drawerDialog) {
        event.preventDefault();
        openDrawer();
        return;
      }
      if (toc) toc.open = true;
    } else if (link.closest('.nav-grid') && toc) {
      toc.open = false;
    }

    if (link.matches('.language-bar a[data-page]')) syncReadingLocation();
  });

  // Edge Drawer Side Panel logic for Mobile
  let drawerDialog = null;
  let edgeTrigger = null;

  function initEdgeDrawer() {
    const navGrid = document.querySelector('.nav-grid');
    if (!navGrid) return;

    const lang = document.documentElement.lang || 'uz';
    const drawerTitleText = lang === 'ko' ? '목차' : (lang === 'en' ? 'Contents' : 'Bo‘limlar');
    const closeAriaText = lang === 'ko' ? '닫기' : (lang === 'en' ? 'Close' : 'Yopish');

    // 1. Create Floating Edge Trigger Button
    edgeTrigger = document.createElement('button');
    edgeTrigger.type = 'button';
    edgeTrigger.className = 'edge-tab-trigger';
    edgeTrigger.setAttribute('aria-label', drawerTitleText);
    edgeTrigger.setAttribute('title', drawerTitleText);
    edgeTrigger.innerHTML = '<img class="icon" src="assets/icons/layout-grid.svg" alt="" aria-hidden="true" width="17" height="17"><span class="edge-label">' + drawerTitleText + '</span>';
    document.body.appendChild(edgeTrigger);

    // 2. Create Edge Drawer Dialog
    drawerDialog = document.createElement('dialog');
    drawerDialog.className = 'edge-drawer';
    drawerDialog.id = 'edge-drawer';
    drawerDialog.setAttribute('aria-labelledby', 'edge-drawer-title');

    const drawerPanel = document.createElement('div');
    drawerPanel.className = 'edge-drawer-panel';

    const header = document.createElement('div');
    header.className = 'edge-drawer-header';
    header.innerHTML = '<div class="edge-drawer-title" id="edge-drawer-title"><img class="icon" src="assets/icons/layout-grid.svg" alt="" aria-hidden="true" width="18" height="18"><span>' + drawerTitleText + '</span><span class="edge-drawer-count">12</span></div><button type="button" class="edge-drawer-close" aria-label="' + closeAriaText + '"><img class="icon" src="assets/icons/x.svg" alt="" aria-hidden="true" width="20" height="20"></button>';

    const content = document.createElement('div');
    content.className = 'edge-drawer-content';

    navGrid.querySelectorAll('a').forEach(link => {
      const clone = link.cloneNode(true);
      clone.className = 'edge-drawer-item';
      clone.addEventListener('click', () => {
        closeDrawer();
      });
      content.appendChild(clone);
    });

    drawerPanel.appendChild(header);
    drawerPanel.appendChild(content);
    drawerDialog.appendChild(drawerPanel);
    document.body.appendChild(drawerDialog);

    edgeTrigger.addEventListener('click', openDrawer);
    header.querySelector('.edge-drawer-close').addEventListener('click', closeDrawer);

    drawerDialog.addEventListener('click', event => {
      if (event.target === drawerDialog) closeDrawer();
    });

    drawerDialog.addEventListener('cancel', event => {
      event.preventDefault();
      closeDrawer();
    });
  }

  function openDrawer() {
    if (!drawerDialog) return;
    drawerDialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      drawerDialog.classList.add('is-open');
    });
    syncActiveDrawerItem();
  }

  function closeDrawer() {
    if (!drawerDialog) return;
    drawerDialog.classList.remove('is-open');
    setTimeout(() => {
      if (drawerDialog.open) drawerDialog.close();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }, 240);
  }

  function syncActiveDrawerItem() {
    if (!drawerDialog) return;
    const currentChapter = [...document.querySelectorAll('.chapter')].reverse().find(ch => {
      return ch.getBoundingClientRect().top <= 140;
    }) || document.querySelector('.chapter');

    const targetHash = currentChapter ? '#' + currentChapter.id : '#bolim-01';
    drawerDialog.querySelectorAll('.edge-drawer-item').forEach(item => {
      if (item.getAttribute('href') === targetHash) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  initEdgeDrawer();
  if (hasToc && location.hash === '#mundarija') toc.open = true;
  updateReturnLinks();

  addEventListener('scroll', scheduleSync, { passive: true });
  addEventListener('resize', scheduleSync);
  addEventListener('hashchange', scheduleSync);
  addEventListener('load', scheduleSync);
  document.addEventListener('toggle', scheduleSync, true);
  requestAnimationFrame(() => requestAnimationFrame(syncReadingLocation));
})();
