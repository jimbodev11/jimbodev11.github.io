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

// --- SMOOTH JS CURSOR & 3D SVG TILT ---
(() => {
  if (matchMedia('(pointer: coarse)').matches) return;
  
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const helloSvg = document.querySelector('.hero svg');
  
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  
  // SVG target és jelenlegi forgás
  let targetRotX = 0;
  let targetRotY = 0;
  let currRotX = 0;
  let currRotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Pötty azonnal követ
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    
    // SVG tilt célpontjainak kiszámítása
    if (helloSvg) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (mouseX - centerX) / centerX;
      const moveY = (mouseY - centerY) / centerY;
      
      targetRotX = -moveY * 15; // Max 15 fok
      targetRotY = moveX * 15;
    }
  }, { passive: true });

  const loop = () => {
    // Gyűrű simán leköveti a pöttyöt (lerp)
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    
    // SVG finomított (lerp) dőlése
    if (helloSvg) {
      currRotX += (targetRotX - currRotX) * 0.1;
      currRotY += (targetRotY - currRotY) * 0.1;
      // Itt nincs szükség CSS transitionre, maga a JS végzi a simítást percenként 60 képkockával
      helloSvg.style.transform = `perspective(1000px) rotateX(${currRotX}deg) rotateY(${currRotY}deg) translateZ(20px)`;
    }
    
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  // Hover effektek a gyűrűn
  const interactables = document.querySelectorAll('a, button, .pet-character, .project-card, .social-link');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();

(() => {
   const L = [
    [['k','const '],['','me'],['',' = {']],
    [['','  '],['p','name'],['',': '],['s','"Jimbo"'],['',',']],
    [['','  '],['p','roles'],['',': ['],['s','"Web"'],['',', '],['s','"C# Szoftver"'],['',', '],['s','"FiveM Lua"'],['','],']],
    [['','  '],['p','stack'],['',': ['],['s','"Web"'],['',', '],['s','"C#"'],['',', '],['s','"Lua"'],['','],']],
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
    const enter = clamp(1 - r.top / innerHeight);   
    const exit = clamp(r.bottom / innerHeight);      
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

(() => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    let currentId = '';
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentId = entry.target.id;
      }
    });
    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { threshold: 0.3 }); // Amikor a szekció 30%-a látszik

  sections.forEach(sec => observer.observe(sec));
})();

(() => {
  const NOW_PLAYING_URL = 'https://spotify-now-playing.marton-bence-david.workers.dev';
  const el = document.getElementById('np');
  if (!el || !NOW_PLAYING_URL) return;
  const img = el.querySelector('img'), title = el.querySelector('b'), sub = el.querySelector('small');
  const mobile = matchMedia('(max-width:600px)');

  const load = async () => {
    try {
      const r = await fetch(NOW_PLAYING_URL);
      if (!r.ok) throw 0;
      const d = await r.json();
      if (!d.title) { el.hidden = true; return; }
      img.src = d.image || '';
      title.textContent = d.title;
      sub.textContent = (d.isPlaying ? '' : 'utoljára · ') + d.artist;
      el.href = d.url;
      el.classList.toggle('playing', !!d.isPlaying);
      el.hidden = false;
      
      // Megvárjuk, hogy a DOM frissüljön a display:none levétele után,
      // majd hozzáadjuk a data-ready classt, hogy a transition lefuthessen.
      requestAnimationFrame(() => {
        el.classList.add('data-ready');
      });
    } catch { el.hidden = true; }
  };

  // telefonon az első koppintás kinyitja, a második megnyitja a számot
  el.addEventListener('click', e => {
    if (mobile.matches && !el.classList.contains('open')) {
      e.preventDefault(); el.classList.add('open');
      setTimeout(() => el.classList.remove('open'), 5000);
    }
  });

  load();
  setInterval(() => { if (!document.hidden) load(); }, 20000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) load(); });
})();

// Header beúszás logikája a "hello" animáció felett
window.addEventListener('load', () => {
  setTimeout(() => {
    const header = document.querySelector('.site-header');
    const np = document.querySelector('.np');
    
    if (header) header.classList.add('loaded');
    if (np) np.classList.add('loaded');
  }, 500);
});

// Interaktív Kutyus Logika
(() => {
  const pet = document.querySelector('.pet-character');
  if (!pet) return;
  const area = document.getElementById('pet-area');
  
  let pos = area.offsetWidth / 2;
  let direction = 1;
  let currentState = 'idle';

  const updatePet = () => {
    const rand = Math.random();
    
    // Állapot sorsolása
    if (rand < 0.4) currentState = 'walk';
    else if (rand < 0.6) currentState = 'sit';
    else if (rand < 0.7) currentState = 'lay';
    else if (rand < 0.8) currentState = 'spin';
    else currentState = 'idle';

    pet.className = `pet-character ${currentState}`;

    // Csont kérése (gondolatbuborék)
    if ((currentState === 'sit' || currentState === 'idle') && Math.random() < 0.35) {
      pet.classList.add('wants-bone');
    } else {
      pet.classList.remove('wants-bone');
    }

    // Irányváltás séta közben
    if (currentState === 'walk' && Math.random() < 0.3) {
      direction *= -1;
    }
    
    pet.style.transform = `translateX(${pos}px) scaleX(${direction})`;
  };

  // Séta mozgatása
  setInterval(() => {
    if (currentState === 'walk') {
      const areaWidth = area.offsetWidth;
      pos += direction * 8; // Sebesség
      
      // Pattanjon vissza a szélekről (50px a kutya szélessége)
      if (pos < 10) { pos = 10; direction = 1; }
      if (pos > areaWidth - 60) { pos = areaWidth - 60; direction = -1; }
      
      pet.style.transform = `translateX(${pos}px) scaleX(${direction})`;
    }
  }, 100);

  // Állapotváltás 3 másodpercenként
  setInterval(updatePet, 3000);
  
  // Ablak átméretezéskor frissítsük a pozíciót ha túlment
  window.addEventListener('resize', () => {
    if (pos > area.offsetWidth - 60) pos = area.offsetWidth - 60;
    pet.style.transform = `translateX(${pos}px) scaleX(${direction})`;
  });
})();