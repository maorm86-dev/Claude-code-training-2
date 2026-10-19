/* Claude Code Academy — תצוגות, ניתוב ואירועים. לא צריך לערוך כדי להוסיף תוכן (ראו README.md). */
(function(){
'use strict';
const A=window.CCA,C=A.C,META=A.META;
const {$,$$,esc,inline,MODS,MOD,CARDS,CMAP}=A;
const app=$('#app');
const S=()=>A.st();
let TM=null,QS=null,RV=null,GM=null;
const stopT=()=>{if(TM){clearInterval(TM);TM=null}};
function show(html,scroll=true){app.innerHTML=html;if(scroll)window.scrollTo(0,0)}

/* ---------- עזרי תצוגה ---------- */
const pct=(a,b)=>b?Math.round(100*a/b):0;
const bar=(a,b)=>'<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct(a,b)+'"><i style="width:'+pct(a,b)+'%"></i></div>';
const chip=lv=>'<span class="chip l'+lv+'">רמה '+lv+' · '+esc(A.level(lv).name)+'</span>';
const ivText=d=>d<=0?'היום':d===1?'מחר':d<7?d+' ימים':d<30?Math.round(d/7)+' שבועות':'חודש+';
const fmt=ms=>{const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const done=id=>!!(S().lessons[id]&&S().lessons[id].done);
const pageH=(t,p)=>'<div class="page-h"><h1>'+t+'</h1>'+(p?'<p class="muted">'+p+'</p>':'')+'</div>';
function copyText(t){try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t);return}}catch(e){}
  const ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove()}

/* ---------- ניווט ---------- */
const NAV=[['','בית'],['path','מסלול'],['cards','כרטיסיות'],['practice','תרגול'],['games','משחקים'],['challenges','אתגרים'],['cheats','מדריך מהיר'],['progress','התקדמות']];
function renderNav(r){$('#nav').innerHTML=NAV.map(n=>'<a href="#/'+n[0]+'"'+(r===n[0]?' aria-current="page"':'')+'>'+n[1]+'</a>').join('')}

/* ---------- בית ---------- */
function vHome(){
  const st=S(),q=A.queue(),nx=A.nextLesson(),n=q.due.length+q.fresh.length,k=A.streakNow(),rk=A.rank(),dn=A.lessonsDone(),cs=A.cardStats();
  const goal=st.set.goal,tn=A.todayN();
  const L=['<span class="prompt">&gt;</span>מה התוכנית להיום?',
    '<span class="ok">✓</span>'+(k?'רצף של <b>'+k+'</b> ימים — שומרים עליו':'היום מתחילים רצף חדש'),
    '<span class="ok">✓</span>'+(n?'<b>'+n+'</b> כרטיסיות מחכות ('+q.due.length+' לחזרה, '+q.fresh.length+' חדשות)':'אין כרטיסיות לחזרה כרגע'),
    '<span class="ok">✓</span>'+(nx?'השיעור הבא: <b>'+esc(nx.title)+'</b> · '+nx.minutes+' דק׳':'סיימת את כל השיעורים — לכו לאתגרים'),
    '<span class="ok">✓</span>יעד יומי: <b>'+Math.min(tn,goal)+'/'+goal+'</b> פעולות'];
  const lv=(META.levels||[]).map(l=>{const p=A.levelProgress(l.id);return '<a class="panel lvc l'+l.id+'" href="#/path" style="display:block;color:inherit;text-decoration:none"><div class="row">'+chip(l.id)+'<span class="sp"></span><span class="muted sm">'+p.done+'/'+p.total+'</span></div><p class="sm" style="margin:.5rem 0">'+esc(l.desc)+'</p>'+bar(p.done,p.total)+'</a>'}).join('');
  show('<div class="hero"><h1>ללמוד Claude Code <span class="hl">כמו שצריך</span></h1><p class="muted" style="max-width:60ch">מסלול מאפס ועד אוטומציה מתקדמת. קצר, מעשי, ומבוסס על מה שמדע הלמידה יודע על איך המוח זוכר.</p></div>'+
  '<div class="term" role="region" aria-label="התוכנית להיום"><div class="term-bar"><b></b><b></b><b></b></div><div class="term-body">'+
  L.map((l,i)=>'<div class="tl'+(i?'':' dim')+'" style="--i:'+i+'">'+l+'</div>').join('')+'</div>'+
  '<div class="term-act">'+(nx?'<a class="btn pri" href="#/lesson/'+nx.id+'">'+(dn?'המשך: '+esc(nx.title):'התחלת השיעור הראשון')+'</a>':'')+
  (n?'<a class="btn" href="#/cards/review">סבב כרטיסיות</a>':'')+'<a class="btn" href="#/practice">תרגול</a></div></div>'+
  '<div class="strip"><div><span class="k">דרגה</span><b>'+esc(rk.name)+'</b>'+bar(st.xp-rk.base,rk.next?rk.next-rk.base:1)+'<span class="k" style="margin-top:4px">'+st.xp+' XP'+(rk.next?' · עוד '+(rk.next-st.xp)+' לדרגה הבאה':'')+'</span></div>'+
  '<div><span class="k">שיעורים</span><b>'+dn+' / '+MODS.length+'</b>'+bar(dn,MODS.length)+'</div>'+
  '<div><span class="k">כרטיסיות</span><b>'+cs.seen+' נלמדו</b><span class="k">'+cs.mastered+' בשליטה מתוך '+cs.total+'</span></div>'+
  '<div><span class="k">יעד יומי</span><b>'+Math.min(tn,goal)+' / '+goal+'</b>'+bar(Math.min(tn,goal),goal)+'</div></div>'+
  '<h2>ארבע רמות</h2><div class="grid g2">'+lv+'</div>'+
  '<h2>איך האתר מלמד אותך</h2><div class="grid g3">'+
  [['🤔','ניחוש לפני קריאה','כל שיעור נפתח בשאלה. גם טעות בניחוש מחזקת את הזיכרון של התשובה הנכונה.'],
   ['🧠','שליפה, לא קריאה חוזרת','חידונים וכרטיסיות מכריחים אותך להיזכר. זה מה שבונה זיכרון לטווח ארוך.'],
   ['⏳','חזרה מרווחת','כרטיסיות חוזרות ביום, ב־3 ימים, בשבוע ועוד — בדיוק לפני שהן נשכחות.'],
   ['🛠️','עשייה וערבוב','אתגרים מעשיים, משחקים ותרגול מעורב. תרגול מגוון עדיף על חזרה על אותו דבר.']]
  .map(x=>'<div class="panel"><div style="font-size:1.6rem">'+x[0]+'</div><h3>'+x[1]+'</h3><p class="sm muted">'+x[2]+'</p></div>').join('')+'</div>');
}

