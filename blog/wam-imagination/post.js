// Figures for "What world action models do with their imagined futures". Data: data/*.js, exported by tools/export_data.py.
const NS = "http://www.w3.org/2000/svg";
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const SHORT = { "Cosmos Policy": "Cosmos", "LingBot-VA": "LingBot", "InternVLA-A1": "InternVLA", "LIBERO-10": "LIBERO",
  "RoboTwin 2.0": "RoboTwin", "CALVIN ABC-D": "CALVIN" };

function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function txt(parent, x, y, s, attrs = {}) {
  const t = el("text", Object.assign({ x, y, "font-size": 12 }, attrs), parent);
  if (attrs.fill) t.style.fill = attrs.fill; // svg text CSS rule beats the attribute
  t.textContent = s;
  return t;
}
const num = (v, d = 2) => (Number.isInteger(+v.toFixed(d)) ? String(Math.round(v)) : v.toFixed(d).replace(/^(-?)0\./, "$1."));  // ".47", "-.003"
// one real frame per benchmark, used as group headers (same scenes as the paper figures)
const FR = { "LIBERO-10": "img/imagine/now_00.jpg", "RoboTwin 2.0": "img/diag/rt_cur.jpg", "CALVIN ABC-D": "img/imagine_cv/now_00.jpg" };
let uid = 0;
function benchHead(svg, x0, x1, top, th, bench, label, sub) {  // rounded frame cropped to fill, name under it
  const cx = (x0 + x1) / 2, w = Math.min(x1 - x0 - 4, th * 4 / 3), id = "fc" + uid++, box = { x: cx - w / 2, y: top, width: w, height: th, rx: 5 };
  if (FR[bench]) {  // benchmarks without a stored frame get the label only
    el("rect", box, el("clipPath", { id }, svg));
    el("image", { href: FR[bench], x: box.x, y: top, width: w, height: th, preserveAspectRatio: "xMidYMid slice", "clip-path": `url(#${id})` }, svg);
    el("rect", Object.assign({ fill: "none", stroke: css("--rule"), "stroke-width": 1 }, box), svg);
  }
  txt(svg, cx, top + th + 15, label || bench, { "text-anchor": "middle", fill: css("--ink") });
  if (sub) txt(svg, cx, top + th + 29, sub, { "text-anchor": "middle", "font-size": 11 });
}
function hatch(svg, role) {  // fill + diagonal lines in the dark hue (the paper's "current masked")
  const id = "h" + uid++, p = el("pattern", { id, width: 5, height: 5, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, svg);
  el("rect", { width: 5, height: 5, fill: css(`--r-${role}-f`) }, p);
  el("line", { x1: 0, y1: 0, x2: 0, y2: 5, stroke: css(`--r-${role}`), "stroke-width": 1.5 }, p);
  return `url(#${id})`;
}
// filled bar with a darker edge of the same hue and a whisker in that hue; o.fill / o.fo / o.hollow vary the fill
function rbar(g, cx, w, y, p, lo, hi, role, o = {}) {
  const d = css(`--r-${role}`), top = Math.min(y(0), y(p));
  el("rect", { x: cx - w / 2, y: top, width: w, height: Math.max(1.5, Math.abs(y(p) - y(0))), stroke: d, "stroke-width": 1.6,
    fill: o.hollow ? css("--bg") : o.fill || css(`--r-${role}-f`), "fill-opacity": o.fo ?? 1 }, g);
  if (lo != null) el("line", { x1: cx, x2: cx, y1: y(lo), y2: y(hi), stroke: d, "stroke-width": 2 }, g);
}
function count(g, cx, yy, s, role, big) {  // number above a bar in the bar's dark hue
  return txt(g, cx, yy - 6, s, { "text-anchor": "middle", fill: css(`--r-${role}`), "font-size": big ? (g.ownerSVGElement.viewBox.baseVal.width < 560 ? 13 : 16) : 12, "font-weight": big ? 700 : 400 });
}
function words(svg, x, yy, parts) {  // one line of coloured words, a direct label in place of a legend
  const t = el("text", { x, y: yy, "text-anchor": "middle", "font-size": 12 }, svg);
  for (const [s, v] of parts) { const sp = el("tspan", {}, t); sp.textContent = s; if (v) sp.style.fill = css(v); }
}
function wilson(k, n, z = 1.96) {
  const p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d;
  const h = (z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / d;
  return [p, Math.max(0, c - h), Math.min(1, c + h)];
}
// light/dark toggle: data-theme on <html> overrides the system preference and is remembered; figures redraw on "themechange"
(function () {
  const btn = document.querySelector("button.theme"), root = document.documentElement, sys = matchMedia("(prefers-color-scheme: dark)");
  const cur = () => root.dataset.theme || (sys.matches ? "dark" : "light");
  const label = () => { btn.textContent = cur() === "dark" ? "Light" : "Dark"; };
  btn.onclick = () => {
    const t = cur() === "dark" ? "light" : "dark";
    root.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
    label(); dispatchEvent(new Event("themechange"));
  };
  sys.addEventListener("change", label);
  label();
})();
const tip = document.getElementById("tip");
function hover(node, html) {
  node.addEventListener("pointerenter", () => { tip.innerHTML = typeof html === "function" ? html() : html; tip.style.opacity = 1; });
  node.addEventListener("pointermove", (e) => {
    tip.style.left = Math.min(e.clientX + 12, innerWidth - tip.offsetWidth - 8) + "px";
    tip.style.top = (e.clientY + 14) + "px";
  });
  node.addEventListener("pointerleave", () => { tip.style.opacity = 0; });
}
function fit(svg, H) {  // viewBox width follows the rendered width so text stays 12px on phones
  const W = Math.round(Math.min(640, Math.max(320, svg.clientWidth || 640)));
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  return W;
}
function scale(d0, d1, r0, r1) { return (v) => r0 + (v - d0) / (d1 - d0) * (r1 - r0); }
function axes(svg, x, y, W, H, m, yt, yfmt, xt, xfmt, ylab, xlab) {
  const g = el("g", {}, svg);
  for (const v of yt) {
    el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), stroke: v === 0 ? css("--faint") : css("--rule"), "stroke-width": v === 0 ? 1.2 : 1.2,
      "stroke-dasharray": v === 0 ? "" : "1.5 3.5", "stroke-linecap": "round" }, g);
    txt(g, m.l - 6, y(v) + 4, yfmt(v), { "text-anchor": "end" });
  }
  for (const v of xt || []) txt(g, x(v), H - m.b + 16, xfmt(v), { "text-anchor": "middle" });
  if (ylab) txt(g, m.l - 40, m.t - 10, ylab, { "font-size": 12 });
  if (xlab) txt(g, (m.l + W - m.r) / 2, H - 4, xlab, { "text-anchor": "middle" });
  return g;
}
function legend(box, items, state, redraw) {
  box.innerHTML = "";
  for (const [key, label, col, kind] of items) {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-pressed", !state || state[key] !== false);
    if (!state) b.style.cursor = "default";
    const sw = kind === "dash" ? `background:repeating-linear-gradient(90deg,${col} 0 4px,transparent 4px 7px)`
      : kind === "hatchrole" ? `background:repeating-linear-gradient(135deg,${css(`--r-${col}`)} 0 1.5px,${css(`--r-${col}-f`)} 1.5px 4.5px);border:1.5px solid ${css(`--r-${col}`)};height:11px;width:11px;border-radius:2px`
      : kind === "role" ? `background:${css(`--r-${col}-f`)};border:1.5px solid ${css(`--r-${col}`)};height:11px;width:11px;border-radius:2px`
      : kind === "fill" ? `background:${col};height:10px;width:10px`
      : kind === "hatch" ? `background:repeating-linear-gradient(135deg,${col} 0 1.5px,${css("--panel")} 1.5px 4px);height:10px;width:10px`
      : kind === "outline" ? `background:transparent;border:1.6px solid ${col};height:10px;width:10px;border-radius:2px`
      : kind === "pale" ? `background:${css("--rule")};height:10px;width:10px` : `background:${col}`;
    b.innerHTML = `<i style="${sw}"></i>${label}`;
    if (kind === "role" || kind === "hatchrole") b.style.color = css(`--r-${col}`);
    if (state) b.onclick = () => { state[key] = state[key] === false; redraw(); };
    box.appendChild(b);
  }
}
function scrubber(fig, n, show, fps) {
  const range = fig.querySelector("input[type=range]"), play = fig.querySelector("button.play");
  range.max = n - 1;
  let timer = null;
  const stop = () => { clearInterval(timer); timer = null; play.textContent = "Play"; };
  range.oninput = () => { stop(); show(+range.value); };
  play.onclick = () => {
    if (timer) return stop();
    if (+range.value >= n - 1) range.value = 0;
    play.textContent = "Pause";
    timer = setInterval(() => {
      if (+range.value >= n - 1) return stop();
      range.value = +range.value + 1;
      show(+range.value);
    }, 1000 / fps);
  };
  show(0);
  return stop;
}
function segment(fig, attr, onpick) {  // segmented control: aria-pressed follows the click, then the figure redraws
  fig.querySelectorAll(`.seg button[${attr}]`).forEach((bt) => bt.onclick = () => {
    fig.querySelectorAll(`.seg button[${attr}]`).forEach((o) => o.setAttribute("aria-pressed", o === bt));
    onpick(bt.getAttribute(attr));
  });
}

