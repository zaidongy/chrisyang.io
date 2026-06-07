(() => {
  const html = document.documentElement;
  const STORAGE_KEY = 'theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch { /* noop */ }
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function getEffectiveTheme() {
    const stored = getStoredTheme();
    return stored || getSystemTheme();
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const isLight = theme === 'light';
    btn.setAttribute('aria-pressed', String(isLight));
    btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');

    // Moon icon (shown in light mode -> click to go dark)
    // Sun icon (shown in dark mode -> click to go light)
    btn.innerHTML = isLight
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  }

  function toggleTheme() {
    const current = html.hasAttribute('data-theme') && html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setStoredTheme(next);
    applyTheme(next);
  }

  function init() {
    applyTheme(getEffectiveTheme());

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
