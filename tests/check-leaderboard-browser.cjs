const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});let checks=0;
 try{for(const width of [320,375,430,1280]){
  const context=await browser.newContext({viewport:{width,height:667}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/account/**',r=>r.fulfill({json:{session:null}}));
  await page.route('**/rest/v1/rpc/nursedoku_daily_board',r=>r.fulfill({json:[{rank:1,nickname:'<b>Test Nurse</b>',elapsed_ms:42000,strikes:0},{rank:1,nickname:'Test Nurse',elapsed_ms:42000,strikes:0}]}));
  await page.addInitScript(()=>localStorage.setItem('nursedoku-changelog','2026-09-29-v1.1.0'));
  await page.goto(process.env.NURSEDOKU_BASE_URL||'http://127.0.0.1:8182/',{waitUntil:'networkidle'});
  const shell=await page.locator('.app-shell').boundingBox();assert(width>=960?shell.width>850:shell.width<=570);checks++;
  await page.getByRole('button',{name:'Daily leaderboard',exact:true}).click();
  await page.locator('#leaderboardRows tr').nth(1).waitFor();
  assert.equal(await page.locator('#leaderboardRows tr').count(),2);checks++;
  assert.equal(await page.locator('#leaderboardRows b').count(),0);checks++;
  assert.equal(await page.locator('#leaderboardRows tr').first().locator('td').nth(2).innerText(),'0:42');checks++;
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
  assert(await page.locator('#leaderboardDialog').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}));checks++;
  assert.equal(await page.locator('#leaderboardConsent,#publishLeaderboardBtn,#withdrawLeaderboardBtn').count(),0);checks++;
  await page.getByText('Signed-in players appear automatically',{exact:false}).waitFor();checks++;
  await page.evaluate(()=>document.documentElement.dataset.appearance='dark');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
  await context.setOffline(true);await page.getByRole('button',{name:'Refresh',exact:true}).click();await page.getByText('You’re offline.',{exact:false}).waitFor();checks++;
  await page.getByRole('button',{name:'Close leaderboard',exact:true}).click();assert(!(await page.locator('#leaderboardDialog').evaluate(el=>el.open)));checks++;
  await context.setOffline(false);await page.locator('#menuDailyBtn').click();
  const board=await page.locator('.game-card').boundingBox(),shift=await page.locator('.status-card').boundingBox();if(width>=960)assert(shift.x>=board.x+board.width);else assert(shift.y<board.y);checks++;
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
  assert.deepEqual(errors,[]);checks++;await context.close();
 }
 console.log(`PASS: ${checks} leaderboard browser checks. Publishing is fixture-based here; live database role tests are separate.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