// Figure 1: imagination scrubber, one episode per benchmark
(function () {
  const fig = document.getElementById("fig-imagine"), D = window.IMAGINE;
  const [now, imag, real] = fig.querySelectorAll(".frames img"), frames = fig.querySelector(".frames");
  const att = fig.querySelector("input[type=checkbox]"), chk = fig.querySelector("label.chk"), step = fig.querySelector(".step");
  const pad = (i) => String(i).padStart(2, "0");
  let ep = "cosmos", cur = 0, stop = () => {};
  const warmed = {};
  const warm = (k) => {
    const e = D.eps[k];
    for (let i = 0; i < e.n; i++) for (const f of ["now", "imag", "real"].concat(e.attn ? ["attn"] : [])) if (f !== "real" || i < e.real_n) (new Image()).src = `${e.dir}/${f}_${pad(i)}.jpg`;
  };
  const show = (i) => {
    const e = D.eps[ep];
    cur = i;
    now.src = `${e.dir}/now_${pad(i)}.jpg`;
    imag.src = `${e.dir}/${e.attn && att.checked ? "attn" : "imag"}_${pad(i)}.jpg`;
    const r = i < e.real_n;
    real.src = `${e.dir}/${r ? "real" : "now"}_${pad(i)}.jpg`;
    real.style.opacity = r ? 1 : 0.15;
    step.textContent = `chunk ${i + 1} / ${e.n}`;
  };
  att.onchange = () => show(cur);
  const select = (k) => {
    stop(); ep = k;
    const e = D.eps[k];
    if (!warmed[k]) { warm(k); warmed[k] = true; }
    chk.style.display = e.attn ? "" : "none";
    frames.classList.toggle("r43", !!e.r43);
    fig.querySelector("input[type=range]").value = 0;
    stop = scrubber(fig, e.n, show, 1.5);
  };
  segment(fig, "data-e", select);
  select(ep);
})();

