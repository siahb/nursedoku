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
      else { control.setAttribute('aria-pressed', String(dark)); control.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="vertical-align:middle;margin-right:6px">' + (dark ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>' : '<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>') + '</svg>' + (dark ? 'Dark' : 'Light'); }
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
      const style=document.createElement('style');style.textContent='html[data-theme=light] .sv-theme-control{background:#eef3f9!important;color:#182033!important;border-color:#b8c5da!important}html[data-theme=dark] .sv-theme-control{background:#172033!important;color:#f4f7ff!important;border-color:#425373!important}.sv-theme-control{position:static!important;display:inline-flex!important;align-items:center;justify-content:center;gap:0;flex:0 0 auto;min-width:88px!important;width:auto!important;height:44px!important;min-height:44px!important;padding:9px 12px!important;margin:0!important;border:1px solid var(--border,var(--b,#637089))!important;border-radius:12px!important;background:var(--panel2,var(--p2,var(--surface,#172033)))!important;color:var(--text,var(--t,#f4f7ff))!important;font:600 13px/1.2 system-ui!important;letter-spacing:0!important;cursor:pointer}.sv-theme-control svg{display:inline-block!important;width:18px!important;height:18px!important}.sv-theme-control:focus-visible{outline:3px solid var(--accent,var(--a,#7c9cff));outline-offset:3px}.sv-theme-row{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap}.sv-theme-header{max-width:940px;margin:0 auto;padding:18px;display:flex;align-items:center;justify-content:space-between;gap:12px}.sv-theme-header>a{color:inherit;text-decoration:none;font:600 14px system-ui}';document.head.append(style);
      for(const id of ['toggle-theme','toggle-theme-checkbox','themeToggle','appearanceBtn','sharedThemeToggle']){
        const control=document.getElementById(id);if(!control||control.type==='checkbox'||control.tagName!=='BUTTON')continue;
        control.classList.add('sv-theme-control');
        const header=control.closest('header,.brand,.topbar,.master-header,.top,.nav');
        if(header){const actions=control.closest('.header-actions,.header-links,.top-actions,.nav')||header;actions.classList.add('sv-theme-row');if(actions===header){actions.style.justifyContent='space-between';const brand=actions.querySelector(':scope > .brand,:scope > .logo-link,:scope > .gate-brand,:scope > .logo,:scope > .home');if(brand)brand.style.marginRight='auto';}actions.append(control);}
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

// Shared decorative background; independent of app data and authentication.
(()=>{'use strict';if(!document.createElement)return;const boot=()=>{
 if(document.getElementById('sv-stars'))return;
 const shared=location.hostname==='siahverse.cc'||location.hostname.endsWith('.siahverse.cc'),key='sv_stars',motion=matchMedia('(prefers-reduced-motion: reduce)');
 const read=()=>{if(shared){const c=document.cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith(key+'='));return c?.slice(key.length+1);}try{return localStorage.getItem(key);}catch{return null;}};
 const canvas=document.createElement('canvas');canvas.id='sv-stars';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);const ctx=canvas.getContext('2d');if(!ctx)return;
 const style=document.createElement('style');style.textContent='#sv-stars{position:fixed!important;inset:0!important;width:100%!important;height:100%!important;pointer-events:none!important;z-index:0!important}body>#stars{display:none!important}body>header,body>main,body>.wrap,body>.container,body>.shell,body>footer,body>section,body>nav,body>h1,body>#board,body>#keyboard{position:relative;z-index:1}.sv-stars-control{min-width:82px!important;width:auto!important;padding:9px 12px!important;gap:6px!important}.sv-stars-control[aria-pressed=true] svg{color:#d99b08;fill:#f5c542}.sv-stars-control svg{margin:0!important}@media(prefers-reduced-motion:reduce){#sv-stars{opacity:.7}}';document.head.append(style);
 const button=document.createElement('button');button.type='button';button.className='sv-theme-control sv-stars-control';button.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/></svg><span>Star</span>';
 let enabled=read()!=='off',frame=0,last=0,w=0,h=0,stars=[];
 function resize(){w=innerWidth;h=innerHeight;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);stars=Array.from({length:w<600?65:130},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.3+.65,s:Math.random()*9+5}));paint(0);}
 function paint(dt){ctx.clearRect(0,0,w,h);ctx.fillStyle=document.documentElement.dataset.theme==='light'?'rgba(40,62,110,.72)':'rgba(165,190,255,.58)';for(const star of stars){star.y-=star.s*dt;if(star.y<0){star.y=h;star.x=Math.random()*w;}ctx.beginPath();ctx.arc(star.x,star.y,star.r*(document.documentElement.dataset.theme==='dark'?1.55:1),0,Math.PI*2);ctx.fill();}}
 function tick(now){paint(last?Math.min((now-last)/1000,.05):0);last=now;frame=requestAnimationFrame(tick);}
 function sync(){enabled=read()!=='off';canvas.hidden=!enabled;button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Turn stars off':'Turn stars on');button.title=enabled?'Turn stars off':'Turn stars on';cancelAnimationFrame(frame);frame=0;last=0;if(enabled&&!document.hidden){paint(0);if(!motion.matches)frame=requestAnimationFrame(tick);}}
 const mount=()=>{if(button.isConnected)return;const theme=document.querySelector('.sv-theme-control:not(.sv-stars-control)');if(theme)theme.before(button);};mount();new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
 button.onclick=()=>{const value=enabled?'off':'on';if(shared)document.cookie=key+'='+value+'; Path=/; Domain=siahverse.cc; Max-Age=31536000; SameSite=Lax; Secure';else try{localStorage.setItem(key,value);}catch{}sync();};
 addEventListener('resize',resize);addEventListener('focus',sync);addEventListener('storage',sync);document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);new MutationObserver(()=>paint(0)).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});setInterval(()=>{if((read()!=='off')!==enabled)sync();},1000);resize();sync();
 };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();})();

