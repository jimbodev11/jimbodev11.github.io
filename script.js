
(() => {
  const hero = document.getElementById('hero');
  const goo = document.getElementById('goo'), dots = document.getElementById('dots');
  const g = goo.getContext('2d'), d = dots.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;   // telefon/tablet: nincs egérkövetés, csak random mozgás
  const GAP = touch ? 44 : 56, BASE = 3.2, REACH = touch ? 150 : 230, SMALL_MAX = 8;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const walkers = Array.from({ length: touch ? 3 : 1 }, () => ({ x: 0, y: 0, tx: 0, ty: 0, next: 0 }));
  let W = 0, H = 0, cols = 0, rows = 0, v = [], dpr = 1;
  let mx = -9999, my = -9999, moved = 0, visible = true, last = performance.now();
 
  const rr = (c, x, y, s, r) => {
    const h = s / 2;
    c.beginPath(); c.roundRect(x - h, y - h, s, s, r); c.fill();
  };
 
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    [goo, dots].forEach(c => { c.width = W * dpr; c.height = H * dpr; });
    g.setTransform(dpr, 0, 0, dpr, 0, 0); d.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / GAP) + 1; rows = Math.ceil(H / GAP) + 1;
    v = new Float32Array(cols * rows);
  };
 
  const frame = now => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (visible) {
      const rect = hero.getBoundingClientRect();
      const pts = [];
      if (!touch && now - moved < 2500) pts.push([mx - rect.left, my - rect.top]);
      else walkers.forEach(w => {
        if (now > w.next) { w.tx = rnd(0, W); w.ty = rnd(0, H); w.next = now + rnd(1200, 2800); if (!w.x) { w.x = w.tx; w.y = w.ty; } }
        const k = 1 - Math.exp(-dt * 1.6);
        w.x += (w.tx - w.x) * k; w.y += (w.ty - w.y) * k;
        pts.push([w.x, w.y]);
      });
      const decay = Math.pow(0.9, dt * 60);
      g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      d.clearRect(0, 0, W, H);
      g.fillStyle = d.fillStyle = '#fff';
      const maxS = GAP * 1.08;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const k = j * cols + i, px = i * GAP, py = j * GAP;
        let tgt = 0;
        for (const [x, y] of pts) {
          const dist = Math.hypot(px - x, py - y);
          if (dist < REACH) tgt = Math.max(tgt, Math.pow(1 - dist / REACH, 1.4));
        }
        v[k] = Math.max(v[k] * decay, tgt);
        const s = BASE + v[k] * (maxS - BASE);
        const a = v[k] * 0.45 * Math.sin(k * 1.7);
        d.save(); d.translate(px, py); d.rotate(a);
        rr(d, 0, 0, Math.min(s, SMALL_MAX), Math.min(s, SMALL_MAX) * 0.28);
        d.restore();
        if (s > 6) {
          g.save(); g.translate(px, py); g.rotate(a);
          rr(g, 0, 0, s, s * 0.3);
          g.restore();
        }
      }
    }
    requestAnimationFrame(frame);
  };
 
  size();
  addEventListener('resize', size);
  addEventListener('pointermove', e => { if (touch) return; mx = e.clientX; my = e.clientY; moved = performance.now(); }, { passive: true });
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(hero);
 
  if (reduce) {
    d.fillStyle = '#fff';
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) rr(d, i * GAP, j * GAP, BASE, 1);
  } else requestAnimationFrame(frame);
})();

(() => {
  const L = [
    [['k','const '],['','me'],['',' = {']],
    [['','  '],['p','name'],['',': '],['s','"[Név]"'],['',',']],
    [['','  '],['p','role'],['',': '],['s','"webfejlesztő"'],['',',']],
    [['','  '],['p','stack'],['',': ['],['s','"HTML"'],['',', '],['s','"CSS"'],['',', '],['s','"JavaScript"'],['','],']],
    [['','  '],['p','open'],['',': '],['k','true'],['',',']],
    [['','};']],
    [],
    [['c','// görgess tovább: lefordítom']],
    [['k','function '],['f','render'],['','() {']],
    [['','  '],['k','return '],['','me;']],
    [['','}']]
  ];
  const total = L.reduce((a, l) => a + l.reduce((b, t) => b + t[1].length, 0), 0);
  const stage = document.getElementById('stage');
  const hero = document.getElementById('hero');
  const editor = document.getElementById('editor');
  const card = document.getElementById('card');
  const code = document.getElementById('code');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
 
  let last = -1;
  const draw = shown => {
    if (shown === last) return; last = shown;
    let left = shown, out = '';
    L.forEach(line => {
      let html = '';
      line.forEach(([c, t]) => {
        if (left <= 0) return;
        const part = t.slice(0, left); left -= part.length;
        html += c ? `<span class="${c}">${esc(part)}</span>` : esc(part);
      });
      out += `<span class="ln">${html}</span>`;
    });
    code.innerHTML = out;
    if (shown < total && shown > 0) {
      const lines = code.querySelectorAll('.ln');
      let idx = 0, rem = shown;
      for (let i = 0; i < L.length; i++) {
        const len = L[i].reduce((b, t) => b + t[1].length, 0);
        if (rem <= len) { idx = i; break; } rem -= len; idx = i;
      }
      const c = document.createElement('span'); c.className = 'caret';
      (lines[idx] || lines[lines.length - 1]).appendChild(c);
    }
  };
 
  const update = () => {
    if (!stage.isConnected) return;
    const r = stage.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight));
    draw(Math.floor(clamp(p / 0.6) * total));
    const t = clamp((p - 0.68) / 0.22);
    const enter = clamp(1 - r.top / innerHeight);   // belépéskor felfelé úszik be
    const exit = clamp(r.bottom / innerHeight);      // kilépéskor elhalványul
    hero.style.opacity = clamp(1 - scrollY / (innerHeight * 0.85));
    editor.style.opacity = (1 - t) * enter;
    editor.style.transform = `translateY(${-t * 40}px) scale(${1 - t * 0.05})`;
    editor.style.filter = `blur(${t * 6}px)`;
    card.style.opacity = t * exit;
    card.style.transform = `translateY(${(1 - t) * 40}px)`;
  };
 
  if (reduce) { draw(total); return; }
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; update(); });
  }, { passive: true });
  addEventListener('resize', update);
  update();
})();

(() => {
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('in', e.isIntersecting)),
    { threshold: 0.35 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


document.addEventListener('contextmenu', e => e.preventDefault());