// Figure 5: interchange scrubber with distance traces (RoboTwin 2.0), and the source test (re-encoding) as bars
(function () {
  const fig = document.getElementById("fig-steer");
  const SETS = {
    robotwin: { D: window.STEER_RT, conds: ["none", "kv_fut"], dir: "img/steer_rt", fps: 4, pad: 3, r43: true,
      objs: { A: ["gray mouse", "--r-none"], B: ["blue bell", "--r-cf"] } },
  };
  const [a, b] = fig.querySelectorAll(".frames img"), frames = fig.querySelector(".frames"), step = fig.querySelector(".step"), svg = fig.querySelector("svg");
  const scrub = [fig.querySelector("button.play"), fig.querySelector("input[type=range]"), step], lg = fig.querySelector(".legend");
  // source test: redirects under the predicted-frame interchange, after re-encoding the source frames under the original
  // instruction, and under the current-frame interchange. src: P4 paper sec. "The source of the target object";
  // results/INDEX.csv P4-209 (Cosmos Policy, LIBERO-Object, 100 per arm), P4-148 and P4-070/P4-071 (LingBot-VA, LIBERO-10, 40 per arm)
  const RS = [
    ["Cosmos Policy", "LIBERO-Object", 100, [["all", "interchange", 86], ["band", "re-encoded", 0]]],
    ["LingBot-VA", "LIBERO-10", 40, [["all", "interchange", 39], ["band", "re-encoded", 39], ["ctrl", "current frame", 0]]],
  ];
  let restricted = false;
  function drawRS() {  // grouped bars per model, frames as benchmark headers, conditions labelled under the bars
    svg.innerHTML = "";
    const narrow = (svg.clientWidth || 640) < 500, th = narrow ? 40 : 60, H2 = th + (narrow ? 266 : 286), W = fit(svg, H2);
    const mm = { l: narrow ? 26 : 34, r: 4, t: th + 74, b: 24 }, yy = scale(0, 1, H2 - mm.b, mm.t);
    axes(svg, null, yy, W, H2, mm, [0, 0.5, 1], (v) => num(v, 1), [], null, null);
    if (!narrow) txt(svg, 0, th + 52, "redirected", { "font-size": 11 });
    const nb = RS.reduce((t, r) => t + r[3].length, 0), gap = narrow ? 12 : 26, bw = (W - mm.l - mm.r - gap * (RS.length - 1)) / nb;
    const sty = { all: ["cf", {}], band: ["cf", { fo: 0.45 }], ctrl: ["cur", {}] };
    const under = { all: "interchange", band: "re-encoded", ctrl: narrow ? "current" : "current frame" };
    let x0 = mm.l;
    const spans = {};
    for (const [model, bench, n, cells] of RS) {
      const g = el("g", {}, svg), gx1 = x0 + bw * cells.length;
      cells.forEach(([kind, label, k], i) => {
        const [p, lo, hi] = wilson(k, n), cx = x0 + bw * (i + 0.5), w = Math.min(34, bw * 0.7), [role, o] = sty[kind];
        rbar(g, cx, w, yy, p, lo, hi, role, o);
        count(g, cx, yy(hi), String(k), role, kind === "all" || kind === "band");
        txt(g, cx, H2 - mm.b + 16, under[kind], { "text-anchor": "middle", fill: css(`--r-${role}`), "font-size": narrow ? 10 : 12 });
        hover(el("rect", { x: cx - bw / 2, y: mm.t, width: bw, height: yy(0) - mm.t, fill: "transparent" }, g), `${k}/${n}`);
      });
      txt(svg, (x0 + gx1) / 2, th + 52, model, { "text-anchor": "middle", fill: css("--ink"), "font-weight": 700, "font-size": narrow ? 11 : 12 });
      spans[bench] = [spans[bench] ? spans[bench][0] : x0, gx1, n];
      x0 = gx1 + gap;
    }
    for (const b in spans) benchHead(svg, spans[b][0], spans[b][1], 0, th, b, narrow ? SHORT[b] || b : b, `n = ${spans[b][2]}`);
    lg.innerHTML = "";
  }
  const H = 190;
  let S, D, n, maxSteps, ymax, y, cursor, x, W, m, stop = () => {};
  const pad = (i) => String(i).padStart(S.pad, "0");
  function draw() {
    svg.innerHTML = "";
    legend(lg, [["n", "no intervention", css("--soft"), "line"], ["s", "interchange", css("--soft"), "dash"]], null);
    W = fit(svg, H);
    m = { l: 48, r: W < 500 ? 96 : 120, t: 24, b: 40 };
    x = scale(0, maxSteps, m.l, W - m.r);
    const xt = W < 500 ? [0, 200, 400] : [0, 100, 200, 300, 400, 500];
    axes(svg, x, y, W, H, m, [0, ymax / 2, ymax], (v) => num(v, 2), xt.filter((v) => v <= maxSteps), String, "distance (m)", "control step");
    const last = {};
    for (const cond of S.conds) {
      const R = D[cond];
      for (const obj in R.dist) {
        const v = R.dist[obj], dt = R.n_steps / v.length;
        el("path", { d: v.map((d, i) => `${i ? "L" : "M"}${x(i * dt).toFixed(1)},${y(d).toFixed(1)}`).join(""), fill: "none",
          stroke: css(S.objs[obj][1]), "stroke-width": 2.4, "stroke-linecap": "round", "stroke-dasharray": cond === S.conds[0] ? "" : "5 3" }, svg);
        if (cond === S.conds[0]) last[obj] = v[v.length - 1];
      }
    }
    const ks = Object.keys(S.objs).sort((p, q) => last[p] - last[q]);  // labels at the end of the solid traces, 16 px apart
    let prev = -1e9;
    for (const obj of ks) {
      const yy = Math.max(y(last[obj]) + 4, prev + 16);
      txt(svg, W - m.r + 8, yy, S.objs[obj][0], { fill: css(S.objs[obj][1]) });
      prev = yy;
    }
    cursor = el("line", { y1: m.t, y2: H - m.b, stroke: css("--ink"), "stroke-width": 0.8, opacity: 0.6 }, svg);
  }
  const show = (i) => {
    const [c0, c1] = S.conds;
    a.src = `${S.dir}/${c0}_${pad(Math.min(i, D[c0].n - 1))}.jpg`;
    b.src = `${S.dir}/${c1}_${pad(Math.min(i, D[c1].n - 1))}.jpg`;
    a.style.opacity = i < D[c0].n ? 1 : 0.35;
    const t = Math.round(i / n * maxSteps);
    step.textContent = `step ${t}`;
    cursor.setAttribute("x1", x(t)); cursor.setAttribute("x2", x(t));
  };
  const select = (k) => {
    stop();
    restricted = k === "source";
    frames.style.display = restricted ? "none" : "";
    scrub.forEach((e) => e.style.visibility = restricted ? "hidden" : "");
    if (restricted) return drawRS();
    S = SETS[k]; D = S.D;
    n = Math.max(...S.conds.map((c) => D[c].n));
    maxSteps = Math.max(...S.conds.map((c) => D[c].n_steps));
    ymax = Math.ceil(Math.max(...S.conds.flatMap((c) => Object.values(D[c].dist).flat())) / 0.25) * 0.25;
    y = scale(0, ymax, H - 40, 24);
    frames.classList.toggle("r43", !!S.r43);
    fig.querySelector("input[type=range]").value = 0;
    draw();
    stop = scrubber(fig, n, show, S.fps);
  };
  segment(fig, "data-b", select);
  select("robotwin");
  const redraw = () => { if (restricted) return drawRS(); draw(); show(+fig.querySelector("input[type=range]").value); };
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redraw);
  addEventListener("themechange", redraw);
  addEventListener("resize", redraw);
})();

