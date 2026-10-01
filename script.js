(() => {
  const THRESHOLD = 200;   // növeld, ha téves riasztást kapsz
  let locked = false;

  const lock = () => {
    if (locked) return;
    locked = true;
    document.documentElement.innerHTML =
      '<head><meta charset="utf-8"></head><body style="margin:0;background:#000"></body>';
  };

  const sizeCheck = () => {
    if (window.outerWidth - window.innerWidth > THRESHOLD ||
        window.outerHeight - window.innerHeight > THRESHOLD) lock();
  };

  const debuggerCheck = () => {
    const t = performance.now();
    debugger;
    if (performance.now() - t > 100) lock();
  };

  setInterval(() => { sizeCheck(); debuggerCheck(); }, 1000);
  window.addEventListener('resize', sizeCheck);

  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(k)) ||
        (e.ctrlKey && k === 'u')) e.preventDefault();
  });
  document.addEventListener('contextmenu', e => e.preventDefault());
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
    editor.style.opacity = 1 - t;
    editor.style.transform = `translateY(${-t * 40}px) scale(${1 - t * 0.05})`;
    editor.style.filter = `blur(${t * 6}px)`;
    card.style.opacity = t;
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