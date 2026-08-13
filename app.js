const SONGS=[
 {title:'Tujhe Dekha Toh',artist:'Kumar Sanu • Lata Mangeshkar',id:'cNV5hLSa9H8',mood:'90s Romance'},
 {title:'Humko Humise Chura Lo',artist:'Lata Mangeshkar • Udit Narayan',id:'zWPsjhBaRb0',mood:'Late Night'},
 {title:'Do Dil Mil Rahe Hain',artist:'Kumar Sanu',id:'P_KMLTRyRQM',mood:'90s Romance'},
 {title:'Aankhon Se Tune Kya Keh Diya',artist:'Kumar Sanu • Alka Yagnik',id:'MabYaWdPA3M',mood:'Rainy Night'},
 {title:'Hothon Pe Bas',artist:'Lata Mangeshkar • Kumar Sanu',id:'c-t4nE-KCU8',mood:'Road Radio'}
];
let currentIndex=0,playing=false,shuffle=true,repeat=false,player=null,ready=false,timer=null;
const $=id=>document.getElementById(id);
function format(sec){if(!Number.isFinite(sec)||sec<0)return'0:00';const m=Math.floor(sec/60),s=Math.floor(sec%60).toString().padStart(2,'0');return`${m}:${s}`}
function randomIndex(){return Math.floor(Math.random()*SONGS.length)}
function setMeta(i){
 const s=SONGS[i];
 $('title').textContent=s.title;$('artist').textContent=s.artist;
 $('stationStatus').textContent=`ON AIR · DARD-E-DRIVER · ${s.mood}`;
 $('queueCount').textContent=String(SONGS.length).padStart(2,'0');
 renderQueue();
}
function renderQueue(){
 const el=$('list');
 el.innerHTML=SONGS.map((s,i)=>`<button class="queue-item ${i===currentIndex?'active':''}" data-index="${i}"><span>${String(i+1).padStart(2,'0')}</span><b>${i===currentIndex?'NOW PLAYING':s.title}</b><small>${i===currentIndex?'ON AIR · '+s.mood:s.artist}</small><i>▶</i></button>`).join('');
 el.querySelectorAll('.queue-item').forEach(b=>b.onclick=()=>playIndex(Number(b.dataset.index)));
}
function playIndex(i){
 if(!player||!ready)return;
 currentIndex=(i+SONGS.length)%SONGS.length;
 setMeta(currentIndex);
 player.loadVideoById({videoId:SONGS[currentIndex].id,startSeconds:0});
 player.playVideo();
}
function tuneIn(){
 const i=shuffle?randomIndex():currentIndex;
 playIndex(i);
 $('player').scrollIntoView({behavior:'smooth',block:'center'});
}
function onYouTubeIframeAPIReady(){
 player=new YT.Player('yt',{
  height:'200',width:'200',videoId:SONGS[0].id,
  playerVars:{playsinline:1,controls:0,rel:0,iv_load_policy:3},
  events:{
   onReady:e=>{ready=true;e.target.setVolume(Number($('volume').value)||80);currentIndex=0;setMeta(0);},
   onStateChange:e=>{
    if(e.data===YT.PlayerState.PLAYING){playing=true;$('play').textContent='❚❚';$('stationStatus').textContent=`ON AIR · DARD-E-DRIVER · ${SONGS[currentIndex].mood}`;startProgress();}
    if(e.data===YT.PlayerState.PAUSED){playing=false;$('play').textContent='▶';stopProgress();}
    if(e.data===YT.PlayerState.ENDED){nextSong();}
   },
   onError:()=>{
    $('stationStatus').textContent='TRACK UNAVAILABLE · SKIPPING';
    setTimeout(nextSong,600);
   }
  }
 });
}
function nextSong(){
 if(!player||!ready)return;
 let i;
 if(repeat)i=currentIndex;
 else if(shuffle){i=randomIndex();if(SONGS.length>1&&i===currentIndex)i=(i+1)%SONGS.length;}
 else i=(currentIndex+1)%SONGS.length;
 playIndex(i);
}
function prevSong(){playIndex(currentIndex-1)}
function startProgress(){stopProgress();timer=setInterval(()=>{if(!player||!playing)return;const d=player.getDuration(),t=player.getCurrentTime();$('time').textContent=format(t);$('duration').textContent=format(d);$('seek').value=d?Math.round(t/d*100):0;},500)}
function stopProgress(){if(timer){clearInterval(timer);timer=null}}
$('start').onclick=tuneIn;
$('play').onclick=()=>{if(!player||!ready)return;if(playing)player.pauseVideo();else player.playVideo();};
$('next').onclick=nextSong;
$('prev').onclick=prevSong;
$('shuffle').onclick=()=>{shuffle=!shuffle;$('shuffle').classList.toggle('on',shuffle)};
$('repeat').onclick=()=>{repeat=!repeat;$('repeat').classList.toggle('on',repeat)};
$('shuffle').classList.toggle('on',shuffle);
$('volume').oninput=e=>{const v=Number(e.target.value);$('volValue').textContent=v;if(player)player.setVolume(v)};
$('seek').oninput=e=>{if(player&&player.getDuration())player.seekTo(player.getDuration()*Number(e.target.value)/100,true)};
window.addEventListener('load',()=>{
 renderQueue();
 document.querySelectorAll('.mood-grid button').forEach((b,i)=>b.addEventListener('click',()=>{shuffle=true;$('shuffle').classList.add('on');tuneIn();}));
});
