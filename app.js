const songs=[
{title:'Pehla Nasha',artist:'Udit Narayan · Sadhana Sargam',mood:'Saloon Classics',youtube:'ZYotlBxpM3Q',duration:'04:54'},
{title:'Tujhe Dekha To',artist:'Kumar Sanu · Lata Mangeshkar',mood:'Saloon Classics',youtube:'EYA-aTnbKIQ',duration:'05:03'},
{title:'Aankhon Se Tune Kya Keh Diya',artist:'Kumar Sanu · Alka Yagnik',mood:'Desi Sunday',youtube:'4GQU2aaOXxM',duration:'05:10'},
{title:'Ghar Se Nikalte Hi',artist:'Udit Narayan',mood:'Highway Raat',youtube:'',duration:'05:00'},
{title:'Do Dil Mil Rahe Hain',artist:'Kumar Sanu',mood:'90s Dard',youtube:'',duration:'05:47'},
{title:'Humko Sirf Tumse Pyaar Hai',artist:'Kumar Sanu · Alka Yagnik',mood:'90s Dard',youtube:'',duration:'06:04'},
{title:'Yeh Kaali Kaali Aankhen',artist:'Kumar Sanu',mood:'Highway Raat',youtube:'',duration:'07:02'},
{title:'Kaho Naa Pyaar Hai',artist:'Udit Narayan · Alka Yagnik',mood:'Desi Sunday',youtube:'',duration:'06:55'}
];
let current=0,playing=false,yt=null,shuffle=false,repeat=false,filtered=songs;
const $=id=>document.getElementById(id), title=$('title'),artist=$('artist'),play=$('play');
function render(list=filtered){filtered=list;$('queueCount').textContent=String(list.length).padStart(2,'0');$('list').innerHTML=list.map((s,i)=>`<div class="queue-item ${songs.indexOf(s)===current?'active':''}" data-i="${songs.indexOf(s)}"><span class="qnum">${String(i+1).padStart(2,'0')}</span><div class="qcover">♪</div><div><div class="qtitle">${s.title}</div><div class="qartist">${s.artist}</div></div><span class="qtime">${s.youtube?s.duration:'ON YOUTUBE'}</span><button class="qplay">${songs.indexOf(s)===current&&playing?'❚❚':'▶'}</button></div>`).join('');document.querySelectorAll('.queue-item').forEach(x=>x.onclick=e=>{if(e.target.classList.contains('qplay'))e.stopPropagation();load(+x.dataset.i,true)});}
function load(i,auto=false){current=(i+songs.length)%songs.length;const s=songs[current];title.textContent=s.title;artist.textContent=s.artist;$('duration').textContent=s.duration;$('time').textContent='0:00';$('seek').value=0;$('cover').innerHTML='<span>♪</span>';if(yt&&s.youtube){yt.loadVideoById(s.youtube);if(auto)yt.playVideo();playing=auto;$('stationStatus').textContent=auto?'LIVE · '+s.mood.toUpperCase():'READY TO DRIVE'}else{playing=false;$('stationStatus').textContent='YOUTUBE LINK REQUIRED';}play.textContent=playing?'❚❚':'▶';render(filtered);}
function next(){if(repeat){load(current,true);return}if(shuffle){let n=current;while(n===current&&songs.length>1)n=Math.floor(Math.random()*songs.length);load(n,true)}else load(current+1,true)}
function prev(){load(current-1,true)}
play.onclick=()=>{const s=songs[current];if(!yt||!s.youtube){if(s.youtube)load(current,true);return}if(playing)yt.pauseVideo();else yt.playVideo()};$('start').onclick=()=>load(current,true);$('next').onclick=next;$('prev').onclick=prev;
$('shuffle').onclick=()=>{shuffle=!shuffle;$('shuffle').style.color=shuffle?'var(--red)':''};$('repeat').onclick=()=>{repeat=!repeat;$('repeat').style.color=repeat?'var(--red)':''};
$('volume').oninput=e=>{const v=+e.target.value;$('volValue').textContent=v;if(yt)yt.setVolume(v)};
$('seek').oninput=e=>{if(yt&&yt.getDuration){const d=yt.getDuration();if(d)yt.seekTo(d*(+e.target.value/100),true)}};
document.querySelectorAll('.mood-grid button').forEach(b=>b.onclick=()=>{const m=b.dataset.mood;const list=songs.filter(s=>s.mood===m);render(list);$('queue').scrollIntoView({behavior:'smooth'});});
function tick(){if(yt&&playing&&yt.getCurrentTime){const t=yt.getCurrentTime(),d=yt.getDuration();if(d){$('seek').value=(t/d)*100;$('time').textContent=fmt(t);$('duration').textContent=fmt(d)}}requestAnimationFrame(tick)}
function fmt(s){s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function onYouTubeIframeAPIReady(){yt=new YT.Player('yt',{height:'1',width:'1',videoId:'',playerVars:{playsinline:1,controls:0,rel:0,modestbranding:1},events:{onReady:()=>yt.setVolume(80),onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING){playing=true;$('stationStatus').textContent='LIVE · ON AIR';play.textContent='❚❚';render(filtered)}if(e.data===YT.PlayerState.PAUSED){playing=false;play.textContent='▶';render(filtered)}if(e.data===YT.PlayerState.ENDED)next()}}});requestAnimationFrame(tick)}
render();