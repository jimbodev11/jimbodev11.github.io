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

  const updateNav = () => {
    let currentId = '';
    const focusY = window.innerHeight * 0.4; // Képernyő felső 40%-a a fókuszpont

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= focusY && rect.bottom >= focusY) {
        currentId = sec.id;
      }
    });

    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 50) {
      currentId = sections[sections.length - 1].id;
    }

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
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
      sub.textContent = (d.isPlaying ? '' : 'Last played · ') + d.artist;
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
  const ground = document.getElementById('pet-ground');
  const throwBtn = document.getElementById('pet-throw-btn');
  const scoreVal = document.getElementById('pet-score-val');
  const heartsEl = document.getElementById('pet-hearts');
  if (!pet || !ground) return;

  const tooltipImg = pet.querySelector('.pet-tooltip img');
  const thoughtBubble = pet.querySelector('.pet-thought-bubble');
  const suzyImages = [
    'img/suzy.jpg',
    'img/suzy7.JPEG',
    'img/suzy8.JPEG',
  ];

  let pos = ground.offsetWidth / 2 || 150;
  let direction = 1;
  let currentState = 'idle';
  let isChasing = false;
  let activeBone = null;
  let targetBoneX = null;
  let isCelebrating = false;

  let score = parseInt(localStorage.getItem('suzy_bones') || '0', 10);
  if (scoreVal) scoreVal.textContent = score;

  const updateHappiness = () => {
    if (!heartsEl) return;
    if (score >= 20) heartsEl.textContent = '🌟💖💖💖🌟';
    else if (score >= 10) heartsEl.textContent = '💖💖💖💖💖';
    else if (score >= 5) heartsEl.textContent = '❤️❤️❤️❤️';
    else heartsEl.textContent = '❤️❤️❤️';
  };
  updateHappiness();

  pet.addEventListener('mouseenter', () => {
    if (isChasing || isCelebrating) return;
    const randImg = suzyImages[Math.floor(Math.random() * suzyImages.length)];
    if (tooltipImg) tooltipImg.src = randImg;
    currentState = Math.random() > 0.5 ? 'sit' : 'lay';
    pet.className = `pet-character ${currentState}`;
    pet.classList.remove('wants-bone');
  });

  pet.addEventListener('mouseleave', () => {
    if (isChasing || isCelebrating) return;
    pet.classList.remove('wants-bone');
    currentState = 'idle';
    pet.className = `pet-character ${currentState}`;
  });

  const showFloatingFeedback = (text, x) => {
    const floatEl = document.createElement('div');
    floatEl.className = 'pet-floating-heart';
    floatEl.textContent = text;
    floatEl.style.left = `${x}px`;
    floatEl.style.bottom = '55px';
    ground.appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 1000);
  };

  const throwBone = (targetX) => {
    if (isCelebrating) return;

    if (activeBone) {
      activeBone.remove();
      activeBone = null;
    }

    const groundWidth = ground.offsetWidth;
    const clampedX = Math.max(20, Math.min(groundWidth - 40, targetX));

    const bone = document.createElement('div');
    bone.className = 'pet-bone';
    bone.textContent = '🦴';
    bone.style.left = `${clampedX}px`;
    ground.appendChild(bone);

    activeBone = bone;
    targetBoneX = clampedX;
    isChasing = true;
    currentState = 'run';
    pet.className = 'pet-character run';
    pet.classList.remove('wants-bone');

    if (thoughtBubble) {
      thoughtBubble.textContent = '😋';
      pet.classList.add('wants-bone');
    }

    direction = clampedX > pos ? 1 : -1;
    pet.style.transform = `translateX(${pos}px) scaleX(${-direction})`;
  };

  if (throwBtn) {
    throwBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const groundWidth = ground.offsetWidth;
      let targetX;
      if (pos < groundWidth / 2) {
        targetX = pos + 100 + Math.random() * (groundWidth - pos - 150);
      } else {
        targetX = 40 + Math.random() * (pos - 100);
      }
      throwBone(targetX);
    });
  }

  ground.addEventListener('click', (e) => {
    if (e.target.closest('.pet-character')) return;
    const rect = ground.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    throwBone(clickX);
  });

  const updatePet = () => {
    if (isChasing || isCelebrating || pet.matches(':hover')) return;

    const rand = Math.random();
    if (rand < 0.35) currentState = 'walk';
    else if (rand < 0.55) currentState = 'sit';
    else if (rand < 0.72) currentState = 'lay';
    else if (rand < 0.82) currentState = 'bark';
    else currentState = 'idle';

    pet.className = `pet-character ${currentState}`;
    if ((currentState === 'sit' || currentState === 'idle') && Math.random() < 0.25) {
      if (thoughtBubble) thoughtBubble.textContent = '🦴';
      pet.classList.add('wants-bone');
    } else {
      pet.classList.remove('wants-bone');
    }

    if (currentState === 'walk' && Math.random() < 0.3) {
      direction *= -1;
    }

    pet.style.transform = `translateX(${pos}px) scaleX(${-direction})`;
  };

  setInterval(() => {
    const groundWidth = ground.offsetWidth;

    if (isChasing && targetBoneX !== null && activeBone) {
      const dist = targetBoneX - pos;
      direction = dist > 0 ? 1 : -1;

      if (Math.abs(dist) <= 24) {
        isChasing = false;
        isCelebrating = true;
        targetBoneX = null;

        activeBone.classList.add('eaten');
        setTimeout(() => {
          if (activeBone) {
            activeBone.remove();
            activeBone = null;
          }
        }, 300);

        score++;
        localStorage.setItem('suzy_bones', score);
        if (scoreVal) scoreVal.textContent = score;
        updateHappiness();

        currentState = 'jump';
        pet.className = 'pet-character jump';
        showFloatingFeedback('+1 🦴 ❤️', pos + 30);

        if (thoughtBubble) {
          thoughtBubble.textContent = '💖';
          pet.classList.add('wants-bone');
        }

        setTimeout(() => {
          currentState = 'spin';
          pet.className = 'pet-character spin';
        }, 400);

        setTimeout(() => {
          currentState = 'sit';
          pet.className = 'pet-character sit';
        }, 850);

        setTimeout(() => {
          isCelebrating = false;
          pet.classList.remove('wants-bone');
          currentState = 'idle';
          pet.className = 'pet-character idle';
        }, 1400);
      } else {
        pos += direction * 14;
        if (pos < 10) pos = 10;
        if (pos > groundWidth - 70) pos = groundWidth - 70;
        pet.style.transform = `translateX(${pos}px) scaleX(${-direction})`;
      }
    } else if (currentState === 'walk' || currentState === 'jump') {
      pos += direction * (currentState === 'jump' ? 12 : 7);

      if (pos < 10) { pos = 10; direction = 1; }
      if (pos > groundWidth - 70) { pos = groundWidth - 70; direction = -1; }

      pet.style.transform = `translateX(${pos}px) scaleX(${-direction})`;
    }
  }, 100);

  setInterval(updatePet, 2200);

  window.addEventListener('resize', () => {
    const groundWidth = ground.offsetWidth;
    if (pos > groundWidth - 70) pos = groundWidth - 70;
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
      proj3_title: { hu: "Saját Portfólió", en: "My Portfolio" },
      proj3_desc: { hu: "A jelenlegi bemutatkozó weboldalam.", en: "My current portfolio website." },
      tag_clean: { hu: "Letisztult", en: "Clean" },
      tag_fast: { hu: "Gyors", en: "Fast" },
      tag_creative: { hu: "Kreatív", en: "Creative" },
      contact_title: { hu: "Beszéljünk!", en: "Let's Talk!" },
      contact_desc: { hu: "Nyitott vagyok új projektekre. Keress bátran az alábbi platformokon!", en: "I am open to new projects. Feel free to contact me on the platforms below!" },
      status_open: { hu: "Elérhető új projektekre", en: "Available for new projects" },
      pet_throw_btn: { hu: "Dobj csontot!", en: "Throw bone!" },
      pet_score_label: { hu: "Csontok:", en: "Bones:" },
      pet_hint: { hu: "Kattints a földre vagy a gombra egy csont dobásához!", en: "Click the ground or button to throw a bone!" }
    };
  let currentLang = localStorage.getItem('site_lang') || 'hu';
  const btn = document.getElementById('lang-toggle');

  const applyLang = () => {
    window.currentLang = currentLang;
    document.documentElement.lang = currentLang;
    if (btn) btn.textContent = currentLang === 'hu' ? 'EN' : 'HU';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[key] && i18n[key][currentLang]) {
        if (el.tagName === 'SPAN' && el.classList.contains('s')) {
           el.textContent = `"${i18n[key][currentLang]}"`;
        } else {
           el.textContent = i18n[key][currentLang];
        }
      }
    });
  };

  if (btn) {
    applyLang();
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'hu' ? 'en' : 'hu';
      localStorage.setItem('site_lang', currentLang);
      applyLang();
    });
  }
})();

