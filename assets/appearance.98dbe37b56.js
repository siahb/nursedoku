(() => {
  'use strict';
  const root = document.documentElement;
  const key = 'sv_theme';
  const shared = location.hostname === 'siahverse.cc' || location.hostname.endsWith('.siahverse.cc');
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let current;
  const valid = value => value === 'dark' || value === 'light';
  function read() {
    if (shared) {
      const match = document.cookie.split(';').map(x => x.trim()).find(x => x.startsWith(key + '='));
      const value = match && match.slice(key.length + 1);
      return valid(value) ? value : null;
    }
    try { const value = localStorage.getItem(key); return valid(value) ? value : null; } catch { return null; }
  }
  function apply(value) {
    current = value;
    root.dataset.theme = value;
    root.dataset.appearance = value;
    root.style.colorScheme = value;
    if (document.body) document.body.classList.toggle('light-mode', value === 'light');
    const dark = value === 'dark';
    for (const id of ['toggle-theme', 'toggle-theme-checkbox', 'themeToggle', 'appearanceBtn', 'sharedThemeToggle']) {
      const control = document.getElementById(id);
      if (!control) continue;
      control.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      control.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
      if (control.type === 'checkbox') control.checked = dark;
      else { control.setAttribute('aria-pressed', String(dark)); control.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="vertical-align:middle;margin-right:6px">' + (dark ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>' : '<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>') + '</svg>' + (dark ? 'Light' : 'Dark'); }
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#090d17' : '#f4f7fb';
  }
  function refresh() { const value = read() || (system.matches ? 'dark' : 'light'); if (value !== current) apply(value); }
  function set(value) {
    if (!valid(value)) return;
    if (shared) document.cookie = key + '=' + value + '; Path=/; Domain=siahverse.cc; Max-Age=31536000; SameSite=Lax; Secure';
    else { try { localStorage.setItem(key, value); } catch {} }
    apply(value);
  }
  window.SiahverseTheme = {set, refresh, get: () => current};
  refresh();
  function bind() {
    if(document.createElement&&document.head){
      const style=document.createElement('style');style.textContent='.sv-theme-control{position:static!important;display:inline-flex!important;align-items:center;justify-content:center;gap:0;flex:0 0 auto;min-width:88px!important;width:auto!important;height:44px!important;min-height:44px!important;padding:9px 12px!important;margin:0!important;border:1px solid var(--border,var(--b,#637089))!important;border-radius:12px!important;background:var(--panel2,var(--p2,var(--surface,#172033)))!important;color:var(--text,var(--t,#f4f7ff))!important;font:600 13px/1.2 system-ui!important;letter-spacing:0!important;cursor:pointer}.sv-theme-control svg{display:inline-block!important;width:18px!important;height:18px!important}.sv-theme-control:focus-visible{outline:3px solid var(--accent,var(--a,#7c9cff));outline-offset:3px}.sv-theme-row{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap}.sv-theme-header{max-width:940px;margin:0 auto;padding:18px;display:flex;align-items:center;justify-content:space-between;gap:12px}.sv-theme-header>a{color:inherit;text-decoration:none;font:600 14px system-ui}';document.head.append(style);
      for(const id of ['toggle-theme','toggle-theme-checkbox','themeToggle','appearanceBtn','sharedThemeToggle']){
        const control=document.getElementById(id);if(!control||control.type==='checkbox'||control.tagName!=='BUTTON')continue;
        control.classList.add('sv-theme-control');
        const header=control.closest('header,.brand,.topbar,.master-header,.top,.nav');
        if(header){const actions=control.closest('.header-actions,.header-links,.top-actions,.nav')||header;actions.classList.add('sv-theme-row');actions.append(control);}
        else if(control.parentElement===document.body){const header=document.createElement('header');header.className='sv-theme-header';const back=document.querySelector('a[href="/"],a[href="/nursing/"],a[href="/qbanco/"]');if(back)header.append(back);document.body.insertBefore(header,document.body.firstChild);header.append(control);}
      }
    }

    apply(read() || current);
    for (const id of ['toggle-theme', 'toggle-theme-checkbox', 'themeToggle', 'appearanceBtn', 'sharedThemeToggle']) {
      const control = document.getElementById(id);
      if (control) control.addEventListener(control.type === 'checkbox' ? 'change' : 'click', () => {
        const checkboxChoice = control.checked ? 'dark' : 'light';
        refresh();
        set(control.type === 'checkbox' ? checkboxChoice : (current === 'dark' ? 'light' : 'dark'));
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('storage', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  system.addEventListener('change', refresh);
  // Cookies have no cross-origin change event. Visible tabs check for updates.
  window.setInterval(() => { if (!document.hidden) refresh(); }, 1000);
})();