/* ---------- מסלול ---------- */
function vPath(){
  const nx=A.nextLesson();
  show(pageH('מסלול הלמידה','לכו לפי הסדר. כל תחנה לוקחת כ־10–15 דקות. נקודה צהובה = התחנה הבאה שלכם.')+'<div class="metro">'+
  (META.levels||[]).map(l=>{const p=A.levelProgress(l.id);return '<section class="lvl l'+l.id+'"><div class="lvl-h">'+chip(l.id)+'<span class="muted sm">'+esc(l.desc)+'</span><span class="sp"></span><span class="muted sm">'+p.done+'/'+p.total+'</span></div><div class="stn-list">'+
    MODS.filter(m=>m.level===l.id).map(m=>{const d=done(m.id),o=nx&&nx.id===m.id;return '<a class="stn'+(d?' done':'')+(o?' open':'')+'" href="#/lesson/'+m.id+'"><span class="dot"></span><span>'+esc(m.icon||'')+'</span><span class="stn-t">'+esc(m.title)+'</span><span class="stn-m muted">'+(d?'✓ הושלם':m.minutes+' דק׳')+'</span></a>'}).join('')+'</div></section>'}).join('')+'</div>');
}

/* ---------- שיעור ---------- */
function blk(b){switch(b.t){
  case 'h':return '<h2>'+inline(b.x)+'</h2>';
  case 'p':return '<p>'+inline(b.x)+'</p>';
  case 'list':{const g=b.ord?'ol':'ul';return '<'+g+'>'+b.x.map(i=>'<li>'+inline(i)+'</li>').join('')+'</'+g+'>'}
  case 'steps':return '<ol class="steps">'+b.x.map(i=>'<li>'+inline(i)+'</li>').join('')+'</ol>';
  case 'code':return '<div class="codebox"><button class="copy" data-act="copy">העתק</button><pre dir="ltr"><code>'+esc(b.x)+'</code></pre></div>';
  case 'callout':{const k=b.k||'tip';return '<div class="callout '+k+'"><b>'+({tip:'טיפ',warn:'שימו לב',note:'הערה'}[k]||'')+':</b> '+inline(b.x)+'</div>'}
  case 'table':return '<div class="tw"><table><thead><tr>'+b.head.map(h=>'<th>'+inline(h)+'</th>').join('')+'</tr></thead><tbody>'+b.rows.map(r=>'<tr>'+r.map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  default:return ''}}
function qHTML(pq,k){return '<div class="q" data-qi="'+k+'"><div class="q-text">'+(k+1)+'. '+inline(pq.q)+'</div>'+
  pq.o.map((o,j)=>'<button class="opt" data-act="ans" data-qi="'+k+'" data-oi="'+j+'"><span class="l">'+'אבגד'[j]+'</span><span>'+inline(o.t)+'</span></button>').join('')+'<div class="why" role="status" hidden></div></div>'}
function lessonQuiz(m){QS={mode:'lesson',id:m.id,list:(m.quiz||[]).map((q,i)=>A.prep(q,m.id+'-q'+i)),done:{},ok:0,n:0,wrong:[]};
  return QS.list.map((p,i)=>qHTML(p,i)).join('')+'<div id="lres"></div>'}
function vLesson(id){
  const m=MOD[id];if(!m)return vNF();
  A.visit(id);document.title=m.title+' · '+META.title;
  const i=A.MIDX[id],pv=MODS[i-1],nx=MODS[i+1],d=done(id);
  show('<article class="lesson"><div class="crumb"><a href="#/path">מסלול</a> › רמה '+m.level+' · '+esc(A.level(m.level).name)+'</div>'+
  '<h1>'+esc(m.icon||'')+' '+esc(m.title)+'</h1><div class="meta">'+chip(m.level)+'<span>⏱ '+m.minutes+' דק׳</span>'+(m.verified?'<span>אומת מול התיעוד: '+esc(m.verified)+'</span>':'')+(d?'<span class="chip ok">✓ הושלם</span>':'')+'</div>'+
  '<p style="font-size:1.1rem;margin-top:1rem">'+inline(m.summary)+'</p>'+
  '<div class="panel goals"><b>בסוף השיעור תדעו</b><ul>'+(m.goals||[]).map(g=>'<li>'+inline(g)+'</li>').join('')+'</ul></div>'+
  (m.predict?'<div class="predict"><b>🤔 לפני שקוראים — נחשו</b><p>'+inline(m.predict.q)+'</p><button class="btn sm" data-act="reveal">חשבתי על זה — הציגו תשובה</button><div class="ans" hidden>'+inline(m.predict.a)+'</div></div>':'')+
  m.blocks.map(blk).join('')+
  (m.docs&&m.docs.length?'<p class="docs muted sm">📖 בתיעוד הרשמי: '+m.docs.map(x=>'<a href="'+esc(META.docsBase+x[0])+'" target="_blank" rel="noopener">'+esc(x[1])+'</a>').join(' · ')+'</p>':'')+
  '<div class="recap"><b>סיכום — מה לזכור</b><ul>'+(m.recap||[]).map(r=>'<li>'+inline(r)+'</li>').join('')+'</ul></div>'+
  '<h2>בדקו את עצמכם</h2><p class="muted sm">שליפה מהזיכרון היא הדרך הכי יעילה ללמוד. ענו לפני שאתם מציצים למעלה.</p><div id="lq">'+lessonQuiz(m)+'</div>'+
  '<div class="lfoot">'+(pv?'<a class="btn" href="#/lesson/'+pv.id+'">→ '+esc(pv.title)+'</a>':'')+'<span class="sp"></span><button class="btn" data-act="mark" data-id="'+id+'">'+(d?'✓ סומן כהושלם':'סמן כהושלם')+'</button>'+(nx?'<a class="btn pri" href="#/lesson/'+nx.id+'">'+esc(nx.title)+' ←</a>':'')+'</div></article>');
}
function lessonResult(){
  const m=MOD[QS.id],n=QS.list.length,ok=QS.ok,pass=ok>=Math.ceil(n*2/3),nx=MODS[A.MIDX[m.id]+1];
  let first=false;if(pass)first=A.doneLesson(m.id);if(ok===n&&n>0)A.perfect();
  $('#lres').innerHTML='<div class="panel center"><div class="res">'+ok+'/'+n+'</div><p>'+(pass?(ok===n?'מושלם! ':'כל הכבוד! ')+'השיעור סומן כהושלם'+(first?' (+30 XP)':'.'):'כמעט. קראו שוב את הסיכום ונסו שוב — הטעויות הן החלק שהכי מלמד.')+'</p><div class="row" style="justify-content:center"><button class="btn" data-act="retry">נסו שוב</button>'+(nx?'<a class="btn pri" href="#/lesson/'+nx.id+'">לשיעור הבא ←</a>':'<a class="btn pri" href="#/progress">להתקדמות</a>')+'</div></div>';
  const b=$('[data-act=mark]');if(b&&pass){b.textContent='✓ סומן כהושלם'}
}

/* ---------- תרגול ---------- */
function vPractice(arg){
  if(arg)return startPractice(arg);
  const mis=A.mistakes().length;
  show(pageH('תרגול','שליפה מהזיכרון + ערבוב נושאים = למידה עמוקה יותר מחזרה על שיעור אחד.')+
  '<div class="tiles"><a class="gt" href="#/practice/mixed"><div class="ic">🎲</div><h3>תרגול מעורב</h3><p class="sm muted">10 שאלות מכל מה שלמדתם, בערבוב. הטעויות האחרונות שלכם מופיעות שוב.</p></a>'+
  '<a class="gt" href="#/practice/mistakes"><div class="ic">🩹</div><h3>תיקון טעויות</h3><p class="sm muted">'+(mis?mis+' שאלות שטעיתם בהן לאחרונה.':'אין טעויות פתוחות. כל הכבוד!')+'</p></a></div>'+
  '<h2>לפי שיעור</h2><div class="grid g3">'+MODS.map(m=>'<a class="panel" style="color:inherit;text-decoration:none" href="#/practice/'+m.id+'"><span class="muted sm">'+esc(m.icon||'')+' רמה '+m.level+'</span><div><b>'+esc(m.title)+'</b></div></a>').join('')+'</div>');
}
function startPractice(mode){
  const set=A.practiceSet(mode);
  if(!set.length){show('<div class="panel center"><p>אין כרגע שאלות בנושא הזה.</p><a class="btn" href="#/practice">חזרה</a></div>');return}
  QS={mode:'practice',pm:mode,list:set.map(q=>A.prep(q,q.id)),done:{},ok:0,n:0,idx:0,wrong:[]};paintPractice();
}
function paintPractice(){const i=QS.idx,n=QS.list.length;
  show('<div class="lesson"><div class="row"><a href="#/practice">← יציאה</a><span class="sp"></span><span class="chip">'+(i+1)+'/'+n+'</span></div>'+bar(i,n)+qHTML(QS.list[i],i)+'<div id="pn" style="margin-top:12px"></div></div>',false);app.focus({preventScroll:true})}
function practiceEnd(){
  const n=QS.list.length,ok=QS.ok,mods=[...new Set(QS.wrong.map(id=>A.QMAP[id].m))];
  show('<div class="lesson"><div class="panel center"><div class="res">'+ok+'/'+n+'</div><p>'+(ok===n?'ללא טעויות!':ok>=n*0.7?'עבודה טובה.':'יש מה לחזק — וזה בדיוק המטרה.')+'</p>'+
  (mods.length?'<p class="sm muted">כדאי לחזור על: '+mods.map(id=>'<a href="#/lesson/'+id+'">'+esc(MOD[id].title)+'</a>').join(' · ')+'</p>':'')+
  '<div class="row" style="justify-content:center"><a class="btn pri" href="#/practice/'+QS.pm+'" data-act="again">סבב נוסף</a><a class="btn" href="#/practice">חזרה</a></div></div></div>');
}

/* ---------- כרטיסיות ---------- */
function vCards(arg){
  if(arg==='review')return startReview(false);
  if(arg==='free')return startReview(true);
  const cs=A.cardStats(),st=S();
  const mx=Math.max(1,...cs.boxes);
  show(pageH('כרטיסיות זיכרון','שיטת ליינטנר: כרטיסיה שענית עליה נכון חוזרת בהפרשים הולכים וגדלים. כרטיסיה שטעית בה חוזרת מיד.')+
  '<div class="strip"><div><span class="k">לחזרה היום</span><b>'+cs.due+'</b></div><div><span class="k">חדשות היום</span><b>'+cs.fresh+'</b></div><div><span class="k">נלמדו</span><b>'+cs.seen+' / '+cs.unlocked+'</b></div><div><span class="k">בשליטה</span><b>'+cs.mastered+'</b></div></div>'+
  (cs.unlocked===0?'<div class="callout note"><b>שימו לב:</b> כרטיסיות נפתחות כשפותחים את השיעור שלהן. פתחו שיעור ראשון, או הפעילו למטה את ״כל הכרטיסיות״.</div>':'')+
  '<div class="row">'+((cs.due+cs.fresh)?'<a class="btn pri" href="#/cards/review">התחלת סבב ('+(cs.due+cs.fresh)+')</a>':'<span class="muted">אין כרטיסיות לחזרה כרגע. 🎉</span>')+(cs.seen?'<a class="btn" href="#/cards/free">תרגול חופשי (10 כרטיסיות)</a>':'')+'</div>'+
  '<h2>הקופסאות שלך</h2><div class="panel">'+cs.boxes.map((n,i)=>'<div class="row" style="margin:6px 0"><span style="min-width:96px">קופסה '+(i+1)+'</span><div class="bar sp"><i style="width:'+pct(n,mx)+'%"></i></div><span class="muted sm" style="min-width:60px">'+n+' · '+ivText(A.IV[i])+'</span></div>').join('')+'<p class="muted sm">ככל שהקופסה גבוהה יותר, הפער עד החזרה הבאה גדול יותר (1, 3, 7, 16, 35 ימים).</p></div>'+
  '<h2>הגדרות</h2><div class="panel"><div class="field"><label for="npd">כרטיסיות חדשות ביום</label><select id="npd" data-chg="set" data-k="newPerDay">'+[4,8,12,20].map(v=>'<option'+(st.set.newPerDay===v?' selected':'')+'>'+v+'</option>').join('')+'</select></div>'+
  '<div class="field"><label for="allc">פתיחת כל הכרטיסיות (גם משיעורים שלא למדתם)</label><input type="checkbox" id="allc" data-chg="set" data-k="allCards"'+(st.set.allCards?' checked':'')+'></div></div>');
}
function startReview(free){
  const q=A.queue();
  const ids=free?A.freeQueue().map(c=>c.id):A.shuffle(q.due).slice(0,40).concat(q.fresh).map(c=>c.id);
  if(!ids.length){show('<div class="panel center"><p>אין כרגע כרטיסיות לחזרה.</p><a class="btn" href="#/cards">חזרה</a></div>');return}
  RV={ids,i:0,flip:false,r:[0,0,0,0],xp0:S().xp};paintCard();
}
function paintCard(){
  const c=CMAP[RV.ids[RV.i]],m=MOD[c.m],st=S().cards[c.id];
  show('<div class="lesson"><div class="row"><a href="#/cards">← יציאה</a><span class="sp"></span>'+(st?'<span class="chip">קופסה '+(st.b+1)+'</span>':'<span class="chip l2">חדשה</span>')+'<span class="chip">'+(RV.i+1)+'/'+RV.ids.length+'</span></div>'+bar(RV.i,RV.ids.length)+
  '<div class="fc"><div class="side">'+esc(m.title)+' · שאלה</div><div class="txt">'+inline(c.f)+'</div>'+(RV.flip?'<div class="back"><div class="side">תשובה</div><div class="txt">'+inline(c.b)+'</div></div>':'')+'</div>'+
  (RV.flip?'<div class="rate">'+[['שוב',0],['קשה',1],['טוב',2],['קל',3]].map(x=>'<button data-act="rate" data-r="'+x[1]+'">'+x[0]+'<small>'+(x[1]===0?'עוד מעט':ivText(A.nextIv(c.id,x[1])))+' · <span class="kbd">'+(x[1]+1)+'</span></small></button>').join('')+'</div>'
   :'<button class="btn pri" style="width:100%" data-act="flip">הצג תשובה <span class="kbd">רווח</span></button><p class="muted sm center">נסו לענות בראש לפני שמציגים — השליפה היא הלמידה.</p>')+'</div>',false);
  app.focus({preventScroll:true});
}
function endReview(){
  const r=RV.r,n=r[0]+r[1]+r[2]+r[3],gain=S().xp-RV.xp0;
  show('<div class="lesson"><div class="panel center"><div class="res">'+n+'</div><p>כרטיסיות נסקרו · +'+gain+' XP</p><p class="sm muted">שוב: '+r[0]+' · קשה: '+r[1]+' · טוב: '+r[2]+' · קל: '+r[3]+'</p><div class="row" style="justify-content:center"><a class="btn pri" href="#/">לדף הבית</a><a class="btn" href="#/practice">לתרגול</a></div></div></div>');
  RV=null;
}

/* ---------- משחקים ---------- */
function vGames(){
  const gs=S().games;
  show(pageH('משחקים','משחקים קצרים (2–4 דקות). שליפה תחת לחץ קל מקבעת את הידע.')+'<div class="tiles">'+
  (C.games||[]).map(g=>'<a class="gt" href="#/game/'+g.id+'"><div class="ic">'+esc(g.icon||'🎮')+'</div><h3>'+esc(g.title)+'</h3><p class="sm muted">'+esc(g.desc||'')+'</p><span class="chip">'+({match:'התאמה',choice:'חידון בזק',order:'סידור'}[g.type]||g.type)+'</span> '+(gs[g.id]?'<span class="chip ok">שיא '+gs[g.id].best+'</span>':'')+'</a>').join('')+'</div>');
}
function vGame(id){
  const g=(C.games||[]).find(x=>x.id===id);if(!g)return vNF();
  ({match:gMatch,choice:gChoice,order:gOrder}[g.type]||vNF)(g);
}
const gHead=g=>'<div class="row"><a href="#/games">← משחקים</a><span class="sp"></span><b>'+esc(g.icon||'')+' '+esc(g.title)+'</b></div>';
/* התאמה */
function gMatch(g){
  const pairs=A.shuffle(g.pairs).slice(0,6),idx=pairs.map((p,i)=>i);
  GM={g,pairs,sel:null,done:0,err:0,t0:Date.now(),fin:false};
  const L=A.shuffle(idx),R=A.shuffle(idx);
  show('<div class="lesson" style="max-width:860px">'+gHead(g)+'<p class="muted">לחצו על מושג ואז על ההגדרה שמתאימה לו.</p><div class="row"><span class="timer" id="tm">0:00</span><span class="sp"></span><span>טעויות: <b id="er">0</b></span></div>'+
  '<div class="mtch" style="margin-top:12px"><div>'+L.map(i=>'<button class="tile" style="width:100%;margin-bottom:10px" data-act="mt" data-s="l" data-i="'+i+'"><code dir="ltr">'+esc(pairs[i][0])+'</code></button>').join('')+'</div><div>'+
  R.map(i=>'<button class="tile" style="width:100%;margin-bottom:10px" data-act="mt" data-s="r" data-i="'+i+'">'+inline(pairs[i][1])+'</button>').join('')+'</div></div><div id="gres"></div></div>');
  TM=setInterval(()=>{const e=$('#tm');if(e&&GM&&!GM.fin)e.textContent=fmt(Date.now()-GM.t0)},500);
}
function finishMatch(){
  GM.fin=true;stopT();const sec=Math.round((Date.now()-GM.t0)/1000),score=Math.max(10,100-GM.err*12-Math.floor(sec/4));
  const x=A.gameDone(GM.g.id,score,10+Math.max(0,12-GM.err*3));
  $('#gres').innerHTML='<div class="panel center"><div class="res">'+score+'</div><p>זמן '+fmt(sec*1000)+' · '+GM.err+' טעויות · +'+x+' XP</p><div class="row" style="justify-content:center"><a class="btn pri" href="#/game/'+GM.g.id+'" data-act="again">שוב</a><a class="btn" href="#/games">לכל המשחקים</a></div></div>';
}
/* חידון בזק */
function gChoice(g){GM={g,items:A.shuffle(g.items).slice(0,10),i:0,lives:3,score:0,locked:false};paintChoice()}
function paintChoice(){
  if(GM.i>=GM.items.length||GM.lives<=0)return endChoice();
  const it=GM.items[GM.i];GM.pq=A.prep(it,'g');GM.locked=false;
  show('<div class="lesson">'+gHead(GM.g)+'<div class="row" style="margin:10px 0"><span style="color:var(--bad);letter-spacing:3px" id="hp">'+'♥'.repeat(GM.lives)+'♡'.repeat(3-GM.lives)+'</span><span class="sp"></span><span class="chip">'+(GM.i+1)+'/'+GM.items.length+'</span><span class="chip ok">ניקוד '+GM.score+'</span></div><div class="q"><div class="q-text">'+inline(GM.pq.q)+'</div>'+
  GM.pq.o.map((o,j)=>'<button class="opt" data-act="gc" data-oi="'+j+'"><span class="l">'+'אבגד'[j]+'</span><span>'+inline(o.t)+'</span></button>').join('')+'<div class="why" hidden></div></div><div id="gn"></div></div>',false);
}
function endChoice(){
  const win=GM.lives>0,x=A.gameDone(GM.g.id,GM.score,GM.score*2+(win?5:0));
  show('<div class="lesson">'+gHead(GM.g)+'<div class="panel center"><div class="res">'+GM.score+'/'+GM.items.length+'</div><p>'+(win?'סיימתם את כל הסיבוב!':'נגמרו החיים — זה בסדר, זה חלק מהלמידה.')+' +'+x+' XP</p><div class="row" style="justify-content:center"><a class="btn pri" href="#/game/'+GM.g.id+'" data-act="again">שוב</a><a class="btn" href="#/games">לכל המשחקים</a></div></div></div>');
}
/* סידור */
function gOrder(g){
  const it=g.items[Math.floor(Math.random()*g.items.length)];
  GM={g,it,next:0,err:0,fin:false};
  show('<div class="lesson">'+gHead(g)+'<div class="panel"><b>המשימה:</b> '+inline(it.goal)+'</div><p class="muted">לחצו על השלבים לפי הסדר הנכון. שלב שגוי לא ייכנס.</p><div class="row" style="margin-bottom:8px">טעויות: <b id="er">0</b></div>'+
  '<div class="grid g2" style="align-items:start"><div id="pool">'+A.shuffle(it.steps.map((t,i)=>({t,i}))).map(s=>'<button class="tile" style="width:100%;margin-bottom:10px;text-align:start" data-act="od" data-i="'+s.i+'">'+inline(s.t)+'</button>').join('')+'</div><ol class="built" id="built"></ol></div><div id="gres"></div></div>',false);
}

/* ---------- אתגרים ---------- */
function vChallenges(arg){
  const lv=+arg||0,all=C.challenges||[],list=all.filter(c=>!lv||c.l===lv),st=S().ch;
  const nd=all.filter(c=>st[c.id]&&st[c.id].done).length;
  show(pageH('אתגרים מעשיים','קוראים ולומדים — אבל הידע נבנה כשעושים. כל אתגר קצר, וגם כתיבת ״מה למדתי״ בסופו נחשבת: זו שליפה והסבר במילים שלכם.')+
  '<div class="row" style="margin-bottom:14px"><span class="chip ok">'+nd+' / '+all.length+' הושלמו</span><span class="sp"></span>'+[0,1,2,3,4].map(l=>'<a class="btn sm" '+(lv===l?'style="background:var(--ink);color:var(--paper)" ':'')+'href="#/challenges'+(l?'/'+l:'')+'">'+(l?'רמה '+l:'הכל')+'</a>').join('')+'</div>'+
  list.map(c=>{const s=st[c.id]||{};return '<details class="panel" id="ch-'+esc(c.id)+'"><summary><span class="ck">'+(s.done?'✅':'⬜')+'</span><b>'+esc(c.t)+'</b>'+chip(c.l)+'<span class="muted sm">⏱ '+c.min+' דק׳</span></summary>'+
   '<p><b>המטרה:</b> '+inline(c.g)+'</p><ol class="steps">'+(c.s||[]).map(x=>'<li>'+inline(x)+'</li>').join('')+'</ol><p><b>איך יודעים שהצלחתם:</b> '+inline(c.ok)+'</p>'+(c.x?'<p class="muted"><b>הרחבה:</b> '+inline(c.x)+'</p>':'')+
   '<label class="sm" for="n-'+esc(c.id)+'"><b>'+inline(c.r||'מה למדתי / מה הפתיע אותי?')+'</b></label><textarea id="n-'+esc(c.id)+'" data-chg="note" data-id="'+esc(c.id)+'" placeholder="כמה משפטים במילים שלכם...">'+esc(s.note||'')+'</textarea>'+
   '<div class="row" style="margin-top:8px"><button class="btn '+(s.done?'':'pri')+'" data-act="chdone" data-id="'+esc(c.id)+'">'+(s.done?'בטל סימון':'סיימתי את האתגר ✓')+'</button></div></details>'}).join(''));
}

/* ---------- מדריך מהיר ---------- */
function vCheats(){
  show(pageH('מדריך מהיר','כל מה שצריך מול העיניים. לחיצה על שורה מעתיקה את הפקודה. אפשר לסנן.')+
  '<input type="search" id="cf" data-inp="cf" placeholder="סינון: למשל compact" style="width:100%;max-width:360px" aria-label="סינון מדריך">'+
  (C.cheats||[]).map(s=>'<section class="cs-sec"><h2>'+esc(s.t)+'</h2><div class="tw"><table><tbody>'+s.rows.map(r=>'<tr class="cs-cmd" data-act="copyt" data-t="'+esc(r[0])+'" title="לחצו להעתקה"><td style="white-space:nowrap"><code dir="ltr">'+esc(r[0])+'</code></td><td>'+inline(r[1])+'</td></tr>').join('')+'</tbody></table></div></section>').join(''));
}

/* ---------- התקדמות ---------- */
function heat(){
  const days=S().days,n=new Date(),end=new Date(n.getFullYear(),n.getMonth(),n.getDate()),start=new Date(end);start.setDate(end.getDate()-(7*25+end.getDay()));
  let h='';for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){const k=A.dstr(d),c=days[k]||0;h+='<div class="hc" data-l="'+(c===0?0:c<5?1:c<15?2:c<30?3:4)+'" title="'+k+': '+c+' פעולות"></div>'}
  return '<div class="heat" role="img" aria-label="מפת פעילות חצי שנה אחרונה">'+h+'</div>';
}
function vProgress(){
  const st=S(),rk=A.rank(),cs=A.cardStats(),a=st.stat,weak=A.weakModules(),nch=Object.values(st.ch).filter(c=>c.done).length;
  const sel=(k,opts)=>'<select data-chg="set" data-k="'+k+'" aria-label="'+k+'">'+opts.map(o=>'<option value="'+o[0]+'"'+(String(st.set[k])===String(o[0])?' selected':'')+'>'+o[1]+'</option>').join('')+'</select>';
  show(pageH('ההתקדמות שלך','הכל נשמר בדפדפן שלך בלבד. אפשר לייצא גיבוי ולהעביר בין מכשירים.')+
  '<div class="strip"><div><span class="k">דרגה</span><b>'+esc(rk.name)+'</b><span class="k">'+st.xp+' XP</span></div><div><span class="k">רצף נוכחי / שיא</span><b>'+A.streakNow()+' ימים</b></div><div><span class="k">שיעורים</span><b>'+A.lessonsDone()+' / '+MODS.length+'</b></div><div><span class="k">דיוק בחידונים</span><b>'+(a.answers?Math.round(100*a.correct/a.answers)+'%':'—')+'</b><span class="k">'+a.answers+' תשובות</span></div></div>'+
  '<div class="strip"><div><span class="k">חזרות כרטיסיות</span><b>'+a.reviews+'</b></div><div><span class="k">כרטיסיות בשליטה</span><b>'+cs.mastered+' / '+cs.total+'</b></div><div><span class="k">אתגרים</span><b>'+nch+' / '+(C.challenges||[]).length+'</b></div><div><span class="k">משחקים ששוחקו</span><b>'+Object.keys(st.games).length+'</b></div></div>'+
  '<h2>פעילות — חצי שנה אחרונה</h2><div class="panel">'+heat()+'</div>'+
  (weak.length?'<h2>נקודות לחיזוק</h2><div class="panel">'+weak.map(w=>'<div class="field"><span>'+esc(w.m.title)+' <span class="muted sm">(דיוק '+w.acc+'%)</span></span><a class="btn sm" href="#/practice/'+w.m.id+'">תרגול</a></div>').join('')+'</div>':'')+
  '<h2>תגים</h2><div class="badges">'+A.BADGES.map(b=>'<div class="bd'+(st.badges[b.id]?'':' off')+'"><span class="i">'+b.i+'</span><b>'+esc(b.n)+'</b><br><span class="muted">'+esc(b.d)+'</span></div>').join('')+'</div>'+
  '<h2>הגדרות</h2><div class="panel"><div class="field"><label>ערכת נושא</label>'+sel('theme',[['auto','לפי המכשיר'],['light','בהיר'],['dark','כהה']])+'</div>'+
  '<div class="field"><label>גודל טקסט</label>'+sel('fs',[[0.9,'קטן'],[1,'רגיל'],[1.15,'גדול'],[1.3,'גדול מאוד']])+'</div>'+
  '<div class="field"><label>יעד יומי (פעולות)</label>'+sel('goal',[[10,'10'],[20,'20'],[40,'40']])+'</div></div>'+
  '<h2>גיבוי</h2><div class="panel"><div class="row"><button class="btn" data-act="export">ייצוא התקדמות</button><label class="btn" for="imp">ייבוא</label><input type="file" id="imp" accept=".json,application/json" data-chg="imp" hidden><span class="sp"></span><button class="btn sm" data-act="reset" style="color:var(--bad);border-color:var(--bad)">איפוס הכל</button></div></div>');
}

