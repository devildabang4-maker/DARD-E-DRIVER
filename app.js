const STATIONS={
  road:{name:'90s Road Radio',playlist:'PLmrzljTFgnQD5PO9sgJtdEIadZYVsO7C0'},
  bollywood:{name:'Bollywood Jukebox',playlist:'PLo7WLtfSrhdYYdAM4UWSaUy4xG7_GZqXD'}
};
let station=STATIONS.road,currentIndex=0,playing=false,shuffle=true,repeat=false,player=null,ready=false,timer=null,startRequested=false;
const $=id=>document.getElementById(id);
function format(sec){if(!Number.isFinite(sec)||sec<0)return'0:00';const m=Math.floor(sec/60),s=Math.floor(sec%60).toString().padStart(2,'0');return`${m}:${s}`}
function updateMeta(){
 if(!player||!ready)return;
 const data=player.getVideoData?player.getVideoData():{};
 if(data&&data.title){$('title').textContent=data.title;$('artist').textContent=data.author||'YouTube Music';}
 const list=player.getPlaylist?player.getPlaylist():[];
 const idx=player.getPlaylistIndex?player.getPlaylistIndex():currentIndex;
 if(typeof idx==='number'&&idx>=0)currentIndex=idx;
 $('queueCount').textContent=list.length?String(list.length).padStart(3,'0'):'RADIO';
 $('stationStatus').textContent=`${station.name} · ${list.length?list.length+' TRACKS':'ON AIR'}`;
 renderQueue(list);
}
function renderQueue(list){
 const el=$('list');
 if(!list||!list.length){el.innerHTML='<div class="queue-empty">Tune in to load the radio queue.</div>';return;}
 const total=Math.min(list.length,15);
 el.innerHTML=Array.from({length:total},(_,i)=>`<button class="queue-item ${i===currentIndex?'active':''}" data-index="${i}"><span>${String(i+1).padStart(2,'0')}</span><b>${i===currentIndex?'NOW PLAYING':'ROAD TRACK '+String(i+1).padStart(2,'0')}</b><small>${i===currentIndex?'ON AIR · '+station.name:'tap to play'}</small><i>▶</i></button>`).join('');
 el.querySelectorAll('.queue-item').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.index);startRequested=true;player.playVideoAt(i);currentIndex=i;});
}
function loadStation(s,autoplay=false){
 station=s;
 if(!player||!ready)return;
 startRequested=autoplay;
 $('stationStatus').textContent=`${s.name} · TUNING IN...`;
 // Load the actual YouTube playlist. Shuffle is applied before playback so the first song is random.
 player.loadPlaylist({list:s.playlist,listType:'playlist',index:0,startSeconds:0});
}
function beginRandomPlayback(){
 if(!player||!ready)return;
 player.setShuffle(true);
 player.setLoop(false);
 player.playVideo();
 startRequested=false;
}
function onYouTubeIframeAPIReady(){
 player=new YT.Player('yt',{
  height:'200',width:'200',videoId:'',
  playerVars:{playsinline:1,controls:0,rel:0,iv_load_policy:3},
  events:{
   onReady:e=>{ready=true;e.target.setVolume(Number($('volume').value)||80);loadStation(station,false);},
   onStateChange:e=>{
    if(e.data===YT.PlayerState.PLAYING){playing=true;$('play').textContent='❚❚';$('stationStatus').textContent=`ON AIR · ${station.name}`;updateMeta();startProgress();}
    if(e.data===YT.PlayerState.PAUSED){playing=false;$('play').textContent='▶';stopProgress();}
    if(e.data===YT.PlayerState.ENDED){if(repeat){player.playVideo();}else{player.nextVideo();}}
    if(e.data===YT.PlayerState.CUED){
      player.setShuffle(shuffle);
      player.setLoop(false);
      updateMeta();
      if(startRequested)setTimeout(beginRandomPlayback,250);
    }
   },
   onError:()=>{
    $('stationStatus').textContent='TRACK UNAVAILABLE · FINDING ANOTHER';
    setTimeout(()=>{if(player){player.nextVideo();if(startRequested||playing)player.playVideo();}},500);
   }
  }
 });
}
function startProgress(){stopProgress();timer=setInterval(()=>{if(!player||!playing)return;const d=player.getDuration(),t=player.getCurrentTime();$('time').textContent=format(t);$('duration').textContent=format(d);$('seek').value=d?Math.round(t/d*100):0;},500)}
function stopProgress(){if(timer){clearInterval(timer);timer=null}}
$('start').onclick=()=>{if(!player||!ready)return;startRequested=true;beginRandomPlayback();$('player').scrollIntoView({behavior:'smooth',block:'center'});};
$('play').onclick=()=>{if(!player||!ready)return;if(playing)player.pauseVideo();else{if(!player.getPlaylist().length)loadStation(station,true);else player.playVideo();}};
$('next').onclick=()=>{if(player){player.nextVideo();playing=true}};
$('prev').onclick=()=>{if(player){player.previousVideo();playing=true}};
$('shuffle').onclick=()=>{shuffle=!shuffle;if(player)player.setShuffle(shuffle);$('shuffle').classList.toggle('on',shuffle)};
$('repeat').onclick=()=>{repeat=!repeat;$('repeat').classList.toggle('on',repeat)};
$('shuffle').classList.toggle('on',shuffle);
$('volume').oninput=e=>{const v=Number(e.target.value);$('volValue').textContent=v;if(player)player.setVolume(v)};
$('seek').oninput=e=>{if(player&&player.getDuration())player.seekTo(player.getDuration()*Number(e.target.value)/100,true)};
window.addEventListener('load',()=>{
 document.querySelectorAll('.mood-grid button').forEach((b,i)=>b.addEventListener('click',()=>loadStation(i===0||i===2?STATIONS.road:STATIONS.bollywood,true)));
});
