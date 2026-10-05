(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const themeButton = document.querySelector('.theme-toggle');
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const setThemeLabel = () => {
    if (!themeButton) return;
    const label = document.documentElement.dataset.theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro';
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
  };
  themeButton?.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch (_) {}
    setThemeLabel();
  });
  scheme.addEventListener?.('change', event => {
    let saved = null;
    try { saved = localStorage.getItem('portfolio-theme'); } catch (_) {}
    if (!saved) {
      document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
      setThemeLabel();
    }
  });
  setThemeLabel();

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  const closeMenu = () => {
    menu?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      closeMenu(); menu.focus();
    }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });

  const links = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  const updateActive = () => {
    if (!sections.length) return;
    const header = document.querySelector('.site-header');
    const line = (header?.getBoundingClientRect().bottom || 0) + 100;
    let active = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= line) active = section;
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) active = sections[sections.length - 1];
    for (const link of links) {
      if (active && link.hash.slice(1) === active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(updateActive, { rootMargin: '-80px 0px -65% 0px', threshold: [0, .1, .5, 1] });
    sections.forEach(section => observer.observe(section));
  }
  window.addEventListener('resize', updateActive);
  let pending = false;
  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; updateActive(); });
  }, { passive: true });
  updateActive();
})();