(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      siteHeader.classList.toggle('nav-open');
      menuToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        siteHeader.classList.remove('nav-open');
        menuToggle.classList.remove('active');
      });
    });
  }
})();



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


(() => {
  const el = document.getElementById('clock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('hu-HU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Budapest' });
  const set = () => { el.textContent = fmt.format(new Date()); };
  set(); setInterval(set, 1000);
})();

(() => {
  if (matchMedia('(pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top; 
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12; 
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = 'translateY(-16px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.06)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

(() => {
  let clickCount = 0;
  let clickTimer = null;
  document.querySelectorAll('.mac-title').forEach(title => {
    if (title.textContent.trim() === 'gasztrotukor.hu') {
      title.style.cursor = 'pointer';
      title.style.userSelect = 'none';
      title.addEventListener('click', (e) => {
        e.stopPropagation();
        clickCount++;
        clearTimeout(clickTimer);
        
        if (clickCount >= 5) {
          window.open('http://csopa04.hu', '_blank');
          clickCount = 0;
        }
        
        clickTimer = setTimeout(() => { clickCount = 0; }, 1500);
      });
    }
  });
})();

(() => {
  const fullTitle = 'Jimbo Dev';
  let currentLength = 0;
  let isTyping = true;
  let blinkCount = 0;
  
  document.title = '_';

  const typeTitle = () => {
    if (isTyping) {
      currentLength++;
      document.title = fullTitle.substring(0, currentLength) + '_';
      
      if (currentLength === fullTitle.length) {
        isTyping = false;
      }
      const speed = Math.floor(Math.random() * 200) + 150;
      setTimeout(typeTitle, speed);
    } else {
      if (blinkCount < 8) {
        document.title = fullTitle + (blinkCount % 2 === 0 ? ' ' : '_');
        blinkCount++;
        setTimeout(typeTitle, 500);
      } else {
        document.title = fullTitle; 
      }
    }
  };

  setTimeout(typeTitle, 1000);
})();

(() => {
  const npPlayer = document.getElementById('np');
  if (!npPlayer) return;

 
  if (!matchMedia('(pointer: coarse)').matches) {
    npPlayer.addEventListener('mousemove', e => {
      const rect = npPlayer.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top; 
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;

      npPlayer.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
    });

    npPlayer.addEventListener('mouseleave', () => {
      npPlayer.style.transform = '';
    });
  }

  const header = npPlayer.querySelector('.editor-header');
  const body = npPlayer.querySelector('.np-body');
  
  if (header && body) {
    header.style.cursor = 'pointer';
    header.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      npPlayer.classList.toggle('collapsed');
    });
  }
})();

(() => {
  const magneticElements = document.querySelectorAll('.nav-links a, .social-link, #lang-toggle, .h-icon');
  
  if (!matchMedia('(pointer: coarse)').matches) {
    magneticElements.forEach(el => {
    el.classList.add('magnetic-btn');
    
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;
      
      el.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
    });
  });
  }

  const triggerRefresh = () => {
    document.querySelectorAll('section').forEach(sec => {
      sec.style.animation = 'none';
      void sec.offsetWidth; // Trigger reflow
      sec.style.animation = 'refreshAnim 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
    });
  };

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      triggerRefresh();
    });
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      triggerRefresh();
    });
  });
})();

(() => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let w, h;
  const spacingX = 25; 
  const spacingY = 25; 
  let cols, rows;
  let points = [];
  
  let mx = -1000, my = -1000;
  let lastMoved = Date.now();
  let time = 0;
  
  let afkX = window.innerWidth / 2;
  let afkY = window.innerHeight / 2;
  let afkTx = afkX;
  let afkTy = afkY;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    lastMoved = Date.now();
    afkX = mx;
    afkY = my;
  });

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.ceil(w / spacingX) + 4;
    rows = Math.ceil(h / spacingY) + 4;
    points = [];
    for(let i = 0; i < cols; i++) {
      points[i] = [];
      for(let j = 0; j < rows; j++) {
        points[i][j] = {
          ox: i * spacingX - spacingX*2, 
          oy: j * spacingY - spacingY*2, 
          x: 0,
          y: 0
        };
      }
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, w, h);
    time += 0.008; 
    
    let now = Date.now();
    let isAfk = (now - lastMoved > 2500) && !matchMedia('(pointer: coarse)').matches;
    
    if (isAfk) {
      if (Math.random() < 0.015) {
        afkTx = Math.random() * w;
        afkTy = Math.random() * h;
      }
      afkX += (afkTx - afkX) * 0.015;
      afkY += (afkTy - afkY) * 0.015;
      document.documentElement.style.setProperty('--mouse-x', afkX + 'px');
      document.documentElement.style.setProperty('--mouse-y', afkY + 'px');
    }
    
    let targetX = isAfk ? afkX : mx;
    let targetY = isAfk ? afkY : my;

    for(let i = 0; i < cols; i++) {
      for(let j = 0; j < rows; j++) {
        let p = points[i][j];
        
        let waveY = Math.sin(i * 0.12 + time) * 35 
                  + Math.sin(i * 0.25 - time * 1.2) * 15 
                  + Math.cos(j * 0.15 + time) * 20;

        let waveX = Math.cos(j * 0.1 + time) * 15;

        let dx = targetX - p.ox;
        let dy = targetY - p.oy;
        let dist = Math.sqrt(dx*dx + dy*dy);
        
        let repX = 0, repY = 0;
        const radius = 200; 
        if (dist < radius && matchMedia('(pointer: fine)').matches) {
          // Lágy, haranggörbe szerű torzítás csak az Y tengelyen (mintha belenyomnád az ujjad)
          let force = Math.exp(-(dist * dist) / (radius * radius * 0.3));
          repY = force * 60; // 60px-el lefelé nyomja a vonalakat
        }

        p.x = p.ox + waveX;
        p.y = p.oy + waveY + repY;
      }
    }

    ctx.lineWidth = 1.2;
    for(let j = 0; j < rows; j++) {
      ctx.beginPath();
      for(let i = 0; i < cols; i++) {
        let p = points[i][j];
        if (i === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          let prev = points[i-1][j];
          let cpX = (prev.x + p.x) / 2;
          let cpY = (prev.y + p.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
        }
      }
      ctx.lineTo(points[cols-1][j].x, points[cols-1][j].y);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'; 
      ctx.stroke();
    }

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(draw);
    }
  }
  
  draw();
})();
(() => {
  const notification = document.createElement('div');
  notification.className = 'copy-notification';
  document.body.appendChild(notification);

  document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      let textToCopy = '';
      const href = link.getAttribute('href');
      
      if (href.startsWith('mailto:')) {
        textToCopy = href.replace('mailto:', '');
      } else if (link.textContent.trim().toLowerCase() === 'discord') {
        // Ha ms a Discord neved, krlek rd t ezt!
        textToCopy = 'bigkokxd'; 
      } else {
        textToCopy = href; 
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          let isEn = document.documentElement.lang === 'en';
          notification.textContent = isEn 
            ? textToCopy + ' copied to clipboard!' 
            : textToCopy + ' vágólapra másolva!';
          
          notification.classList.add('show');
          
          clearTimeout(notification.timeout);
          notification.timeout = setTimeout(() => {
            notification.classList.remove('show');
          }, 3000);
        }).catch(err => console.error('Nem sikerült másolni:', err));
      }
    });
  });
})();