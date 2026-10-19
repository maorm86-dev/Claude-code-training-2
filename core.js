/* Claude Code Academy — מנוע: מצב, חזרה מרווחת (Leitner), XP, תגים, אינדקסים וחיפוש.
   אין צורך לערוך קובץ זה כדי להוסיף או לעדכן תוכן — התוכן נמצא בתיקיית data/. */
(function(){
'use strict';
const C=window.COURSE;
const KEY='cca.v1';
const IV=[0,1,3,7,16,35];                       // ימים עד החזרה הבאה לפי קופסה
const RANKS=[[0,'חדש בטרמינל'],[100,'מתחיל סקרן'],[300,'מפעיל מנוסה'],[650,'בונה זרימות'],[1100,'מרחיב ומתאים'],[1700,'מתזמר סוכנים'],[2500,'מאסטר Claude Code']];

/* ---------- עזרים ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inline=s=>esc(s)
  .replace(/`([^`]+)`/g,'<code dir="ltr">$1</code>')
  .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
const hash=s=>{let h=5381;s=String(s);for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36)};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pad=n=>String(n).padStart(2,'0');
const dstr=(d=new Date())=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const dnum=(d=new Date())=>Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);

/* ---------- מצב ---------- */
const def=()=>({v:1,xp:0,days:{},streak:{n:0,last:''},lessons:{},cards:{},qs:{},ch:{},games:{},badges:{},
  stat:{reviews:0,answers:0,correct:0,perfect:0},
  set:{theme:'auto',fs:1,goal:20,newPerDay:8,allCards:false},today:{d:'',n:0,newc:0}});
let S=def();
function load(){try{const r=JSON.parse(localStorage.getItem(KEY));if(r&&r.v===1){S=Object.assign(def(),r);S.set=Object.assign(def().set,r.set||{});S.stat=Object.assign(def().stat,r.stat||{})}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
load();

/* ---------- אינדקסים ---------- */
const META=C.meta||{levels:[]};
const MODS=C.modules.slice().sort((a,b)=>a.level-b.level||a.order-b.order);
const MOD={};MODS.forEach(m=>MOD[m.id]=m);
const MIDX={};MODS.forEach((m,i)=>MIDX[m.id]=i);
const level=id=>(META.levels||[]).find(l=>l.id===id)||{id,name:'רמה '+id,desc:''};
const QBANK=[];
MODS.forEach(m=>(m.quiz||[]).forEach((q,i)=>QBANK.push({id:m.id+'-q'+i,m:m.id,q:q.q,o:q.o,a:q.a,w:q.w})));
(C.questions||[]).forEach(q=>{if(q.id&&q.q)QBANK.push(q)});
const QMAP={};QBANK.forEach(q=>QMAP[q.id]=q);
const CARDS=(C.cards||[]).map(c=>Array.isArray(c)?{id:c[0]+'-'+hash(c[1]),m:c[0],f:c[1],b:c[2]}:Object.assign({id:c.m+'-'+hash(c.f)},c))
  .filter(c=>MOD[c.m]).sort((a,b)=>MIDX[a.m]-MIDX[b.m]);
const CMAP={};CARDS.forEach(c=>CMAP[c.id]=c);

/* ---------- ממשק קטן ---------- */
function toast(msg,cls){const t=$('#toasts');if(!t)return;const el=document.createElement('div');el.className='toast '+(cls||'');el.textContent=msg;t.appendChild(el);setTimeout(()=>el.remove(),2800)}
function rank(){let i=0;RANKS.forEach((r,k)=>{if(S.xp>=r[0])i=k});return {i,name:RANKS[i][1],base:RANKS[i][0],next:RANKS[i+1]?RANKS[i+1][0]:null}}
function hdr(){const b=$('#xpBadge');if(b)b.textContent=S.xp+' XP'}
function applyTheme(){const r=document.documentElement;r.dataset.theme=S.set.theme;r.style.setProperty('--fs',S.set.fs)}
function touch(){save();hdr()}

/* ---------- פעילות, רצף ו־XP ---------- */
function rollDay(){const t=dstr();if(S.today.d!==t)S.today={d:t,n:0,newc:0}}
function act(n){rollDay();const t=S.today.d;S.today.n+=n;S.days[t]=(S.days[t]||0)+n;
  if(S.streak.last!==t){const y=dstr(new Date(Date.now()-864e5));S.streak.n=S.streak.last===y?S.streak.n+1:1;S.streak.last=t}}
function streakNow(){const t=dstr(),y=dstr(new Date(Date.now()-864e5));return (S.streak.last===t||S.streak.last===y)?S.streak.n:0}
function todayN(){rollDay();return S.today.n}
function addXP(n,msg){const before=rank().i;S.xp+=n;if(msg)toast('+'+n+' XP · '+msg,'mark');if(rank().i>before)toast('דרגה חדשה: '+rank().name+' 🎉','mark')}

/* ---------- שיעורים ---------- */
const L=id=>S.lessons[id]||(S.lessons[id]={});
function visit(id){const l=L(id);if(!l.seen){l.seen=1;touch()}}
function doneLesson(id){const l=L(id);let first=false;if(!l.done){l.done=1;first=true;addXP(30,'שיעור הושלם');act(2)}touch();checkBadges();return first}
function nextLesson(){return MODS.find(m=>!(S.lessons[m.id]&&S.lessons[m.id].done))||null}
const lessonsDone=()=>MODS.filter(m=>S.lessons[m.id]&&S.lessons[m.id].done).length;
function levelProgress(lv){const ms=MODS.filter(m=>m.level===lv);const d=ms.filter(m=>S.lessons[m.id]&&S.lessons[m.id].done).length;return {done:d,total:ms.length}}

/* ---------- שאלות ---------- */
function prep(q,id){return {id,q:q.q,w:q.w,o:shuffle(q.o.map((t,i)=>({t,ok:i===q.a})))}}
function answerQ(id,ok){const q=S.qs[id]||(S.qs[id]={ok:0,bad:0,last:1});
  if(ok){addXP(q.ok===0?5:1);q.ok++}else q.bad++;
  q.last=ok?1:0;S.stat.answers++;if(ok)S.stat.correct++;act(1);touch()}
const mistakes=()=>QBANK.filter(q=>S.qs[q.id]&&S.qs[q.id].last===0);
function weakModules(){const r=[];MODS.forEach(m=>{let ok=0,bad=0;QBANK.filter(q=>q.m===m.id).forEach(q=>{const s=S.qs[q.id];if(s){ok+=s.ok;bad+=s.bad}});
  if(ok+bad>=3&&ok/(ok+bad)<0.8)r.push({m,acc:Math.round(100*ok/(ok+bad))})});return r.sort((a,b)=>a.acc-b.acc).slice(0,4)}
function practiceSet(mode){
  const seen=QBANK.filter(q=>S.lessons[q.m]&&S.lessons[q.m].seen);
  if(mode==='mistakes')return shuffle(mistakes()).slice(0,15);
  if(MOD[mode])return shuffle(QBANK.filter(q=>q.m===mode));
  const pool=seen.length>=6?seen:QBANK;
  const wrong=shuffle(mistakes()).slice(0,4);
  const ids=new Set(wrong.map(q=>q.id));
  return shuffle(wrong.concat(shuffle(pool.filter(q=>!ids.has(q.id))).slice(0,10-wrong.length)));
}

/* ---------- כרטיסיות (Leitner) ---------- */
const unlocked=c=>S.set.allCards||(S.lessons[c.m]&&S.lessons[c.m].seen);
function queue(){rollDay();const t=dnum();
  const due=CARDS.filter(c=>S.cards[c.id]&&S.cards[c.id].due<=t);
  const left=Math.max(0,S.set.newPerDay-S.today.newc);
  const fresh=CARDS.filter(c=>!S.cards[c.id]&&unlocked(c)).slice(0,left);
  return {due,fresh}}
function freeQueue(){return shuffle(CARDS.filter(c=>S.cards[c.id])).slice(0,10)}
function nextIv(id,r){const c=S.cards[id]||{b:0};let b=c.b;
  if(r===0)return 0;if(r===1)b=Math.max(1,b);else if(r===2)b=Math.min(5,b+1);else b=Math.min(5,b+2);
  return Math.max(1,IV[r===1?Math.max(0,b-1):b])}
function rate(id,r){rollDay();let c=S.cards[id];
  if(!c){c=S.cards[id]={b:0,due:0,seen:0};S.today.newc++}
  c.seen++;
  if(r===0)c.b=0;else if(r===1)c.b=Math.max(1,c.b);else if(r===2)c.b=Math.min(5,c.b+1);else c.b=Math.min(5,c.b+2);
  c.due=r===0?dnum():dnum()+Math.max(1,IV[r===1?Math.max(0,c.b-1):c.b]);
  S.stat.reviews++;addXP([0,1,2,3][r]);act(1);touch();checkBadges()}
function cardStats(){const boxes=[0,0,0,0,0,0];let seen=0,un=0;
  CARDS.forEach(c=>{if(S.cards[c.id]){boxes[S.cards[c.id].b]++;seen++}if(unlocked(c))un++});
  const q=queue();return {total:CARDS.length,unlocked:un,seen,boxes,mastered:boxes[4]+boxes[5],due:q.due.length,fresh:q.fresh.length}}

/* ---------- אתגרים ומשחקים ---------- */
function setChallenge(id,done,note){const c=S.ch[id]||(S.ch[id]={});
  if(note!==undefined)c.note=note;
  if(done!==undefined&&!!done!==!!c.done){c.done=!!done;if(done){addXP(25,'אתגר הושלם');act(3)}}
  touch();checkBadges()}
function gameDone(id,score,xpAward){const g=S.games[id]||(S.games[id]={best:0,plays:0,day:''});
  const first=g.day!==dstr();g.day=dstr();g.plays++;if(score>g.best)g.best=score;
  const x=first?xpAward:1;addXP(x,'משחק');act(2);touch();checkBadges();return x}

/* ---------- תגים ---------- */
function derived(){const lv={};(META.levels||[]).forEach(l=>{const p=levelProgress(l.id);lv[l.id]=p.total>0&&p.done===p.total});
  return {lessons:lessonsDone(),lv,streak:streakNow(),ch:Object.values(S.ch).filter(c=>c.done).length,games:Object.values(S.games).filter(g=>g.plays>0).length}}
const BADGES=[
 {id:'first',i:'🌱',n:'צעד ראשון',d:'סיימת שיעור ראשון',t:x=>x.lessons>=1},
 {id:'l1',i:'🧭',n:'יסודות',d:'סיימת את כל שיעורי רמה 1',t:x=>x.lv[1]},
 {id:'l2',i:'🛠️',n:'יומיום',d:'סיימת את כל שיעורי רמה 2',t:x=>x.lv[2]},
 {id:'l3',i:'🧩',n:'מרחיב ומתאים',d:'סיימת את כל שיעורי רמה 3',t:x=>x.lv[3]},
 {id:'l4',i:'🚀',n:'אוטומציה',d:'סיימת את כל שיעורי רמה 4',t:x=>x.lv[4]},
 {id:'all',i:'🏆',n:'בוגר',d:'סיימת את כל השיעורים',t:x=>x.lessons>=MODS.length&&MODS.length>0},
 {id:'rev50',i:'🗂️',n:'50 חזרות',d:'50 סקירות כרטיסיות',t:()=>S.stat.reviews>=50},
 {id:'rev250',i:'📚',n:'250 חזרות',d:'250 סקירות כרטיסיות',t:()=>S.stat.reviews>=250},
 {id:'perfect',i:'🎯',n:'בול',d:'כל התשובות נכונות בחידון שיעור',t:()=>S.stat.perfect>=1},
 {id:'s3',i:'🔥',n:'3 ימים ברצף',d:'למדת שלושה ימים ברציפות',t:x=>x.streak>=3},
 {id:'s7',i:'🔥',n:'שבוע ברצף',d:'שבעה ימים ברציפות',t:x=>x.streak>=7},
 {id:'s30',i:'🌋',n:'חודש ברצף',d:'30 ימים ברציפות',t:x=>x.streak>=30},
 {id:'ch1',i:'⚒️',n:'ידיים בקוד',d:'סיימת אתגר מעשי ראשון',t:x=>x.ch>=1},
 {id:'ch5',i:'🧰',n:'בעל מלאכה',d:'סיימת 5 אתגרים',t:x=>x.ch>=5},
 {id:'game3',i:'🎮',n:'שחקן',d:'שיחקת ב־3 משחקים שונים',t:x=>x.games>=3},
 {id:'xp1000',i:'⭐',n:'אלף XP',d:'צברת 1,000 נקודות',t:()=>S.xp>=1000}
];
function checkBadges(){const x=derived();BADGES.forEach(b=>{if(!S.badges[b.id]&&b.t(x)){S.badges[b.id]=dstr();toast(b.i+' תג חדש: '+b.n,'mark')}});save()}

/* ---------- חיפוש ---------- */
function mtxt(m){return m._t||(m._t=(m.title+' '+m.summary+' '+JSON.stringify(m.blocks||[])+' '+JSON.stringify(m.recap||[])).toLowerCase())}
function search(term){const t=String(term||'').trim().toLowerCase();if(t.length<2)return null;
  const has=s=>String(s||'').toLowerCase().includes(t);
  return {
    lessons:MODS.filter(m=>mtxt(m).includes(t)),
    cards:CARDS.filter(c=>has(c.f)||has(c.b)).slice(0,25),
    cheats:(C.cheats||[]).map(s=>({t:s.t,rows:s.rows.filter(r=>has(r[0])||has(r[1]))})).filter(s=>s.rows.length),
    challenges:(C.challenges||[]).filter(c=>has(c.t)||has(c.g)||(c.s||[]).some(has))
  }}

/* ---------- ייצוא וייבוא ---------- */
const exportJSON=()=>JSON.stringify(S,null,1);
function importJSON(txt){const r=JSON.parse(txt);if(!r||r.v!==1)throw new Error('bad');S=Object.assign(def(),r);S.set=Object.assign(def().set,r.set||{});S.stat=Object.assign(def().stat,r.stat||{});applyTheme();touch()}
function reset(){S=def();applyTheme();touch()}

applyTheme();hdr();
window.CCA={C,META,MODS,MOD,MIDX,QBANK,QMAP,CARDS,CMAP,IV,RANKS,BADGES,$,$$,esc,inline,hash,shuffle,dstr,dnum,
  st:()=>S,save,touch,toast,rank,applyTheme,act,streakNow,todayN,addXP,visit,doneLesson,nextLesson,lessonsDone,levelProgress,level,
  prep,answerQ,mistakes,weakModules,practiceSet,queue,freeQueue,nextIv,rate,cardStats,setChallenge,gameDone,derived,checkBadges,
  search,exportJSON,importJSON,reset,
  perfect(){S.stat.perfect++;touch();checkBadges()}};
})();
