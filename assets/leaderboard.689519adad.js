(() => {
'use strict';
const $=id=>document.getElementById(id),config=window.NURSEDOKU_ACCOUNT_CONFIG;
let request=0;
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const status=text=>{$('leaderboardStatus').textContent=text;};
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
})();

