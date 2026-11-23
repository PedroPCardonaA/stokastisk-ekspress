// Validator for Stokastisk Ekspress content.
// Usage (from src/):  node validate.js                 -> all content files (same glob as build.py)
//                     node validate.js qe_H24.js ...   -> only the given files (safe to run in parallel)
// Checks: schema, bilingual fields, unique ids, per-option explanations, KaTeX parsing of every $…$,
// figure kinds (and that each figure renders, once figs.js implements it), guide/formula-sheet shape, scoring rules.
const fs = require('fs'), path = require('path');
process.chdir(__dirname);
const all = () => [...fs.readdirSync('.').filter(f=>/^qe_.*\.js$/.test(f)).sort(), ...fs.readdirSync('.').filter(f=>/^qn_.*\.js$/.test(f)).sort(), ...fs.readdirSync('.').filter(f=>/^fix.*\.js$/.test(f)).sort(), ...(fs.existsSync('guide.js')?['guide.js']:[])];
const files = process.argv.slice(2).length ? process.argv.slice(2).map(f=>path.basename(f)) : all();
const QB=[], XP={}, FIX={}; let GUIDE, FORMELARK;
let errs=0, warns=0; const err=(...a)=>{console.log('ERROR',...a);errs++}, warn=(...a)=>{console.log('warn ',...a);warns++};
for(const f of files){ const src = fs.readFileSync(f,'utf8');
  try{ const r = new Function('QB','XP','FIX', src + '\n;return {G: typeof GUIDE!=="undefined"?GUIDE:undefined, F: typeof FORMELARK!=="undefined"?FORMELARK:undefined};')(QB,XP,FIX); if(r.G) GUIDE=r.G; if(r.F) FORMELARK=r.F; }
  catch(e){ err('cannot load',f,':',e.message); } }
