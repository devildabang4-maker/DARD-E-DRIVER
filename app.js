const SONGS=[
 {title:'Pehla Nasha',artist:'Udit Narayan • Sadhana Sargam',id:'Ki41AKu0iHc',mood:'90s Romance'},
 {title:'Tujhe Dekha Toh',artist:'Kumar Sanu • Lata Mangeshkar',id:'cNV5hLSa9H8',mood:'90s Romance'},
 {title:'Aankhon Se Tune Kya Keh Diya',artist:'Kumar Sanu • Alka Yagnik',id:'qEFgYftu29c',mood:'Rainy Night'},
 {title:'Hothon Pe Bas',artist:'Lata Mangeshkar • Kumar Sanu',id:'c-t4nE-KCU8',mood:'Road Radio'},
 {title:'Main Yahaan Hoon',artist:'Udit Narayan',id:'m6Y8xEfyXTs',mood:'Late Night'},
 {title:'Tere Liye',artist:'Lata Mangeshkar • Roop Kumar Rathod',id:'jo6iAkSoraY',mood:'Late Night'},
 {title:'Tum Mile Dil Khile',artist:'Kumar Sanu • Alka Yagnik • K.S. Chithra',id:'kPoSLwnK7CQ',mood:'Rainy Night'},
 {title:'Gali Mein Aaj Chaand Nikla',artist:'Alka Yagnik',id:'hwi-QXBcGJk',mood:'Rainy Night'},
 {title:'Aa Bhi Jaa Aa Bhi Jaa',artist:'Lucky Ali • Sunidhi Chauhan',id:'bczClQgNbLA',mood:'Late Night'},
 {title:'Awarapan Banjarapan',artist:'KK',id:'VXWbs_yGZqw',mood:'Dard'},
 {title:'Dheere Jalna',artist:'Sonu Nigam • Shreya Ghoshal',id:'LqMhqSwi7Fw',mood:'Romance'},
 {title:'Mujh Mein Tu',artist:'Keerthi Sagathia',id:'eJfGY7q0dGU',mood:'Road Radio'},
 {title:'Saaton Janam Main Tere',artist:'Kumar Sanu • Alka Yagnik',id:'f0oiheLlFW4',mood:'90s Romance'}
];
let currentIndex=0,playing=false,shuffle=true,repeat=false,player=null,ready=false,timer=null;
const $=id=>document.getElementById(id);
function format(sec){if(!Number.isFinite(sec)||sec<0)return'0:00';const m=Math.floor(sec/60),s=Math.floor(sec%60).toString().padStart(2,'0');return`${m}:${s}`}
function randomIndex(){return Math.floor(Math.random()*SONGS.length)}
function setMeta(i){const s=SONGS[i];$('title').textContent=s.title;$('artist').textContent=s.artist;$('stationStatus').textContent=`${playing?'ON AIR':'READY'} · DARD-E-DRIVER · ${s.mood}`;$('queueCount').textContent=String(SONGS.length).padStart(2,'0');renderQueue()}
function renderQueue(){const el=$('list');el.innerHTML=SONGS.map((s,i)=>`<button class="queue-item ${i===currentIndex?'active':''}" data-index="${i}"><span>${String(i+1).padStart(2,'0')}</span><div class="qcover">♪</div><div><b class="qtitle">${s.title}</b><div class="qartist">${s.artist}</div></div><span class="qtime">${i===currentIndex?'ON AIR':'READY'}</span><i>▶</i></button>`).join('');el.querySelectorAll('.queue-item').forEach(b=>b.onclick=()=>playIndex(Number(b.dataset.index)))}
function playIndex(i){if(!player||!ready)return;currentIndex=(i+SONGS.length)%SONGS.length;playing=true;setMeta(currentIndex);player.loadVideoById({videoId:SONGS[currentIndex].id,startSeconds:0});player.playVideo()}
function tuneIn(){playIndex(shuffle?randomIndex():currentIndex);$('player').scrollIntoView({behavior:'smooth',block:'center'})}
function nextSong(){if(!player||!ready)return;let i=repeat?currentIndex:(shuffle?randomIndex():(currentIndex+1)%SONGS.length);if(shuffle&&!repeat&&SONGS.length>1&&i===currentIndex)i=(i+1)%SONGS.length;playIndex(i)}
function prevSong(){playIndex(currentIndex-1)}
function onYouTubeIframeAPIReady(){player=new YT.Player('yt',{height:'200',width:'200',videoId:SONGS[0].id,playerVars:{playsinline:1,controls:0,rel:0,iv_load_policy:3},events:{onReady:e=>{ready=true;e.target.setVolume(Number($('volume').value)||80);currentIndex=0;playing=false;setMeta(0)},onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING){playing=true;$('play').textContent='❚❚';$('stationStatus').textContent=`ON AIR · DARD-E-DRIVER · ${SONGS[currentIndex].mood}`;startProgress()}if(e.data===YT.PlayerState.PAUSED){playing=false;$('play').textContent='▶';stopProgress()}if(e.data===YT.PlayerState.ENDED)nextSong()},onError:()=>{$('stationStatus').textContent='SKIPPING UNAVAILABLE TRACK…';setTimeout(nextSong,500)}}})}
function startProgress(){stopProgress();timer=setInterval(()=>{if(!player||!playing)return;const d=player.getDuration(),t=player.getCurrentTime();$('time').textContent=format(t);$('duration').textContent=format(d);$('seek').value=d?Math.round(t/d*100):0},500)}
function stopProgress(){if(timer){clearInterval(timer);timer=null}}
$('start').onclick=tuneIn;
$('play').onclick=()=>{if(!player||!ready)return;if(playing)player.pauseVideo();else player.playVideo()};
$('next').onclick=nextSong;$('prev').onclick=prevSong;
$('shuffle').onclick=()=>{shuffle=!shuffle;$('shuffle').classList.toggle('on',shuffle)};
$('repeat').onclick=()=>{repeat=!repeat;$('repeat').classList.toggle('on',repeat)};
$('shuffle').classList.toggle('on',shuffle);
$('volume').oninput=e=>{const v=Number(e.target.value);$('volValue').textContent=v;if(player)player.setVolume(v)};
$('seek').oninput=e=>{if(player&&player.getDuration())player.seekTo(player.getDuration()*Number(e.target.value)/100,true)};
window.addEventListener('load',()=>{renderQueue();document.querySelectorAll('.mood-grid button').forEach(b=>b.addEventListener('click',tuneIn))});