/* ---------- עדכונים ---------- */
function vUpdates(){
  const d=Math.floor((Date.now()-new Date(META.verifiedOn+'T00:00:00').getTime())/864e5);
  const prompt='פתח את התיקייה claude-code-academy וקרא את CLAUDE.md.\nבדוק מול התיעוד הרשמי (https://code.claude.com/docs) מה השתנה ב-Claude Code מאז התאריך verifiedOn ב-data/meta.js.\nעדכן רק את השיעורים, הכרטיסיות והמדריך המהיר הרלוונטיים, הוסף רשומה ל-data/changelog.js, ועדכן contentVersion ו-verifiedOn.\nבסוף הרץ node --check על כל קבצי ה-JS.';
  show(pageH('עדכונים וגרסה','Claude Code משתנה מהר. האתר בנוי כך שאפשר לרענן תוכן בלי לגעת במנוע.')+
  '<div class="panel"><div class="row"><b>גרסת תוכן '+esc(META.contentVersion)+'</b><span class="sp"></span><span class="muted">אומת מול התיעוד: '+esc(META.verifiedOn)+' (לפני '+d+' ימים)</span></div>'+(d>45?'<div class="callout note"><b>הערה:</b> עברו יותר מ־45 יום מאז האימות האחרון. שווה לרענן — ראו למטה.</div>':'')+
  '<p class="sm"><a href="'+esc(META.docsBase)+'" target="_blank" rel="noopener">התיעוד הרשמי</a> · <a href="'+esc(META.docsBase)+'changelog" target="_blank" rel="noopener">יומן שינויים רשמי של Claude Code</a></p></div>'+
  '<h2>איך מעדכנים</h2><ol class="steps"><li>פתחו את תיקיית האתר בטרמינל והריצו <code dir="ltr">claude</code>.</li><li>הדביקו את הבקשה הבאה (היא גם נמצאת ב־README).</li><li>בדקו ב־<code dir="ltr">/diff</code> מה השתנה ואשרו.</li></ol><div class="codebox"><button class="copy" data-act="copy">העתק</button><pre dir="ltr" style="white-space:pre-wrap"><code>'+esc(prompt)+'</code></pre></div>'+
  '<h2>יומן שינויים של האתר</h2>'+(C.changelog||[]).map(c=>'<div class="panel"><b>'+esc(c.v)+'</b> <span class="muted sm">· '+esc(c.d)+'</span><ul>'+c.items.map(i=>'<li>'+inline(i)+'</li>').join('')+'</ul></div>').join(''));
}

