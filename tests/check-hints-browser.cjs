const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge'});let checks=0;
try{for(const width of [375,1280])for(const n of [6,10]){
 const p=await b.newPage({viewport:{width,height:667}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/api/account/**',r=>r.fulfill({json:{session:null}}));
 await p.addInitScript(()=>localStorage.setItem('nursedoku-changelog','2026-10-20-v1.2.0'));
 await p.goto(process.env.NURSEDOKU_BASE_URL||'http://127.0.0.1:8192/nursedoku/');
 await p.evaluate(n=>{stats.shift000Complete=true;document.getElementById('boardSize').value=String(n);switchGame('practice');enterGame();},n);
 const before=await p.evaluate(()=>JSON.stringify({state,history,strikes}));
 await p.locator('#hintBtn').click();
 assert.equal(await p.locator('.cell[data-hint-action]:not([data-hint-action=""])').count(),1,'Exactly one action target');checks++;
 assert(await p.evaluate(()=>document.activeElement.classList.contains('cell')&&document.activeElement.classList.contains('hint')),'Hint target receives keyboard focus');checks++;
 assert(await p.locator('.cell.hint').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'Target is visible after request '+JSON.stringify({width,n,rect:await p.locator('.cell.hint').evaluate(e=>e.getBoundingClientRect().toJSON())}));checks++;
 assert.equal(await p.evaluate(()=>JSON.stringify({state,history,strikes})),before,'Request preserves marks, undo and strikes');checks++;
 assert.equal(await p.locator('.hint-preview').count(),1,'RN/X hint has a ghost preview');assert.equal(await p.locator('.hint-preview').getAttribute('aria-hidden'),'true');checks++;
 assert.equal(await p.locator('.hint-preview').evaluate(e=>getComputedStyle(e).animationName),'hint-preview-pulse');checks++;
 await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.hint-preview').evaluate(e=>getComputedStyle(e).animationName),'none');await p.emulateMedia({reducedMotion:'no-preference'});checks++;

 await p.locator('#hintBtn').click();const h=await p.evaluate(()=>explainHint(puzzle(),state));
 await p.keyboard.press(h.kind==='x'?'Space':'r');
 assert.equal(await p.evaluate(({r,c})=>state[r][c],h),h.kind==='x'?'x':'rn','Keyboard acts on the highlighted square');checks++;
 assert.equal(await p.locator('.hint-preview').count(),0,'Preview clears after a move');checks++;

 await p.reload();await p.locator('#continueBtn').click();await p.locator('#hintBtn').click();
 assert.equal(await p.locator('.cell.hint').getAttribute('aria-describedby'),'message','Hint explanation is linked after reload');checks++;
 await p.evaluate(()=>{finished=true;paint();});assert(await p.locator('#hintBtn').isDisabled(),'Hint disabled after completion');checks++;
 await p.evaluate(()=>{lost=true;paint();});assert(await p.locator('#hintBtn').isDisabled(),'Hint disabled after loss');checks++;
 await p.evaluate(()=>{finished=false;lost=false;state=blank();state[0][(puzzle().solution[0]+1)%size()]='rn';hintCell=null;render();});await p.locator('#hintBtn').click();assert.equal(await p.locator('.cell.hint').getAttribute('data-hint-action'),'Review');assert.equal(await p.locator('.hint-preview').count(),0);assert.equal(await p.locator('.cell.hint .rn-marker').count(),1);checks++;
 assert.deepEqual(errors,[],'No browser errors');checks++;await p.close();
 }console.log('PASS: '+checks+' hint browser checks for 6x6/10x10 at phone and desktop sizes.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