for(const q of QB){ q.kind=q.kind||'single'; if(!q.x&&XP[q.id]) q.x=XP[q.id]; if(FIX[q.id]) Object.assign(q,FIX[q.id]); }
const NT = 10, SRC = /^(H2[0-5]|K2[1-5]|P21|P20a|P20b|notes|new)$/;
const FIGKINDS = ['hist','box','bars','pmf','pdf','cdf','xy','resid','qq','venn','ptree','sys','line','dot'];
const bi = p => Array.isArray(p) && p.length===2 && p.every(x=>typeof x==='string' && x.trim());
const ids = new Set(), per={}, perNum={}, kinds={}, srcs={};
for(const q of QB){
  const id = q.id || '(no id)';
  if(typeof q.id!=='string' || !q.id) err('missing id', JSON.stringify(q).slice(0,80));
  if(ids.has(id)) err('duplicate id', id); ids.add(id);
  if(!(Number.isInteger(q.t) && q.t>=0 && q.t<NT)) err('bad t (station 0–9)', id);
  if(!['single','tf','multi','num'].includes(q.kind)) err('bad kind', id);
  if(!SRC.test(q.s||'')) err('bad s', id, q.s);
  if(!bi(q.q)) err('q must be [no,en] non-empty', id);
  if(!bi(q.w)) err('w must be [no,en] non-empty', id);
  if(q.f!==undefined && !bi(q.f)) err('bad f', id);
  if(q.c!==undefined && typeof q.c!=='string') err('c must be a string', id);
  if(q.fig){ const k = typeof q.fig==='object' ? q.fig.k : null; if(!FIGKINDS.includes(k)) err('bad fig kind', id, k); }
  if(q.s==='new' && q.kind==='num' && !q.f) err('new num question needs formula f', id);
  per[q.t]=(per[q.t]||0)+1; kinds[q.kind]=(kinds[q.kind]||0)+1; srcs[q.s]=(srcs[q.s]||0)+1; if(q.f) perNum[q.t]=(perNum[q.t]||0)+1;
  if(q.kind==='num'){
    if(!Number.isFinite(q.ans)) err('num ans must be a finite number', id);
    if(!(q.tol>0)) err('num tol must be > 0', id);
    else if(Number.isFinite(q.ans) && q.ans!==0 && q.tol > Math.abs(q.ans)*0.05 + 1e-12) warn('tolerance > 5% of answer', id, q.ans, q.tol);
    if(q.unit!==undefined && !bi(q.unit)) err('unit must be [no,en]', id);
    if(q.o) err('num question must not have options', id);
    continue;
  }
  if(!Array.isArray(q.o) || q.o.length<2) { err('options missing', id); continue; }
  if(!q.o.every(bi)) err('every option must be [no,en]', id);
  if(q.o.length>8) err('too many options (max 8)', id);
  if(new Set(q.o.map(o=>o[0])).size!==q.o.length) err('duplicate option text', id);
  if(!Array.isArray(q.x) || q.x.length!==q.o.length){ err('x must have one entry per option', id); continue; }
  if(q.kind==='multi'){
    if(!Array.isArray(q.a)||!q.a.length||new Set(q.a).size!==q.a.length||q.a.some(i=>!(Number.isInteger(i)&&i>=0&&i<q.o.length))) err('bad multi a', id);
    if(!q.x.every(bi)) err('multi: every x entry must be [no,en] (say why true or false)', id);
  } else {
    if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<q.o.length)) err('bad a', id);
    if(q.x[q.a]!==null) err('x[a] must be null (the correct option is explained by w)', id);
    q.x.forEach((e,i)=>{ if(i!==q.a && !bi(e)) err('x missing for wrong option', id, i); });
    if(q.kind==='tf' && JSON.stringify(q.o)!==JSON.stringify([["Sant","True"],["Usant","False"]])) err('tf options must be [["Sant","True"],["Usant","False"]]', id);
  }
}
// ---- guide + formula sheet ----
if(files.includes('guide.js')){
  const gids=new Set(), gper={};
  if(!Array.isArray(GUIDE)) err('GUIDE missing'); else GUIDE.forEach(g=>{ if(!Number.isInteger(g.t)||g.t<0||g.t>=NT) err('guide bad t',g.t); if(!Array.isArray(g.items)||!g.items.length) err('guide empty topic',g.t);
    (g.items||[]).forEach(it=>{ if(gids.has(it.id)) err('guide dup id',it.id); gids.add(it.id); gper[g.t]=(gper[g.t]||0)+1;
      for(const k of ['n','f','e']) if(!bi(it[k])) err('guide bad '+k,it.id); if(it.ex!==undefined && !bi(it.ex)) err('guide bad ex',it.id); }); });
  if(Array.isArray(GUIDE)) for(let t=0;t<NT;t++) if(!gper[t]) err('guide missing station',t);
  if(!Array.isArray(FORMELARK)) err('FORMELARK missing'); else FORMELARK.forEach((sec,i)=>{ if(!bi(sec.h)) err('FORMELARK bad h',i); if(!Array.isArray(sec.rows)||!sec.rows.length) err('FORMELARK empty section',i); else sec.rows.forEach((r,j)=>{ if(!Array.isArray(r)||r.length!==2||!bi(r[0])||!bi(r[1])) err('FORMELARK bad row',i,j); }); });
  console.log('guide cards', gids.size, JSON.stringify(gper), '| formelark sections', Array.isArray(FORMELARK)?FORMELARK.length:0);
}
// ---- KaTeX: every $…$ segment in every text field must parse ----
{ const katex=require('./vendor/katex.min.js'); let nt=0; const kw={};
  const texCheck=(str,where)=>{ if(typeof str!=='string') return; const parts=str.split('$'); if(parts.length%2===0){ err('unbalanced $ in',where); return; }
    parts.forEach((p,i)=>{ if(i%2===0) return; nt++; try{ katex.renderToString('\\displaystyle '+p,{throwOnError:true,strict:(code)=>{ kw[code]=(kw[code]||0)+1; return 'ignore'; }}); }catch(e){ err('KaTeX error in',where,':',e.message.slice(0,160)); } }); };
  const pairs=(v,w)=>{ if(Array.isArray(v)) v.forEach((x,k)=>Array.isArray(x)?pairs(x,w+'['+k+']'):texCheck(x,w+'['+k+']')); };
  for(const q of QB){ for(const k of ['q','w','f','unit']) pairs(q[k], q.id+'.'+k); if(q.o) q.o.forEach((o,i)=>pairs(o,q.id+'.o'+i)); if(q.x) q.x.forEach((x,i)=>x&&pairs(x,q.id+'.x'+i)); }
  if(Array.isArray(GUIDE)) for(const g of GUIDE) for(const it of g.items) for(const k of ['n','f','e','ex']) pairs(it[k], it.id+'.'+k);
  if(Array.isArray(FORMELARK)) FORMELARK.forEach((sec,i)=>{ pairs(sec.h,'formelark'+i); sec.rows.forEach((r,j)=>pairs(r,'formelark'+i+'.'+j)); });
  console.log('tex segments', nt, Object.keys(kw).length ? 'katex warnings '+JSON.stringify(kw) : ''); }