/* ---------- חיפוש ---------- */
function vSearch(arg){
  const r=A.search(arg);
  if(!r){show(pageH('חיפוש','הקלידו לפחות שני תווים.'));return}
  const n=r.lessons.length+r.cards.length+r.cheats.length+r.challenges.length;
  show(pageH('חיפוש: '+esc(arg),n+' תוצאות')+
  (r.lessons.length?'<h2>שיעורים</h2>'+r.lessons.map(m=>'<a class="stn" href="#/lesson/'+m.id+'"><span>'+esc(m.icon||'')+'</span><span class="stn-t">'+esc(m.title)+'</span><span class="stn-m muted">רמה '+m.level+'</span></a>').join(''):'')+
  (r.cheats.length?'<h2>מדריך מהיר</h2>'+r.cheats.map(s=>'<div class="tw"><table><tbody>'+s.rows.map(x=>'<tr class="cs-cmd" data-act="copyt" data-t="'+esc(x[0])+'"><td style="white-space:nowrap"><code dir="ltr">'+esc(x[0])+'</code></td><td>'+inline(x[1])+'</td></tr>').join('')+'</tbody></table></div>').join(''):'')+
  (r.cards.length?'<h2>כרטיסיות</h2>'+r.cards.map(c=>'<div class="panel"><b>'+inline(c.f)+'</b><br><span class="muted">'+inline(c.b)+'</span></div>').join(''):'')+
  (r.challenges.length?'<h2>אתגרים</h2>'+r.challenges.map(c=>'<a class="stn" href="#/challenges/'+c.l+'"><span class="stn-t">'+esc(c.t)+'</span></a>').join(''):'')+(n?'':'<p class="muted">לא נמצא כלום. נסו מילה אחרת.</p>'));
}
function vNF(){show('<div class="panel center"><h1>404</h1><p>הדף לא נמצא.</p><a class="btn pri" href="#/">לדף הבית</a></div>')}

