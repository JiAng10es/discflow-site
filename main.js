'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // 1. Mobile Navigation Drawer
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileBtn && mobileDrawer) {
    const closeDrawer = () => {
      mobileDrawer.classList.remove('is-open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    };
    mobileBtn.addEventListener('click', () => {
      const open = mobileDrawer.classList.toggle('is-open');
      mobileBtn.setAttribute('aria-expanded', String(open));
    });
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeDrawer();
        mobileBtn.focus();
      }
    });
  }

  // 2. Hero Showcase Switcher (Fujii Kaze & Queue Refresh)
  const heroViews = {
    fujii: {
      src: 'assets/hero_fujii_player_dark.png',
      alt: 'Discflow v2.3.1 播放主界面 - 藤井風《HELP EVER HURT NEVER》',
      caption: '藤井風《HELP EVER HURT NEVER》· 无边框圆角 · 16-Bit / 44.1 kHz'
    },
    queue: {
      src: 'assets/queue_refresh_dark.png',
      alt: 'Discflow v2.3.1 曲目队列与一键重刷歌词界面',
      caption: '曲目队列 · 支持整碟一键「重刷歌词」与三源专辑匹配'
    }
  };

  const heroImg = document.getElementById('hero-showcase-img');
  const heroCaption = document.getElementById('hero-showcase-caption');
  const heroSegBtns = Array.from(document.querySelectorAll('[data-hero-view]'));

  heroSegBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.heroView;
      const item = heroViews[key];
      if (!item || !heroImg) return;
      heroImg.src = item.src;
      heroImg.alt = item.alt;
      if (heroCaption) heroCaption.textContent = item.caption;
      heroSegBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
    });
  });

  // 3. Light / Dark Theme Preview Switcher
  const themeBtns = Array.from(document.querySelectorAll('[data-theme-mode]'));
  const galleryDark = document.getElementById('theme-gallery-dark');
  const galleryLight = document.getElementById('theme-gallery-light');

  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.themeMode;
      const isDark = mode === 'dark';
      if (galleryDark) galleryDark.classList.toggle('is-active', isDark);
      if (galleryLight) galleryLight.classList.toggle('is-active', !isDark);
      themeBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
    });
  });

  // 4. Crisp Image Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  let lastFocused = null;

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Discflow 高清截图预览';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  };

  document.querySelectorAll('[data-zoomable]').forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  // 5. Page View Counter (Busuanzi + LocalStorage fallback)
  const pvEl = document.getElementById('busuanzi_value_site_pv');
  if (pvEl) {
    const LOCAL_KEY = 'discflow_site_pv_cache';
    let currentVal = parseInt(localStorage.getItem(LOCAL_KEY) || '1280', 10);
    currentVal += 1;
    localStorage.setItem(LOCAL_KEY, String(currentVal));
    pvEl.textContent = currentVal.toLocaleString('en-US');

    const script = document.createElement('script');
    script.async = true;
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.onload = () => {
      const observer = new MutationObserver(() => {
        const parsed = parseInt((pvEl.textContent || '').replace(/,/g, ''), 10);
        if (!isNaN(parsed) && parsed > currentVal) {
          localStorage.setItem(LOCAL_KEY, String(parsed));
        }
      });
      observer.observe(pvEl, { childList: true, characterData: true });
    };
    document.body.appendChild(script);
  }
});
