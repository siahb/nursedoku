// Keep source files canonical; immutable copies are the browser-facing build.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),hash=value=>crypto.createHash('sha256').update(value).digest('hex').slice(0,10);
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');const assets=['./','index.html','manifest.webmanifest','icon.svg','icon.svg?v=20261020-puzzle-logo','pwa.js?v=20261020-puzzle-logo',...JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8')).icons.map(i=>i.src),'icons/icon-180.png?v=20261020-puzzle-logo'];fs.mkdirSync(path.join(root,'assets'),{recursive:true});
// Content hashes replace any leftover query-string cache busters.
html=html.replace(/((?:src|href)="assets\/[^"?]+\.(?:js|css))\?[^"]*(")/g,'$1$2');
for(const name of ['app.js','styles.css','puzzles.js','large-puzzles.js','account-config.js','accounts.js','appearance.js','tutorial.js','shift000.js','leaderboard.js']){
 const data=fs.readFileSync(path.join(root,name)),ext=path.extname(name),stem=path.basename(name,ext),file=`assets/${stem}.${hash(data)}${ext}`;
 fs.writeFileSync(path.join(root,file),data);assets.push(file);
 const escaped=stem.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 html=html.replace(new RegExp(`((?:src|href)=")(?:assets/${escaped}\\.[a-f0-9]+\\${ext}|${escaped}\\${ext}\\?v=[a-z0-9-]+)(")`,'g'),(_,before,after)=>before+file+after);
}
fs.writeFileSync(path.join(root,'index.html'),html);
let sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');sw=sw.replace(/const CACHE='[^']+';/,`const CACHE='nursedoku-${hash(JSON.stringify(assets)+html)}';`).replace(/const ASSETS=.*?;/,`const ASSETS=${JSON.stringify(assets)};`);fs.writeFileSync(path.join(root,'sw.js'),sw);
console.log('Built immutable app assets and offline cache.');