/* ---------- ראוטר ---------- */
const R={'':vHome,path:vPath,lesson:vLesson,cards:vCards,practice:vPractice,games:vGames,game:vGame,challenges:vChallenges,cheats:vCheats,progress:vProgress,updates:vUpdates,search:vSearch};
function route(){
  stopT();QS=null;RV=null;GM=null;document.title=META.title;
  const p=location.hash.replace(/^#\/?/,'').split('/'),r=p[0]||'',arg=decodeURIComponent(p.slice(1).join('/'));
  renderNav({lesson:'path',game:'games'}[r]||r);
  (R[r]||vNF)(arg);
  app.focus({preventScroll:true});
}

/* ---------- פעולות ---------- */
const ACT={
  reveal(el){el.hidden=true;$('.ans',el.parentNode).hidden=false},
  copy(el){copyText($('pre',el.parentNode).textContent);el.textContent='הועתק ✓';setTimeout(()=>{el.textContent='העתק'},1400)},
  copyt(el){copyText(el.dataset.t);A.toast('הועתק: '+el.dataset.t)},
  mark(el){const f=A.doneLesson(el.dataset.id);el.textContent='✓ סומן כהושלם';if(!f)A.toast('השיעור כבר מסומן')},
  retry(){const m=MOD[QS.id];$('#lq').innerHTML=lessonQuiz(m)},
  ans(el){
    if(!QS)return;const k=+el.dataset.qi,j=+el.dataset.oi,pq=QS.list[k];if(QS.done[k])return;QS.done[k]=1;
    const ok=pq.o[j].ok,box=el.closest('.q');
    $$('.opt',box).forEach((b,x)=>{b.disabled=true;if(pq.o[x].ok)b.classList.add('ok')});
    if(!ok){el.classList.add('bad');QS.wrong.push(pq.id)}
    const w=$('.why',box);w.hidden=false;w.innerHTML=(ok?'<b>✓ נכון.</b> ':'<b>✗ לא בדיוק.</b> ')+inline(pq.w||'');
    A.answerQ(pq.id,ok);QS.n++;if(ok)QS.ok++;
    if(QS.mode==='lesson'){if(QS.n===QS.list.length)lessonResult()}
    else $('#pn').innerHTML='<button class="btn pri" data-act="pnext">'+(QS.idx===QS.list.length-1?'לסיכום':'הבאה ←')+'</button>';
  },
  pnext(){QS.idx++;QS.idx>=QS.list.length?practiceEnd():paintPractice()},
  again(){setTimeout(route,0)},
  flip(){if(!RV||RV.flip)return;RV.flip=true;paintCard()},
  rate(el){if(!RV)return;const r=+el.dataset.r,id=RV.ids[RV.i];A.rate(id,r);RV.r[r]++;if(r===0)RV.ids.push(id);RV.i++;RV.flip=false;RV.i>=RV.ids.length?endReview():paintCard()},
  mt(el){
    if(!GM||GM.fin||el.classList.contains('done'))return;const s=el.dataset.s,i=+el.dataset.i;
    if(GM.sel&&GM.sel.el===el){el.classList.remove('sel');GM.sel=null;return}
    if(GM.sel&&GM.sel.s===s){GM.sel.el.classList.remove('sel');GM.sel=null}
    if(!GM.sel){GM.sel={s,i,el};el.classList.add('sel');return}
    const a=GM.sel;GM.sel=null;
    if(a.i===i){[a.el,el].forEach(t=>{t.classList.remove('sel');t.classList.add('done')});GM.done++;if(GM.done===GM.pairs.length)finishMatch()}
    else{GM.err++;$('#er').textContent=GM.err;[a.el,el].forEach(t=>{t.classList.remove('sel');t.classList.add('flash');setTimeout(()=>t.classList.remove('flash'),400)})}
  },
  gc(el){
    if(!GM||GM.locked)return;GM.locked=true;const pq=GM.pq,ok=pq.o[+el.dataset.oi].ok,box=el.closest('.q');
    $$('.opt',box).forEach((b,x)=>{b.disabled=true;if(pq.o[x].ok)b.classList.add('ok')});
    if(ok)GM.score++;else{el.classList.add('bad');GM.lives--;$('#hp').textContent='♥'.repeat(GM.lives)+'♡'.repeat(3-GM.lives)}
    const w=$('.why',box);w.hidden=false;w.innerHTML=(ok?'<b>✓ נכון.</b> ':'<b>✗ לא בדיוק.</b> ')+inline(pq.w||'');
    $('#gn').innerHTML='<button class="btn pri" data-act="gnext" style="margin-top:12px">'+(GM.i>=GM.items.length-1||GM.lives<=0?'לסיכום':'הבאה ←')+'</button>';
  },
  gnext(){GM.i++;paintChoice()},
  od(el){
    if(!GM||GM.fin||el.disabled)return;const i=+el.dataset.i;
    if(i===GM.next){el.disabled=true;el.classList.add('done');const li=document.createElement('li');li.innerHTML=el.innerHTML;$('#built').appendChild(li);GM.next++;
      if(GM.next===GM.it.steps.length){GM.fin=true;const x=A.gameDone(GM.g.id,Math.max(0,10-GM.err),Math.max(5,15-GM.err*3));
        $('#gres').innerHTML='<div class="panel center"><p><b>מצוין!</b> '+GM.err+' טעויות · +'+x+' XP</p><div class="row" style="justify-content:center"><a class="btn pri" href="#/game/'+GM.g.id+'" data-act="again">עוד סיבוב</a><a class="btn" href="#/games">לכל המשחקים</a></div></div>'}}
    else{GM.err++;$('#er').textContent=GM.err;el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),400)}
  },
  chdone(el){
    const id=el.dataset.id,was=!!(S().ch[id]&&S().ch[id].done);A.setChallenge(id,!was);
    const d=$('#ch-'+CSS.escape(id));$('.ck',d).textContent=was?'⬜':'✅';el.textContent=was?'סיימתי את האתגר ✓':'בטל סימון';el.classList.toggle('pri',was);
  },
  export(){const b=new Blob([A.exportJSON()],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='cca-progress-'+A.dstr()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)},
  reset(){if(confirm('למחוק את כל ההתקדמות? אי אפשר לבטל. כדאי לייצא גיבוי קודם.')){A.reset();route()}}
};
const CHG={
  set(el){const k=el.dataset.k;let v=el.type==='checkbox'?el.checked:el.value;if(['fs','goal','newPerDay'].includes(k))v=+v;S().set[k]=v;A.applyTheme();A.touch();if(k==='allCards')route()},
  note(el){A.setChallenge(el.dataset.id,undefined,el.value)},
  imp(el){const f=el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{A.importJSON(r.result);A.toast('ההתקדמות יובאה');route()}catch(e){A.toast('הקובץ לא תקין')}};r.readAsText(f)}
};
const INP={cf(el){const t=el.value.trim().toLowerCase();$$('.cs-sec').forEach(s=>{let v=0;$$('tr',s).forEach(r=>{const m=!t||r.textContent.toLowerCase().includes(t);r.hidden=!m;if(m)v++});s.hidden=!v})}};

