/**
 * JimboDev.hu — Scroll-Driven 3D Ribbed Metallic Torus Engine
 * Recreates the exact monochrome ribbed sculpture & camera choreography from the reference video.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ==========================================================================
     2. INTERSECTION OBSERVER FOR REVEALS
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ==========================================================================
     3. SCROLL-DRIVEN 3D RIBBED METALLIC SCULPTURE (Canvas)
     ========================================================================== */
  const canvas = document.getElementById('ribbedTorusCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let vw = (canvas.width = window.innerWidth);
  let vh = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    vw = canvas.width = window.innerWidth;
    vh = canvas.height = window.innerHeight;
  });

  // Track normalized scroll progress (0.0 at top -> 1.0 at bottom)
  let targetScroll = 0;
  let smoothScroll = 0;

  const updateScroll = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    targetScroll = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Normalized mouse for subtle parallax (-1 to 1)
  let normMouseX = 0;
  let normMouseY = 0;
  window.addEventListener('mousemove', (e) => {
    normMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    normMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /**
   * 4 Keyframe Camera States matching the video timestamps:
   * State 0 (0:00 Hero): Wide ribbed arch across the bottom half
   * State 1 (0:07 About): Shifted right, standing vertically like a twisted column
   * State 2 (0:09 Bento): Shifted center-right behind the glass cards
   * State 3 (0:12 CTA): Centered vortex tunnel facing the camera
   */
  const keyframes = [
    // Scene 0: Hero Arch
    { offsetX: 0.0, offsetY: 0.36, scale: 1.28, rotX: 1.05, rotY: 0.08, rotZ: 0.0, twist: 2.2 },
    // Scene 1: Manifesto Right Column
    { offsetX: 0.32, offsetY: 0.02, scale: 1.05, rotX: 0.35, rotY: -0.85, rotZ: 1.25, twist: 3.0 },
    // Scene 2: Bento Background Sculpture
    { offsetX: 0.08, offsetY: 0.0, scale: 1.12, rotX: 0.55, rotY: 0.55, rotZ: -0.65, twist: 2.6 },
    // Scene 3: Vortex Tunnel Center
    { offsetX: 0.0, offsetY: 0.0, scale: 1.38, rotX: 0.12, rotY: 0.1, rotZ: 0.0, twist: 3.6 }
  ];

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function getInterpolatedState(progress) {
    const totalSegments = keyframes.length - 1;
    const scaled = progress * totalSegments;
    const index = Math.min(totalSegments - 1, Math.floor(scaled));
    const localT = smoothstep(scaled - index);

    const k1 = keyframes[index];
    const k2 = keyframes[index + 1];

    return {
      offsetX: lerp(k1.offsetX, k2.offsetX, localT),
      offsetY: lerp(k1.offsetY, k2.offsetY, localT),
      scale: lerp(k1.scale, k2.scale, localT),
      rotX: lerp(k1.rotX, k2.rotX, localT),
      rotY: lerp(k1.rotY, k2.rotY, localT),
      rotZ: lerp(k1.rotZ, k2.rotZ, localT),
      twist: lerp(k1.twist, k2.twist, localT)
    };
  }

  function rotatePoint(p, rx, ry, rz) {
    // X rotation
    let y1 = p.y * Math.cos(rx) - p.z * Math.sin(rx);
    let z1 = p.y * Math.sin(rx) + p.z * Math.cos(rx);
    let x1 = p.x;

    // Y rotation
    let z2 = z1 * Math.cos(ry) - x1 * Math.sin(ry);
    let x2 = z1 * Math.sin(ry) + x1 * Math.cos(ry);
    let y2 = y1;

    // Z rotation
    let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
    let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
    let z3 = z2;

    return { x: x3, y: y3, z: z3 };
  }

  let clock = 0;

  function render() {
    ctx.clearRect(0, 0, vw, vh);

    // Smoothly approach scroll position
    smoothScroll += (targetScroll - smoothScroll) * 0.07;
    if (!prefersReducedMotion) {
      clock += 0.008;
    }

    const state = getInterpolatedState(smoothScroll);

    const baseRadius = Math.min(vw, vh) * 0.34 * state.scale;
    const tubeRadius = baseRadius * 0.42;

    const centerX = vw * (0.5 + state.offsetX) + normMouseX * 18;
    const centerY = vh * (0.5 + state.offsetY) + normMouseY * 18;

    const rx = state.rotX + normMouseY * 0.12;
    const ry = state.rotY + normMouseX * 0.12;
    const rz = state.rotZ + clock * 0.4;

    // Number of metallic ribs around the torus (gives the exact fluted/ribbed look)
    const numRibs = 112;
    const ribPoints = 34;
    const ribsToDraw = [];

    // Light direction for high-contrast dramatic chrome reflection
    const light = { x: 0.25, y: -0.85, z: -0.45 };

    for (let i = 0; i < numRibs; i++) {
      const u = (i / numRibs) * Math.PI * 2;

      // Subtle organic wave along the major ring
      const majorWave = 1 + 0.08 * Math.sin(u * 3 + clock * 2);
      const R = baseRadius * majorWave;

      const pts2D = [];
      let avgZ = 0;
      let normalSum = { x: 0, y: 0, z: 0 };

      for (let j = 0; j <= ribPoints; j++) {
        // v goes around the tube cross-section, twisted by u
        const v = (j / ribPoints) * Math.PI * 2 + u * state.twist + clock * 1.4;

        // Ribbed extrusion ridges
        const ridge = 1 + 0.06 * Math.cos(v * 6);
        const r = tubeRadius * ridge;

        const px = (R + r * Math.cos(v)) * Math.cos(u);
        const py = (R + r * Math.cos(v)) * Math.sin(u);
        const pz = r * Math.sin(v) * 1.25;

        // Approximate surface normal for metallic shading
        const nx = Math.cos(v) * Math.cos(u);
        const ny = Math.cos(v) * Math.sin(u);
        const nz = Math.sin(v);

        const rotP = rotatePoint({ x: px, y: py, z: pz }, rx, ry, rz);
        const rotN = rotatePoint({ x: nx, y: ny, z: nz }, rx, ry, rz);

        const fov = 900;
        const perspective = fov / (fov + rotP.z + 400);

        pts2D.push({
          x: centerX + rotP.x * perspective,
          y: centerY + rotP.y * perspective,
          z: rotP.z,
          n: rotN
        });

        avgZ += rotP.z;
        normalSum.x += rotN.x;
        normalSum.y += rotN.y;
        normalSum.z += rotN.z;
      }

      avgZ /= pts2D.length;
      ribsToDraw.push({ pts2D, avgZ, u });
    }

    // Painter's algorithm: sort ribs back to front
    ribsToDraw.sort((a, b) => b.avgZ - a.avgZ);

    // Render each metallic rib plate with dark shadows & bright chrome speculars
    for (const rib of ribsToDraw) {
      const pts = rib.pts2D;

      for (let j = 0; j < pts.length - 1; j++) {
        const p1 = pts[j];
        const p2 = pts[j + 1];

        // Calculate lighting intensity from rotated normal
        const dotLight = -(p1.n.x * light.x + p1.n.y * light.y + p1.n.z * light.z);
        const diffuse = Math.max(0, dotLight);
        const specular = Math.pow(diffuse, 14); // Sharp chrome reflection band
        const rim = Math.pow(1 - Math.abs(p1.n.z), 3) * 0.25;

        // Depth fade so back ribs melt into the black background
        const depthFactor = Math.max(0.08, Math.min(1, 1 - (p1.z + 250) / 750));

        const brightness = Math.min(
          255,
          Math.floor((14 + diffuse * 135 + specular * 165 + rim * 60) * depthFactor)
        );

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        // Draw dark rib body + bright metallic ridge edge
        ctx.strokeStyle = `rgb(${brightness}, ${brightness}, ${Math.min(255, brightness + 6)})`;
        ctx.lineWidth = 3.2 * depthFactor;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  /* ==========================================================================
     4. BILINGUAL EN / HU LOCALIZATION ENGINE
     ========================================================================== */
  const i18n = {
    en: {
      nav_about: 'About',
      nav_services: 'Services',
      nav_work: 'Work',
      nav_contact: 'Contact',
      nav_cta: 'Get in Touch',

      hero_headline: 'Powering the next<br />generation of <em>digital</em> brands.',
      hero_scroll: 'Scroll to explore',
      hero_desc: 'JimboDev is a premier Hungarian digital studio specializing in bespoke web experiences, <strong>high-performance FiveM scripts</strong>, and precision UI/UX systems—partnering with ambitious creators and communities to drive real impact.',

      manifesto_tag: '01 // STUDIO MANIFESTO',
      manifesto_text: '<span class="hi">We specialize in engineering</span> for the modern digital world. From <span class="hi">award-style web platforms</span> and interactive <span class="hi">UI/UX design systems</span>, to zero-lag <span class="hi">FiveM NUI &amp; Lua ecosystems</span> that elevate roleplay servers.',
      stat_label_1: 'Idle Script Resmon',
      stat_label_2: 'NUI & Web Motion',
      stat_label_3: 'Custom Architecture',

      bento_tag: '02 // CAPABILITIES & ARCHIVE',
      bento_headline: 'Trusted by Leading<br />Innovators &amp; <em>Creators.</em>',
      bento_sub: 'Three core pillars combined with battle-tested fullstack and FiveM engineering.',

      pillar_1_badge: 'Pillar 01',
      pillar_1_title: 'Web Design & Dev',
      pillar_1_foot: 'Custom HTML/CSS/JS, WebGL & Next-Gen Portfolios',

      pillar_2_badge: 'Pillar 02',
      pillar_2_title: 'FiveM Scripts',
      pillar_2_foot: 'Lua, JS, SQL, ESX Legacy & Custom NUI Systems',

      pillar_3_badge: 'Pillar 03',
      pillar_3_title: 'UI / UX Design',
      pillar_3_foot: 'Design Systems, Game HUDs & Prototypes',

      proj_nocturne_badge: 'FiveM // Game Server',
      status_paused: 'Paused',
      proj_nocturne_foot: 'Custom Roleplay Server & NUI Ecosystem',

      proj_gasztro_badge: 'Graduation Work // Web',
      proj_gasztro_foot: 'Gastronomy Platform & Exam Masterpiece',

      proj_portfolio_badge: 'Portfolio // Web',
      proj_portfolio_title: 'Personal Portfolio',
      proj_portfolio_foot: 'Creative Developer Site with 3D Sculpture',

      btn_details: 'Details',

      cta_headline: 'Ready to <em>ascend</em> your<br />digital project?',
      cta_btn: 'Get in Touch',
      footer_copy: '© 2026 JimboDev Studio — Hungary. All rights reserved.',

      modal_overview: '01 // Overview',
      modal_architecture: '02 // Architecture & Tech',
      modal_highlights: '03 // Key Highlights',
      modal_close: 'Close (Esc)',

      pet_throw_btn: 'Throw bone!',
      pet_score_label: 'Bones:',
      pet_hint: 'Click the ground or the button to throw a bone for Suzy!',
      carousel_tag: 'SECRET EASTER EGG',
      carousel_title: 'Meet Suzy 🐾',
      carousel_hint: 'Click any photo to focus • Auto-rotates'
    },
    hu: {
      nav_about: 'Rólam',
      nav_services: 'Szolgáltatások',
      nav_work: 'Munkáink',
      nav_contact: 'Kapcsolat',
      nav_cta: 'Kapcsolatfelvétel',

      hero_headline: 'A digitális márkák<br />következő <em>generációját</em> építjük.',
      hero_scroll: 'Görgess a felfedezéshez',
      hero_desc: 'A JimboDev egy prémium magyar digitális stúdió, amely egyedi webes élményekre, <strong>nagy teljesítményű FiveM scriptekre</strong> és precíz UI/UX rendszerekre specializálódott—ambiciózus alkotókkal és közösségekkel együttműködve a valódi hatásért.',

      manifesto_tag: '01 // STÚDIÓ MANIFESZTUM',
      manifesto_text: '<span class="hi">A modern digitális világra</span> specializálódott mérnöki munka. A <span class="hi">díjnyertes webes platformoktól</span> és interaktív <span class="hi">UI/UX design rendszerektől</span> a nulla késleltetésű <span class="hi">FiveM NUI és Lua ökoszisztémákig</span>, amelyek új szintre emelik a játékszervereket.',
      stat_label_1: 'Alapjárat Resmon',
      stat_label_2: 'NUI & Web Mozgás',
      stat_label_3: 'Egyedi Architektúra',

      bento_tag: '02 // KÉPESSÉGEK & PROJEKTEK',
      bento_headline: 'Vezető Innovátorok és<br /><em>Alkotók</em> Bizalmával.',
      bento_sub: 'Három alappillér ötvözve a harcedzett fullstack és FiveM mérnökséggel.',

      pillar_1_badge: 'Alappillér 01',
      pillar_1_title: 'Webdesign & Fejlesztés',
      pillar_1_foot: 'Egyedi HTML/CSS/JS, WebGL és modern portfóliók',

      pillar_2_badge: 'Alappillér 02',
      pillar_2_title: 'FiveM Scriptek',
      pillar_2_foot: 'Lua, JS, SQL, ESX Legacy és egyedi NUI rendszerek',

      pillar_3_badge: 'Alappillér 03',
      pillar_3_title: 'UI / UX Design',
      pillar_3_foot: 'Design rendszerek, in-game HUD-ok és prototípusok',

      proj_nocturne_badge: 'FiveM // Játékszerver',
      status_paused: 'Szünetel',
      proj_nocturne_foot: 'Egyedi Roleplay szerver & NUI ökoszisztéma',

      proj_gasztro_badge: 'Vizsgamunka // Web',
      proj_gasztro_foot: 'Gasztronómiai platform & vizsgaremek',

      proj_portfolio_badge: 'Portfólió // Web',
      proj_portfolio_title: 'Saját Portfólió',
      proj_portfolio_foot: 'Kreatív fejlesztői weboldal 3D szoborral',

      btn_details: 'Részletek',

      cta_headline: 'Készen állsz <em>új szintre emelni</em><br />a digitális projekted?',
      cta_btn: 'Lépjünk Kapcsolatba',
      footer_copy: '© 2026 JimboDev Stúdió — Magyarország. Minden jog fenntartva.',

      modal_overview: '01 // Áttekintés',
      modal_architecture: '02 // Architektúra & Technológia',
      modal_highlights: '03 // Kiemelt Tulajdonságok',
      modal_close: 'Bezárás (Esc)',

      pet_throw_btn: 'Dobj csontot!',
      pet_score_label: 'Csontok:',
      pet_hint: 'Kattints a földre vagy a gombra egy csont dobásához Suzy-nak!',
      carousel_tag: 'TITKOS EASTER EGG',
      carousel_title: 'Ismerd meg Suzy-t 🐾',
      carousel_hint: 'Kattints egy képre a fókuszáláshoz • Automatikus forgás'
    }
  };

  let currentLang = 'en';
  let activeProjectId = null;

  function applyLanguage(lang) {
    currentLang = lang;
    const dict = i18n[lang] || i18n.en;

    document.documentElement.lang = lang;

    // Update plain text elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // Update HTML-containing elements
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Toggle active state in the navbar button
    const optEn = document.getElementById('opt-en');
    const optHu = document.getElementById('opt-hu');
    if (optEn && optHu) {
      if (lang === 'en') {
        optEn.classList.add('active');
        optHu.classList.remove('active');
      } else {
        optHu.classList.add('active');
        optEn.classList.remove('active');
      }
    }

    // If modal is open, re-render with new language
    if (modal && modal.classList.contains('active') && activeProjectId) {
      renderModal(activeProjectId);
    }

    try {
      localStorage.setItem('jimbodev_demo_lang', lang);
    } catch (e) {}
  }

  const langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'en' ? 'hu' : 'en';
      applyLanguage(nextLang);
    });

    try {
      const savedLang = localStorage.getItem('jimbodev_demo_lang');
      if (savedLang && i18n[savedLang]) {
        applyLanguage(savedLang);
      }
    } catch (e) {}
  }

  /* ==========================================================================
     5. PROJECT DETAILS CASE STUDY MODAL
     ========================================================================== */
  const projectData = {
    gasztrotukor: {
      macTitle: "gasztrotukor.md",
      title: {
        en: "Gasztrotükör",
        hu: "Gasztrotükör"
      },
      tagline: {
        en: "Gastronomy web platform & recipe catalog developed as a graduation masterpiece",
        hu: "Gasztronómiai webes platform & receptkatalógus iskolai vizsgaremekként"
      },
      badges: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL", "UI/UX", "Exam Masterpiece"],
      overview: {
        en: "Gasztrotükör is a comprehensive recipe catalog and culinary showcase web application created as a school exam masterpiece. The goal was to build a modern, responsive, and blazing-fast interface that guides users through recipes step-by-step with rich gastronomic tips.",
        hu: "A Gasztrotükör egy átfogó receptkatalógus és ételismertető weboldal, amelyet iskolai vizsgaremekként készítettem. A cél egy olyan modern, reszponzív és gyors felület létrehozása volt, amely a receptek lépésről lépésre történő bemutatása mellett részletes konyhaművészeti és gasztronómiai ismereteket ad át a felhasználóknak."
      },
      architecture: {
        en: "Classic client-server architecture with optimized database querying for rapid recipe search and filtering. Fully responsive layout utilizing clean semantic HTML5 and modern CSS Grid/Flexbox layouts.",
        hu: "Klasszikus kliens-szerver architektúra, optimalizált adatbázis-lekérdezésekkel a gyors ételkereséshez és szűréshez. Reszponzív, mobilbarát elrendezés tiszta szemantikus HTML5 elemekkel és modern CSS rácsrendszerrel (CSS Grid / Flexbox)."
      },
      highlights: {
        en: "Category-based recipe filtering, detailed ingredient and portion calculations, print-friendly styling, and comprehensive examination documentation.",
        hu: "Kategóriánkénti receptkeresés, részletes alapanyag- és adagkalkuláció, nyomtatóbarát nézet, valamint letisztult vizsgaremek dokumentáció."
      },
      actionPrimary: {
        url: "../src/GasztroTükör vizsgaremek.pdf",
        text: {
          en: "View Exam PDF ↗",
          hu: "Vizsgaremek PDF Megnyitása ↗"
        },
        target: "_blank"
      }
    },
    nocturne: {
      macTitle: "nocturnerp.lua",
      title: {
        en: "Nocturne Roleplay",
        hu: "Nocturne Roleplay"
      },
      tagline: {
        en: "Custom FiveM (GTA V) multiplayer roleplay game server architecture",
        hu: "Egyedi FiveM (GTA V) multiplayer szerepjáték szerver architektúra"
      },
      badges: ["Lua", "FiveM API", "MySQL", "JavaScript", "Custom NUI", "Game Server"],
      overview: {
        en: "Nocturne RP is a custom GTA V-based multiplayer roleplay server. All gameplay logic, player progression, and economy systems were designed from the ground up with a strict focus on high client FPS and lag-free network synchronization.",
        hu: "A Nocturne RP egy egyedi, GTA V alapú multiplayer szerepjáték-szerver, amelynek teljes szerveroldali és kliensoldali játékmeneti logikáját a nulláról terveztük meg és implementáltuk. Kiemelt fókusz volt a maximális kliensoldali FPS megtartása és a lag-mentes szinkronizáció."
      },
      architecture: {
        en: "Modular Lua script architecture with non-blocking async database operations. In-game interfaces run as hardware-accelerated HTML5/CSS/JavaScript NUI panels directly within the game engine for a sleek, immersive HUD.",
        hu: "Moduláris Lua script-rendszer aszinkron adatbázis-műveletekkel. A felhasználói felületek modern HTML5/CSS/JavaScript alapú NUI (Native UI) panelekként futnak a játékmotoron belül, biztosítva az immerszív, egyedi HUD-ot és paneleket."
      },
      highlights: {
        en: "Custom dynamic economy, persistent vehicle systems, tailored inventory, and custom interaction radial menus. Currently on hold for engine refactoring.",
        hu: "Egyedi gazdasági és járműkezelő rendszerek, optimalizált szinkronizáció, saját leltár és interakciós felület. A fejlesztés jelenleg szünetel az architektúra továbbfejlesztése miatt."
      },
      actionPrimary: {
        url: "../nocturnedev/",
        text: {
          en: "NocturneDev Store ↗",
          hu: "NocturneDev Webshop ↗"
        },
        target: "_blank"
      },
      statusBadge: {
        en: "Development Paused",
        hu: "Fejlesztés szünetel"
      }
    },
    portfolio: {
      macTitle: "jimbodev.md",
      title: {
        en: "Jimbo Dev Portfolio",
        hu: "Jimbo Dev Portfólió"
      },
      tagline: {
        en: "Creative developer website with real-time 3D metallic sculpture and fluid aesthetics",
        hu: "Kreatív fejlesztői weboldal valós idejű 3D fém/króm szoborral és folyékony esztétikával"
      },
      badges: ["Vanilla JS", "HTML5 Canvas", "Procedural 3D Math", "Scroll Choreography", "Dark Chrome UI"],
      overview: {
        en: "My personal developer portfolio designed and built to the highest visual standards of modern creative web development. It showcases technical precision and fluid aesthetics without heavy external dependencies, running entirely on pure Vanilla code.",
        hu: "A bemutatkozó weboldalam, amelyet a modern kreatív webfejlesztés legmagasabb vizuális elvárásai szerint építettem. Célja a technikai precizitás és a magával ragadó vizuális esztétika ötvözése külső nehéz keretrendszerek nélkül, 100%-ban tiszta Vanilla kód alapon."
      },
      architecture: {
        en: "Ultra-optimized HTML5 2D Canvas featuring real-time 3D toroidal rib sculpture, camera state interpolation, depth fading, and rock-solid 60–120 FPS performance across devices.",
        hu: "Ultra-optimalizált HTML5 2D Canvas valós idejű 3D toroid rib szoborral, kamera-állapot interpolációval, mélységélességgel és sima 60–120 FPS rendereléssel minden eszközön."
      },
      highlights: {
        en: "Procedural metallic highlights and specular shading, scroll-choreographed camera movement, elegant typography, and a clean dark bento system.",
        hu: "Procedurális fémfény és specular árnyalás, görgetés-vezérelt kamera koreográfia, elegáns tipográfia és letisztult sötét bento rendszer."
      },
      actionPrimary: {
        url: "https://github.com/jimbodev11",
        text: {
          en: "GitHub Source ↗",
          hu: "GitHub Forráskód ↗"
        },
        target: "_blank"
      }
    }
  };

  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-mac-title');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');

  function renderModal(projectId) {
    const data = projectData[projectId];
    if (!data || !modalBody) return;

    activeProjectId = projectId;
    const dict = i18n[currentLang] || i18n.en;

    if (modalTitle) modalTitle.textContent = data.macTitle;

    const badgesHtml = data.badges.map((b) => `<span>${b}</span>`).join('');

    let actionBtnHtml = '';
    if (data.actionPrimary) {
      const primaryText = data.actionPrimary.text[currentLang] || data.actionPrimary.text.en;
      actionBtnHtml = `<a href="${data.actionPrimary.url}" target="${data.actionPrimary.target || '_blank'}" rel="noopener noreferrer" class="modal-action-btn modal-btn-primary" data-hover>${primaryText}</a>`;
    }
    if (data.statusBadge) {
      const badgeText = data.statusBadge[currentLang] || data.statusBadge.en;
      actionBtnHtml += `<span class="modal-action-btn modal-btn-secondary" style="cursor: default; opacity: 0.75;">${badgeText}</span>`;
    }

    const titleText = data.title[currentLang] || data.title.en;
    const taglineText = data.tagline[currentLang] || data.tagline.en;
    const overviewText = data.overview[currentLang] || data.overview.en;
    const archText = data.architecture[currentLang] || data.architecture.en;
    const highText = data.highlights[currentLang] || data.highlights.en;

    modalBody.innerHTML = `
      <div class="modal-header-info">
        <h2>${titleText}</h2>
        <p class="modal-tagline">${taglineText}</p>
        <div class="modal-badges">${badgesHtml}</div>
      </div>
      <div class="modal-section">
        <h4>${dict.modal_overview}</h4>
        <p>${overviewText}</p>
      </div>
      <div class="modal-section">
        <h4>${dict.modal_architecture}</h4>
        <p>${archText}</p>
      </div>
      <div class="modal-section">
        <h4>${dict.modal_highlights}</h4>
        <p>${highText}</p>
      </div>
      <div class="modal-actions">
        ${actionBtnHtml}
        <button type="button" class="modal-action-btn modal-btn-secondary" id="modal-body-close" data-hover>${dict.modal_close}</button>
      </div>
    `;

    const bodyClose = document.getElementById('modal-body-close');
    if (bodyClose) {
      bodyClose.addEventListener('click', closeModal);
    }
  }

  function openModal(projectId) {
    if (!modal) return;
    renderModal(projectId);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeProjectId = null;
  }

  // Open modal on clicking .modal-btn or project card (ignoring direct external link clicks)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.project-ext-link')) return;

    const trigger = e.target.closest('.modal-btn, [data-project]');
    if (trigger) {
      const pId = trigger.getAttribute('data-project');
      if (pId && projectData[pId]) {
        e.preventDefault();
        openModal(pId);
      }
    }
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  /* ==========================================================================
     6. MOBILE HAMBURGER & DRAWER CONTROLLER
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function toggleMobileMenu(force) {
    if (!hamburgerBtn || !mobileDrawer) return;
    const shouldOpen = force !== undefined ? force : !mobileDrawer.classList.contains('active');

    hamburgerBtn.classList.toggle('active', shouldOpen);
    hamburgerBtn.setAttribute('aria-expanded', shouldOpen.toString());
    mobileDrawer.classList.toggle('active', shouldOpen);
    mobileDrawer.setAttribute('aria-hidden', (!shouldOpen).toString());
  }

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close on clicking any link inside drawer
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target) && mobileDrawer.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    });
  }

  /* ==========================================================================
     7. SUZY PET MINIGAME (Bone Physics, Happiness, Celebrations)
     ========================================================================== */
  (() => {
    const pet = document.querySelector('.pet-character');
    const ground = document.getElementById('pet-ground');
    const throwBtn = document.getElementById('pet-throw-btn');
    const scoreVal = document.getElementById('pet-score-val');
    const heartsEl = document.getElementById('pet-hearts');
    if (!pet || !ground) return;

    const tooltipImg = document.getElementById('pet-tooltip-img');
    const thoughtBubble = pet.querySelector('.pet-thought-bubble');
    const suzyImages = [
      '../img/suzy.jpg',
      '../img/suzy7.JPEG',
      '../img/suzy8.JPEG'
    ];

    let pos = Math.max(30, (ground.offsetWidth / 2) || 150);
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
          targetX = pos + 90 + Math.random() * (groundWidth - pos - 140);
        } else {
          targetX = 35 + Math.random() * (pos - 80);
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

    // Global helper for DevTools Console
    window.suzy = {
      feed: (targetX) => {
        const petArea = document.getElementById('pet-area');
        if (petArea) petArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const gw = ground.offsetWidth || 500;
          const x = typeof targetX === 'number' ? targetX : (pos < gw / 2 ? pos + 120 : pos - 120);
          throwBone(x);
        }, 350);
        return "🦴 Csont eldobva! Nézd meg Suzy-t! / Bone thrown! Watch Suzy run!";
      }
    };

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
          try {
            localStorage.setItem('suzy_bones', score.toString());
          } catch (e) {}
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

  /* ==========================================================================
     8. SUZY 3D CAROUSEL EASTER EGG (Triggered by 5 Rapid Clicks on Suzy)
     ========================================================================== */
  (() => {
    const pet = document.querySelector('.pet-character');
    const overlay = document.getElementById('suzy-easter-egg');
    if (!pet || !overlay) return;

    const closeBtn = overlay.querySelector('.close-easter-egg');
    const items = overlay.querySelectorAll('.carousel-item');
    const track = overlay.querySelector('.carousel-track');
    if (!items.length || !track) return;

    let clicks = 0;
    let clickTimer;
    let activeIndex = 0;
    let currentRotation = 0;
    const theta = 360 / items.length;
    let autoplayTimer;

    const getRadius = () => {
      const itemWidth = items[0].offsetWidth || 280;
      const minRadius = (itemWidth / 2) / Math.tan(Math.PI / items.length) + 25;
      return window.innerWidth > 768 ? Math.max(300, minRadius) : minRadius;
    };

    const updateCarousel = () => {
      const radius = getRadius();
      let targetRotation = -activeIndex * theta;
      let diff = (targetRotation - currentRotation) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      currentRotation += diff;
      track.style.transform = `translateZ(${-radius}px) rotateY(${currentRotation}deg)`;

      items.forEach((item, i) => {
        item.style.transform = `rotateY(${i * theta}deg) translateZ(${radius}px)`;

        let offset = Math.abs(i - activeIndex);
        if (offset > items.length / 2) offset = items.length - offset;

        item.style.filter = `brightness(${offset === 0 ? 1 : Math.max(0.25, 1 - (offset * 0.35))})`;
        item.style.opacity = offset === 0 ? '1' : `${Math.max(0.4, 1 - (offset * 0.25))}`;
      });
    };

    const startAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => {
        activeIndex = (activeIndex + 1) % items.length;
        updateCarousel();
      }, 2600);
    };

    const stopAutoplay = () => {
      clearInterval(autoplayTimer);
    };

    const openEasterEgg = () => {
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      updateCarousel();
      startAutoplay();
    };

    const closeEasterEgg = () => {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      stopAutoplay();
    };

    pet.addEventListener('click', () => {
      clicks++;
      clearTimeout(clickTimer);
      if (clicks >= 5) {
        clicks = 0;
        openEasterEgg();
      } else {
        clickTimer = setTimeout(() => { clicks = 0; }, 1200);
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeEasterEgg);
    }

    // Close when clicking backdrop outside track
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('carousel-container')) {
        closeEasterEgg();
      }
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('show')) {
        closeEasterEgg();
      }
    });

    // Focus item on click
    items.forEach((item, i) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
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
});