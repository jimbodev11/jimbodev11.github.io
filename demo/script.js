(function() {
  const i18n = {
    en: {
      ticker: ['REACTIVE', 'MODULAR', 'PIXEL-PERFECT', 'HIGH-PERFORMANCE', 'NO FLUFF'],
      nav_about: 'ABOUT',
      nav_surveillance: 'SURVEILLANCE',
      nav_faq: 'FAQ',
      nav_contact: 'CONTACT',
      nav_status: 'BUDAPEST // AVAILABLE FOR COMMISSIONS',
      hero_meta_arch: 'SYS_KERNEL_v2.4 // ARCH: x86_64',
      hero_meta_coord: 'LAT: 47.4979° N // LONG: 19.0402° E',
      hero_meta_loc: 'BUDAPEST, HU',
      hero_tagline: 'Sculpting visual systems, high-performance web architecture & custom gaming ecosystems.',
      hero_pill_1: '[01] FRONTEND & UI/UX',
      hero_pill_2: '[02] FIVEM & GAME SYSTEMS',
      hero_pill_3: '[03] FULL-STACK ARCHITECTURE',
      hands_tag_1: '// CRAFT & IDENTITY',
      hands_desc_1: 'Every interface carries distinct atmosphere and character. No generic templates: bespoke typography, fluid micro-interactions, and immaculate craft.',
      hands_tag_2: '// LOW LATENCY SYSTEMS',
      hands_desc_2: 'C#, Lua, modern JavaScript and robust backends. Engineered for high-throughput gaming networks and ultra-responsive web engines.',
      cctv_header: '// SURVEILLANCE FEED v2.1.4',
      cctv_rec: 'RECORDING ACTIVE',
      cctv_online: '03 / 03 FEEDS ONLINE',
      cctv_cam1_label: 'WEB ARCHITECTURE',
      cctv_cam2_label: 'GAME SYSTEMS',
      cctv_cam3_label: 'INTERACTION DESIGN',
      cctv_status: 'FEED_ACTIVE',
      faq_title: 'FAQ',
      faq_note_1: 'ASKED OFTEN',
      faq_note_2: 'ANSWERED WITHOUT FILTER',
      faq_q1: 'What kind of projects do you build?',
      faq_a1: 'Modern web platforms, custom UI/UX design systems, complex FiveM game frameworks, RESTful APIs, and full digital brand identities. From early concepts to the last line of code, everything is engineered in-house.',
      faq_q2: 'What is your core tech stack?',
      faq_a2: 'JavaScript, TypeScript, C#, Lua, CSS3 / Canvas, Node.js, and SQL. I choose the best suited tool for each challenge to achieve maximum performance and long-term stability.',
      faq_q3: 'How does collaboration work?',
      faq_a3: 'Transparent, asynchronous workflow with live interactive previews at every milestone. Direct communication via Discord or Email with zero friction or drawn-out meetings.',
      contact_avail_title: 'AVAILABILITY',
      contact_avail_desc: 'OPEN FOR CLIENT COMMISSIONS',
      contact_loc: 'BUDAPEST / REMOTE',
      contact_discord_label: 'DIRECT DISCORD',
      contact_rights: '© 2026 JIMBO DEV · ALL RIGHTS RESERVED',
      contact_craft: 'HANDCRAFTED DESIGN & CODE'
    },
    hu: {
      ticker: ['REAKTÍV', 'MODULÁRIS', 'PIXEL-PONTOS', 'NAGY SEBESSÉG', 'KOMPROMISSZUMMENTES'],
      nav_about: 'RÓLAM',
      nav_surveillance: 'FIGYELŐ',
      nav_faq: 'GYIK',
      nav_contact: 'KAPCSOLAT',
      nav_status: 'BUDAPEST // ELÉRHETŐ MEGBÍZÁSOKRA',
      hero_meta_arch: 'SYS_KERNEL_v2.4 // ARCH: x86_64',
      hero_meta_coord: 'SZÉL: 47.4979° É // HOSSZ: 19.0402° K',
      hero_meta_loc: 'BUDAPEST, HU',
      hero_tagline: 'Vizuális rendszerek, nagy teljesítményű webes architektúra és egyedi játékszerver ökoszisztémák építése.',
      hero_pill_1: '[01] FRONTEND & UI/UX',
      hero_pill_2: '[02] FIVEM & JÁTÉK RENDSZEREK',
      hero_pill_3: '[03] FULL-STACK ARCHITEKTÚRA',
      hands_tag_1: '// IDENTITÁS & PRECIZITÁS',
      hands_desc_1: 'Minden felületnek arca és atmoszférája van. Nem használok generikus sablonokat: egyedi tipográfia, finom mikromozgások és letisztult esztétika.',
      hands_tag_2: '// KISEBESSÉGŰ RENDSZEREK',
      hands_desc_2: 'C#, Lua, modern JavaScript és robusztus háttérrendszerek. Komplex játékszerver architektúrák és optimalizált webes motorok.',
      cctv_header: '// BIZTONSÁGI RENDSZER v2.1.4',
      cctv_rec: 'RÖGZÍTÉS AKTÍV',
      cctv_online: '03 / 03 KAMERA ONLINE',
      cctv_cam1_label: 'WEB ARCHITEKTÚRA',
      cctv_cam2_label: 'JÁTÉK RENDSZEREK',
      cctv_cam3_label: 'INTERAKCIÓS DIZÁJN',
      cctv_status: 'ADÁS_AKTÍV',
      faq_title: 'GYIK',
      faq_note_1: 'GYAKRAN FELTETT',
      faq_note_2: 'SZŰRŐ NÉLKÜLI VÁLASZOK',
      faq_q1: 'Milyen projekteken dolgozol?',
      faq_a1: 'Modern webes felületek, egyedi UI/UX tervezés, FiveM rendszerek, backend API-k és teljes digitális arculatok. Mindent a tervezéstől az utolsó pixelig és kódsorig magam építek.',
      faq_q2: 'Mi a technológiai stack?',
      faq_a2: 'JavaScript, TypeScript, C#, Lua, CSS3 / Canvas, Node.js és SQL. A megfelelő eszközt választom az adott feladathoz a maximális sebesség és stabilitás érdekében.',
      faq_q3: 'Hogyan zajlik a közös munka?',
      faq_a3: 'Átlátható, folyamatos élő előnézetekkel (live previews). Felesleges többórás meetingek nélkül, gyors iterációkkal és közvetlen kommunikációval Discordon vagy emailben.',
      contact_avail_title: 'ELÉRHETŐSÉG',
      contact_avail_desc: 'ELÉRHETŐ ÚJ PROJEKTEKRE',
      contact_loc: 'BUDAPEST / TÁVMUNKA',
      contact_discord_label: 'KÖZVETLEN DISCORD',
      contact_rights: '© 2026 JIMBO DEV · MINDEN JOG FENNTARTVA',
      contact_craft: 'KÉZZEL ÍRT KÓD ÉS DIZÁJN'
    }
  };

  let currentLang = localStorage.getItem('demo_lang') || 'en';
  const langBtn = document.getElementById('lang-btn');
  const langLabel = document.getElementById('lang-label');
  const tickerEl = document.getElementById('ticker-text');
  let tickerIndex = 0;

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('demo_lang', lang);
    langLabel.textContent = lang === 'en' ? 'HU' : 'EN';

    const dict = i18n[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    if (tickerEl) {
      tickerIndex = 0;
      tickerEl.textContent = dict.ticker[0];
    }
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'en' ? 'hu' : 'en';
      applyLanguage(nextLang);
    });
  }

  applyLanguage(currentLang);

  if (tickerEl) {
    setInterval(() => {
      const words = i18n[currentLang].ticker;
      tickerIndex = (tickerIndex + 1) % words.length;
      tickerEl.style.opacity = '0';
      setTimeout(() => {
        tickerEl.textContent = words[tickerIndex];
        tickerEl.style.opacity = '1';
      }, 200);
    }, 2800);
  }

  const burgerBtn = document.getElementById('nav-burger');
  const mobileNav = document.getElementById('mobile-nav');
  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    document.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  const canvas = document.getElementById('hands-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const imgL = new Image();
    const imgR = new Image();
    imgL.src = '../img/hand-left.png';
    imgR.src = '../img/hand-right.png';

    let width, height;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width * (window.devicePixelRatio || 1);
      height = canvas.height = rect.height * (window.devicePixelRatio || 1);
    }
    window.addEventListener('resize', resize);
    resize();

    let mouseProximity = 0;
    let targetProximity = 0.25;

    function handlePointer(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        const norm = Math.abs((clientX - window.innerWidth / 2) / (window.innerWidth / 2));
        targetProximity = Math.max(0, 1 - norm);
      } else {
        targetProximity = 0.25;
      }
    }

    window.addEventListener('mousemove', (e) => {
      handlePointer(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const rect = canvas.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.top < viewH && rect.bottom > 0) {
        const centerDist = Math.abs((rect.top + rect.height / 2) - viewH / 2);
        const maxDist = viewH / 2 + rect.height / 2;
        const scrollProx = Math.max(0, 1 - centerDist / maxDist);
        targetProximity = Math.max(targetProximity, scrollProx * 0.9);
      }
    }, { passive: true });

    const sparks = [];
    function addSpark(x, y) {
      sparks.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 1,
        decay: 0.04 + Math.random() * 0.05
      });
    }

    function render(time) {
      mouseProximity += (targetProximity - mouseProximity) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(width / 1100, height / 620);
      const centerX = width / 2;
      const centerY = height / 2;

      const baseGap = 220 * scale;
      const currentGap = baseGap * (1 - mouseProximity * 0.78);

      const drawWidthL = 440 * scale;
      const drawHeightL = 260 * scale;
      const drawWidthR = 514 * scale;
      const drawHeightR = 290 * scale;

      const posLX = centerX - currentGap / 2 - drawWidthL + (33 * scale);
      const posLY = centerY - drawHeightL / 2 - (10 * scale);

      const posRX = centerX + currentGap / 2 - (31 * scale);
      const posRY = centerY - drawHeightR / 2 + (12 * scale);

      if (imgL.complete && imgL.naturalWidth) {
        ctx.drawImage(imgL, posLX, posLY, drawWidthL, drawHeightL);
      }
      if (imgR.complete && imgR.naturalWidth) {
        ctx.drawImage(imgR, posRX, posRY, drawWidthR, drawHeightR);
      }

      const tipLX = posLX + (407 * scale);
      const tipLY = posLY + (171 * scale);
      const tipRX = posRX + (31 * scale);
      const tipRY = posRY + (128 * scale);

      const sparkMidX = (tipLX + tipRX) / 2;
      const sparkMidY = (tipLY + tipRY) / 2;

      if (mouseProximity > 0.45) {
        const pulse = 0.5 + 0.5 * Math.sin(time / 160);
        const glowRad = (12 + pulse * 28) * scale;
        const grad = ctx.createRadialGradient(sparkMidX, sparkMidY, 0, sparkMidX, sparkMidY, glowRad);
        grad.addColorStop(0, `rgba(0, 255, 136, ${0.9 * pulse})`);
        grad.addColorStop(0.4, `rgba(0, 255, 136, ${0.4 * pulse})`);
        grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sparkMidX, sparkMidY, glowRad, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() < 0.8) {
          addSpark(sparkMidX, sparkMidY);
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
        ctx.lineWidth = 1.2 * scale;
        ctx.beginPath();
        ctx.moveTo(tipLX, tipLY);
        ctx.lineTo(sparkMidX + (Math.random() - 0.5) * 8 * scale, sparkMidY + (Math.random() - 0.5) * 8 * scale);
        ctx.lineTo(tipRX, tipRY);
        ctx.stroke();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx * scale;
        sp.y += sp.vy * scale;
        sp.life -= sp.decay;
        if (sp.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(0, 255, 136, ${sp.life})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  const timeEls = document.querySelectorAll('.cctv-time');
  function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    timeEls.forEach(el => {
      el.textContent = `${h}:${m}:${s}.${ms}`;
    });
  }
  setInterval(updateTime, 40);

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
})();