// Figures 2 and 4: knockout (fig-knockout), and the read site by denoising step, layer range and tracker heads (fig-site);
// filled bars with frames as benchmark headers
function bridgeFig(figId, view) {
  const fig = document.getElementById(figId), D = window.BRIDGE;
  if (!fig) return;
  const svg = fig.querySelector("svg"), lg = fig.querySelector(".legend");
  const all = Object.keys(D.models);
  let libero = all.filter((k) => D.models[k].bands);
  const nOf = (M) => M.nb || N(M), N = (M) => M.n || D.n, noneOf = (M) => M.none_b ?? M.none;
  const hit = (g, x, w, y0, y1, html) => hover(el("rect", { x, y: y0, width: w, height: y1 - y0, fill: "transparent" }, g), html);

  function blind(narrow) {
    const th = narrow ? 44 : 76, H = th + (narrow ? 292 : 282), W = fit(svg, H);
    const mm = { l: narrow ? 26 : 34, r: 2, t: th + 64, b: narrow ? 42 : 28 }, y = scale(0, 1, H - mm.b, mm.t);
    axes(svg, null, y, W, H, mm, [0, 0.5, 1], (v) => num(v, 1), [], null, null);
    txt(svg, 0, mm.t - 8, "success", { "font-size": 11 });
    const benches = [...new Set(all.map((k) => D.models[k].bench))];
    const gap = narrow ? 10 : 22, gw = (W - mm.l - mm.r - gap * (benches.length - 1)) / all.length, w = Math.min(26, gw / 3.5);
    const cur = hatch(svg, "cur");
    let x0 = mm.l, gi = 0;
    benches.forEach((bench) => {
      const ks = all.filter((k) => D.models[k].bench === bench), bx0 = x0;
      ks.forEach((k, j) => {
        const M = D.models[k], cx = x0 + gw * (j + 0.5), g = el("g", {}, svg), name = M.label || k, n = M.n;
        [["none", M.none, "no knockout", {}], ["fut", M.fut, "predicted frames knocked out", {}], ["cur", M.cur, `current frames knocked out (${M.tok_note})`, { fill: cur }]]
          .forEach(([role, kk, what, o], i) => {
            const [p, lo, hi] = wilson(kk, n), bx = cx + (i - 1) * w * 1.1;
            rbar(g, bx, w, y, p, lo, hi, role, o);
            if (role === "fut") count(g, bx, y(hi), String(kk), "fut", true);
            hit(g, bx - w * 0.55, w * 1.1, mm.t, y(0), `${kk}/${n}`);
          });
        // phone: model labels alternate between two rows so neighbours never touch
        txt(g, cx, H - mm.b + 17 + (narrow && gi % 2 ? 13 : 0), narrow || gw < 90 ? SHORT[name] || name : name, { "text-anchor": "middle", fill: css("--ink"), "font-size": narrow ? 10 : 12 });
        gi++;
      });
      const bx1 = x0 + gw * ks.length, n = D.models[ks[0]].n;
      benchHead(svg, bx0, bx1, 0, th, bench, narrow || bx1 - bx0 < 160 ? SHORT[bench] || bench : bench, `n = ${n}`);
      x0 = bx1 + gap;
    });
    legend(lg, [["none", "no knockout", "none", "role"], ["fut", "predicted frames knocked out", "fut", "role"], ["cur", "same number of current-frame keys knocked out", "cur", "hatchrole"]], null);
  }

  // band and head views: one group per model, LIBERO-10 and RoboTwin frames on top
  function grouped(narrow, perModel, gloss) {
    const th = narrow ? 36 : 56, H = th + (narrow ? 270 : 270), W = fit(svg, H);
    const mm = { l: narrow ? 26 : 34, r: 2, t: th + 60, b: 44 }, y = scale(0, 1, H - mm.b, mm.t);
    axes(svg, null, y, W, H, mm, [0, 0.5, 1], (v) => num(v, 1), [], null, null);
    txt(svg, 0, mm.t - 8, "success", { "font-size": 11 });
    const gap = narrow ? 10 : 22, gw = (W - mm.l - mm.r - gap * (libero.length - 1)) / libero.length, spans = {};
    libero.forEach((k, i) => {
      const M = D.models[k], x0 = mm.l + i * (gw + gap), g = el("g", {}, svg), name = M.label || k;
      txt(svg, x0 + gw / 2, th + 36, narrow ? SHORT[name] || name : name, { "text-anchor": "middle", fill: css("--ink"), "font-weight": 700, "font-size": narrow ? 11 : 12 });
      perModel(g, M, x0, gw, y, H, mm, i === 0, `${name}, ${M.bench}`, narrow);
      spans[M.bench] = [spans[M.bench] ? spans[M.bench][0] : x0, x0 + gw];
    });
    for (const b in spans) benchHead(svg, spans[b][0], spans[b][1], 0, th, b, narrow ? SHORT[b] || b : b);
    if (gloss) words(svg, (mm.l + W - mm.r) / 2, H - 6, gloss);
    lg.innerHTML = "";
  }
  function depth(g, M, x0, gw, y, H, mm, first, who, narrow) {  // grey no-knockout bar, then the four layer quarters, shallow to deep
    const n = nOf(M), slot = gw / 5, w = Math.min(24, slot * 0.72), imin = M.bands.indexOf(Math.min(...M.bands));
    [[noneOf(M), "none", "no knockout"]].concat(M.bands.map((b, i) => [b, "fut", `${M.band_names[i]} knocked out`])).forEach(([kk, role, what], i) => {
      const [p, lo, hi] = wilson(kk, n), cx = x0 + slot * (i + 0.5);
      rbar(g, cx, w, y, p, lo, hi, role);
      if (i === imin + 1) { count(g, cx, y(hi), String(kk), "fut", true); if (!narrow) txt(g, cx, y(hi) - 24, M.band_names[i - 1], { "text-anchor": "middle", fill: css("--r-fut"), "font-size": 11 }); }
      hit(g, cx - slot / 2, slot, mm.t, y(0), `${kk}/${n}`);
    });
    if (first) {
      if (!narrow) txt(g, x0 + slot / 2, H - mm.b + 16, "none", { "text-anchor": "middle", fill: css("--r-none"), "font-size": 11 });
      txt(g, x0 + slot * 3, H - mm.b + 16, "shallow → deep", { "text-anchor": "middle", fill: css("--r-fut"), "font-size": 11 });
    }
  }
  function dose(g, M, x0, gw, y, H, mm, first, who) {  // tracker (purple) and random (grey) heads at each k
    const n = nOf(M), slot = gw / 3, w = Math.min(18, slot * 0.36);
    D.k.forEach((kk, i) => {
      const pc = x0 + slot * (i + 0.5);
      [[M.trk[i], "fut", `top ${kk} tracker heads`, -1], [M.rnd[i], "none", `${kk} random heads`, 1]].forEach(([c, role, what, s]) => {
        const [p, lo, hi] = wilson(c, n), cx = pc + s * w * 0.56;
        rbar(g, cx, w, y, p, lo, hi, role);
        if (role === "fut" && i === D.k.length - 1) count(g, cx, y(hi), String(c), "fut", true);
        hit(g, cx - w * 0.56, w * 1.12, mm.t, y(0), `${c}/${n}`);
      });
      txt(g, pc, H - mm.b + 16, String(kk), { "text-anchor": "middle", "font-size": 11 });
    });
  }

  function steps(g, M, x0, gw, y, H, mm, first, who, narrow) {  // grey no-knockout bar, then one bar per group of denoising steps, first to last
    const S = M.steps, n = nOf(M), slot = gw / (S.k.length + 1), w = Math.min(24, slot * 0.72), imin = S.k.indexOf(Math.min(...S.k));
    [[S.none, "none", "no knockout"]].concat(S.k.map((b, i) => [b, "fut", `${S.names[i]} knocked out`])).forEach(([kk, role, what], i) => {
      const [p, lo, hi] = wilson(kk, n), cx = x0 + slot * (i + 0.5);
      rbar(g, cx, w, y, p, lo, hi, role);
      if (i === imin + 1) { count(g, cx, y(hi), String(kk), "fut", true); if (!narrow) txt(g, cx, y(hi) - 24, S.names[i - 1], { "text-anchor": "middle", fill: css("--r-fut"), "font-size": 11 }); }
      hit(g, cx - slot / 2, slot, mm.t, y(0), `${what}: ${kk}/${n}`);
    });
    txt(g, x0 + slot * (S.k.length + 2) / 2, H - mm.b + 16, narrow ? S.unit.split(" ").pop() : S.unit + ", first → last", { "text-anchor": "middle", fill: css("--r-fut"), "font-size": narrow ? 10 : 11 });
  }

  function draw() {
    svg.innerHTML = "";
    const narrow = (svg.clientWidth || 640) < 560;
    if (view === "blind") return blind(narrow);
    libero = all.filter((k) => view === "steps" ? D.models[k].steps : D.models[k].bands);
    if (view === "steps") grouped(narrow, steps, null);
    else if (view === "depth") grouped(narrow, depth, null);
    else grouped(narrow, dose, [["tracker heads", "--r-fut"], [" or "], ["random heads", "--r-none"], [narrow ? " knocked out" : " knocked out from the predicted frames"]]);
  }
  segment(fig, "data-v", (v) => { view = v; draw(); });
  draw();
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
  addEventListener("themechange", draw);
  addEventListener("resize", draw);
}
bridgeFig("fig-knockout", "blind");
bridgeFig("fig-site", "steps");

