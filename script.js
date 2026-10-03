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
           // Paralaxis eltolás a kurzor miatt
          const dist = Math.hypot(px - x, py - y);
          if (dist < REACH) tgt = Math.max(tgt, Math.pow(1 - dist / REACH, 1.4));
        }
        v[k] = Math.max(v[k] * decay, tgt);
        const s = BASE + v[k] * (maxS - BASE);
        const a = v[k] * 0.45 * Math.sin(k * 1.7);
        
        // Pici háttérpontok (dinamikus opacity)
        const alpha = 0.08 + v[k] * 0.92;
        d.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        d.save(); d.translate(px, py); d.rotate(a);
        rr(d, 0, 0, Math.min(s, SMALL_MAX), Math.min(s, SMALL_MAX) * 0.28);
        d.restore();
        
        // Neon Gooey Effekt (kék-lila-pink színátmenet a térben)
        if (s > 6) {
          const hue = 220 + (i / cols) * 60 + (j / rows) * 60; // 220 to 340 (kék-pink)
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

// --- 3D SVG TILT ---
(() => {
  if (matchMedia('(pointer: coarse)').matches) return;
  
  const helloSvg = document.querySelector('.hero svg');
  if (!helloSvg) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  // SVG target és jelenlegi forgás
  let targetRotX = 0;
  let targetRotY = 0;
  let currRotX = 0;
  let currRotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // CSS változók frissítése a Glowing Background effekthez
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    
    // SVG tilt célpontjainak kiszámítása
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (mouseX - centerX) / centerX;
    const moveY = (mouseY - centerY) / centerY;
    
    targetRotX = -moveY * 15;
    targetRotY = moveX * 15;
  }, { passive: true });

  const loop = () => {
    
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


})();

(() => {
  // Hero halványítása görgetésre
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
  const tooltipImg = pet.querySelector('.pet-tooltip img');
  
  // Ide tölthetsz fel több képet Suzyról!
  const suzyImages = [
    'img/suzy.jpg',
    // 'img/suzy2.jpg',
    // 'img/suzy3.jpg'
  ];

  let pos = area.offsetWidth / 2;
  let direction = 1;
  let currentState = 'idle';
  
  // Random kép beállítása hover esetén
  pet.addEventListener('mouseenter', () => {
    // Ha lesz több kép, véletlenszerűen kiválaszt egyet:
    const randImg = suzyImages[Math.floor(Math.random() * suzyImages.length)];
    tooltipImg.src = randImg;
    
    // Hoverre leül vagy lefekszik
    currentState = Math.random() > 0.5 ? 'sit' : 'lay';
    pet.className = `pet-character ${currentState}`;
    
    // Hover alatt ne mutassa a csontot, csak a képet
    pet.classList.remove('wants-bone');
  });

  pet.addEventListener('mouseleave', () => {
    pet.classList.remove('wants-bone');
    currentState = 'idle';
    pet.className = `pet-character ${currentState}`;
  });

  const updatePet = () => {
    // Ha épp hoverolják, ne változtassuk az állapotát magától
    if (pet.matches(':hover')) return;

    const rand = Math.random();
    
    // Állapot sorsolása
    if (rand < 0.3) currentState = 'walk';
    else if (rand < 0.5) currentState = 'sit';
    else if (rand < 0.7) currentState = 'lay';
    else if (rand < 0.8) currentState = 'bark';
    else currentState = 'idle';

    pet.className = `pet-character ${currentState}`;

    // Csont kérése magától néha
    if ((currentState === 'sit' || currentState === 'idle') && Math.random() < 0.2) {
      pet.classList.add('wants-bone');
    } else {
      pet.classList.remove('wants-bone');
    }

    // Irányváltás séta közben
    if (currentState === 'walk' && Math.random() < 0.3) {
      direction *= -1;
    }
    
    pet.style.transform = `translateX(${pos}px) scaleX(${-direction})`;
  };

  // Séta mozgatása
  setInterval(() => {
    if (currentState === 'walk' || currentState === 'jump') {
      const areaWidth = area.offsetWidth;
      pos += direction * (currentState === 'jump' ? 12 : 8); 
      
      if (pos < 10) { pos = 10; direction = 1; }
      if (pos > areaWidth - 60) { pos = areaWidth - 60; direction = -1; }
      
      pet.style.transform = `translateX(${pos}px) scaleX(${-direction})`;
    }
  }, 100);

  // Állapotváltás gyakrabban (2 másodpercenként)
  setInterval(updatePet, 2000);
  
  window.addEventListener('resize', () => {
    if (pos > area.offsetWidth - 60) pos = area.offsetWidth - 60;
    pet.style.transform = `translateX(${pos}px) scaleX(${-direction})`;
  });
})();

