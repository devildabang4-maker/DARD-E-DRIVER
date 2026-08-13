const songs=[
{title:'Pehla Nasha',artist:'Udit Narayan • Sadhana Sargam',mood:'Saloon Classics',youtube:'ZYotlBxpM3Q'},
{title:'Ghar Se Nikalte Hi',artist:'Udit Narayan',mood:'Highway Raat',youtube:''},
{title:'Tujhe Dekha To',artist:'Kumar Sanu • Lata Mangeshkar',mood:'Saloon Classics',youtube:'cNV5hLSa9H8'},
{title:'Do Dil Mil Rahe Hain',artist:'Kumar Sanu',mood:'90s Dard',youtube:''},
{title:'Aankhon Se Tune Kya Keh Diya',artist:'Kumar Sanu • Alka Yagnik',mood:'Desi Sunday',youtube:''},
{title:'Kaho Naa Pyaar Hai',artist:'Udit Narayan • Alka Yagnik',mood:'Desi Sunday',youtube:''},
{title:'Humko Sirf Tumse Pyaar Hai',artist:'Kumar Sanu • Alka Yagnik',mood:'90s Dard',youtube:''},
{title:'Yeh Kaali Kaali Aankhen',artist:'Kumar Sanu',mood:'Highway Raat',youtube:''}
];
let current=0,playing=false,yt=null;
const title=document.getElementById('title'),artist=document.getElementById('artist'),play=document.getElementById('play');
function render(filter=null){const list=document.getElementById('list');const data=filter?songs.filter(s=>s.mood===filter):songs;list.innerHTML=data.map((s,i)=>`<div class="song" data-i="${songs.indexOf(s)}"><span class="num">${String(i+1).padStart(2,'0')}</span><div><div class="name">${s.title}</div><div class="artist">${s.artist}</div></div><span class="duration">${s.youtube?'READY':'ADDING SOON'}</span><button>▶</button></div>`).join('');document.querySelectorAll('.song').forEach(x=>x.onclick=()=>load(+x.dataset.i,true));}
function load(i,auto=false){current=(i+songs.length)%songs.length;const s=songs[current];title.textContent=s.title;artist.textContent=s.artist;document.getElementById('progress').style.width='0%';if(yt&&s.youtube){yt.loadVideoById(s.youtube);if(auto)yt.playVideo();playing=auto;}else if(!s.youtube){title.textContent=s.title+' • YouTube';artist.textContent='Tap to continue on YouTube';playing=false;}play.textContent=playing?'❚❚':'▶';document.getElementById('player').scrollIntoView({behavior:'smooth',block:'center'});}
function next(){load(current+1,true)}
function prev(){load(current-1,true)}
play.onclick=()=>{const s=songs[current];if(!yt)return;if(!s.youtube){load(0,true);return}if(playing){yt.pauseVideo()}else{yt.playVideo()}};
document.getElementById('start').onclick=()=>load(current,true);document.getElementById('next').onclick=next;document.getElementById('prev').onclick=prev;
document.querySelectorAll('.cards button').forEach(b=>b.onclick=()=>{render(b.dataset.filter);document.getElementById('songs').scrollIntoView({behavior:'smooth'});});
function onYouTubeIframeAPIReady(){yt=new YT.Player('yt',{height:'1',width:'1',videoId:'',playerVars:{playsinline:1,controls:0,rel:0},events:{onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING){playing=true;play.textContent='❚❚'}if(e.data===YT.PlayerState.PAUSED){playing=false;play.textContent='▶'}if(e.data===YT.PlayerState.ENDED)next();}}});}
render();