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
  let zoom = 1;
  let imageTrigger = null;
  let returnTo = '#mundarija';
  try { returnTo = sessionStorage.getItem('kuldjuktau-source-return') || returnTo; } catch {}

  function updateReturnLinks() {
    document.querySelectorAll('.source-back').forEach(link => { link.href = returnTo; });
  }
  function syncReadingLocation() {
    const anchorOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0;
    const line = Math.max(toolbar.getBoundingClientRect().bottom + 25, anchorOffset + 8);
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
    zoom = Math.max(1, Math.min(4, value));
    viewerImage.style.width = (zoom * 100) + '%';
    viewer.querySelector('[data-zoom="out"]').disabled = zoom <= 1;
    viewer.querySelector('[data-zoom="in"]').disabled = zoom >= 4;
  }
  function openImage(link) {
    imageTrigger = link;
    viewerTitle.textContent = link.dataset.title || '';
    viewerImage.src = link.href;
    viewerImage.alt = link.dataset.title || '';
    viewerOriginal.href = link.dataset.original || link.href;
    setZoom(1);
    viewer.querySelector('.viewer-scroll').scrollTo(0, 0);
    viewer.showModal();
    document.documentElement.style.overflow = 'hidden';
  }
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.querySelectorAll('[data-zoom]').forEach(button => {
    button.addEventListener('click', () => setZoom(zoom + (button.dataset.zoom === 'in' ? .5 : -.5)));
  });
  viewer.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    imageTrigger?.focus({ preventScroll: true });
  });
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
      toc.open = true;
    } else if (link.closest('.nav-grid')) {
      toc.open = false;
    }
    if (link.matches('.language-bar a[data-page]')) syncReadingLocation();
  });
  if (location.hash === '#mundarija') toc.open = true;
  updateReturnLinks();
  addEventListener('scroll', scheduleSync, { passive: true });
  addEventListener('resize', scheduleSync);
  addEventListener('hashchange', scheduleSync);
  addEventListener('load', scheduleSync);
  document.addEventListener('toggle', scheduleSync, true);
  requestAnimationFrame(() => requestAnimationFrame(syncReadingLocation));
})();