document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(el&&ACT[el.dataset.act])ACT[el.dataset.act](el,e)});
document.addEventListener('change',e=>{const el=e.target.closest('[data-chg]');if(el&&CHG[el.dataset.chg])CHG[el.dataset.chg](el,e)});
document.addEventListener('input',e=>{const el=e.target.closest('[data-inp]');if(el&&INP[el.dataset.inp])INP[el.dataset.inp](el,e)});
document.addEventListener('keydown',e=>{
  const tg=e.target;if(/INPUT|TEXTAREA|SELECT/.test(tg.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='/'){e.preventDefault();$('#q').focus();return}
  if(RV){
    if(!RV.flip&&(e.key===' '||e.key==='Enter')&&!/^(BUTTON|A)$/.test(tg.tagName)){e.preventDefault();ACT.flip()}
    else if(RV.flip&&/^[1-4]$/.test(e.key))ACT.rate({dataset:{r:String(+e.key-1)}});
  }
});
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim().length>1){location.hash='#/search/'+encodeURIComponent(e.target.value.trim());e.target.blur()}});
$('#themeBtn').addEventListener('click',()=>{const o=['auto','light','dark'],s=S();s.set.theme=o[(o.indexOf(s.set.theme)+1)%3];A.applyTheme();A.touch();A.toast('ערכת נושא: '+({auto:'לפי המכשיר',light:'בהיר',dark:'כהה'}[s.set.theme]))});
$('#brandName').textContent=META.title;
$('#footInfo').textContent='גרסת תוכן '+META.contentVersion+' · אומת מול התיעוד ב־'+META.verifiedOn;
window.addEventListener('hashchange',route);
route();
})();
