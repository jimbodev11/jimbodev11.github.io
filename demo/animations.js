/**
 * JimboDev Demo — GSAP Award-Style Animation Engine
 * 
 * Animations:
 *  1. Page Enter — hero letter-by-letter reveal + nav slide-down
 *  2. ScrollTrigger Text Reveal — manifesto + headline lines stagger in
 *  3. Stagger Bento Cards — glass cards cascade in with 3D perspective flip
 *  4. Magnetic Buttons — CTA & cards follow cursor within proximity
 *  5. Text Scramble / Glitch — hero headline scrambles before settling
 *  6. Smooth Lenis-style scroll — native but polished
 *  7. Horizontal card drag hint — subtle horizontal nudge on bento section enter
 *  8. CTA section — massive scale-in headline with split words
 */

/* ──────────────────────────────────────────────
   WAIT FOR GSAP + ScrollTrigger TO LOAD
────────────────────────────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(initGSAP, 50);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  /* ═══════════════════════════════════════════
     UTILITY: Split text into word/char spans
  ═══════════════════════════════════════════ */
  function splitIntoChars(el, wrapClass = 'gsap-char') {
    const text = el.textContent;
    el.innerHTML = '';
    el.setAttribute('aria-label', text);
    return [...text].map(char => {
      const span = document.createElement('span');
      span.className = wrapClass;
      span.style.cssText = 'display:inline-block; will-change:transform,opacity;';
      span.textContent = char === ' ' ? '\u00a0' : char;
      el.appendChild(span);
      return span;
    });
  }

  function splitIntoWords(el, wrapClass = 'gsap-word') {
    const text = el.textContent.trim();
    el.innerHTML = '';
    el.setAttribute('aria-label', text);
    return text.split(/\s+/).map((word, i, arr) => {
      const wrap = document.createElement('span');
      wrap.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:top;';
      const inner = document.createElement('span');
      inner.className = wrapClass;
      inner.style.cssText = 'display:inline-block; will-change:transform,opacity;';
      inner.textContent = word;
      wrap.appendChild(inner);
      if (i < arr.length - 1) {
        wrap.insertAdjacentText('afterend', ' ');
      }
      el.appendChild(wrap);
      return inner;
    });
  }

  /* ═══════════════════════════════════════════
     1. PAGE ENTER ANIMATION
     Nav slides down, hero headline scrambles then reveals
  ═══════════════════════════════════════════ */
  const header = document.querySelector('.site-header');
  const heroTopContent = document.querySelector('.hero-top-content');
  const heroHeadline = document.querySelector('.hero-headline');
  const heroBottom = document.querySelector('.hero-bottom-content');

  // Initial states
  gsap.set(header, { y: -80, opacity: 0 });
  gsap.set(heroBottom, { opacity: 0, y: 30 });

  const enterTl = gsap.timeline({ delay: 0.15 });

  // 1a. Nav bar drops in
  enterTl.to(header, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'power3.out'
  });

  // 1b. Hero headline: word-by-word clip reveal
  if (heroHeadline) {
    gsap.set(heroHeadline, { opacity: 1 });
    const words = splitIntoWords(heroHeadline, 'gsap-word');
    gsap.set(words, { y: '110%', opacity: 0 });

    enterTl.to(words, {
      y: '0%',
      opacity: 1,
      duration: 1.05,
      ease: 'power4.out',
      stagger: 0.07
    }, '-=0.5');
  }

  // 1c. Hero description fades in
  enterTl.to(heroBottom, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'power3.out'
  }, '-=0.4');

  /* ═══════════════════════════════════════════
     2. TEXT SCRAMBLE on hero headline
     Characters flicker through random chars before settling
  ═══════════════════════════════════════════ */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

  function scrambleText(el, finalText, duration = 1.2) {
    const chars = [...finalText];
    let frame = 0;
    const totalFrames = Math.floor(duration * 60);

    const tick = () => {
      const progress = frame / totalFrames;
      el.textContent = chars.map((ch, i) => {
        if (ch === ' ') return ' ';
        if (progress > i / chars.length + 0.3) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      frame++;
      if (frame <= totalFrames) requestAnimationFrame(tick);
      else el.textContent = finalText;
    };
    requestAnimationFrame(tick);
  }

  // Section tags scramble when they enter the viewport
  document.querySelectorAll('.section-tag').forEach(tag => {
    const original = tag.textContent;
    gsap.set(tag, { opacity: 0 });

    ScrollTrigger.create({
      trigger: tag,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(tag, { opacity: 1, duration: 0.3 });
        scrambleText(tag, original, 1.1);
      }
    });
  });

  /* ═══════════════════════════════════════════
     3. MANIFESTO WORD STAGGER REVEAL
     Each word clips up from below
  ═══════════════════════════════════════════ */
  const manifestoText = document.querySelector('.manifesto-text');
  if (manifestoText) {
    // Save HTML (has <span class="hi"> inside), work on hi spans instead
    const hiSpans = manifestoText.querySelectorAll('.hi');
    hiSpans.forEach(span => {
      gsap.set(span, {
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
        backgroundClip: 'text',
        webkitBackgroundClip: 'text',
      });
    });

    ScrollTrigger.create({
      trigger: manifestoText,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.from(manifestoText, {
          opacity: 0,
          y: 40,
          duration: 1.1,
          ease: 'power3.out'
        });

        // Highlight .hi spans sequentially
        hiSpans.forEach((span, i) => {
          gsap.to(span, {
            color: '#ffffff',
            duration: 0.6,
            delay: 0.4 + i * 0.18,
            ease: 'power2.out'
          });
        });
      }
    });
  }

  // Manifesto stats count-up
  document.querySelectorAll('.stat-val').forEach(stat => {
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.from(stat, {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: 'back.out(1.5)'
        });
      }
    });
  });

  /* ═══════════════════════════════════════════
     4. BENTO GLASS CARDS — 3D STAGGER FLIP-IN
     Cards rotate in from slight 3D angle with stagger
  ═══════════════════════════════════════════ */
  const cards = document.querySelectorAll('.glass-card');
  if (cards.length) {
    gsap.set(cards, {
      opacity: 0,
      y: 55,
      rotateX: 12,
      transformPerspective: 900,
      transformOrigin: 'center top'
    });

    ScrollTrigger.create({
      trigger: '.cards-columns',
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: {
            each: 0.1,
            from: 'start'
          }
        });
      }
    });

    // Card hover 3D tilt
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        gsap.to(card, {
          rotateY: dx * 8,
          rotateX: -dy * 6,
          transformPerspective: 800,
          transformOrigin: 'center center',
          ease: 'power1.out',
          duration: 0.35
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.55,
          ease: 'elastic.out(1, 0.6)'
        });
      });
    });
  }

  /* ═══════════════════════════════════════════
     5. STICKY TITLE — PARALLAX DRIFT
     Left column title drifts upward as right cards scroll past
  ═══════════════════════════════════════════ */
  const stickyBox = document.querySelector('.sticky-title-box');
  if (stickyBox) {
    gsap.from(stickyBox, {
      opacity: 0,
      x: -40,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: stickyBox,
        start: 'top 80%',
        once: true
      }
    });
  }

  /* ═══════════════════════════════════════════
     6. CTA HEADLINE — MASSIVE CLIP WORD REVEAL
     "Ready to ascend your digital project?" comes in big
  ═══════════════════════════════════════════ */
  const ctaHeadline = document.querySelector('.cta-headline');
  if (ctaHeadline) {
    // Store plain text before any language switch messes with it
    const ctaText = ctaHeadline.textContent.trim();

    ScrollTrigger.create({
      trigger: ctaHeadline,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.from(ctaHeadline, {
          opacity: 0,
          y: 50,
          scale: 0.96,
          duration: 1.1,
          ease: 'power4.out'
        });
      }
    });
  }

  // CTA button — pulse ring on enter
  const ctaBtn = document.querySelector('.btn-large');
  if (ctaBtn) {
    ScrollTrigger.create({
      trigger: ctaBtn,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.from(ctaBtn, {
          opacity: 0,
          scale: 0.85,
          duration: 0.75,
          ease: 'back.out(1.7)'
        });
      }
    });
  }

  /* ═══════════════════════════════════════════
     7. MAGNETIC BUTTONS
     All [data-hover] elements softly follow cursor
  ═══════════════════════════════════════════ */
  const magneticEls = document.querySelectorAll('.btn-white-pill, .btn-card-action, .brand-logo, .btn-lang-toggle');

  magneticEls.forEach(el => {
    const STRENGTH = 0.32;
    const RADIUS = 90;

    const onMove = e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        gsap.to(el, {
          x: dx * STRENGTH,
          y: dy * STRENGTH,
          duration: 0.35,
          ease: 'power2.out'
        });
      }
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'elastic.out(1, 0.5)'
      });
    };

    document.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });

  /* ═══════════════════════════════════════════
     8. FOOTER STAGGER LINKS
  ═══════════════════════════════════════════ */
  const footerLinks = document.querySelectorAll('.footer-right a, .cta-mini-nav a');
  if (footerLinks.length) {
    gsap.from(footerLinks, {
      opacity: 0,
      y: 15,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.bottom-bar',
        start: 'top 90%',
        once: true
      }
    });
  }

  /* ═══════════════════════════════════════════
     9. SCROLL PROGRESS BAR
     Thin line at top showing page scroll progress
  ═══════════════════════════════════════════ */
  const progressBar = document.createElement('div');
  progressBar.id = 'gsap-progress-bar';
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.15) 100%);
    z-index: 99999;
    pointer-events: none;
    transition: width 0.05s linear;
    backdrop-filter: blur(2px);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ═══════════════════════════════════════════
     10. PET AREA — BOUNCE IN
  ═══════════════════════════════════════════ */
  const petArea = document.querySelector('#pet-area');
  if (petArea) {
    gsap.from(petArea, {
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: 0.9,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: petArea,
        start: 'top 88%',
        once: true
      }
    });
  }

  /* ═══════════════════════════════════════════
     11. SECTION ENTRY — Horizontal accent line
     A thin line sweeps in before each section tag
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.section-tag').forEach(tag => {
    const line = document.createElement('span');
    line.style.cssText = `
      display: block;
      height: 1px;
      background: rgba(255,255,255,0.18);
      width: 0;
      margin-bottom: 0.85rem;
      transform-origin: left center;
    `;
    tag.parentElement.insertBefore(line, tag);

    ScrollTrigger.create({
      trigger: line,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(line, {
          width: '3rem',
          duration: 0.7,
          ease: 'power3.out'
        });
      }
    });
  });

  console.log('%c🎬 GSAP Animations loaded', 'color:#888; font-size:11px');
}

// Kick off
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGSAP);
} else {
  initGSAP();
}