(() => {
  const i18n = {
    nav_home: { hu: "Főoldal", en: "Home" },
    nav_about: { hu: "Rólam", en: "About" },
    nav_projects: { hu: "Projektek", en: "Projects" },
    nav_contact: { hu: "Kapcsolat", en: "Contact" },
    hero_sub: { hu: "Görgess lefelé, és megmutatom, ki vagyok.", en: "Scroll down, let me show you who I am." },
    code_passion: { hu: "Kreatív Fejlesztés", en: "Creative Development" },
    code_skills_3: { hu: "Játékszerverek", en: "Game Servers" },
    code_comment: { hu: "// Egységes, letisztult dizájn!", en: "// Unified, clean design!" },
    about_role: { hu: "Szoftverfejlesztő & Dizájner", en: "Software Developer & Designer" },
    about_desc: { hu: "Szenvedélyem az egyedi, kreatív weboldalak és letisztult felhasználói felületek készítése. Fontos számomra, hogy amit alkotok, az ne csak jól működjön, de vizuálisan is maradandó élményt nyújtson.", en: "I am passionate about creating unique, creative websites and clean user interfaces. It's important to me that what I build not only works well, but also provides a lasting visual experience." },
    chip_creative: { hu: "Kreatív", en: "Creative" },
    chip_coding: { hu: "Kódolás", en: "Coding" },
    proj1_desc: { hu: "Iskolai vizsgaremekként elkészített gasztronómiai webes projekt.", en: "Gastronomy web project created as a school exam masterpiece." },
    proj1_chip1: { hu: "Webfejlesztés", en: "Web Dev" },
    proj1_chip2: { hu: "Vizsgamunka", en: "Exam Project" },
    proj_btn_view: { hu: "Megnézem", en: "View" },
    proj2_desc: { hu: "Egyedi Roleplay szerver projekt. (Jelenleg szünetel)", en: "Custom Roleplay server project. (Currently paused)" },
    proj2_chip1: { hu: "Játékszerver", en: "Game Server" },
    proj2_chip2: { hu: "Közösség", en: "Community" },
    proj_btn_paused: { hu: "Szünetel", en: "Paused" },
    proj3_desc: { hu: "A jelenlegi bemutatkozó weboldalam.", en: "My current portfolio website." },
    contact_title: { hu: "Beszéljünk!", en: "Let's Talk!" },
    contact_desc: { hu: "Nyitott vagyok új projektekre. Keress bátran az alábbi platformokon!", en: "I am open to new projects. Feel free to contact me on the platforms below!" }
  };

  let currentLang = 'hu';
  const btn = document.getElementById('lang-toggle');
  
  if (btn) {
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'hu' ? 'en' : 'hu';
      btn.textContent = currentLang === 'hu' ? 'EN' : 'HU';
      
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[key] && i18n[key][currentLang]) {
          if (el.tagName === 'SPAN' && el.classList.contains('s')) {
             el.textContent = `"${i18n[key][currentLang]}"`; // Retain quotes for JS string
          } else {
             el.textContent = i18n[key][currentLang];
          }
        }
      });
    });
  }
})();