(() => {
  const NS = "http://www.w3.org/2000/svg";
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const ease = (v) => { const x = clamp(v); return x * x * (3 - 2 * x); };
  const between = (t, a, b) => ease((t - a) / (b - a));
  const lerp = (a, b, u) => a + (b - a) * u;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const narrowQ = matchMedia("(max-width: 600px)");
  let uid = 0;

  function el(tag, attrs, parent, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null && String(text).includes("ℓ")) {   
      String(text).split(/(ℓ)/).forEach((p) => { if (!p) return; const t = document.createElementNS(NS, "tspan"); t.textContent = p; if (p === "ℓ") t.setAttribute("class", "d-ell"); e.appendChild(t); });
    } else if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  // text with sub/superscripts: [["a"], ["t:t+16", "sub"]]
  function rich(parent, x, y, parts, cls, anchor = "start") {
    const t = el("text", { x, y, class: cls, "text-anchor": anchor }, parent);
    let shift = 0;
    for (const [s, kind] of parts) {
      const dy = kind === "sub" ? 5 : kind === "sup" ? -7 : 0;
      el("tspan", { dy: dy - shift, class: kind ? "d-script" : "", dx: kind ? 0.5 : 0 }, t, s);
      shift = dy;
    }
    return t;
  }
  function img(parent, x, y, s, href, frameCls = "d-frame") {
    const g = el("g", {}, parent);
    const id = "dc" + uid++;
    el("rect", { x, y, width: s, height: s, rx: 5 }, el("clipPath", { id }, el("defs", {}, g)));
    el("image", { href, x, y, width: s, height: s, "clip-path": `url(#${id})`, preserveAspectRatio: "xMidYMid slice" }, g);
    el("rect", { x, y, width: s, height: s, rx: 5, class: frameCls }, g);
    return g;
  }
  function chips(parent, cx, y, n, cls, w = 14, h = 10, gap = 4) {
    const x0 = cx - (n * (w + gap) - gap) / 2, out = [];
    for (let i = 0; i < n; i++) out.push(el("rect", { x: x0 + i * (w + gap), y, width: w, height: h, rx: 3, class: cls }, parent));
    return out;
  }
  const centers = (n, cx, w = 14, gap = 4) => Array.from({ length: n }, (_, i) => cx - (n * (w + gap) - gap) / 2 + i * (w + gap) + w / 2);
  // filled bundle from a span on one row to a span on another
  function bundle(parent, x0a, x1a, ya, x0b, x1b, yb, cls) {
    const m = (ya + yb) / 2;
    return el("path", { d: `M${x0a},${ya} C${x0a},${m} ${x0b},${m} ${x0b},${yb} L${x1b},${yb} C${x1b},${m} ${x1a},${m} ${x1a},${ya} Z`, class: cls }, parent);
  }

  // A thumbnail zoomed into the region where the two passes' predictions differ.
  function zoomImg(parent, x, y, s, href, frameCls, cx = 0.5, cy = 0.5, h = 0.5) {
    const g = el("g", {}, parent), id = "zi" + uid++, Z = 0.5 / h;
    el("rect", { x, y, width: s, height: s, rx: 5 }, el("clipPath", { id }, el("defs", {}, g)));
    el("image", { href, x: x - (cx - h) * s * Z, y: y - (cy - h) * s * Z, width: s * Z, height: s * Z, "clip-path": `url(#${id})` }, g);
    el("rect", { x, y, width: s, height: s, rx: 5, class: frameCls }, g);
    return g;
  }

  // A clip of real frames inside a rounded frame, with a growing path. frames: "prefix_NN.jpg"; track: normalised (x, y) per step.
  function clipPanel(svg, x, y, s, frameCls) {
    const g = el("g", {}, svg), id = "cp" + uid++;
    el("rect", { x, y, width: s, height: s, rx: 5 }, el("clipPath", { id }, el("defs", {}, g)));
    const im = el("image", { x, y, width: s, height: s, "clip-path": `url(#${id})`, preserveAspectRatio: "xMidYMid slice" }, g);
    const line = el("polyline", { class: "d-path d-path-clip", "clip-path": `url(#${id})` }, g);
    const dot = el("circle", { r: 4.5, class: "d-path-dot" }, g);
    const frame = el("rect", { x, y, width: s, height: s, rx: 5, class: frameCls }, g);
    let cur = null; const pending = [];
    const warm = () => { while (pending.length) { const c = pending.pop(); for (let j = 0; j < c.n; j++) (new Image()).src = `${c.prefix}_${String(j).padStart(2, "0")}.jpg`; } };
    return {
      frame,
      show(c, st, pathCls) {                      // c = window.CLIPS entry; st = track index (2 control steps each)
        const u = clamp(st / (c.track.length - 1));
        if (u > 0) warm();
        const j = Math.round(u * (c.n - 1));             // frames sit at linspace(0, len - 1, n)
        const href = `${c.prefix}_${String(j).padStart(2, "0")}.jpg`;
        if (href !== cur) { im.setAttribute("href", href); cur = href; }
        const k = Math.max(1, Math.round(u * (c.track.length - 1)));
        line.setAttribute("points", c.track.slice(0, k + 1).map(([a, b]) => `${(x + a * s).toFixed(1)},${(y + b * s).toFixed(1)}`).join(" "));
        line.setAttribute("class", "d-path d-path-clip " + (pathCls || ""));
        const [a, b] = c.track[k];
        dot.setAttribute("cx", (x + a * s).toFixed(1)); dot.setAttribute("cy", (y + b * s).toFixed(1));
        dot.style.display = a < 0 || a > 1 || b < 0 || b > 1 ? "none" : "";   // gripper outside the camera view
      },
      preload(c) { pending.push(c); },               // lazy: fetched the first time the clip starts playing
    };
  }
  // two clips at the same control-step rate from step 0
  const STEPS_PER_S = 40;                         
  const clipSecs = (...cs) => Math.max(...cs.map((c) => c.track.length - 1)) / STEPS_PER_S;
  const clipStep = (t, t0) => Math.max(0, t - t0) * STEPS_PER_S;
  const ended = (c, st) => st >= c.track.length - 1;

  // timeline, controls, autoplay, reduced motion, and a rebuild when the layout breakpoint changes
  function film(fig, duration, build, captions) {
    const svg = fig.querySelector("svg");
    const btn = fig.querySelector(".d-play"), seek = fig.querySelector(".d-seek"), clock = fig.querySelector(".d-clock");
    const cap = fig.querySelector(".d-stage");
    let time = 0, playing = false, prev = 0, ready = true, update = () => {};
    const make = () => { svg.innerHTML = ""; update = build(svg, narrowQ.matches); render(); };
    seek.max = Math.round(duration * 100);
    const fmt = (s) => `0:${String(Math.floor(s)).padStart(2, "0")}`;
    function render() {
      update(time);
      seek.value = Math.round(time * 100);
      clock.textContent = `${fmt(time)} / ${fmt(duration)}`;
      const stage = captions.filter(([t0]) => time >= t0).pop();
      if (stage && cap && cap.textContent !== stage[1]) cap.textContent = stage[1];
      btn.textContent = playing ? "Pause" : time >= duration ? "Replay" : "Play";
    }
    function tick(ts) {
      if (!playing) return;
      if (prev) time = Math.min(duration, time + (ts - prev) / 1000);
      prev = ts; render();
      if (time >= duration) { playing = false; render(); return; }
      requestAnimationFrame(tick);
    }
    const play = () => { if (time >= duration) time = 0; playing = true; ready = false; prev = 0; render(); requestAnimationFrame(tick); };
    const pause = () => { playing = false; render(); };
    btn.addEventListener("click", () => (playing ? pause() : play()));
    seek.addEventListener("input", () => { time = Number(seek.value) / 100; ready = false; pause(); });
    fig.seekTo = (t) => { time = t; playing = false; render(); };   // used by the screenshot and export tools
    narrowQ.addEventListener("change", make);
    if (reduced.matches) time = duration;
    make();
    if (!reduced.matches) {
      const check = () => {
        const r = fig.getBoundingClientRect(), mid = innerHeight / 2;
        if (r.bottom < 0 || r.top > innerHeight) { ready = true; if (playing) pause(); }
        else if (ready && r.top <= mid && r.bottom >= mid) play();
      };
      addEventListener("scroll", check, { passive: true });
      addEventListener("resize", check);
      check();
    }
  }

  function layerStack(svg, x0, x1, ys, bandH, groups, labels, predOnly = false) {
    ys.forEach((y, j) => {
      el("rect", { x: x0, y, width: x1 - x0, height: bandH, rx: 7, class: "d-band" }, svg);
      if (labels) el("text", { x: x0 - 8, y: y + bandH / 2 + 5, class: "d-small", "text-anchor": "end" }, svg, labels[j]);
    });
    const col = {}, rows = { cur: [], pred: [], act: [] }, colRect = {};
    for (const g in groups) {
      const [cx, n] = groups[g];
      col[g] = centers(n, cx);
      const x = col[g], half = (n * 18 - 4) / 2;
      colRect[g] = el("rect", { x: cx - half - 3, y: ys[0] - 6, width: 2 * half + 6, height: ys[ys.length - 1] + bandH - ys[0] + 12, rx: 6, class: `d-col d-col-${g}` }, svg);
    }
    const bundles = { cur: [], pred: [] };
    for (let j = 0; j < ys.length - 1; j++) {      // gap between layer j (top) and j+1 (below)
      const cy0 = (bandH - 10) / 2, yUp = ys[j] + cy0 + 10, yLow = ys[j + 1] + cy0;
      const [ca, na] = groups.act, aw = (na * 18 - 4) / 2;
      const [cc, nc] = groups.cur, cw = (nc * 18 - 4) / 2;
      const [cp, np] = groups.pred, pw = (np * 18 - 4) / 2;
      if (predOnly) { bundles.pred.push(bundle(svg, cp - pw, cp + pw, yLow, ca - aw, ca + aw, yUp, "d-b d-b-fut")); continue; }
      bundles.cur.push(bundle(svg, cc - cw * 0.5, cc + cw * 0.5, yLow, ca - aw, ca - aw * 0.55, yUp, "d-b d-b-cur"));
      bundles.pred.push(bundle(svg, cp - pw * 0.8, cp + pw * 0.8, yLow, ca - aw * 0.45, ca + aw, yUp, "d-b d-b-fut"));
    }
    ys.forEach((y) => {
      for (const g in groups) rows[g].push(chips(svg, groups[g][0], y + (bandH - 10) / 2, groups[g][1], `d-chip d-chip-${g}`));
    });
    return { bundles, rows, col, colRect };
  }

  // Joint video-action denoising in Cosmos Policy (mechanism only)
  function joint(svg, N) {
    const D = window.DIAG_JOINT, sig = D.sigmas;
    const W = N ? 380 : 720;
    const P = N
      ? { tx0: 30, tdx: 62, ty: 44, x0: 70, x1: 370, ys: [134, 194, 254], bandH: 30,
          g: { cur: [104, 3], pred: [212, 6], act: [322, 3] }, thumbY: 320, s: 104, cur: 62, pred: [176, 286], gx: [10, 196], gy: 490, gs: 178, H: 718 }
      : { tx0: 40, tdx: 64, ty: 44, x0: 96, x1: 706, ys: [124, 182, 240], bandH: 30,
          g: { cur: [170, 4], pred: [362, 9], act: [612, 6] }, thumbY: 314, s: 112, cur: 170, pred: [362, 362], gx: [130, 370], gy: 496, gs: 220, H: 766 };
    svg.setAttribute("viewBox", `0 0 ${W} ${P.H}`);
    // sampler timeline: one stop per call at its sigma, then the decoded frame (sigma 0)
    const tx = (k) => P.tx0 + k * P.tdx;
    el("text", { x: P.tx0 - 6, y: P.ty - 22, class: "d-label" }, svg, "5 sampler calls");
    el("line", { x1: P.tx0 - 6, y1: P.ty, x2: tx(5) + 18, y2: P.ty, class: "d-axis" }, svg);
    const ticks = [], tl = [];
    for (let k = 0; k <= 5; k++) {
      ticks.push(el("circle", { cx: tx(k), cy: P.ty, r: 4.5, class: "d-tick" }, svg));
      tl.push(el("text", { x: tx(k), y: P.ty + 24, class: "d-small", "text-anchor": "middle" }, svg, k < 5 ? `σ = ${Math.round(sig[k])}` : "decoded"));
    }
    const marker = el("circle", { cx: tx(0), cy: P.ty, r: 7.5, class: "d-marker" }, svg);
    // the action chunk leaves the top of the stack
    const [ca] = P.g.act;
    if (!N) {   // on the phone layout the timeline fills the top row
      el("line", { x1: ca, y1: P.ys[0] - 8, x2: ca, y2: P.ty + 22, class: "d-arrow d-arrow-act" }, svg);
      el("path", { d: `M${ca},${P.ty + 16} l-5,9 h10 z`, class: "d-head-act" }, svg);
      rich(svg, ca + 12, P.ty + 6, [["a"], ["t:t+16", "sub"]], "d-label d-strong d-act-text");
    }
    // layers
    el("text", { x: N ? 10 : P.x0 - 70, y: P.ys[0] - 18, class: "d-label d-strong" }, svg, "video diffusion transformer");
    const S = layerStack(svg, P.x0, P.x1, P.ys, P.bandH, P.g, N ? ["ℓ+2", "ℓ+1", "ℓ"] : ["layer ℓ+2", "layer ℓ+1", "layer ℓ"]);
    // inputs
    const yb = P.ys[2] + P.bandH + 6, s = P.s, ty = P.thumbY;
    const thumbs = N ? { cur: [P.cur - s / 2], pred: [P.pred[0] - s / 2, P.pred[1] - s / 2] }
      : { cur: [P.cur - s / 2], pred: [P.pred[0] - s - 6, P.pred[0] + 6] };
    for (const [g, xs] of Object.entries(thumbs)) {
      const left = xs[0], right = xs[xs.length - 1] + s, [cx, n] = P.g[g], half = (n * 18 - 4) / 2 + 3;
      el("path", { d: `M${cx - half},${yb} L${left + 6},${ty - 2} L${right - 6},${ty - 2} L${cx + half},${yb} Z`, class: `d-funnel d-funnel-${g}` }, svg);
    }
    img(svg, thumbs.cur[0], ty, s, "img/diag/joint_cur.jpg", "d-frame d-frame-cur");
    // one image per stop (noise weighted by the call's sigma, blog/tools/denoise_stops.py), crossfaded as the marker moves
    const pg = el("g", {}, svg);
    const stops = ["fut", "futwrist"].map((name, i) =>
      [0, 1, 2, 3, 4, 5].map((k) => img(pg, thumbs.pred[i], ty, s, `img/diag/joint_${name}${k < 5 ? "_s" + k : ""}.jpg`, "d-frame d-frame-fut")));
    const base = ty + s + 26;
    rich(svg, (thumbs.cur[0] + s / 2), base, [["current o"], ["t", "sub"]], "d-label d-cur-text", "middle");
    const pc = (thumbs.pred[0] + thumbs.pred[1] + s) / 2;
    rich(svg, pc, base, [["predicted ô"], ["t+16", "sub"]], "d-label d-fut-text", "middle");
    const pill = el("g", {}, svg);
    el("rect", { x: pc - 40, y: ty + s / 2 - 14, width: 80, height: 28, rx: 14, class: "d-mask-pill" }, pill);
    el("text", { x: pc, y: ty + s / 2 + 5, class: "d-label d-strong d-mask-text", "text-anchor": "middle" }, pill, "masked");
    // paired rollouts from one initial state: unmasked and future masked, same step rate from step 0
    const C = window.CLIPS, [g1x, g2x] = P.gx, gy = P.gy, gs = P.gs;
    el("text", { x: g1x, y: gy - 12, class: "d-label d-strong" }, svg, "LingBot-VA rollouts, RoboTwin 2.0");
    const p1 = clipPanel(svg, g1x, gy, gs, "d-frame d-frame-act");
    const p2 = clipPanel(svg, g2x, gy, gs, "d-frame d-frame-fut d-frame-thick");
    el("text", { x: g1x, y: gy + gs + 22, class: "d-label d-act-text" }, svg, "unmasked");
    el("text", { x: g2x, y: gy + gs + 22, class: "d-label d-strong d-fut-text" }, svg, "future masked");
    const n1 = el("text", { x: g1x, y: gy + gs + 42, class: "d-small" }, svg, "");
    const n2 = el("text", { x: g2x, y: gy + gs + 42, class: "d-small d-fut-text" }, svg, "");
    p1.preload(C.blind_none); p2.preload(C.blind_masked);
    el("text", { x: P.g.act[0], y: yb + 26, class: "d-label d-act-text", "text-anchor": "middle" }, svg, N ? "action" : "action tokens");

    const T = { call: 1.1, mask: [6.0, 7.0], play: 7.4 };
    return (t) => {
      const prog = Math.min(5, t / T.call), k = Math.floor(prog), fr = ease((prog - k) / 0.4);
      const pos = Math.min(5, k + (k < 5 ? fr : 0));
      marker.setAttribute("cx", lerp(tx(Math.floor(pos)), tx(Math.min(5, Math.floor(pos) + 1)), pos - Math.floor(pos)).toFixed(2));
      const at = Math.round(pos);
      ticks.forEach((c, i) => c.setAttribute("class", i <= pos + 1e-6 ? "d-tick d-tick-done" : "d-tick"));
      tl.forEach((l, i) => l.setAttribute("class", i === at ? "d-small d-now" : "d-small"));
      const clean = pos / 5, cut = between(t, T.mask[0], T.mask[1]);
      for (const st of stops) st.forEach((g, i) => (g.style.opacity = i ? clamp(pos - i + 1).toFixed(3) : 1));
      pg.style.opacity = (1 - 0.6 * cut).toFixed(3); pg.style.filter = `grayscale(${cut.toFixed(2)})`;
      pill.style.opacity = cut.toFixed(3);
      S.rows.act.forEach((r) => r.forEach((c) => (c.style.fillOpacity = (0.25 + 0.75 * clean).toFixed(3))));
      S.rows.pred.forEach((r) => r.forEach((c) => { c.style.fillOpacity = ((0.25 + 0.75 * clean) * (1 - 0.7 * cut)).toFixed(3); c.style.strokeOpacity = (1 - 0.6 * cut).toFixed(3); }));
      S.bundles.pred.forEach((b) => {
        b.style.opacity = ((0.35 + 0.65 * clean) * (1 - 0.82 * cut)).toFixed(3);
        b.style.fillOpacity = (0.85 * (1 - cut)).toFixed(3);
        b.style.strokeDasharray = cut > 0.5 ? "4 4" : "";
      });
      S.bundles.cur.forEach((b) => (b.style.opacity = (0.5 + 0.5 * clean).toFixed(3)));
      const st = clipStep(t, T.play);
      p1.show(C.blind_none, st, ""); p2.show(C.blind_masked, st, "");
      n1.textContent = ended(C.blind_none, st) ? C.blind_none.note || "" : ""; n2.textContent = ended(C.blind_masked, st) ? C.blind_masked.note || "" : "";
    };
  }

  // (b) The key/value swap
  function swap(svg, N) {
    const W = N ? 380 : 720;
    // row geometry: title, instruction, thumbs, two layer bands
    const R = N
      ? { rows: [8, 362], thumbS: 92, tx: 14, bx0: 14, bx1: 366, bandY: 158, g: { cur: [66, 3], kv: [190, 6], act: [318, 3] }, gx: [10, 196], gy: 744, gs: 178, H: 972 }
      : { rows: [10, 262], thumbS: 96, tx: 14, bx0: 236, bx1: 706, bandY: 46, g: { cur: [300, 3], kv: [470, 6], act: [640, 3] }, gx: [130, 370], gy: 548, gs: 220, H: 820 };
    svg.setAttribute("viewBox", `0 0 ${W} ${R.H}`);
    const rows = [
      { name: "counterfactual", instr: ["position the phone to the", "right of the red stapler"], fut: "swap_futB.jpg", cf: true },
      { name: "action pass", instr: ["position the red stapler to", "the right of the phone"], fut: "swap_futA.jpg", cf: false },
    ];
    const refs = {};
    rows.forEach((r, i) => {
      const y = R.rows[i];
      el("text", { x: R.tx, y: y + 16, class: `d-label d-strong ${r.cf ? "d-cf-text" : ""}` }, svg, r.name);
      r.instr.forEach((l, j) => el("text", { x: R.tx, y: y + 38 + j * 17, class: "d-mono" }, svg, l));
      const ty = y + 76, s = R.thumbS;
      img(svg, R.tx, ty, s, "img/diag/swap_cur.jpg", "d-frame d-frame-cur");
      const fg = zoomImg(svg, R.tx + s + 10, ty, s, "img/diag/" + r.fut, `d-frame ${r.cf ? "d-frame-cf" : "d-frame-fut"}`);
      const fsw = r.cf ? null : zoomImg(svg, R.tx + s + 10, ty, s, "img/diag/swap_futB.jpg", "d-frame d-frame-cf");
      const tgt = el("text", { x: R.tx + s + 16, y: ty + s - 9, class: "d-tag " + (r.cf ? "d-tag-cf" : "d-tag-fut") }, svg, r.cf ? "phone" : "stapler");
      el("text", { x: R.tx + s / 2, y: ty + s + 20, class: "d-small d-cur-text", "text-anchor": "middle" }, svg, "current");
      const plab = el("text", { x: R.tx + s * 1.5 + 10, y: ty + s + 20, class: `d-small ${r.cf ? "d-cf-text" : "d-fut-text"}`, "text-anchor": "middle" }, svg, "predicted (wrist)");
      const by = N ? ty + s + 40 : y + R.bandY + 20;
      const groups = { cur: R.g.cur, pred: R.g.kv, act: R.g.act };
      const S = layerStack(svg, R.bx0, R.bx1, [by, by + 76], 30, groups, null, true);   // one idea: only the action -> predicted K/V read
      if (r.cf) S.bundles.pred.forEach((b) => b.setAttribute("class", "d-b d-b-cf"));
      if (r.cf) S.rows.pred.forEach((row) => row.forEach((c) => c.setAttribute("class", "d-chip d-chip-cf")));
      const kvlab = el("text", { x: R.g.kv[0], y: by + 128, class: `d-small ${r.cf ? "d-cf-text" : "d-fut-text"}`, "text-anchor": "middle" }, svg, "predicted K, V");
      if (r.cf) S.colRect.pred.setAttribute("class", "d-col d-col-cf");
      el("text", { x: R.g.cur[0], y: by + 128, class: "d-small d-cur-text", "text-anchor": "middle" }, svg, "current");
      el("text", { x: R.g.act[0], y: by + 128, class: "d-small d-act-text", "text-anchor": "middle" }, svg, "action");
      refs[r.cf ? "cf" : "ap"] = { fg, fsw, plab, kvlab, tgt, S, by, bundles: S.bundles.pred };
    });
    // moving copy of the counterfactual K/V (both layers)
    const mv = el("g", {}, svg);
    for (const j of [0, 1]) chips(mv, R.g.kv[0], refs.cf.by + j * 76 + 10, R.g.kv[1], "d-chip d-chip-cf");
    // first grasp
    const gs = R.gs;
    const [g1x, g2x] = R.gx, g1y = R.gy, g2y = R.gy;
    el("text", { x: g1x, y: R.gy - 14, class: "d-label d-strong" }, svg, "LingBot-VA rollouts, RoboTwin 2.0");
    const C = window.CLIPS;
    const p1 = clipPanel(svg, g1x, g1y, gs, "d-frame d-frame-none");
    el("text", { x: g1x, y: g1y + gs + 22, class: "d-label" }, svg, "unmodified");
    const p2 = clipPanel(svg, g2x, g2y, gs, "d-frame d-frame-cf d-frame-thick");
    el("text", { x: g2x, y: g2y + gs + 22, class: "d-label d-strong d-cf-text" }, svg, "swapped");
    const n1 = el("text", { x: g1x, y: g1y + gs + 42, class: "d-small" }, svg, "");
    const n2 = el("text", { x: g2x, y: g2y + gs + 42, class: "d-small d-cf-text" }, svg, "");
    p1.preload(C.swap_none); p2.preload(C.swap_swapped);
    const T = { move: [1.6, 3.6], play: 4.2 };
    return (t) => {
      const m = between(t, T.move[0], T.move[1]);
      mv.setAttribute("transform", `translate(0,${(refs.ap.by - refs.cf.by) * m})`);
      mv.style.opacity = !N && m > 0 && m < 1 ? 1 : 0;   // on the stacked phone layout the path would cross the text; the crossfade and recolour carry it
      const done = t >= T.move[1];
      refs.ap.S.rows.pred.forEach((row) => row.forEach((c) => c.setAttribute("class", done ? "d-chip d-chip-cf" : "d-chip d-chip-pred")));
      refs.ap.bundles.forEach((b) => b.setAttribute("class", done ? "d-b d-b-cf" : "d-b d-b-fut"));
      refs.ap.fsw.style.opacity = m.toFixed(3);
      refs.ap.plab.textContent = done ? "swapped (wrist)" : "predicted (wrist)";
      refs.ap.plab.setAttribute("class", done ? "d-small d-cf-text" : "d-small d-fut-text");
      refs.ap.kvlab.setAttribute("class", done ? "d-small d-cf-text" : "d-small d-fut-text");
      refs.ap.S.colRect.pred.setAttribute("class", done ? "d-col d-col-cf" : "d-col d-col-pred");
      refs.ap.tgt.textContent = done ? "phone" : "stapler";
      refs.ap.tgt.setAttribute("class", "d-tag " + (done ? "d-tag-cf" : "d-tag-fut"));
      const st = clipStep(t, T.play);      // same step rate from step 0 once the swap lands
      p1.show(C.swap_none, st, "d-path-none"); p2.show(C.swap_swapped, st, "d-path-cf");
      n1.textContent = ended(C.swap_none, st) ? C.swap_none.note || "" : "";
      n2.textContent = ended(C.swap_swapped, st) ? C.swap_swapped.note || "" : "";
    };
  }

  // (c) The control ladder
  function ladder(svg, N) {
    const W = N ? 380 : 720;
    const R = [
      { name: "L1", desc: "scene", base: 0.40, d: 0.49, lab: "0.46 to 0.51", cls: "d-box1" },
      { name: "L2", desc: "full state", base: 0.90, d: 0.021, lab: "0.001 to 0.021", cls: "d-box2" },
      { name: "L3", desc: "+ own motion", base: 0.95, d: 0.003, lab: "≤ 0.003", cls: "d-box3" },
    ];
    const P = N ? { T0: 40, TE: 160, TD: 300, axis1: 360, boxes: [[30, 372, 118, 70], [20, 300, 196, 152], [10, 232, 250, 230]], bx: 296, bw: 44, b0: 462, bh: 200, H: 530, labTop: true }
      : { T0: 80, TE: 300, TD: 600, axis1: 690, boxes: [[52, 314, 210, 76], [36, 272, 340, 130], [20, 230, 470, 186]], bx: 540, bw: 40, b0: 416, bh: 186, H: 450, labTop: false };
    svg.setAttribute("viewBox", `0 0 ${W} ${P.H}`);
    const { T0, TE, TD } = P;
    el("rect", { x: T0, y: 28, width: TE - T0, height: 14, rx: 3, class: "d-exec" }, svg);
    el("rect", { x: TE, y: 28, width: TD - TE, height: 14, rx: 3, class: "d-replan" }, svg);
    el("text", { x: (T0 + TE) / 2, y: 20, class: "d-small", "text-anchor": "middle" }, svg, N ? "executed" : "executed chunk");
    el("text", { x: (TE + TD) / 2, y: 20, class: "d-small", "text-anchor": "middle" }, svg, "replans");
    el("line", { x1: 10, y1: 52, x2: P.axis1, y2: 52, class: "d-axis" }, svg);
    for (const [x, s] of [[T0, "t"], [TE, "t+E"], [TD, "t+δ"]]) {
      el("line", { x1: x, y1: 46, x2: x, y2: 58, class: "d-axis" }, svg);
      el("text", { x, y: 76, class: "d-label", "text-anchor": "middle" }, svg, s);
    }
    el("rect", { x: T0 - 40, y: 98, width: 80, height: 36, rx: 7, class: "d-node" }, svg);
    rich(svg, T0, 122, [["h"], ["ℓ", "sub"], ["(t)"]], "d-label d-strong", "middle");
    el("rect", { x: TD - 28, y: 98, width: 56, height: 36, rx: 7, class: "d-node" }, svg);
    rich(svg, TD, 122, [["Y"], ["δ", "sub"]], "d-label d-strong", "middle");
    el("line", { x1: T0 + 42, y1: 116, x2: TD - 34, y2: 116, class: "d-probe" }, svg);
    el("path", { d: `M${TD - 30},116 l-11,-6 v12 z`, class: "d-head-fut" }, svg);
    el("text", { x: (T0 + TD) / 2, y: 106, class: "d-label d-strong d-fut-text", "text-anchor": "middle" }, svg, "probe");
    el("text", { x: 10, y: P.boxes[2][1] - 12, class: "d-label" }, svg, "nuisance control");
    const boxes = R.map((r, i) => {
      const g = el("g", {}, svg), [x, y, w, h] = P.boxes[i];
      el("rect", { x, y, width: w, height: h, rx: 9, class: "d-box " + r.cls }, g);
      el("text", { x: x + w - 12, y: y + 22, class: "d-label d-strong", "text-anchor": "end" }, g, r.name);
      el("text", { x: x + w - 12, y: y + 42, class: "d-small", "text-anchor": "end" }, g, r.desc);
      return g;
    });
    const { bx, bw, b0, bh } = P;
    const baseR = el("rect", { x: bx, width: bw, class: "d-barbase" }, svg);
    const dR = el("rect", { x: bx, width: bw, class: "d-bard" }, svg);
    el("rect", { x: bx, y: b0 - bh, width: bw, height: bh, rx: 2, class: "d-barframe" }, svg);
    rich(svg, bx + bw / 2, b0 + 22, [["R"], ["2", "sup"]], "d-small", "middle");
    const dlab = el("text", { class: "d-label d-strong d-fut-text", "text-anchor": P.labTop ? "middle" : "start" }, svg);
    el("path", { d: N ? `M${T0},136 C${T0},190 ${bx + bw / 2},170 ${bx + bw / 2},${b0 - bh - 6}` : `M${T0},136 C${T0 + 120},176 ${bx - 120},170 ${bx - 8},${b0 - bh + 14}`, class: "d-probe" }, svg);
    const T = { r: [0.4, 3.4, 6.4], dur: 1.0, end: 9.5 };
    return (t) => {
      let k = 0; for (let i = 0; i < 3; i++) if (t >= T.r[i]) k = i;
      const u = between(t, T.r[k], T.r[k] + T.dur);
      boxes.forEach((g, i) => (g.style.opacity = i < k ? 1 : i === k ? u : 0));
      const p = k ? R[k - 1] : { base: 0, d: 0 };
      const base = lerp(p.base, R[k].base, u), d = lerp(p.d, R[k].d, u);
      const yb = b0 - bh * base, yd = yb - Math.max(bh * d, 2);
      baseR.setAttribute("y", yb.toFixed(1)); baseR.setAttribute("height", (bh * base).toFixed(1));
      dR.setAttribute("y", yd.toFixed(1)); dR.setAttribute("height", (yb - yd).toFixed(1));
      const lab = `ΔR² ${(u > 0.5 || !k ? R[k] : p).lab}`;
      dlab.textContent = lab;
      if (P.labTop) { dlab.setAttribute("x", W / 2); dlab.setAttribute("y", b0 + 58); }
      else { dlab.setAttribute("x", bx + bw + 12); dlab.setAttribute("y", ((yd + yb) / 2 + 6).toFixed(1)); }
    };
  }

  document.querySelectorAll("figure.diagram").forEach((fig) => {
    const d = fig.dataset.diagram;
    const C = window.CLIPS;
    if (d === "joint") film(fig, 7.4 + clipSecs(C.blind_none, C.blind_masked) + 0.8, joint, [[0, "Five sampler calls denoise the predicted frames and the action tokens together, from σ = 80 to σ = 4, and the decoder returns the clean frame. At every layer the action tokens read the predicted-frame tokens (purple) and the current-frame tokens (gold)."],
      [6.0, "Blinding masks the predicted frames from the action in every layer and head."],
      [7.4, "LingBot-VA on RoboTwin 2.0, both runs from the same initial state. With the read intact the robot puts the box in the basket and moves the basket. With the predicted frames masked the arm stays parked at the edge of the view and the box stays put for all 400 steps."]]);
    if (d === "swap") film(fig, 4.2 + clipSecs(C.swap_none, C.swap_swapped) + 0.8, swap, []);
    if (d === "ladder") film(fig, 9.5, ladder, [[0, "The probe reads the activation at chunk start and predicts the target's displacement δ steps later. We report its gain over a nuisance control."],
      [3.4, "Adding the full simulator state to the control drops the gain from 0.46 to 0.51 down to 0.001 to 0.021."],
      [6.4, "Adding the robot's own upcoming motion leaves it within 0.003 of zero (LIBERO-10, δ = 16)."]]);
  });
})();
