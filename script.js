(() => {
  const hero = document.getElementById('hero');
  const goo = document.getElementById('goo'), dots = document.getElementById('dots');
  const g = goo.getContext('2d'), d = dots.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;   // telefon/tablet: nincs egĂ©rkĂ¶vetĂ©s, csak random mozgĂˇs
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
    W = window.innerWidth; H = window.innerHeight;
    [goo, dots].forEach(c => { c.width = W * dpr; c.height = H * dpr; });
    g.setTransform(dpr, 0, 0, dpr, 0, 0); d.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / GAP) + 1; rows = Math.ceil(H / GAP) + 1;
    v = new Float32Array(cols * rows);
  };

  const frame = now => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (visible) {
      const pts = [];
      if (!touch && now - moved < 2500) pts.push([mx, my]);
      else walkers.forEach(w => {
        if (now > w.next) { w.tx = rnd(0, W); w.ty = rnd(0, H); w.next = now + rnd(1200, 2800); if (!w.x) { w.x = w.tx; w.y = w.ty; } }
        const k = 1 - Math.exp(-dt * 1.6);
        w.x += (w.tx - w.x) * k; w.y += (w.ty - w.y) * k;
        pts.push([w.x, w.y]);
      });
      const decay = Math.pow(0.9, dt * 60);
      g.clearRect(0, 0, W, H);
      d.clearRect(0, 0, W, H);
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
        const alpha = 0.08 + v[k] * 0.92;
        d.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        d.save(); d.translate(px, py); d.rotate(a);
        rr(d, 0, 0, Math.min(s, SMALL_MAX), Math.min(s, SMALL_MAX) * 0.28);
        d.restore();
        if (s > 6) {
          const hue = 220 + (i / cols) * 60 + (j / rows) * 60; // 220 to 340 (kĂ©k-pink)
          g.fillStyle = `hsl(${hue}, 100%, 70%)`;
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

  if (reduce) {
    d.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) rr(d, i * GAP, j * GAP, BASE, 1);
  } else requestAnimationFrame(frame);
})();
(() => {
  if (matchMedia('(pointer: coarse)').matches) return;

  const helloSvg = document.querySelector('.hero svg');
  if (!helloSvg) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetRotX = 0;
  let targetRotY = 0;
  let currRotX = 0;
  let currRotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (mouseX - centerX) / centerX;
    const moveY = (mouseY - centerY) / centerY;

    targetRotX = -moveY * 15;
    targetRotY = moveX * 15;
  }, { passive: true });

  const loop = () => {
    if (helloSvg) {
      currRotX += (targetRotX - currRotX) * 0.1;
      currRotY += (targetRotY - currRotY) * 0.1;
      helloSvg.style.transform = `perspective(1000px) rotateX(${currRotX}deg) rotateY(${currRotY}deg) translateZ(20px)`;
    }

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

})();

(() => {
  const heroText = document.querySelector('.hero > div');
  if (!heroText) return;
  let tick = false;
  window.addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.7));
      heroText.style.opacity = opacity;
    });
  }, { passive: true });
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
  }, { threshold: 0.3 }); // Amikor a szekciĂł 30%-a lĂˇtszik

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
      sub.textContent = (d.isPlaying ? '' : 'utoljĂˇra Â· ') + d.artist;
      el.href = d.url;
      el.classList.toggle('playing', !!d.isPlaying);
      el.hidden = false;
      requestAnimationFrame(() => {
        el.classList.add('data-ready');
      });
    } catch { el.hidden = true; }
  };
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
window.addEventListener('load', () => {
  setTimeout(() => {
    const header = document.querySelector('.site-header');
    const np = document.querySelector('.np');

    if (header) header.classList.add('loaded');
    if (np) np.classList.add('loaded');
  }, 500);
});
(() => {
  const pet = document.querySelector('.pet-character');
  const overlay = document.getElementById('suzy-easter-egg');
  if (!pet || !overlay) return;

  const closeBtn = overlay.querySelector('.close-easter-egg');
  const items = overlay.querySelectorAll('.carousel-item');
  let clicks = 0;
  let clickTimer;
  let activeIndex = 0;
  let currentRotation = 0;
  const theta = 360 / items.length;
  let autoplayTimer;

  const getRadius = () => {
    const itemWidth = items[0].offsetWidth || 300;
    // Matematikailag a minimális sugár, hogy a kártyák szélei épp összeérjenek: (width / 2) / tan(36deg)
    // Rápakolunk még 20px-et (vagy többet), hogy biztosan legyen köztük kis rés és ne lógjanak egymásba
    const minRadius = (itemWidth / 2) / Math.tan(Math.PI / items.length) + 30;
    return window.innerWidth > 768 ? 350 : minRadius;
  };

  const startAutoplay = () => {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      activeIndex = (activeIndex + 1) % items.length;
      updateCarousel();
    }, 2500);
  };

  pet.addEventListener('click', () => {
    clicks++;
    clearTimeout(clickTimer);
    if (clicks >= 5) {
      overlay.classList.add('show');
      updateCarousel();
      startAutoplay();
      clicks = 0;
    } else {
      clickTimer = setTimeout(() => { clicks = 0; }, 1000);
    }
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
    clearInterval(autoplayTimer);
  });

  const updateCarousel = () => {
    const radius = getRadius();
    let targetRotation = -activeIndex * theta;
    let diff = (targetRotation - currentRotation) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    currentRotation += diff;

    const track = document.querySelector('.carousel-track');
    track.style.transform = `translateZ(${-radius}px) rotateY(${currentRotation}deg)`;

    items.forEach((item, i) => {
      item.style.transform = `rotateY(${i * theta}deg) translateZ(${radius}px)`;

      let offset = Math.abs(i - activeIndex);
      if (offset > items.length / 2) offset = items.length - offset; 
      
      item.style.filter = `brightness(${offset === 0 ? 1 : Math.max(0.2, 1 - (offset * 0.4))})`;
      item.style.pointerEvents = 'auto'; 
    });
  };

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (i !== activeIndex) {
        activeIndex = i;
        updateCarousel();
        startAutoplay();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (overlay.classList.contains('show')) updateCarousel();
  });

  updateCarousel();
})();