// Figure 6: proportion mediated per model, with 95% cluster-bootstrap intervals. src: P4 paper tab:pm; INDEX P4-300, P4-301, P4-309, P4-310, P4-293
(function () {
  const fig = document.getElementById("fig-pm");
  if (!fig) return;
  const svg = fig.querySelector("svg");
  const ROWS = [
    ["VPP", "CALVIN, instruction", 0.99, 0.94, 1.03, "fut"],
    ["Seer-Large", "CALVIN, instruction", 0.36, 0.25, 0.47, "fut"],
    ["LaWAM", "RoboTwin 2.0, instruction", 0.09, -0.03, 0.21, "fut"],
    ["InternVLA-A1", "RoboTwin 2.0, instruction", 0.00, 0.00, 0.00, "fut"],
    ["Cosmos Policy", "adapter gain, L21-27, last step", 0.83, 0.69, 0.99, "act"],
    ["Cosmos Policy", "adapter gain, L7-13 (control)", 0.02, -0.05, 0.10, "none"],
  ];
  function draw() {
    svg.innerHTML = "";
    const narrow = (svg.clientWidth || 640) < 520, rh = narrow ? 44 : 34, H = ROWS.length * rh + 46, W = fit(svg, H);
    const m = { l: narrow ? 8 : 320, r: 40, t: 10, b: 36 }, x = scale(-0.1, 1.1, m.l, W - m.r);
    for (const v of [0, 0.5, 1]) {
      el("line", { x1: x(v), x2: x(v), y1: m.t, y2: H - m.b, stroke: v === 0 ? css("--faint") : css("--rule"), "stroke-width": 1.2, "stroke-dasharray": v === 0 ? "" : "1.5 3.5" }, svg);
      txt(svg, x(v), H - m.b + 16, num(v, 1), { "text-anchor": "middle" });
    }
    txt(svg, (m.l + W - m.r) / 2, H - 4, "proportion mediated", { "text-anchor": "middle", "font-size": 11 });
    ROWS.forEach(([model, what, p, lo, hi, role], i) => {
      const yc = m.t + rh * i + rh / 2 + (narrow ? 8 : 0), d = css(`--r-${role}`), g = el("g", {}, svg);
      const lab = narrow ? [m.l, yc - 13, "start"] : [m.l - 10, yc + 4, "end"];
      const t = txt(g, lab[0], lab[1], model, { "text-anchor": lab[2], fill: css("--ink"), "font-weight": 700 });
      const sp = el("tspan", {}, t); sp.textContent = "  " + what; sp.style.fill = css("--soft"); sp.style.fontWeight = 400;
      const bh = narrow ? 12 : 14;
      el("rect", { x: Math.min(x(0), x(p)), y: yc - bh / 2, width: Math.max(1.5, Math.abs(x(p) - x(0))), height: bh, fill: css(`--r-${role}-f`), stroke: d, "stroke-width": 1.4 }, g);
      el("line", { x1: x(lo), x2: x(hi), y1: yc, y2: yc, stroke: d, "stroke-width": 2 }, g);
      txt(g, Math.max(x(hi), x(p)) + 6, yc + 4, p.toFixed(2).replace(/^(-?)0\./, "$1."), { fill: d, "font-weight": 700 });
      hover(el("rect", { x: m.l, y: yc - rh / 2, width: W - m.l - m.r, height: rh, fill: "transparent" }, g), `${model}, ${what}: ${num(p, 2)} [${num(lo, 2)}, ${num(hi, 2)}]`);
    });
  }
  draw();
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
  addEventListener("themechange", draw);
  addEventListener("resize", draw);
})();