// ---- figures: render each one in a stub environment (only if figs.js implements the kind) ----
{ const tpl = fs.readFileSync('template.html','utf8');
  const stBlock = tpl.slice(tpl.indexOf('const ST = (() => {'), tpl.indexOf('/* ================= FORMULA SHEET'));
  const figSrc = fs.readFileSync('figs.js','utf8');
  let env; try{ env = new Function('S','css','mulberry', stBlock + '\nconst tx = p => Array.isArray(p) ? p[0] : (p ?? "");\nconst texify = s => s;\n' + figSrc + '\n;return {figHTML: typeof figHTML!=="undefined"?figHTML:null, FIGK: typeof FIGK!=="undefined"?FIGK:{}};')(
      {lang:'no'}, () => '#888888', function(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }); }
  catch(e){ err('figs.js failed to load:', e.message); env = null; }
  if(env && env.figHTML){ let ok=0, skipped=0; const origErr = console.error; console.error = (...a) => err('figure threw:', ...a.map(x=>x&&x.message?x.message:typeof x==='object'?JSON.stringify(x).slice(0,120):x));
    for(const q of QB) if(q.fig){ if(!env.FIGK[q.fig.k]){ skipped++; continue; } const h = env.figHTML(q.fig); if(typeof h!=='string' || !h.includes('<svg') || /NaN|undefined/.test(h)) err('figure renders badly', q.id, q.fig.k, typeof h==='string' && /NaN|undefined/.test(h) ? '(contains NaN/undefined)' : ''); else ok++; }
    console.error = origErr; console.log('figures rendered', ok, skipped ? '| not yet implemented: '+skipped : ''); } }
// ---- scoring rules (from template.html) ----
{ const tpl = fs.readFileSync('template.html','utf8'), grab = n => { const m = tpl.match(new RegExp('function '+n+'\\([\\s\\S]*?\\n}\\n')); if(!m) throw new Error('missing '+n); return m[0]; };
  const env = new Function(['isEmpty','parseNum','resultOf','pointsFor','scoreExam','gradeFor'].map(grab).join('\n') + '\nconst GRADES=[[89,"A"],[77,"B"],[65,"C"],[53,"D"],[41,"E"],[-Infinity,"F"]];\nreturn {pointsFor, scoreExam, gradeFor, parseNum};')();
  const S6={kind:'single',o:[1,2,3,4,5,6],a:2}, TF={kind:'tf',o:[1,2],a:0}, MU={kind:'multi',o:[1,2,3,4,5],a:[0,3]}, NU={kind:'num',ans:0.914,tol:0.0005};
  const chk=(name,got,exp)=>{ const ok = got===exp || Math.abs(got-exp)<1e-9; if(!ok){ err('scoring test', name, '=', got, 'expected', exp); } };
  chk('single correct',env.pointsFor(S6,2),1); chk('single wrong',env.pointsFor(S6,0),0); chk('single skip',env.pointsFor(S6,null),0);
  chk('tf wrong',env.pointsFor(TF,1),0); chk('multi exact',env.pointsFor(MU,[3,0]),1); chk('multi subset',env.pointsFor(MU,[0]),0); chk('multi superset',env.pointsFor(MU,[0,1,3]),0);
  chk('num within tol',env.pointsFor(NU,0.9143),1); chk('num outside tol',env.pointsFor(NU,0.92),0); chk('parse comma',env.parseNum('0,914'),0.914);
  const g=[{t:0,start:0,len:2},{t:1,start:2,len:2}]; let r=env.scoreExam([S6,S6,S6,S6],[2,0,0,null],g); chk('no floor: group raw',r.groups[1].raw,0); chk('exam total',r.total,1); chk('exam pct',r.pct,25);
  r=env.scoreExam(Array(22).fill(S6),Array(22).fill(2),null); chk('22 correct pct',r.pct,100); chk('grade A',r.grade,'A');
  chk('grade 88.9->B',env.gradeFor(88.9)==='B'?1:0,1); chk('grade 41->E',env.gradeFor(41)==='E'?1:0,1); chk('grade 40.9->F',env.gradeFor(40.9)==='F'?1:0,1);
  console.log('scoring tests done'); }
console.log('files', files.length, '| questions', QB.length, '| per station', JSON.stringify(per), '| with formula', JSON.stringify(perNum));
console.log('kinds', JSON.stringify(kinds), '| sources', JSON.stringify(srcs));
console.log(errs ? `FAILED: ${errs} error(s), ${warns} warning(s)` : `OK (${warns} warning(s))`);
process.exit(errs ? 1 : 0);
