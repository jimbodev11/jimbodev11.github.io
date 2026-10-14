(function() {
  const i18n = {
    en: {
      ticker: ['NO MORË TALK', 'AFTËRLYFE', 'BEYOND THE REALM', 'GHOST IN THE SYSTEM', 'PHANTOM CORE'],
      nav_about: 'ABOUT',
      nav_surveillance: 'NIGHT VISION',
      nav_faq: 'DOSSIER',
      nav_contact: 'TRANSMIT',
      nav_status: 'SECTOR: BUDAPEST // SIGNAL: UNLOCKED',
      hero_meta_arch: '// FREQUENCY: 432 Hz // NIGHT_VISION: ACTIVE',
      hero_meta_coord: 'SPECTRAL LOC: 47.4979° N // 19.0402° E',
      hero_meta_loc: 'AFTËRLYFE ARCHIVE // CORP_11',
      hero_tagline: 'Transcending limits into the digital afterlyfe. Ethereal UI/UX architectures, distributed low-latency gaming networks & bespoke web engineering.',
      hero_pill_1: '[01] ETHEREAL FRONTEND & UI/UX',
      hero_pill_2: '[02] FIVEM & PARANORMAL NETWORKS',
      hero_pill_3: '[03] AFTËRLYFE FULL-STACK RUNTIME',
      hands_tag_1: '// PHENOMENON 01: ETHEREAL CRAFT',
      hands_desc_1: 'Visual interfaces designed beyond conventional boundaries. Zero generic templates: eerie lighting, spectral phosphor contrast, and meticulous precision.',
      hands_tag_2: '// PHENOMENON 02: HIGH-OUTPUT SYSTEMS',
      hands_desc_2: 'C#, Lua, asynchronous JavaScript and robust server runtimes. Engineered for massive concurrency, seamless low latency, and immortal uptime.',
      cctv_header: '// AFTËRLYFE NIGHT VISION // IR SENSORS ACTIVE',
      cctv_rec: 'NIGHT CAM REC ●',
      cctv_online: '03 / 03 SENSORS ONLINE',
      cctv_cam1_label: 'CORE PLATFORM ARCH',
      cctv_cam2_label: 'DISTRIBUTED GAME SYSTEMS',
      cctv_cam3_label: 'TACTICAL UI LAB',
      cctv_status: 'FEED: STABLE',
      faq_title: 'DOSSIER',
      faq_note_1: 'CLASSIFIED ARCHIVE',
      faq_note_2: 'FILTER OVERRIDE ACTIVE',
      faq_q1: 'What project scopes do you undertake?',
      faq_a1: 'Custom web platforms, brutalist UI/UX design architectures, high-performance FiveM game servers, low-latency microservices and end-to-end digital branding. Everything is built from ground zero without third-party template bloat.',
      faq_q2: 'What is the technical weapon of choice?',
      faq_a2: 'TypeScript, modern JavaScript, C#, Lua, CSS3 / Canvas shader logic, Node.js, and SQL. I deploy battle-tested technologies engineered for stability, maximum frame rates, and zero latency.',
      faq_q3: 'How is the transmission and deployment handled?',
      faq_a3: 'Direct, asynchronous communication via Discord or secure email. Regular live preview staging at every build phase. Zero bloated corporate meetings; pure execution.',
      contact_avail_title: 'TRANSMISSION FREQUENCY',
      contact_avail_desc: 'OPEN FOR COMMERCIAL COMMISSIONS',
      contact_loc: 'BUDAPEST // REMOTE WORLDWIDE',
      contact_discord_label: 'ENCRYPTED DISCORD',
      contact_rights: '© 2026 JIMBO DEV // AFTËRLYFE ARCHIVE',
      contact_craft: 'ALL FREQUENCIES SECURED'
    },
    hu: {
      ticker: ['NINCS TÖBB BESZÉD', 'AFTËRLYFE', 'A HATÁROKON TÚL', 'SZELLEM A RENDSZERBEN', 'FANTOM MAG'],
      nav_about: 'RÓLAM',
      nav_surveillance: 'ÉJJELLÁTÓ',
      nav_faq: 'DOKUMENTÁCIÓ',
      nav_contact: 'KAPCSOLAT',
      nav_status: 'SZEKTOR: BUDAPEST // JEL: FELOLDVA',
      hero_meta_arch: '// FREKVENCIA: 432 Hz // ÉJJELLÁTÓ: AKTÍV',
      hero_meta_coord: 'SPEKTRÁLIS HELY: 47.4979° É // 19.0402° K',
      hero_meta_loc: 'AFTËRLYFE ARCHÍVUM // CORP_11',
      hero_tagline: 'Határok átlépése a digitális túlvilágba. Éteri UI/UX architektúrák, osztott alacsony késleltetésű játékhálózatok és egyedi webes mérnökség.',
      hero_pill_1: '[01] ÉTERI FRONTEND & UI/UX',
      hero_pill_2: '[02] FIVEM & PARANORMÁLIS HÁLÓZATOK',
      hero_pill_3: '[03] AFTËRLYFE FULL-STACK MOTOR',
      hands_tag_1: '// JELENSÉG 01: ÉTERI PRECIZITÁS',
      hands_desc_1: 'Hagyományos kereteken túli felületek. Nulla sablon: kísérteties fények, foszforzöld kontraszt és aprólékosan csiszolt esztétika.',
      hands_tag_2: '// JELENSÉG 02: NAGY TELJESÍTMÉNYŰ RENDSZEREK',
      hands_desc_2: 'C#, Lua, aszinkron JavaScript és megerősített szerverkernelek. Hatalmas egyidejű játékosszámra és halhatatlan üzemidőre méretezve.',
      cctv_header: '// AFTËRLYFE ÉJJELLÁTÓ // IR SZENZOROK AKTÍVAK',
      cctv_rec: 'ÉJJELLÁTÓ REC ●',
      cctv_online: '03 / 03 SZENZOR ONLINE',
      cctv_cam1_label: 'FŐ PLATFORM ARCHITEKTÚRA',
      cctv_cam2_label: 'OSZTOTT JÁTÉKRENDSZEREK',
      cctv_cam3_label: 'TAKTIKAI UI LABOR',
      cctv_status: 'ADÁS: STABIL',
      faq_title: 'DOKUMENTÁCIÓ',
      faq_note_1: 'TITKOSÍTOTT ARCHÍVUM',
      faq_note_2: 'SZŰRŐ FELÜLÍRÁS AKTÍV',
      faq_q1: 'Milyen projekt feladatokat vállalsz?',
      faq_a1: 'Egyedi webes platformok, brutalista UI/UX architektúrák, nagyteljesítményű FiveM szerverek, mikroszolgáltatások és teljes digitális arculatok. Mindent az alapoktól építek külső sablonok nélkül.',
      faq_q2: 'Milyen technológiai fegyvertárral dolgozol?',
      faq_a2: 'TypeScript, modern JavaScript, C#, Lua, CSS3 / Canvas shaderek, Node.js és SQL. Harcedzett technológiákat alkalmazok maximális sebességgel és nulla felesleges késleltetéssel.',
      faq_q3: 'Hogyan zajlik az átadás és a kommunikáció?',
      faq_a3: 'Közvetlen, aszinkron kommunikáció Discordon vagy titkosított emailben. Folyamatos éles előnézetek minden fejlesztési fázisban. Nulla felesleges meeting; tiszta megvalósítás.',
      contact_avail_title: 'SUGÁRZÁSI FREKVENCIA',
      contact_avail_desc: 'ELÉRHETŐ KERESKEDELMI MEGBÍZÁSOKRA',
      contact_loc: 'BUDAPEST // GLOBÁLIS TÁVMUNKA',
      contact_discord_label: 'TITKOSÍTOTT DISCORD',
      contact_rights: '© 2026 JIMBO DEV // AFTËRLYFE ARCHÍVUM',
      contact_craft: 'MINDEN FREKVENCIA BIZTOSÍTVA'
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
        targetProximity = Math.max(targetProximity, scrollProx * 0.95);
      }
    }, { passive: true });

    const sparks = [];
    function addSpark(x, y) {
      sparks.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3.5,
        vy: (Math.random() - 0.5) * 3.5,
        life: 1,
        decay: 0.035 + Math.random() * 0.055,
        color: Math.random() > 0.35 ? '#00ff77' : '#e6fff4'
      });
    }

    function render(time) {
      mouseProximity += (targetProximity - mouseProximity) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(width / 1100, height / 620);
      const centerX = width / 2;
      const centerY = height / 2;

      const baseGap = 220 * scale;
      const currentGap = baseGap * (1 - mouseProximity * 0.8);

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
        const pulse = 0.5 + 0.5 * Math.sin(time / 140);
        const glowRad = (14 + pulse * 34) * scale;
        const grad = ctx.createRadialGradient(sparkMidX, sparkMidY, 0, sparkMidX, sparkMidY, glowRad);
        grad.addColorStop(0, `rgba(0, 255, 119, ${0.95 * pulse})`);
        grad.addColorStop(0.35, `rgba(0, 255, 119, ${0.5 * pulse})`);
        grad.addColorStop(0.7, `rgba(230, 255, 244, ${0.25 * pulse})`);
        grad.addColorStop(1, 'rgba(0, 255, 119, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sparkMidX, sparkMidY, glowRad, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() < 0.85) {
          addSpark(sparkMidX, sparkMidY);
        }

        ctx.strokeStyle = Math.random() > 0.35 ? 'rgba(0, 255, 119, 0.95)' : 'rgba(230, 255, 244, 0.95)';
        ctx.lineWidth = 1.3 * scale;
        ctx.beginPath();
        ctx.moveTo(tipLX, tipLY);
        const jx = sparkMidX + (Math.random() - 0.5) * 10 * scale;
        const jy = sparkMidY + (Math.random() - 0.5) * 10 * scale;
        ctx.lineTo(jx, jy);
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
        ctx.fillStyle = sp.color === '#00ff77' ? `rgba(0, 255, 119, ${sp.life})` : `rgba(230, 255, 244, ${sp.life})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2.2 * scale, 0, Math.PI * 2);
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
