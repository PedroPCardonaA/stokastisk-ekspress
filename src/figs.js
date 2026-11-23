/* ================= FIGURE CATALOG (object figs: {k:"…", …}; see SPEC.md) ================= */
const PAL = ["#1e88e5","#e53935","#43a047","#fb8c00","#8e24aa","#00897b","#c0a000","#6d4c41","#d81b60","#3949ab"];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const lbl = v => esc(texPlain(tx(v)));
const PANEL_L = "ABCDEFGH";
function gauss(r){ let u=0; for(let i=0;i<6;i++) u+=r(); return (u-3)/Math.sqrt(.5); }
function niceTicks(a, b, n){
  const span = (b-a) || 1, raw = span/n, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw/mag;
  const step = (f<1.5?1:f<3?2:f<7?5:10)*mag, out = [];
  for(let v = Math.floor(a/step+1e-9)*step; v <= b + step*.5 - 1e-12 || out.length < 2; v += step){ out.push(+v.toFixed(10)); if(out.length > 40) break; }
  if(out[out.length-1] < b - 1e-12) out.push(+(out[out.length-1]+step).toFixed(10));
  return out;
}
const numFmt = v => { const a = Math.abs(v); return a>=1000 ? String(Math.round(v)) : a>=10 ? String(+v.toFixed(1)) : String(+v.toFixed(a>=1?2:3)); };
function svgOpen(W, H, label){ return `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${esc(label)}" font-family="system-ui,sans-serif">`; }
function figColors(){ return {fg:css("--text"), mu:css("--muted"), bg:css("--panel-solid"), acc:css("--accent")}; }

