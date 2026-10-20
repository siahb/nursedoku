(()=>{
 let pending=null;const button=document.getElementById('installAppBtn'),status=document.getElementById('installAppStatus');
 if(!button)return;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 addEventListener('beforeinstallprompt',event=>{event.preventDefault();pending=event;button.hidden=standalone();});
 button.addEventListener('click',async()=>{if(!pending)return;button.disabled=true;try{await pending.prompt();const result=await pending.userChoice;status.textContent=result.outcome==='accepted'?'Installation requested.':'You can install NurseDoku later.';}catch{status.textContent='Use your browser menu to install NurseDoku.';}finally{pending=null;button.hidden=true;button.disabled=false;}});
 addEventListener('appinstalled',()=>{pending=null;button.hidden=true;status.textContent='NurseDoku installed.';});
 if(!standalone()&&(/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))){button.hidden=false;button.textContent='Add NurseDoku to Home Screen';button.addEventListener('click',()=>{status.textContent='In Safari, open Share, then choose Add to Home Screen.';});}
})();
