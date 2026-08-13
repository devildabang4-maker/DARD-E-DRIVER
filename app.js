const songs=[
{title:'Pehla Nasha',artist:'Udit Narayan • Sadhana Sargam',youtube:'1R8MGdgZDns'},
{title:'Ghar Se Nikalte Hi',artist:'Udit Narayan',youtube:'_IcVb6hFhPs'},
{title:'Tujhe Dekha Toh',artist:'Kumar Sanu • Lata Mangeshkar',youtube:'tdx9M8yjqM8'},
{title:'Do Dil Mil Rahe Hain',artist:'Kumar Sanu',youtube:'Lhm4cqmJ5KE'},
{title:'Aankhon Se Tune Kya Keh Diya',artist:'Kumar Sanu • Alka Yagnik',youtube:''},
{title:'Kaho Naa Pyaar Hai',artist:'Udit Narayan • Alka Yagnik',youtube:''},
{title:'Humko Sirf Tumse Pyaar Hai',artist:'Kumar Sanu • Alka Yagnik',youtube:''},
{title:'Yeh Kaali Kaali Aankhen',artist:'Kumar Sanu',youtube:''}
];
let current=0,playing=false,yt=null,timer=null;const $=id=>document.getElementById(id);
function fmt(sec){sec=Math.max(0,Math.floor(sec||0));return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`}
function render(){ $('list').innerHTML=songs.map((s,i)=>`<div class="song" data-i="${i}"><span class="num">${String(i+1).padStart(2,'0')}</span><div><div class="name">${s.title}</div><div class="artist">${s.artist}</div></div><span class="duration">${s.youtube?'READY':'ADDING SOON'}</span><button>▶</button></div>`).join('');document.querySelectorAll('.song').forEach(row=>row.onclick=()=>load(+row.dataset.i,true));}
function load(i,auto=false){current=(i+songs.length)%songs.length;const s=songs[current];$('title').textContent=s.title;$('artist').textContent=s.artist;$('liveText').textContent='Tuning in…';$('seek').value=0;$('time').textContent='0:00';$('duration').textContent='0:00';$('thumb').textContent='♪';if(yt&&s.youtube){yt.loadVideoById(s.youtube);if(auto)yt.playVideo();playing=auto;}else if(!s.youtube){playing=false;$('play').textContent='▶';$('liveText').textContent='Song link pending';}if(auto)$('player').scrollIntoView({behavior:'smooth',block:'center'});$('play').textContent=playing?'❚❚':'▶';}
function next(){load(current+1,true)}function prev(){load(current-1,true)}
$('start').onclick=()=>load(current,true);$('play').onclick=()=>{if(!yt){load(current,true);return}if(playing)yt.pauseVideo();else if(songs[current].youtube)yt.playVideo()};$('next').onclick=next;$('prev').onclick=prev;
$('seek').oninput=e=>{if(yt&&yt.getDuration){const d=yt.getDuration();if(d)yt.seekTo((e.target.value/100)*d,true)}};$('volume').oninput=e=>{if(yt&&yt.setVolume)yt.setVolume(+e.target.value)};
function tick(){if(!yt||!yt.getCurrentTime)return;const now=yt.getCurrentTime(),d=yt.getDuration();$('time').textContent=fmt(now);$('duration').textContent=fmt(d);$('seek').value=d?(now/d)*100:0;}
function onYouTubeIframeAPIReady(){yt=new YT.Player('yt',{height:'1',width:'1',videoId:'',playerVars:{playsinline:1,controls:0,rel:0,modestbranding:1},events:{onReady:e=>e.target.setVolume(85),onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING){playing=true;$('play').textContent='❚❚';$('liveText').textContent='Tuning in…';clearInterval(timer);timer=setInterval(tick,500)}if(e.data===YT.PlayerState.PAUSED){playing=false;$('play').textContent='▶';clearInterval(timer)}if(e.data===YT.PlayerState.ENDED){clearInterval(timer);next()}}}})}
render();