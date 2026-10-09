(() => {
'use strict';
const $=id=>document.getElementById(id),config=window.NURSEDOKU_ACCOUNT_CONFIG;
let busy=false,request=0;
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const status=text=>{$('leaderboardStatus').textContent=text;};
function locks(value){busy=value;for(const id of ['publishLeaderboardBtn','withdrawLeaderboardBtn','refreshLeaderboardBtn'])$(id).disabled=value;}
async function load(){
 const ticket=++request,day=$('leaderboardDate').value;$('leaderboardRows').replaceChildren();$('leaderboardTable').hidden=true;status('Loading daily times…');
 if(!navigator.onLine){status('You’re offline. Connect to see the leaderboard; your progress is safe.');return;}
 try{
  const response=await fetch(config.url+'/rest/v1/rpc/nursedoku_daily_board',{method:'POST',headers:{apikey:config.key,'Content-Type':'application/json'},body:JSON.stringify({p_day:day})});
  if(!response.ok)throw Error('The leaderboard could not load. Try again shortly.');
  const rows=await response.json();if(ticket!==request)return;
  if(!Array.isArray(rows))throw Error('The leaderboard could not load.');
  for(const row of rows){const tr=document.createElement('tr');for(const value of [row.rank,row.nickname,`${Math.floor(row.elapsed_ms/60000)}:${String(Math.floor(row.elapsed_ms/1000)%60).padStart(2,'0')}`,row.strikes]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}$('leaderboardRows').append(tr);}
  $('leaderboardTable').hidden=!rows.length;status(rows.length?`Top ${rows.length} daily results for ${day}. Equal times and strikes share a rank.`:'No results for this day yet. Your daily shift could be the first.');
 }catch(error){if(ticket===request)status(error.message);}
}
$('leaderboardBtn').addEventListener('click',()=>{window.NurseDokuProgress.pause();$('leaderboardDate').max=today();$('leaderboardDate').value=today();$('leaderboardDialog').showModal();load();});
$('closeLeaderboardBtn').addEventListener('click',()=>$('leaderboardDialog').close());
$('leaderboardDialog').addEventListener('close',()=>{request++;window.NurseDokuProgress.resume();});
$('leaderboardDate').addEventListener('change',()=>{if($('leaderboardDate').reportValidity())load();});
$('refreshLeaderboardBtn').addEventListener('click',load);
$('leaderboardForm').addEventListener('submit',async event=>{
 event.preventDefault();if(busy)return;
 const nickname=$('leaderboardNickname').value.trim();
 if(!/^[A-Za-z0-9 _-]{2,24}$/.test(nickname)){status('Use 2–24 letters, numbers, spaces, underscores or hyphens.');return;}
 if(!$('leaderboardConsent').checked){status('Choose to share your nickname and result before publishing.');return;}
 const g=window.NurseDokuProgress.snapshot().game;
 if(g.gameKind!=='daily'||!g.finished||g.lost||!g.rankEligible){status('Finish a new daily shift without hints or resets to publish. Practice, tutorial, and replay results stay private.');return;}
 if(!g.bonusSubmitted||(g.bonusQueue.length&&g.bonusCursor!==g.bonusQueue.length-1)){status('Answer all required NCLEX questions before publishing.');return;}
 locks(true);status('Syncing and publishing your daily result…');
 try{await window.NurseDokuLeaderboardAccount.publish(nickname);$('leaderboardDate').value=g.dailyDate;await load();status('Daily result published. Your first published result for this date is kept.');}catch(error){status(error.message);}finally{locks(false);}
});
$('withdrawLeaderboardBtn').addEventListener('click',async()=>{
 if(busy||!confirm('Remove all your public NurseDoku results? Your puzzles and private progress will stay saved.'))return;
 locks(true);status('Removing your public results…');
 try{await window.NurseDokuLeaderboardAccount.withdraw();await load();status('Your public results have been removed.');}catch(error){status(error.message);}finally{locks(false);}
});
})();