/* ---------- shared helpers ---------- */
const isNum = v => typeof v === "number" && Number.isFinite(v);
const nv = v => { const n = typeof v === "number" ? v : (typeof v === "string" && v.trim() !== "" ? Number(v.trim().replace(",", ".")) : NaN); return Number.isFinite(n) ? n : null; };
const numsOf = a => (Array.isArray(a) ? a : []).map(nv).filter(v => v !== null);
const r1 = v => String(Math.round(v*10)/10);
const hint = (v, def, lo, hi) => isNum(v) ? Math.max(lo, Math.min(hi, v)) : def;
const isEn = () => typeof S !== "undefined" && S && S.lang === "en";
const tw = (s, fs = 11) => String(s ?? "").length * fs * 0.56;           // rough text width
const halo = C => `stroke="${C.bg}" stroke-width="3.5" stroke-linejoin="round" paint-order="stroke"`;
let FIG_UID = 0; const figUid = () => "fg" + (++FIG_UID).toString(36);
// Figures cannot render KaTeX, so turn simple $…$ LaTeX into plain Unicode text.
const TEXMAP = {"\\cap":"∩","\\cup":"∪","\\mid":"|","\\mu":"μ","\\sigma":"σ","\\lambda":"λ","\\alpha":"α","\\beta":"β","\\theta":"θ","\\leq":"≤","\\geq":"≥","\\le":"≤","\\ge":"≥","\\neq":"≠","\\approx":"≈","\\cdot":"·","\\times":"×","\\infty":"∞","\\pm":"±","\\emptyset":"∅","\\varnothing":"∅","\\Omega":"Ω","\\varepsilon":"ε","\\epsilon":"ε","\\chi":"χ","\\nu":"ν","\\Phi":"Φ","\\phi":"φ","\\rho":"ρ","\\delta":"δ","\\Delta":"Δ","\\gamma":"γ","\\tau":"τ","\\eta":"η","\\left":"","\\right":"","\\quad":" ","\\to":"→","\\rightarrow":"→","\\sim":"~","\\in":"∈","\\sum":"Σ","\\prime":"′","\\ldots":"…","\\dots":"…"};
function texPlain(s){
  s = String(s ?? "");
  if(s.indexOf("$") < 0 && s.indexOf("\\") < 0) return s;
  const ov = (a, mark) => a.split("").map(c => c + mark).join("");
  return s.replace(/\$/g, "")
    .replace(/\\(?:overline|bar)\{([^{}]*)\}/g, (m, a) => ov(a, "̅"))
    .replace(/\\hat\{([^{}]*)\}/g, (m, a) => ov(a, "̂"))
    .replace(/\\(?:text|mathrm|mathbf|mathit|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2")
    .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)")
    .replace(/\\[,;:! ]/g, " ")
    .replace(/\\[a-zA-Z]+/g, m => TEXMAP[m] ?? m.slice(1))
    .replace(/\{,\}/g, ",")
    .replace(/\^\{?c\}?/g, "ᶜ")
    .replace(/_\{?([0-9])\}?/g, (m, d) => "₀₁₂₃₄₅₆₇₈₉"[d])
    .replace(/\^\{?([0-9])\}?/g, (m, d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d])
    .replace(/[{}]/g, "");
}
const ftx = v => esc(texPlain(tx(v)));                                    // figure text (escaped)
// value shown inside a diagram (Venn region, tree branch): numbers get a decimal comma in Norwegian
const valTxt = v => typeof v === "number" ? (isFinite(v) ? (s => isEn() ? s : s.replace(".", ","))(String(+v.toFixed(6))) : "") : texPlain(tx(v));
function tickFmt(step){
  const d = Math.max(0, Math.min(8, -Math.floor(Math.log10(step) + 1e-9)));
  return v => { if(Math.abs(v) < step*1e-6) v = 0; return Math.abs(v) >= 1e6 ? String(Math.round(v)) : v.toFixed(d); };
}
const plainNum = v => String(+(+v).toFixed(6));
// axis description: domain + ticks [{v,s}]
function axisSpec(min, max, n, opt = {}){
  if(!(isNum(min) && isNum(max))){ min = 0; max = 1; }
  if(max < min) [min, max] = [max, min];
  if(max - min < 1e-12){ const d = Math.abs(min)*0.1 || 1; min -= d; max += d; }
  const ticks = niceTicks(min, max, n), step = ticks.length > 1 ? ticks[1]-ticks[0] : (max-min);
  if(opt.snap){ min = Math.min(min, ticks[0]); max = Math.max(max, ticks[ticks.length-1]); }
  const fmt = tickFmt(step);
  let t = ticks.filter(v => v >= min - step*1e-6 && v <= max + step*1e-6).map(v => ({v, s: fmt(v)}));
  if(Array.isArray(opt.user)){ const u = numsOf(opt.user).filter(v => v >= min - 1e-9 && v <= max + 1e-9); if(u.length) t = u.map(v => ({v, s: plainNum(v)})); }
  return {d: [min, max], t};
}
const padRange = (lo, hi, frac = 0.06) => { if(hi - lo < 1e-12){ const d = Math.abs(lo)*0.1 || 1; return [lo-d, hi+d]; } const p = (hi-lo)*frac; return [lo-p, hi+p]; };
function rangeOf(r){ if(!Array.isArray(r) || r.length < 2) return null; const a = nv(r[0]), b = nv(r[1]); if(a === null || b === null || a === b) return null; return a < b ? [a, b] : [b, a]; }
// thin out category/point ticks so labels do not collide
function thinTicks(t, pxPer){ if(!t.length) return t; const maxW = Math.max(...t.map(o => tw(o.s, 11))) + 6, every = Math.max(1, Math.ceil(maxW / Math.max(1, pxPer))); return t.filter((o, i) => i % every === 0); }

function figEmpty(f){
  const C = figColors();
  return svgOpen(300, 70, "figure") + `<text x="150" y="40" font-size="13" text-anchor="middle" fill="${C.mu}">${isEn() ? "(no data)" : "(ingen data)"}</text></svg>`;
}
function legendItem(C, e, x, y){
  const c = e.color || C.fg; let g;
  if(e.type === "box") g = `<rect x="${x}" y="${y-5}" width="14" height="10" rx="2" fill="${c}" fill-opacity="${e.op ?? .45}" stroke="${c}"/>`;
  else if(e.type === "dot") g = `<circle cx="${x+7}" cy="${y}" r="3.6" fill="${c}"/>`;
  else g = `<line x1="${x}" x2="${x+16}" y1="${y}" y2="${y}" stroke="${c}" stroke-width="2.6" ${e.dash ? 'stroke-dasharray="5 3"' : ""}/>`;
  return g + `<text x="${x+21}" y="${y+4}" font-size="11.5" fill="${C.fg}">${ftx(e.name)}</text>`;
}
/* Cartesian frame: grid, ticks, axes, labels, legend, title. o: {xd,yd,xt,yt,xLabel,yLabel,legend,W,H,plotH,gridX,gridY,noY,L,xRot} */
function figFrame(f, o){
  const C = figColors(), title = tx(f.title) ? ftx(f.title) : "";
  const xl = ftx(f.xLabel != null ? f.xLabel : o.xLabel), yl = o.noY ? "" : ftx(f.yLabel != null ? f.yLabel : o.yLabel);
  const W = Math.round(hint(f.w, o.W || 460, 260, 820));
  const leg = (o.legend || []).filter(e => e && texPlain(tx(e.name)).length), rows = [];
  { let cx = 0, row = []; leg.forEach(e => { const w = 34 + tw(texPlain(tx(e.name)), 11.5); if(row.length && cx + w > W - 30){ rows.push(row); row = []; cx = 0; } row.push({e, dx: cx}); cx += w; }); if(row.length) rows.push(row); }
  const legH = rows.length * 17, T = 12 + (title ? 20 : 0) + (legH ? legH + 4 : 0);
  const xt = o.xt || [], yt = o.noY ? [] : (o.yt || []);
  const yTickW = yt.length ? Math.max(...yt.map(t => tw(t.s, 11))) : 0;
  const L = o.L ?? Math.round(Math.max(30, (yl ? 22 : 6) + yTickW + 10)), R = o.R ?? 18;
  const B = (o.xRot ? 46 : 24) + (xl ? 18 : 0);
  const plotH = Math.round(o.plotH ?? (hint(f.h, o.H || 290, 160, 700) - 70)), H = Math.round(T + plotH + B), bot = T + plotH;
  const [x0, x1] = o.xd, [y0, y1] = o.yd, pw = W - L - R;
  const X = v => L + (v - x0) / ((x1 - x0) || 1) * pw, Y = v => bot - (v - y0) / ((y1 - y0) || 1) * plotH;
  const id = figUid();
  let s = svgOpen(W, H, texPlain(tx(f.title)) || o.aria || f.k || "figure") + `<defs><clipPath id="${id}"><rect x="${L}" y="${T}" width="${pw}" height="${plotH}"/></clipPath></defs>`;
  if(o.gridY !== false) yt.forEach(t => { const y = r1(Y(t.v)); s += `<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="${C.mu}" stroke-opacity=".2"/>`; });
  if(o.gridX) xt.forEach(t => { const x = r1(X(t.v)); s += `<line x1="${x}" x2="${x}" y1="${T}" y2="${bot}" stroke="${C.mu}" stroke-opacity=".14"/>`; });
  yt.forEach(t => { const y = Y(t.v); s += `<text x="${L-6}" y="${r1(y+4)}" font-size="11" text-anchor="end" fill="${C.mu}">${esc(t.s)}</text>`; });
  xt.forEach(t => { const x = r1(X(t.v)); s += `<line x1="${x}" x2="${x}" y1="${bot}" y2="${bot+4}" stroke="${C.mu}"/>`
    + (o.xRot ? `<text x="${x}" y="${bot+14}" font-size="11" text-anchor="end" fill="${C.fg}" transform="rotate(-35 ${x} ${bot+14})">${esc(t.s)}</text>` : `<text x="${x}" y="${bot+16}" font-size="11" text-anchor="middle" fill="${o.xCat ? C.fg : C.mu}">${esc(t.s)}</text>`); });
  s += `<line x1="${L}" x2="${W-R}" y1="${bot}" y2="${bot}" stroke="${C.mu}"/>` + (o.noY ? "" : `<line x1="${L}" x2="${L}" y1="${T}" y2="${bot}" stroke="${C.mu}"/>`);
  const end = () => {
    let e = "";
    rows.forEach((row, ri) => { const y = 12 + (title ? 20 : 0) + ri*17 + 5; row.forEach(it => e += legendItem(C, it.e, L + it.dx, y)); });
    if(title) e += `<text x="${W/2}" y="18" font-size="13" font-weight="600" text-anchor="middle" fill="${C.fg}">${title}</text>`;
    if(xl) e += `<text x="${r1((L+W-R)/2)}" y="${H-7}" font-size="12" text-anchor="middle" fill="${C.fg}">${xl}</text>`;
    if(yl) e += `<text x="13" y="${r1((T+bot)/2)}" font-size="12" text-anchor="middle" fill="${C.fg}" transform="rotate(-90 13 ${r1((T+bot)/2)})">${yl}</text>`;
    return e + `</svg>`;
  };
  return {C, W, H, L, R, T, B, bot, plotH, X, Y, x0, x1, y0, y1, clip: `clip-path="url(#${id})"`, s, end};
}
// polyline of data points, y clamped well outside the plot (the clipPath hides the overflow)
function polyPts(fr, pts){
  const span = fr.y1 - fr.y0, lo = fr.y0 - span, hi = fr.y1 + span;
  return pts.filter(p => !Number.isNaN(p[1]) && isNum(p[0])).map(p => r1(fr.X(p[0])) + "," + r1(fr.Y(Math.max(lo, Math.min(hi, p[1]))))).join(" ");
}
// marks:[x | [x,"label"]] -> dashed vertical lines
function drawMarks(fr, marks){
  let s = ""; if(!Array.isArray(marks)) marks = marks != null ? [marks] : [];
  marks.forEach(m => { const x = nv(Array.isArray(m) ? m[0] : m), t = Array.isArray(m) ? m[1] : null; if(x === null || x < fr.x0 || x > fr.x1) return;
    const px = r1(fr.X(x)); s += `<line x1="${px}" x2="${px}" y1="${fr.T}" y2="${fr.bot}" stroke="${fr.C.acc}" stroke-dasharray="5 4" stroke-width="1.6"/>`;
    if(t != null && texPlain(tx(t))) s += `<text x="${r1(fr.X(x)+4)}" y="${fr.T+12}" font-size="11.5" fill="${fr.C.acc}" ${halo(fr.C)}>${ftx(t)}</text>`; });
  return s;
}

/* ---------- distributions (for pdf/cdf/hist overlays) ---------- */
function gammaP(a, x){ // regularized lower incomplete gamma
  if(x <= 0) return 0; const gln = ST.lnGamma(a);
  if(x < a + 1){ let ap = a, sum = 1/a, del = sum; for(let n = 0; n < 500; n++){ ap++; del *= x/ap; sum += del; if(Math.abs(del) < Math.abs(sum)*1e-14) break; } return Math.min(1, sum*Math.exp(-x + a*Math.log(x) - gln)); }
  let b = x + 1 - a, c = 1e300, d = 1/b, h = d;
  for(let i = 1; i < 500; i++){ const an = -i*(i-a); b += 2; d = an*d + b; if(Math.abs(d) < 1e-300) d = 1e-300; c = b + an/c; if(Math.abs(c) < 1e-300) c = 1e-300; d = 1/d; const del = d*c; h *= del; if(Math.abs(del-1) < 1e-14) break; }
  return Math.max(0, 1 - Math.exp(-x + a*Math.log(x) - gln)*h);
}
function distOf(c){
  if(!c || typeof c !== "object") return null;
  const pos = (v, def) => { const n = nv(v); return n !== null && n > 0 ? n : def; }, num = (v, def) => { const n = nv(v); return n !== null ? n : def; };
  switch(String(c.dist || "norm").toLowerCase()){
    case "norm": case "normal": { const m = num(c.mu ?? c.mean, 0), s = pos(c.sigma ?? c.sd, 1);
      return {pdf: x => ST.normPdf(x, m, s), cdf: x => ST.Phi((x-m)/s), range: [m-4*s, m+4*s], br: []}; }
    case "exp": { const l = pos(c.lambda ?? c.rate, 1);
      return {pdf: x => x < 0 ? 0 : l*Math.exp(-l*x), cdf: x => x < 0 ? 0 : 1 - Math.exp(-l*x), range: [0, 5/l], br: [0]}; }
    case "t": { const v = pos(c.df ?? c.nu, 10);
      return {pdf: x => ST.tPdf(x, v), cdf: x => ST.tCdf(x, v), range: [-4.5, 4.5], br: []}; }
    case "weibull": { const k = pos(c.k, 1), l = pos(c.lambda ?? c.scale, 1);
      return {pdf: x => x < 0 ? 0 : x === 0 ? (k < 1 ? Infinity : k === 1 ? 1/l : 0) : (k/l)*Math.pow(x/l, k-1)*Math.exp(-Math.pow(x/l, k)),
              cdf: x => x <= 0 ? 0 : 1 - Math.exp(-Math.pow(x/l, k)), range: [0, l*Math.pow(3, 1/k)*1.5], br: [0], sing: k < 1}; }
    case "unif": case "uniform": { const a = num(c.a, 0); let b = num(c.b, a + 1); if(b <= a) b = a + 1; const h = 1/(b-a), w = b - a;
      return {pdf: x => (x < a || x > b) ? 0 : h, cdf: x => x <= a ? 0 : x >= b ? 1 : (x-a)*h, range: [a-.1*w, b+.1*w], br: [a, b]}; }
    case "chisq": case "chi2": { const k = pos(c.df, 1), lnc = -(k/2)*Math.LN2 - ST.lnGamma(k/2);
      return {pdf: x => x < 0 ? 0 : x === 0 ? (k < 2 ? Infinity : k === 2 ? .5 : 0) : Math.exp((k/2-1)*Math.log(x) - x/2 + lnc),
              cdf: x => gammaP(k/2, x/2), range: [0, k + 5*Math.sqrt(2*k)], br: [0], sing: k < 2}; }
    case "custom": {
      const xs = Array.isArray(c.xs) ? c.xs : [], ys = Array.isArray(c.ys) ? c.ys : [], P = [];
      for(let i = 0; i < Math.min(xs.length, ys.length); i++){ const x = nv(xs[i]), y = nv(ys[i]); if(x !== null && y !== null) P.push([x, y]); }
      P.sort((p, q) => p[0] - q[0]); if(P.length < 2) return null;
      const interp = (x, out) => { if(x < P[0][0]) return out ? P[0][1] : 0; if(x > P[P.length-1][0]) return out ? P[P.length-1][1] : 0;
        let i = 1; while(i < P.length - 1 && P[i][0] < x) i++; const [xa, ya] = P[i-1], [xb, yb] = P[i]; return xb === xa ? yb : ya + (yb-ya)*(x-xa)/(xb-xa); };
      return {pdf: x => interp(x, false), cdf: x => interp(x, true), range: [P[0][0], P[P.length-1][0]], br: P.map(p => p[0]), custom: true}; }
    default: return null;
  }
}
function curvesOf(f){
  let cs = Array.isArray(f.curves) ? f.curves : f.curve ? [].concat(f.curve) : f.dist ? [f] : [];
  return cs.map(c => ({c, d: distOf(c)})).filter(o => o.d);
}
function sampleFn(fn, br, x0, x1, n){
  const eps = (x1 - x0)*1e-7, xs = [];
  for(let i = 0; i <= n; i++) xs.push(x0 + (x1 - x0)*i/n);
  (br || []).forEach(b => { if(b > x0 && b < x1) xs.push(b - eps, b, b + eps); });
  xs.sort((a, b) => a - b);
  return xs.map(x => { let y; try{ y = fn(x); }catch(e){ y = NaN; } return [x, typeof y === "number" ? y : NaN]; }).filter(p => !Number.isNaN(p[1]));
}
function shadeList(sh){
  if(!Array.isArray(sh) || !sh.length) return [];
  if(!Array.isArray(sh[0])) sh = [sh];
  return sh.filter(Array.isArray).map(p => { const a = p[0] == null ? -Infinity : nv(p[0]), b = p[1] == null ? Infinity : nv(p[1]); if(a === null || b === null) return null; return a <= b ? [a, b] : [b, a]; }).filter(Boolean);
}

/* ---------- pdf / continuous cdf ---------- */
function figDensity(f, cum){
  const cs = curvesOf(f); if(!cs.length) return figEmpty(f);
  const fnOf = o => cum ? o.d.cdf : o.d.pdf;
  let xr = rangeOf(f.range) || rangeOf(f.xRange);
  if(!xr){ xr = [Math.min(...cs.map(o => o.d.range[0])), Math.max(...cs.map(o => o.d.range[1]))]; if(!(xr[1] > xr[0])) xr = [xr[0] - 1, xr[0] + 1]; }
  const [x0, x1] = xr, span = x1 - x0, N = 180;
  const samples = cs.map(o => sampleFn(fnOf(o), o.d.br, x0, x1, N));
  let ymax = 0;
  samples.forEach((pts, i) => pts.forEach(p => { if(cs[i].d.sing && !cum && p[0] < 0.05*span) return; if(isNum(p[1]) && p[1] > ymax) ymax = p[1]; }));
  if(!(ymax > 0)) ymax = 1;
  const yr = rangeOf(f.yRange), ya = cum ? axisSpec(0, Math.max(1, ymax), 5, {snap: true}) : yr ? axisSpec(yr[0], yr[1], 5) : axisSpec(0, ymax*1.06, 5, {snap: true});
  const xa = axisSpec(x0, x1, 8, {user: f.xTicks});
  const named = cs.length > 1 || cs.some(o => o.c.name);
  const legend = named ? cs.map((o, i) => ({name: o.c.name ?? (o.c.dist || "") + (i ? " " + (i+1) : ""), color: o.c.color || PAL[i % PAL.length], dash: !!o.c.dash})) : [];
  const fr = figFrame(f, {xd: [x0, x1], yd: ya.d, xt: thinTicks(xa.t, 460/Math.max(1, xa.t.length)), yt: ya.t, xLabel: "x", yLabel: cum ? "F(x)" : "f(x)", legend, aria: cum ? "cdf" : "density"});
  let s = fr.s;
  if(!cum){ const col = cs[0].c.color || PAL[0], fn0 = fnOf(cs[0]);
    shadeList(f.shade).forEach(([a, b]) => { a = Math.max(a, x0); b = Math.min(b, x1); if(!(b > a)) return;
      const pts = sampleFn(fn0, cs[0].d.br, a, b, Math.max(20, Math.round(N*(b-a)/span)));
      s += `<polygon ${fr.clip} fill="${col}" fill-opacity=".32" stroke="none" points="${r1(fr.X(a))},${r1(fr.Y(0))} ${polyPts(fr, pts)} ${r1(fr.X(b))},${r1(fr.Y(0))}"/>`; }); }
  samples.forEach((pts, i) => { const c = cs[i].c; s += `<polyline ${fr.clip} fill="none" stroke="${c.color || PAL[i % PAL.length]}" stroke-width="2.4" stroke-linejoin="round" ${c.dash ? 'stroke-dasharray="7 4"' : ""} points="${polyPts(fr, pts)}"/>`; });
  s += drawMarks(fr, f.marks);
  (Array.isArray(f.labels) ? f.labels : []).forEach(l => { if(!Array.isArray(l)) return; const x = nv(l[0]); if(x === null || x < x0 || x > x1) return;
    let y = nv(l[2]); let py; if(y !== null) py = fr.Y(y); else { const v = fnOf(cs[0])(x); py = fr.Y(isNum(v) ? Math.min(v, fr.y1) : fr.y0) - 10; }
    py = Math.max(fr.T + 12, Math.min(fr.bot - 4, py));
    const px = Math.max(fr.L + 4, Math.min(fr.W - fr.R - 4, fr.X(x))), txt = texPlain(tx(l[1])), anchor = px - tw(txt, 12)/2 < fr.L ? "start" : px + tw(txt, 12)/2 > fr.W - fr.R ? "end" : "middle";
    s += `<text x="${r1(px)}" y="${r1(py)}" font-size="12" text-anchor="${anchor}" fill="${fr.C.fg}" ${halo(fr.C)}>${esc(txt)}</text>`; });
  return s + fr.end();
}
function figPdf(f){ return figDensity(f, false); }

/* ---------- step cdf (discrete) ---------- */
function pairsXP(f){
  const ps = Array.isArray(f.ps) ? f.ps : [], xs = Array.isArray(f.xs) ? f.xs : ps.map((_, i) => i), P = [];
  for(let i = 0; i < Math.min(xs.length, ps.length); i++){ const x = nv(xs[i]), p = nv(ps[i]); if(x !== null && p !== null) P.push([x, p]); }
  return P.sort((a, b) => a[0] - b[0]);
}
function figStep(f, P, isCdf){
  if(!P.length) return figEmpty(f);
  const vals = P.map(p => p[1]), sum = vals.reduce((a, b) => a + b, 0), mono = vals.every((v, i) => !i || v >= vals[i-1] - 1e-12);
  if(isCdf == null) isCdf = mono && sum > 1 + 1e-6 && vals[vals.length-1] <= 1 + 1e-6;
  let acc = 0; const F = P.map(p => isCdf ? p[1] : (acc += p[1]));
  const xs = P.map(p => p[0]), n = xs.length, gap = n > 1 ? (xs[n-1] - xs[0])/(n-1) : 1;
  const xr = rangeOf(f.range) || [xs[0] - gap, xs[n-1] + gap];
  const ya = axisSpec(0, Math.max(1, ...F), 5, {snap: true});
  let xa = n <= 25 ? {t: xs.filter(x => x >= xr[0] && x <= xr[1]).map(v => ({v, s: plainNum(v)}))} : axisSpec(xr[0], xr[1], 8);
  if(f.xTicks) xa = axisSpec(xr[0], xr[1], 8, {user: f.xTicks});
  const fr = figFrame(f, {xd: xr, yd: ya.d, xt: thinTicks(xa.t, 420/Math.max(1, xa.t.length)), yt: ya.t, xLabel: "x", yLabel: "F(x)", aria: "cdf"});
  const c = PAL[0], C = fr.C; let s = fr.s, seg = "", dots = "";
  const line = (xa_, xb, y) => { const a = Math.max(xa_, xr[0]), b = Math.min(xb, xr[1]); if(b > a) seg += `<line x1="${r1(fr.X(a))}" x2="${r1(fr.X(b))}" y1="${r1(fr.Y(y))}" y2="${r1(fr.Y(y))}" stroke="${c}" stroke-width="2.4"/>`; };
  const dot = (x, y, open) => { if(x < xr[0] || x > xr[1]) return; dots += `<circle cx="${r1(fr.X(x))}" cy="${r1(fr.Y(y))}" r="3.6" fill="${open ? C.bg : c}" stroke="${c}" stroke-width="1.6"/>`; };
  line(xr[0], xs[0], 0); dot(xs[0], 0, true);
  for(let i = 0; i < n; i++){ const nx = i < n-1 ? xs[i+1] : xr[1]; line(xs[i], nx, F[i]); dot(xs[i], F[i], false); if(i < n-1) dot(nx, F[i], true); }
  return s + seg + dots + drawMarks(fr, f.marks) + fr.end();
}
function figCdf(f){
  if(curvesOf(f).length) return figDensity(f, true);
  return figStep(f, pairsXP(f), f.isCdf);
}

/* ---------- pmf ---------- */
function figPmf(f){
  const P = pairsXP(f); if(!P.length) return figEmpty(f);
  if(f.cum) return figStep(f, P, false);
  const xs = P.map(p => p[0]), n = xs.length;
  let gap = 1; if(n > 1){ gap = Infinity; for(let i = 1; i < n; i++) if(xs[i] - xs[i-1] > 1e-12) gap = Math.min(gap, xs[i] - xs[i-1]); if(!isFinite(gap)) gap = 1; }
  const xr = rangeOf(f.range) || [xs[0] - .7*gap, xs[n-1] + .7*gap];
  const ya = axisSpec(0, Math.max(...P.map(p => p[1]), 1e-9)*1.04, 5, {snap: true});
  let xa = n <= 30 ? {t: xs.map(v => ({v, s: plainNum(v)}))} : axisSpec(xr[0], xr[1], 8);
  if(f.xTicks) xa = axisSpec(xr[0], xr[1], 8, {user: f.xTicks});
  const fr0W = hint(f.w, 460, 260, 820);
  const fr = figFrame(f, {xd: xr, yd: ya.d, xt: thinTicks(xa.t.filter(t => t.v >= xr[0] && t.v <= xr[1]), (fr0W - 70)/Math.max(1, xa.t.length)), yt: ya.t, xLabel: "x", yLabel: "P(X = x)", aria: "pmf"});
  const hl = numsOf(f.hl), isH = x => hl.some(h => Math.abs(h - x) < 1e-9), pxGap = Math.abs(fr.X(xr[0] + gap) - fr.X(xr[0]));
  const bw = Math.max(2.5, Math.min(46, pxGap*.62));
  let s = fr.s;
  P.forEach(([x, p]) => { if(x < xr[0] || x > xr[1]) return; const cx = fr.X(x), y = fr.Y(Math.max(0, p)), h = isH(x);
    s += `<rect x="${r1(cx - bw/2)}" y="${r1(y)}" width="${r1(bw)}" height="${r1(Math.max(0, fr.bot - y))}" fill="${h ? PAL[1] : PAL[0]}" fill-opacity="${h ? .9 : .78}"/>`;
    if(f.vals) s += `<text x="${r1(cx)}" y="${r1(y - 4)}" font-size="10" text-anchor="middle" fill="${fr.C.fg}">${esc(valTxt(p))}</text>`; });
  return s + drawMarks(fr, f.marks) + fr.end();
}

/* ---------- histogram ---------- */
function figHist(f){
  const data = numsOf(f.data); let bins = [];
  if(Array.isArray(f.bins) && f.bins.length){
    bins = f.bins.map(b => Array.isArray(b) ? [nv(b[0]), nv(b[1]), nv(b[2])] : null).filter(b => b && b[0] !== null && b[1] !== null && b[2] !== null && b[1] > b[0] && b[2] >= 0);
  } else if(data.length){
    const mn = Math.min(...data), mx = Math.max(...data);
    let bw = nv(f.binWidth); if(!(bw > 0)){ const k = Math.ceil(Math.log2(data.length) + 1), raw = (mx - mn)/k || 1, mag = Math.pow(10, Math.floor(Math.log10(raw))), q = raw/mag; bw = (q < 1.5 ? 1 : q < 3 ? 2 : q < 7 ? 5 : 10)*mag; }
    let st = nv(f.start); if(st === null) st = Math.floor(mn/bw + 1e-9)*bw; if(st > mn) st -= Math.ceil((st - mn)/bw - 1e-9)*bw;
    const m = Math.min(400, Math.floor((mx - st)/bw + 1e-9) + 1), cnt = Array(m).fill(0);
    data.forEach(v => { const i = Math.floor((v - st)/bw + 1e-9); if(i >= 0 && i < m) cnt[i]++; });
    bins = cnt.map((c, i) => [+(st + i*bw).toFixed(10), +(st + (i+1)*bw).toFixed(10), c]);
  }
  if(!bins.length) return figEmpty(f);
  bins.sort((a, b) => a[0] - b[0]);
  const n = bins.reduce((a, b) => a + b[2], 0) || 1, dens = !!f.density, hgt = b => dens ? b[2]/(n*(b[1]-b[0])) : b[2];
  const lo = bins[0][0], hi = bins[bins.length-1][1], pad = (hi - lo)*.03, xr = rangeOf(f.range) || [lo - pad, hi + pad];
  // overlay curve(s)
  const curves = (f.curve ? [].concat(f.curve) : []).filter(c => c && typeof c === "object").map(c => {
    c = Object.assign({}, c);
    if(String(c.dist || "norm").startsWith("norm") && (nv(c.mu) === null || nv(c.sigma) === null)){
      const vals = data.length ? data.map(v => [v, 1]) : bins.map(b => [(b[0]+b[1])/2, b[2]]), W = vals.reduce((a, v) => a + v[1], 0) || 1;
      const m = vals.reduce((a, v) => a + v[0]*v[1], 0)/W, sd = Math.sqrt(vals.reduce((a, v) => a + v[1]*(v[0]-m)**2, 0)/Math.max(1, W - 1)) || 1;
      if(nv(c.mu) === null) c.mu = m; if(nv(c.sigma) === null) c.sigma = sd; }
    return {c, d: distOf(c)}; }).filter(o => o.d);
  const scale = dens ? 1 : n*(bins[0][1] - bins[0][0]);
  const cpts = curves.map(o => sampleFn(x => o.d.pdf(x)*scale, o.d.br, xr[0], xr[1], 160));
  let ymax = Math.max(...bins.map(hgt)); cpts.forEach(p => p.forEach(q => { if(isNum(q[1]) && q[1] > ymax) ymax = q[1]; }));
  const ya = axisSpec(0, ymax > 0 ? ymax*1.03 : 1, 5, {snap: true});
  const edges = [...new Set(bins.flatMap(b => [b[0], b[1]]))].sort((a, b) => a - b);
  let xa = edges.length <= 17 ? {t: edges.map(v => ({v, s: plainNum(v)}))} : axisSpec(xr[0], xr[1], 8);
  if(f.xTicks) xa = axisSpec(xr[0], xr[1], 8, {user: f.xTicks});
  const legend = curves.some(o => o.c.name) ? curves.map((o, i) => ({name: o.c.name, color: PAL[(i+1) % PAL.length]})) : [];
  const fr = figFrame(f, {xd: xr, yd: ya.d, xt: thinTicks(xa.t, 420/Math.max(1, xa.t.length)), yt: ya.t, xLabel: "x", yLabel: dens ? (isEn() ? "Density" : "Tetthet") : (isEn() ? "Count" : "Antall"), legend, aria: "histogram"});
  let s = fr.s;
  bins.forEach(b => { const xa_ = fr.X(b[0]), xb = fr.X(b[1]), y = fr.Y(hgt(b));
    s += `<rect ${fr.clip} x="${r1(xa_)}" y="${r1(y)}" width="${r1(Math.max(0, xb - xa_))}" height="${r1(Math.max(0, fr.bot - y))}" fill="${PAL[0]}" fill-opacity=".72" stroke="${fr.C.fg}" stroke-opacity=".55" stroke-width=".8"/>`;
    if(f.vals && b[2] > 0) s += `<text x="${r1((xa_+xb)/2)}" y="${r1(y-4)}" font-size="10" text-anchor="middle" fill="${fr.C.fg}">${esc(valTxt(dens ? +hgt(b).toFixed(4) : b[2]))}</text>`; });
  cpts.forEach((p, i) => s += `<polyline ${fr.clip} fill="none" stroke="${PAL[(i+1) % PAL.length]}" stroke-width="2.4" points="${polyPts(fr, p)}"/>`);
  return s + drawMarks(fr, f.marks) + fr.end();
}

/* ---------- box plot ---------- */
function quartiles(d, method){
  const n = d.length, med = n % 2 ? d[(n-1)/2] : (d[n/2-1] + d[n/2])/2;
  const at = pos => { pos = Math.max(1, Math.min(n, pos)); const i = Math.floor(pos), fr = pos - i; return i >= n ? d[n-1] : d[i-1] + fr*(d[i] - d[i-1]); };
  const m = String(method || "").toLowerCase();
  if(m === "vekting" || m === "weighted" || m === "n+1") return [at(.25*(n+1)), med, at(.75*(n+1))];
  if(m === "numpy" || m === "linear" || m === "python") return [at(1 + .25*(n-1)), med, at(1 + .75*(n-1))];
  if(n < 2) return [med, med, med];
  const h = Math.floor(n/2), mid = a => a.length % 2 ? a[(a.length-1)/2] : (a[a.length/2-1] + a[a.length/2])/2;
  return [mid(d.slice(0, h)), med, mid(d.slice(n - h))];   // "enkel metode": median of lower/upper half (median excluded when n is odd)
}
function boxStats(g, f){
  if(!g || typeof g !== "object") return null;
  const d = numsOf(g.data).sort((a, b) => a - b), whiskRange = f.whiskers === "range" || g.whiskers === "range";
  if(d.length){
    const [q1, med, q3] = quartiles(d, g.qMethod || f.qMethod), iqr = q3 - q1, lf = q1 - 1.5*iqr, uf = q3 + 1.5*iqr;
    const inside = whiskRange ? d : d.filter(v => v >= lf - 1e-12 && v <= uf + 1e-12);
    return {name: g.name, q1, med, q3, lo: Math.min(...inside, q1), hi: Math.max(...inside, q3), out: whiskRange ? [] : d.filter(v => v < lf - 1e-12 || v > uf + 1e-12), mean: g.showMean || f.showMean ? d.reduce((a, b) => a + b, 0)/d.length : nv(g.mean)};
  }
  let q1 = nv(g.q1), med = nv(g.med ?? g.median), q3 = nv(g.q3), lo = nv(g.min), hi = nv(g.max);
  if(med === null) med = q1 !== null && q3 !== null ? (q1 + q3)/2 : (q1 ?? q3);
  if(med === null) return null;
  if(q1 === null) q1 = med; if(q3 === null) q3 = med;
  if(lo === null) lo = Math.min(q1, med); if(hi === null) hi = Math.max(q3, med);
  return {name: g.name, q1, med, q3, lo, hi, out: numsOf(g.out), mean: nv(g.mean)};
}
function figBox(f){
  let groups = Array.isArray(f.groups) ? f.groups : (f.data || f.q1 != null || f.med != null) ? [f] : [];
  const st = groups.map(g => boxStats(g, f)).filter(Boolean); if(!st.length) return figEmpty(f);
  const n = st.length, horiz = f.horizontal !== false, names = st.map(b => texPlain(tx(b.name))), hasNames = names.some(Boolean);
  const all = st.flatMap(b => [b.lo, b.hi, b.q1, b.q3, b.med, ...b.out]);
  const vr = rangeOf(f.range) || padRange(Math.min(...all), Math.max(...all), .06);
  const va = axisSpec(vr[0], vr[1], 7, {user: f.ticks || (horiz ? f.xTicks : f.yTicks)});
  const cats = st.map((b, i) => ({v: horiz ? n - i - .5 : i + .5, s: names[i]}));
  let fr;
  if(horiz){
    const L = (hasNames ? Math.round(Math.min(160, Math.max(...names.map(s => tw(s, 11.5)))) + 16) : 14) + (tx(f.yLabel) ? 22 : 0);
    fr = figFrame(f, {xd: va.d, yd: [0, n], xt: va.t, yt: [], plotH: Math.max(70, n*52), gridX: true, gridY: false, L, aria: "box plot"});
    if(hasNames) cats.forEach(c => fr.s += `<text x="${fr.L - 8}" y="${r1(fr.Y(c.v) + 4)}" font-size="11.5" text-anchor="end" fill="${fr.C.fg}">${esc(c.s)}</text>`);
  } else {
    const W = hint(f.w, Math.max(260, Math.min(620, 110 + n*90)), 220, 820);
    fr = figFrame(Object.assign({}, f, {w: W}), {xd: [0, n], yd: va.d, xt: hasNames ? cats : [], yt: va.t, xCat: true, aria: "box plot"});
  }
  const C = fr.C, V = horiz ? fr.X : fr.Y, band = horiz ? fr.plotH/n : (fr.W - fr.L - fr.R)/n, bh = Math.min(30, band*.45);
  let s = fr.s;
  st.forEach((b, i) => {
    const col = PAL[i % PAL.length], c = horiz ? fr.Y(cats[i].v) : fr.X(cats[i].v);
    const seg = (v1, v2, c1, c2, extra = "") => horiz ? `<line x1="${r1(V(v1))}" x2="${r1(V(v2))}" y1="${r1(c1)}" y2="${r1(c2)}" ${extra}/>` : `<line y1="${r1(V(v1))}" y2="${r1(V(v2))}" x1="${r1(c1)}" x2="${r1(c2)}" ${extra}/>`;
    const st_ = `stroke="${col}" stroke-width="1.8"`;
    s += seg(b.lo, b.q1, c, c, st_) + seg(b.q3, b.hi, c, c, st_) + seg(b.lo, b.lo, c - bh*.35, c + bh*.35, st_) + seg(b.hi, b.hi, c - bh*.35, c + bh*.35, st_);
    const a1 = V(b.q1), a2 = V(b.q3);
    s += horiz ? `<rect x="${r1(Math.min(a1, a2))}" y="${r1(c - bh/2)}" width="${r1(Math.abs(a2 - a1))}" height="${r1(bh)}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="1.8"/>`
               : `<rect y="${r1(Math.min(a1, a2))}" x="${r1(c - bh/2)}" height="${r1(Math.abs(a2 - a1))}" width="${r1(bh)}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="1.8"/>`;
    s += seg(b.med, b.med, c - bh/2, c + bh/2, `stroke="${C.fg}" stroke-width="2.6"`);
    if(isNum(b.mean)) s += horiz ? `<path d="M${r1(V(b.mean)-4)} ${r1(c-4)}l8 8m0 -8l-8 8" stroke="${C.fg}" stroke-width="1.6"/>` : `<path d="M${r1(c-4)} ${r1(V(b.mean)-4)}l8 8m0 -8l-8 8" stroke="${C.fg}" stroke-width="1.6"/>`;
    b.out.forEach(v => s += horiz ? `<circle cx="${r1(V(v))}" cy="${r1(c)}" r="3.6" fill="none" stroke="${col}" stroke-width="1.6"/>` : `<circle cy="${r1(V(v))}" cx="${r1(c)}" r="3.6" fill="none" stroke="${col}" stroke-width="1.6"/>`);
  });
  return s + fr.end();
}

/* ---------- scatter family: xy, resid, qq ---------- */
const ptsOf = a => (Array.isArray(a) ? a : []).filter(Array.isArray).map(p => [nv(p[0]), nv(p[1]), p[2]]).filter(p => p[0] !== null && p[1] !== null);
const linesOf = l => (Array.isArray(l) ? l : l ? [l] : []).filter(o => o && typeof o === "object").map(o => ({b0: nv(o.b0) ?? 0, b1: nv(o.b1) ?? 0, name: o.name, dash: o.dash, color: o.color})).filter(o => isNum(o.b0) && isNum(o.b1));
function scatterCore(f, series, o = {}){
  const lines = o.lines || [], allP = series.flatMap(sr => sr.pts);
  if(!allP.length && !lines.length) return figEmpty(f);
  let xr = rangeOf(f.xRange), yr = rangeOf(f.yRange);
  if(!xr) xr = allP.length ? padRange(Math.min(...allP.map(p => p[0])), Math.max(...allP.map(p => p[0]))) : [0, 1];
  if(!yr){ let ys = allP.map(p => p[1]); if(o.yLine !== false) lines.forEach(l => ys.push(l.b0 + l.b1*xr[0], l.b0 + l.b1*xr[1]));
    if(!ys.length) ys = [0, 1]; let lo = Math.min(...ys), hi = Math.max(...ys);
    if(o.sym){ const m = Math.max(Math.abs(lo), Math.abs(hi)) || 1; lo = -m; hi = m; }
    if(isNum(o.hline)){ lo = Math.min(lo, o.hline); hi = Math.max(hi, o.hline); }
    yr = padRange(lo, hi, .08); }
  const xa = axisSpec(xr[0], xr[1], 7, {user: f.xTicks}), ya = axisSpec(yr[0], yr[1], 6, {user: f.yTicks});
  const named = series.length > 1 || series.some(sr => sr.name) || lines.some(l => l.name);
  const legend = named ? [...series.filter(sr => sr.name || series.length > 1).map((sr, i) => ({name: sr.name ?? `${i+1}`, color: sr.color, type: "dot"})), ...lines.filter(l => l.name).map(l => ({name: l.name, color: l.color, dash: l.dash}))] : [];
  const fr = figFrame(f, {xd: xr, yd: ya.d.map((v, i) => i ? Math.max(v, yr[1]) : Math.min(v, yr[0])), xt: xa.t, yt: ya.t, gridX: true, xLabel: o.xLabel ?? "x", yLabel: o.yLabel ?? "y", legend, aria: o.aria || "scatter plot"});
  let s = fr.s;
  if(isNum(o.hline)) s += `<line x1="${fr.L}" x2="${fr.W - fr.R}" y1="${r1(fr.Y(o.hline))}" y2="${r1(fr.Y(o.hline))}" stroke="${fr.C.mu}" stroke-width="1.4" stroke-dasharray="6 4"/>`;
  lines.forEach(l => s += `<line ${fr.clip} x1="${r1(fr.X(xr[0]))}" x2="${r1(fr.X(xr[1]))}" y1="${r1(fr.Y(l.b0 + l.b1*xr[0]))}" y2="${r1(fr.Y(l.b0 + l.b1*xr[1]))}" stroke="${l.color}" stroke-width="2.2" ${l.dash ? 'stroke-dasharray="7 4"' : ""}/>`);
  series.forEach(sr => sr.pts.forEach(p => { const cx = fr.X(p[0]), cy = fr.Y(p[1]);
    if(cx < fr.L - 1 || cx > fr.W - fr.R + 1 || cy < fr.T - 1 || cy > fr.bot + 1) return;
    s += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="3.6" fill="${sr.color}" fill-opacity=".8"/>`;
    if(p[2] != null && texPlain(tx(p[2]))) s += `<text x="${r1(cx + 5)}" y="${r1(cy - 5)}" font-size="11" fill="${fr.C.fg}" ${halo(fr.C)}>${ftx(p[2])}</text>`; }));
  return s + drawMarks(fr, f.marks) + fr.end();
}
function seriesOf(f){
  const out = [];
  if(Array.isArray(f.series)) f.series.forEach(sr => { if(sr && typeof sr === "object"){ const p = ptsOf(sr.pts); if(p.length) out.push({pts: p, name: sr.name}); } });
  const p = ptsOf(f.pts); if(p.length) out.unshift({pts: p, name: f.name});
  out.forEach((sr, i) => sr.color = PAL[i % PAL.length]);
  return out;
}
function figXy(f){
  const series = seriesOf(f), lines = linesOf(f.line ?? f.lines);
  lines.forEach((l, i) => l.color = l.color || (series.length > 1 ? PAL[(series.length + i) % PAL.length] : PAL[(1 + i) % PAL.length]));
  return scatterCore(f, series, {lines});
}
function figResid(f){
  const series = seriesOf(f);
  return scatterCore(f, series, {hline: 0, sym: true, xLabel: isEn() ? "Fitted value" : "Tilpasset verdi", yLabel: "Residual", aria: "residual plot"});
}
function figQq(f){
  let pts = ptsOf(f.pts);
  const d = numsOf(f.data).sort((a, b) => a - b);
  if(d.length) pts = d.map((v, i) => [ST.zq((i + .5)/d.length), v]);
  if(!pts.length) return figEmpty(f);
  const lines = [];
  if(f.ref !== false && pts.length >= 2){ const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0)/n, my = pts.reduce((a, p) => a + p[1], 0)/n;
    const sxx = pts.reduce((a, p) => a + (p[0]-mx)**2, 0), sxy = pts.reduce((a, p) => a + (p[0]-mx)*(p[1]-my), 0);
    if(sxx > 0){ const b1 = sxy/sxx; lines.push({b0: my - b1*mx, b1, color: PAL[1]}); } }
  return scatterCore(f, [{pts, color: PAL[0]}], {lines, yLine: false, xLabel: isEn() ? "Theoretical normal quantiles" : "Teoretiske normalkvantiler", yLabel: isEn() ? "Sample quantiles" : "Observerte verdier", aria: "normal QQ plot"});
}

/* ---------- dot plot ---------- */
function figDot(f){
  const d = numsOf(f.data); if(!d.length) return figEmpty(f);
  const cnt = new Map(); d.slice().sort((a, b) => a - b).forEach(v => { const k = Math.round(v*1e9)/1e9; cnt.set(k, (cnt.get(k) || 0) + 1); });
  const maxS = Math.max(...cnt.values()), xr = rangeOf(f.range) || padRange(Math.min(...d), Math.max(...d), .07);
  const xa = axisSpec(xr[0], xr[1], 8, {user: f.xTicks});
  const fr = figFrame(f, {xd: xr, yd: [0, 1], xt: xa.t, yt: [], noY: true, gridY: false, L: 22, R: 22, plotH: Math.max(60, maxS*13 + 16), xLabel: "x", aria: "dot plot"});
  let s = fr.s;
  cnt.forEach((c, v) => { for(let k = 0; k < c; k++) s += `<circle cx="${r1(fr.X(v))}" cy="${r1(fr.bot - 8 - k*13)}" r="5.2" fill="${PAL[0]}" fill-opacity=".85"/>`; });
  return s + drawMarks(fr, f.marks) + fr.end();
}

/* ---------- Venn diagram ---------- */
function figVenn(f){
  const C = figColors();
  let sets = Array.isArray(f.sets) ? f.sets.slice(0, 3) : [];
  if(sets.length < 2) sets = sets.concat(["A", "B"].slice(sets.length));
  const n = sets.length, title = tx(f.title) ? ftx(f.title) : "", top = title ? 28 : 8, W = 400, r = 80;
  let cs, rect;
  if(n === 2){ const cy = top + 22 + r + 6; cs = [[W/2 - 52, cy], [W/2 + 52, cy]]; rect = {x: 12, y: top, w: W - 24, h: 2*r + 56}; }
  else { const cy = top + 32 + r; cs = [[W/2 - 48, cy], [W/2 + 48, cy], [W/2, cy + 82]]; rect = {x: 12, y: top, w: W - 24, h: 32 + r + 82 + r + 26}; }
  const H = rect.y + rect.h + 8;
  // region keys: letters A/B/C (position) or the set names when they are single letters
  const idx = {}; sets.forEach((_, i) => idx["ABC"[i]] = i); sets.forEach((st, i) => { const t = String(texPlain(tx(st))).trim(); if(t.length === 1) idx[t.toUpperCase()] = i; });
  const code = k => { k = String(k ?? "").trim(); if(/^(none|ingen|s|outside|utenfor|ω)$/i.test(k) || k === "") return ""; const ix = new Set();
    for(const ch of k.replace(/[^A-Za-z]/g, "").toUpperCase()){ if(!(ch in idx)) return null; ix.add(idx[ch]); } return ix.size ? [...ix].sort().join("") : null; };
  const inside = (x, y, i) => (x - cs[i][0])**2 + (y - cs[i][1])**2 < r*r;
  const codeAt = (x, y) => cs.map((_, i) => inside(x, y, i) ? String(i) : "").join("");
  // label anchor per region: grid point farthest from all boundaries
  const best = {};
  for(let x = rect.x + 4; x < rect.x + rect.w; x += 3) for(let y = rect.y + 4; y < rect.y + rect.h; y += 3){
    const c = codeAt(x, y); if(c === "") continue;
    const dd = Math.min(...cs.map(([cx, cy]) => Math.abs(Math.hypot(x - cx, y - cy) - r)));
    if(!best[c] || dd > best[c][2]) best[c] = [x, y, dd]; }
  const id = figUid();
  let defs = cs.map(([cx, cy], i) => `<clipPath id="${id}c${i}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`).join("");
  const shade = [...new Set((Array.isArray(f.shade) ? f.shade : f.shade != null ? [f.shade] : []).map(code).filter(c => c !== null))];
  let sh = "";
  shade.forEach((c, j) => { const inc = c.split("").map(Number), exc = cs.map((_, i) => i).filter(i => !inc.includes(i));
    defs += `<mask id="${id}m${j}"><rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>${exc.map(i => `<circle cx="${cs[i][0]}" cy="${cs[i][1]}" r="${r}" fill="#000"/>`).join("")}</mask>`;
    let g = `<rect x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}" fill="${PAL[0]}" fill-opacity=".38" mask="url(#${id}m${j})"/>`;
    inc.forEach(i => g = `<g clip-path="url(#${id}c${i})">${g}</g>`); sh += g; });
  let s = svgOpen(W, H, texPlain(tx(f.title)) || "Venn diagram") + `<defs>${defs}</defs>`;
  s += `<rect x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}" rx="4" fill="none" stroke="${C.fg}" stroke-width="1.5"/>` + sh;
  cs.forEach(([cx, cy], i) => s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PAL[i]}" stroke-width="2.2"/>`);
  // set labels outside the circles
  const ang = n === 2 ? [135, 45] : [135, 45, 270];
  sets.forEach((st, i) => { const a = ang[i]*Math.PI/180, x = cs[i][0] + (r + 12)*Math.cos(a), y = cs[i][1] - (r + 12)*Math.sin(a) + (ang[i] === 270 ? 10 : 0);
    s += `<text x="${r1(x)}" y="${r1(y)}" font-size="15" font-weight="700" text-anchor="${ang[i] === 135 ? "end" : ang[i] === 45 ? "start" : "middle"}" fill="${PAL[i]}" ${halo(C)}>${ftx(st)}</text>`; });
  s += `<text x="${rect.x + 8}" y="${rect.y + 17}" font-size="14" font-style="italic" fill="${C.fg}">${ftx(f.S ?? "S")}</text>`;
  const vals = f.vals && typeof f.vals === "object" ? f.vals : {};
  Object.keys(vals).forEach(k => { const c = code(k), v = valTxt(vals[k]); if(c === null || v === "") return;
    if(c === "") s += `<text x="${rect.x + rect.w - 8}" y="${rect.y + rect.h - 9}" font-size="13" text-anchor="end" fill="${C.fg}" ${halo(C)}>${esc(v)}</text>`;
    else if(best[c]) s += `<text x="${best[c][0]}" y="${best[c][1] + 5}" font-size="13" text-anchor="middle" fill="${C.fg}" ${halo(C)}>${esc(v)}</text>`; });
  if(title) s += `<text x="${W/2}" y="18" font-size="13" font-weight="600" text-anchor="middle" fill="${C.fg}">${title}</text>`;
  return s + `</svg>`;
}

/* ---------- probability tree ---------- */
function figPtree(f){
  const C = figColors();
  let root = f.root ?? f.tree ?? f.kids; if(!Array.isArray(root)) root = root && typeof root === "object" ? [root] : [];
  const norm = (nd, d) => { if(nd == null || d > 5) return null; if(typeof nd !== "object" || Array.isArray(nd)) nd = {l: nd};
    const k = nd.kids ?? nd.children ?? nd.c; return {l: texPlain(tx(nd.l ?? nd.label ?? "")), p: valTxt(nd.p ?? ""), end: nd.end != null ? valTxt(nd.end) : "", kids: Array.isArray(k) ? k.map(x => norm(x, d + 1)).filter(Boolean) : [], d}; };
  const top = root.map(x => norm(x, 1)).filter(Boolean); if(!top.length) return figEmpty(f);
  const leaves = [], byD = [[]]; let D = 1;
  const walk = nd => { (byD[nd.d] = byD[nd.d] || []).push(nd); D = Math.max(D, nd.d); if(nd.kids.length) nd.kids.forEach(walk); else leaves.push(nd); };
  top.forEach(walk);
  const labW = byD.map((a, d) => d ? Math.max(8, ...a.map(nd => tw(nd.l, 13.5))) : 4);
  const allP = byD.flat().map(nd => nd.p), edge = Math.max(86, Math.max(0, ...allP.map(p => tw(p, 12))) + 46);
  const X = [16]; for(let d = 1; d <= D; d++) X[d] = X[d-1] + labW[d-1] + (d === 1 ? 0 : 8) + edge;
  const endW = Math.max(0, ...leaves.map(nd => nd.end ? tw(nd.end, 12) + 18 : 0));
  const title = tx(f.title) ? ftx(f.title) : "", T = 10 + (title ? 22 : 0), sp = leaves.length > 12 ? 24 : 34;
  const W = Math.round(X[D] + labW[D] + endW + 16), H = Math.round(T + leaves.length*sp + 8);
  leaves.forEach((nd, i) => nd.y = T + (i + .5)*sp);
  const setY = nd => { if(nd.kids.length){ nd.kids.forEach(setY); nd.y = (nd.kids[0].y + nd.kids[nd.kids.length-1].y)/2; } return nd.y; };
  top.forEach(setY);
  const rootY = (top[0].y + top[top.length-1].y)/2;
  let s = svgOpen(W, H, texPlain(tx(f.title)) || "probability tree"), txt = "";
  const draw = (nd, px, py, pw) => {
    const x = X[nd.d], x1 = px + pw + 5, x2 = x - 6;
    s += `<line x1="${r1(x1)}" y1="${r1(py)}" x2="${r1(x2)}" y2="${r1(nd.y)}" stroke="${C.mu}" stroke-width="1.6"/>`;
    if(nd.p){ const mx = (x1 + x2)/2, my = (py + nd.y)/2, up = nd.y < py - .5, dn = nd.y > py + .5;
      txt += `<text x="${r1(mx)}" y="${r1(up ? my - 6 : dn ? my + 15 : my - 6)}" font-size="12" text-anchor="middle" fill="${C.acc}" ${halo(C)}>${esc(nd.p)}</text>`; }
    txt += `<text x="${r1(x)}" y="${r1(nd.y + 4.5)}" font-size="13.5" font-weight="600" fill="${C.fg}">${esc(nd.l)}</text>`;
    if(!nd.kids.length && nd.end) txt += `<text x="${r1(X[D] + labW[D] + 14)}" y="${r1(nd.y + 4.5)}" font-size="12" fill="${C.mu}">${esc(nd.end)}</text>`;
    nd.kids.forEach(k => draw(k, x, nd.y, tw(nd.l, 13.5)));
  };
  top.forEach(nd => draw(nd, X[0] - 5, rootY, 0));
  s += `<circle cx="${X[0]}" cy="${r1(rootY)}" r="3.5" fill="${C.fg}"/>` + txt;
  if(title) s += `<text x="${W/2}" y="18" font-size="13" font-weight="600" text-anchor="middle" fill="${C.fg}">${title}</text>`;
  return s + `</svg>`;
}

/* ---------- reliability block diagram ---------- */
function figSys(f){
  const C = figColors(), BH = 30, SG = 22, PG = 12, PP = 18;
  const parse = (nd, d) => {
    if(d > 8) return null;
    if(Array.isArray(nd)){ let type = "s", kids = nd; if(nd[0] === "s" || nd[0] === "p"){ type = nd[0]; kids = nd.slice(1); }
      kids = kids.map(k => parse(k, d + 1)).filter(Boolean); if(!kids.length) return null; if(kids.length === 1) return kids[0]; return {type, kids}; }
    if(nd && typeof nd === "object") return {type: "c", l: texPlain(tx(nd.l ?? nd.label ?? ""))};
    if(nd == null) return null; return {type: "c", l: texPlain(String(nd))};
  };
  const tree = parse(f.sys ?? f.s ?? f.blocks, 0); if(!tree) return figEmpty(f);
  const size = nd => {
    if(nd.type === "c"){ nd.w = Math.max(40, tw(nd.l, 13) + 20); nd.h = BH; }
    else if(nd.type === "s"){ nd.kids.forEach(size); nd.w = nd.kids.reduce((a, k) => a + k.w, 0) + SG*(nd.kids.length - 1); nd.h = Math.max(...nd.kids.map(k => k.h)); }
    else { nd.kids.forEach(size); nd.w = Math.max(...nd.kids.map(k => k.w)) + 2*PP; nd.h = nd.kids.reduce((a, k) => a + k.h, 0) + PG*(nd.kids.length - 1); }
  };
  size(tree);
  const title = tx(f.title) ? ftx(f.title) : "", T = 12 + (title ? 22 : 0), IN = 30;
  const W = Math.round(tree.w + 2*IN + 8), H = Math.round(T + tree.h + 14);
  let wires = "", boxes = "";
  const ln = (x1, y1, x2, y2) => wires += `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${C.fg}" stroke-width="1.6"/>`;
  const draw = (nd, x, y) => { // (x,y) = top-left; wire enters at (x, y+h/2) and leaves at (x+w, y+h/2)
    if(nd.type === "c"){ boxes += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(nd.w)}" height="${nd.h}" rx="4" fill="${PAL[0]}" fill-opacity=".14" stroke="${PAL[0]}" stroke-width="1.7"/><text x="${r1(x + nd.w/2)}" y="${r1(y + nd.h/2 + 4.5)}" font-size="13" text-anchor="middle" fill="${C.fg}">${esc(nd.l)}</text>`; return; }
    if(nd.type === "s"){ let cx = x; const mid = y + nd.h/2;
      nd.kids.forEach((k, i) => { if(i) ln(cx - SG, mid, cx, mid); draw(k, cx, mid - k.h/2); cx += k.w + SG; }); return; }
    let cy = y; const mids = [];
    nd.kids.forEach(k => { const kx = x + PP + (nd.w - 2*PP - k.w)/2, m = cy + k.h/2; mids.push(m); ln(x, m, kx, m); ln(kx + k.w, m, x + nd.w, m); draw(k, kx, cy); cy += k.h + PG; });
    ln(x, mids[0], x, mids[mids.length-1]); ln(x + nd.w, mids[0], x + nd.w, mids[mids.length-1]);
  };
  const mid = T + tree.h/2;
  draw(tree, IN + 4, T);
  ln(10, mid, IN + 4, mid); ln(IN + 4 + tree.w, mid, W - 10, mid);
  let s = svgOpen(W, H, texPlain(tx(f.title)) || "reliability block diagram") + wires + boxes
    + `<circle cx="10" cy="${r1(mid)}" r="3.5" fill="${C.fg}"/><circle cx="${W - 10}" cy="${r1(mid)}" r="3.5" fill="${C.fg}"/>`;
  if(title) s += `<text x="${W/2}" y="18" font-size="13" font-weight="600" text-anchor="middle" fill="${C.fg}">${title}</text>`;
  return s + `</svg>`;
}

/* ---------- line ---------- */
function figLine(f){
  const series = (Array.isArray(f.series) ? f.series : []).filter(s => s && Array.isArray(s.ys)), hasLeg = series.length > 1 || !!(series[0] && series[0].name);
  const C = figColors(), W = 460, H = 290 + (hasLeg ? 18 : 0), L = 54, R = 16, T = hasLeg ? 32 : 14, B = 46;
  const xs = Array.isArray(f.xs) ? f.xs : [], all = series.flatMap(s => s.ys).filter(v => v!=null && isFinite(v));
  if(!all.length || !xs.length) return figEmpty(f);
  let ymin = f.yMin ?? (Math.min(...all) >= 0 ? 0 : Math.min(...all)), ymax = f.yMax ?? Math.max(...all);
  if(ymax === ymin) ymax = ymin + 1;
  const ticks = niceTicks(ymin, ymax, 6); ymin = Math.min(ymin, ticks[0]); ymax = ticks[ticks.length-1];
  const numeric = xs.every(v => typeof v === "number"), xmin = numeric ? Math.min(...xs) : 0, xmax = numeric ? Math.max(...xs) : xs.length-1;
  const X = (v,i) => L + (((numeric ? v : i) - xmin) / ((xmax-xmin)||1)) * (W-L-R), Y = v => H-B - (v-ymin)/(ymax-ymin)*(H-T-B);
  let s = svgOpen(W, H, "line chart");
  ticks.filter(v => v>=ymin-1e-9 && v<=ymax+1e-9).forEach(v => { s += `<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="${C.mu}" stroke-opacity=".22"/><text x="${L-6}" y="${Y(v)+4}" font-size="11" text-anchor="end" fill="${C.mu}">${numFmt(v)}</text>`; });
  const every = Math.ceil(xs.length / 13);
  xs.forEach((v,i) => { if(i % every) return; s += `<line x1="${X(v,i)}" x2="${X(v,i)}" y1="${H-B}" y2="${H-B+4}" stroke="${C.mu}"/><text x="${X(v,i)}" y="${H-B+16}" font-size="11" text-anchor="middle" fill="${C.mu}">${esc(typeof v==="number" ? numFmt(v) : tx(v))}</text>`; });
  s += `<line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="${C.mu}"/><line x1="${L}" x2="${L}" y1="${T}" y2="${H-B}" stroke="${C.mu}"/>`;
  (f.marks || []).forEach(m => { const i = xs.indexOf(m); if(!numeric && i < 0) return; const x = numeric ? X(m) : X(0, i); if(!isFinite(x)) return; s += `<line x1="${x}" x2="${x}" y1="${T}" y2="${H-B}" stroke="${C.acc}" stroke-dasharray="5 4" stroke-width="1.6"/>`; });
  series.forEach((sr,si) => { const c = PAL[si % PAL.length], pts = sr.ys.map((y,i) => (y==null || !isFinite(y) || i >= xs.length ? null : [X(xs[i],i), Y(y)])).filter(Boolean);
    s += `<polyline fill="none" stroke="${c}" stroke-width="2.4" ${si>0 && sr.dash ? 'stroke-dasharray="6 4"' : ""} points="${pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ")}"/>`;
    if(xs.length <= 25) pts.forEach(p => s += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="${c}"/>`); });
  if(hasLeg){ let lx = L; series.forEach((sr,si) => { const nm = texPlain(tx(sr.name)); s += `<rect x="${lx}" y="10" width="14" height="4" fill="${PAL[si%PAL.length]}"/><text x="${lx+18}" y="16" font-size="11" fill="${C.fg}">${esc(nm)}</text>`; lx += 30 + nm.length*6.2; }); }
  s += `<text x="${(L+W-R)/2}" y="${H-8}" font-size="12" text-anchor="middle" fill="${C.fg}">${lbl(f.xLabel)}</text><text x="13" y="${(T+H-B)/2}" font-size="12" text-anchor="middle" fill="${C.fg}" transform="rotate(-90 13 ${(T+H-B)/2})">${lbl(f.yLabel)}</text>`;
  return s + `</svg>`;
}

/* ---------- bars ---------- */
function figBars(f){
  const items = (Array.isArray(f.items) ? f.items : []).filter(it => Array.isArray(it) && isNum(it[1]));
  if(!items.length) return figEmpty(f);
  const C = figColors(), n = items.length, longest = Math.max(...items.map(it => texPlain(tx(it[0])).length));
  const rot = n > 4 && longest > 7, W = Math.max(320, Math.min(620, 80 + n*Math.max(46, Math.min(80, longest*7)))), H = 270 + (rot ? 30 : 0), L = 52, R = 16, T = 18, B = rot ? 76 : 46;
  const vals = items.map(it => it[1]), total = vals.reduce((a,b)=>a+b,0), vmax = f.cumulative ? Math.max(total, ...vals) : Math.max(...vals);
  const ticks = niceTicks(0, vmax, 5), ymax = ticks[ticks.length-1], Y = v => H-B - v/ymax*(H-T-B), bw = (W-L-R)/n;
  let s = svgOpen(W, H, "bar chart");
  ticks.forEach(v => s += `<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="${C.mu}" stroke-opacity=".22"/><text x="${L-6}" y="${Y(v)+4}" font-size="11" text-anchor="end" fill="${C.mu}">${numFmt(v)}</text>`);
  items.forEach((it,i) => { const x = L + i*bw + bw*.15, w = bw*.7, y = Y(it[1]);
    s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(H-B-y).toFixed(1)}" rx="3" fill="${PAL[0]}" fill-opacity=".85"/><text x="${(x+w/2).toFixed(1)}" y="${(y-4).toFixed(1)}" font-size="11" text-anchor="middle" fill="${C.fg}">${numFmt(it[1])}</text>`;
    const tx0 = (L + i*bw + bw/2).toFixed(1);
    s += rot ? `<text x="${tx0}" y="${H-B+14}" font-size="11" text-anchor="end" fill="${C.fg}" transform="rotate(-35 ${tx0} ${H-B+14})">${lbl(it[0])}</text>` : `<text x="${tx0}" y="${H-B+16}" font-size="11" text-anchor="middle" fill="${C.fg}">${lbl(it[0])}</text>`; });
  if(f.cumulative){ let c = 0; const pts = items.map((it,i) => { c += it[1]; return [L + i*bw + bw/2, Y(c)]; });
    s += `<polyline fill="none" stroke="${PAL[1]}" stroke-width="2.2" points="${pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ")}"/>` + pts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="${PAL[1]}"/>`).join("");
    s += `<rect x="${L+8}" y="${T}" width="12" height="4" fill="${PAL[1]}"/><text x="${L+24}" y="${T+6}" font-size="11" fill="${C.fg}">${S.lang==="en"?"cumulative":"kumulativ"}</text>`; }
  s += `<line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="${C.mu}"/><text x="${(L+W-R)/2}" y="${H-6}" font-size="12" text-anchor="middle" fill="${C.fg}">${lbl(f.xLabel)}</text>`;
  if(f.yLabel) s += `<text x="13" y="${(T+H-B)/2}" font-size="12" text-anchor="middle" fill="${C.fg}" transform="rotate(-90 13 ${(T+H-B)/2})">${lbl(f.yLabel)}</text>`;
  return s + `</svg>`;
}

/* ---------- registry ---------- */
const FIGK = {hist:figHist, box:figBox, bars:figBars, pmf:figPmf, pdf:figPdf, cdf:figCdf, xy:figXy, resid:figResid, qq:figQq, venn:figVenn, ptree:figPtree, sys:figSys, line:figLine, dot:figDot};
function figKind(f){ return typeof f === "object" && f ? f.k : ""; }
function figHTML(f){
  if(!f) return "";
  try{ const fn = FIGK[figKind(f)]; return fn ? fn(f) : ""; }
  catch(e){ console.error("figure failed", f, e); return ""; }
}
