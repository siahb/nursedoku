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
  await page.getByRole('button',{name:'Daily leaderboard',exact:true}).click();
  await page.locator('#leaderboardRows tr').nth(1).waitFor();
  assert.equal(await page.locator('#leaderboardRows tr').count(),2);checks++;
  assert.equal(await page.locator('#leaderboardRows b').count(),0);checks++;
  assert.equal(await page.locator('#leaderboardRows tr').first().locator('td').nth(2).innerText(),'0:42');checks++;
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
  assert(await page.locator('#leaderboardDialog').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}));checks++;
  await page.locator('#leaderboardNickname').fill('Test Nurse');await page.locator('#leaderboardConsent').check();
  await page.getByRole('button',{name:'Publish my daily result'}).click();
  await page.getByText('Finish a new daily shift without hints or resets to publish.',{exact:false}).waitFor();checks++;
  await page.evaluate(()=>{window.NurseDokuProgress.snapshot=()=>({game:{gameKind:'daily',finished:true,lost:false,rankEligible:true,bonusSubmitted:false,bonusQueue:[1],bonusCursor:0}});});
  await page.getByRole('button',{name:'Publish my daily result'}).click();await page.getByText('Answer all required NCLEX questions before publishing.',{exact:true}).waitFor();checks++;
  await page.evaluate(()=>{window.NurseDokuProgress.snapshot=()=>({game:{gameKind:'daily',finished:true,lost:false,rankEligible:true,bonusSubmitted:true,bonusQueue:[1],bonusCursor:0,dailyDate:'2026-10-09'}});window.NurseDokuLeaderboardAccount.publish=async()=>{throw Error('Sign in to publish your result.');};});
  await page.getByRole('button',{name:'Publish my daily result'}).click();await page.getByText('Sign in to publish your result.',{exact:true}).waitFor();checks++;
  await page.evaluate(()=>{window.NurseDokuLeaderboardAccount.publish=async nickname=>{window.__nickname=nickname;};});
  await page.getByRole('button',{name:'Publish my daily result'}).click();await page.getByText('Daily result published.',{exact:false}).waitFor();assert.equal(await page.evaluate(()=>window.__nickname),'Test Nurse');checks++;
  await page.evaluate(()=>document.documentElement.dataset.appearance='dark');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
  await context.setOffline(true);await page.getByRole('button',{name:'Refresh',exact:true}).click();await page.getByText('You’re offline.',{exact:false}).waitFor();checks++;
  await page.getByRole('button',{name:'Close leaderboard',exact:true}).click();assert(!(await page.locator('#leaderboardDialog').evaluate(el=>el.open)));checks++;
  assert.deepEqual(errors,[]);checks++;await context.close();
 }
 console.log(`PASS: ${checks} leaderboard browser checks. Publishing is fixture-based here; live database role tests are separate.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