// Figure 7: control ladder, one bar per policy at horizon delta; the colour follows the control (L1 grey, L2 purple, L3 green)
(function () {
  if (!document.getElementById("fig-ladder")) return;
  const fig = document.getElementById("fig-ladder"), D = window.LADDER, svg = fig.querySelector("svg"), step = fig.querySelector(".step");
  const keys = Object.keys(D.models), HS = D.models[keys[0]].rungs.scene.map((p) => p[0]);
  const LBL = { pi05: "π0.5", fastwam: "Fast-WAM" }, SH = { vla_jepa: "JEPA", lingbot_va: "LingBot", cosmos_policy: "Cosmos", fastwam: "Fast-WAM", pi05: "π0.5", lawam: "LaWAM" };
  const ROLE = { scene: "none", fullrbf: "fut", dyn: "act" };
  let rung = "fullrbf", di = HS.indexOf(16), parts = [], y;
  function update() {
    const dg = rung === "scene" ? 2 : 3;
    for (const P of parts) {
      const p = D.models[P.k].rungs[rung][di], top = Math.min(y(0), y(p[1]));
      P.bar.style.y = `${top}px`; P.bar.style.height = `${Math.max(1.5, Math.abs(y(p[1]) - y(0)))}px`;
      P.wh.style.y = `${y(p[3])}px`; P.wh.style.height = `${Math.max(1, y(p[2]) - y(p[3]))}px`;
      P.t.textContent = num(p[1], dg);
      P.t.style.transform = `translateY(${p[1] >= 0 ? y(p[3]) - 7 : y(p[2]) + 17}px)`;
    }
    step.textContent = `δ = ${HS[di]}`;
  }
  function draw() {
    svg.innerHTML = "";
    const H = 270, W = fit(svg, H), narrow = W < 500, m = { l: narrow ? 30 : 40, r: 4, t: 34, b: 26 };
    let lo = 0, hi = 0;
    for (const k of keys) for (const p of D.models[k].rungs[rung]) { lo = Math.min(lo, p[2]); hi = Math.max(hi, p[3]); }
    const st = [0.01, 0.02, 0.05, 0.1, 0.25].find((s) => Math.ceil(hi / s) - Math.floor(lo / s) <= 5) || 0.25;
    lo = Math.floor(lo / st) * st; hi = Math.ceil(hi / st) * st;
    y = scale(lo, hi, H - m.b, m.t);
    const yt = [];
    if (lo < 0) yt.push(+lo.toFixed(3), 0, +hi.toFixed(3));
    else for (let v = 0; v <= hi + 1e-9; v += st) yt.push(+v.toFixed(3));
    axes(svg, null, y, W, H, m, yt, (v) => num(v, st < 0.1 || st === 0.25 ? 2 : 1), [], null, null);
    txt(svg, 0, m.t - 16, "ΔR²", { "font-size": 11 });
    const role = ROLE[rung], d = css(`--r-${role}`), slot = (W - m.l - m.r) / keys.length, w = Math.min(46, slot * 0.6);
    parts = keys.map((k, i) => {
      const cx = m.l + slot * (i + 0.5), g = el("g", { class: "tr" }, svg), name = LBL[k] || D.models[k].label;
      const bar = el("rect", { x: cx - w / 2, width: w, fill: css(`--r-${role}-f`), stroke: d, "stroke-width": 1.6 }, g);
      const wh = el("rect", { x: cx - 1, width: 2, fill: d }, g);
      const t = txt(g, cx, 0, "", { "text-anchor": "middle", fill: d, "font-size": narrow ? 12 : 15, "font-weight": 700 });
      txt(svg, cx, H - m.b + 17, narrow ? SH[k] : name, { "text-anchor": "middle", fill: css("--ink"), "font-size": narrow ? 10 : 12 });
      hover(el("rect", { x: cx - slot / 2, y: m.t, width: slot, height: H - m.b - m.t, fill: "transparent" }, svg), () => {
        return D.models[k].rungs[rung][di][1].toFixed(3);
      });
      return { k, bar, wh, t };
    });
    update();
  }
  segment(fig, "data-r", (r) => { rung = r; draw(); });
  draw();
  const range = fig.querySelector("input[type=range]");
  scrubber(fig, HS.length, (i) => { di = i; update(); }, 1.2);
  range.value = di = HS.indexOf(16); update();
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
  addEventListener("themechange", draw);
  addEventListener("resize", draw);
})();

// Rollout carousel: paired clips (left unmodified, right intervened), one at a time. Clips: img/rollouts, from blog/candidates.
(() => {
  const fig = document.getElementById("fig-rollouts");
  if (!fig) return;
  const SETS = {
    knockout: [
      ["blind_01_lingbot-va_robotwin_basket_e0", "LingBot-VA, RoboTwin 2.0, box into the basket: with the knockout the arm stays parked off-camera"],
      ["blind_02_lingbot-va_robotwin_a2b-left_e1", "LingBot-VA, RoboTwin 2.0, mouse left of the bell: with the knockout the arm stays parked and the mouse never moves"],
      ["blind_03_dreamzero_libero10_t1-i0", "DreamZero, LIBERO-10, cream cheese and butter into the basket: with the knockout the arm hovers and grasps nothing"],
      ["blind_04_cosmos_libero10_t1-i8_paired", "Cosmos Policy, LIBERO-10, cream cheese and butter into the basket: with the knockout the arm pushes the milk carton to the basket instead"],
      ["blind_05_cosmos_libero10_t7-i6_paired", "Cosmos Policy, LIBERO-10, soup and cream cheese into the basket: with the knockout the arm knocks the soup over, then grabs and tips the basket"],
      ["blind_06_cosmos_libero10_t7-i8_paired", "Cosmos Policy, LIBERO-10, soup and cream cheese into the basket: with the knockout the arm hovers near the soup and grasps nothing"],
      ["blind_07_cosmos_libero10_t0-i5_paired_nearmiss", "Near-miss. Cosmos Policy, LIBERO-10, soup and sauce into the basket: with the knockout the arm puts the soup in, then tips the basket; the sauce stays on the table"],
    ],
    interchange: [
      ["swap_01_lingbot-va_robotwin_a2b-right_e0", "LingBot-VA, RoboTwin 2.0, stapler right of the phone: after the interchange the arm picks up the phone first"],
      ["swap_02_lingbot-va_robotwin_a2b-left_e1", "LingBot-VA, RoboTwin 2.0, mouse left of the bell: after the interchange the arm moves the bell to the mouse"],
      ["swap_03_lingbot-va_robotwin_basket_e0", "LingBot-VA, RoboTwin 2.0, box into the basket: after the interchange the arm moves the basket and never picks the box"],
      ["swap_04_lingbot-va_robotwin_basket_e1", "LingBot-VA, RoboTwin 2.0, toy car into the basket: after the interchange the arm goes to the basket first and drops the car beside it"],
      ["swap_05_dreamzero_libero10_t0-i0", "DreamZero, LIBERO-10, soup and sauce into the basket: after the interchange the arm picks the cream cheese, then the butter"],
      ["swap_06_dreamzero_libero10_t1-i0", "DreamZero, LIBERO-10, cream cheese and butter into the basket: after the interchange the arm picks the soup, then the sauce"],
    ],
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const video = fig.querySelector("video"), cap = fig.querySelector(".rv-cap"), dots = fig.querySelector(".rv-dots");
  let set = "knockout", i = 0, near = false, inView = false;
  video.muted = true;
  if (reduced.matches) video.controls = true;
  function sync() { if (inView && !reduced.matches) video.play().catch(() => {}); else video.pause(); }
  function load() {
    const name = "img/rollouts/" + SETS[set][i][0];
    if (near) { video.poster = name + ".jpg"; video.src = name + ".mp4"; sync(); }  // nothing fetched until the figure nears the viewport
  }
  function show(n) {
    const list = SETS[set];
    i = (n + list.length) % list.length;
    cap.textContent = list[i][1];
    dots.querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-current", k === i));
    load();
  }
  function pick(s) {
    set = s;
    fig.classList.toggle("rv-ic", s === "interchange");
    fig.querySelectorAll("[data-set]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.set === s));
    dots.innerHTML = "";
    SETS[s].forEach((_, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", `Rollout ${k + 1} of ${SETS[s].length}`);
      b.onclick = () => show(k);
      dots.appendChild(b);
    });
    show(0);
  }
  fig.querySelectorAll("[data-set]").forEach((b) => (b.onclick = () => pick(b.dataset.set)));
  fig.querySelector(".rv-prev").onclick = () => show(i - 1);
  fig.querySelector(".rv-next").onclick = () => show(i + 1);
  fig.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { show(i - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { show(i + 1); e.preventDefault(); }
  });
  let x0 = null;
  const stage = fig.querySelector(".rv-stage");
  stage.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
  });
  new IntersectionObserver((es) => { if (es[0].isIntersecting && !near) { near = true; load(); } }, { rootMargin: "400px" }).observe(fig);
  new IntersectionObserver((es) => { inView = es[0].isIntersecting; sync(); }, { threshold: 0.5 }).observe(stage);
  reduced.addEventListener("change", () => { video.controls = reduced.matches; sync(); });
  pick("knockout");
})();
