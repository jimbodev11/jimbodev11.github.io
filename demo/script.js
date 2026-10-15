/**
 * JimboDev (jimbodev.hu) — Interactive Studio Script
 * Vanilla JS: 3D Glossy Torus Knot Canvas, Custom Cursor,
 * Scroll Background Morpher, and Reveal Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. MOBILE MENU TOGGLE
     ========================================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     2. CUSTOM INTERACTIVE CURSOR
     ========================================================================== */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorLabel = document.querySelector('.cursor-label');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Instant position for inner dot
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    // Smooth lerp for outer ring
    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Grow cursor on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, [data-cursor]');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        const customText = el.getAttribute('data-cursor');
        cursorLabel.textContent = customText || 'View';
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        cursorLabel.textContent = '';
      });
    });
  }

  /* ==========================================================================
     3. SCROLL REVEAL & DYNAMIC BACKGROUND COLOR TRANSITIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-text');

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // Dynamic body theme switching per section
  const themedSections = document.querySelectorAll('section[data-bg]');
  const bgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const theme = entry.target.getAttribute('data-bg');
          if (theme) {
            document.body.setAttribute('data-theme', theme);
          }
        }
      });
    },
    { threshold: 0.35 }
  );

  themedSections.forEach((sec) => bgObserver.observe(sec));

  /* ==========================================================================
     4. HERO 3D GLOSSY SCULPTURE (Canvas Torus Knot + Mouse Parallax)
        Zero external assets required.
     ========================================================================== */
  const canvas = document.getElementById('heroObjectCanvas');
  const parallaxWrapper = document.getElementById('heroParallax');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Normalized mouse coordinates (-1 to 1) for parallax & rotation tilt
    let targetNormX = 0;
    let targetNormY = 0;
    let currentNormX = 0;
    let currentNormY = 0;

    window.addEventListener('mousemove', (e) => {
      targetNormX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetNormY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Generate a 3D Torus Knot tube mesh (p=2, q=3)
    const tubularSegments = 128;
    const radialSegments = 18;
    const tubeRadius = 32;
    const knotScale = 44;

    function getKnotPoint(t, morphTime) {
      const p = 2;
      const q = 3;
      const r = Math.cos(q * t) + 2.4 + Math.sin(morphTime * 1.5 + t * 2) * 0.16;
      return {
        x: r * Math.cos(p * t) * knotScale,
        y: r * Math.sin(p * t) * knotScale,
        z: -Math.sin(q * t) * knotScale * 1.35
      };
    }

    function normalize(v) {
      const len = Math.hypot(v.x, v.y, v.z) || 1;
      return { x: v.x / len, y: v.y / len, z: v.z / len };
    }

    function cross(a, b) {
      return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
      };
    }

    function rotate3D(pt, rx, ry, rz) {
      // Rotate X
      let y1 = pt.y * Math.cos(rx) - pt.z * Math.sin(rx);
      let z1 = pt.y * Math.sin(rx) + pt.z * Math.cos(rx);
      let x1 = pt.x;

      // Rotate Y
      let z2 = z1 * Math.cos(ry) - x1 * Math.sin(ry);
      let x2 = z1 * Math.sin(ry) + x1 * Math.cos(ry);
      let y2 = y1;

      // Rotate Z
      let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
      let z3 = z2;

      return { x: x3, y: y3, z: z3 };
    }

    let time = 0;

    function drawSculpture() {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate parallax
      currentNormX += (targetNormX - currentNormX) * 0.06;
      currentNormY += (targetNormY - currentNormY) * 0.06;

      if (!prefersReducedMotion && parallaxWrapper) {
        const moveX = currentNormX * 22;
        const moveY = currentNormY * 22;
        parallaxWrapper.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
      }

      const rotX = time * 0.45 + currentNormY * 0.45;
      const rotY = time * 0.65 + currentNormX * 0.55;
      const rotZ = time * 0.25;

      // Build vertices rings along the knot spine
      const rings = [];
      const eps = 0.01;

      for (let i = 0; i < tubularSegments; i++) {
        const u = (i / tubularSegments) * Math.PI * 2;
        const p1 = getKnotPoint(u, time);
        const p2 = getKnotPoint(u + eps, time);

        const tangent = normalize({
          x: p2.x - p1.x,
          y: p2.y - p1.y,
          z: p2.z - p1.z
        });

        const up = { x: 0, y: 1, z: 0 };
        const normal = normalize(cross(tangent, up));
        const binormal = normalize(cross(tangent, normal));

        const ring = [];
        for (let j = 0; j < radialSegments; j++) {
          const v = (j / radialSegments) * Math.PI * 2;
          const cosV = Math.cos(v);
          const sinV = Math.sin(v);

          const vx = p1.x + tubeRadius * (cosV * normal.x + sinV * binormal.x);
          const vy = p1.y + tubeRadius * (cosV * normal.y + sinV * binormal.y);
          const vz = p1.z + tubeRadius * (cosV * normal.z + sinV * binormal.z);

          const rotatedPos = rotate3D({ x: vx, y: vy, z: vz }, rotX, rotY, rotZ);

          // Perspective projection
          const fov = 520;
          const scale = fov / (fov + rotatedPos.z + 260);
          ring.push({
            x: rotatedPos.x,
            y: rotatedPos.y,
            z: rotatedPos.z,
            sx: width / 2 + rotatedPos.x * scale,
            sy: height / 2 + rotatedPos.y * scale,
            u
          });
        }
        rings.push(ring);
      }

      // Build quad faces for painter's algorithm depth sorting
      const faces = [];
      for (let i = 0; i < tubularSegments; i++) {
        const nextI = (i + 1) % tubularSegments;
        for (let j = 0; j < radialSegments; j++) {
          const nextJ = (j + 1) % radialSegments;

          const a = rings[i][j];
          const b = rings[nextI][j];
          const c = rings[nextI][nextJ];
          const d = rings[i][nextJ];

          // Face normal for lighting
          const ux = b.x - a.x;
          const uy = b.y - a.y;
          const uz = b.z - a.z;

          const vx = d.x - a.x;
          const vy = d.y - a.y;
          const vz = d.z - a.z;

          const n = normalize({
            x: uy * vz - uz * vy,
            y: uz * vx - ux * vz,
            z: ux * vy - uy * vx
          });

          const avgZ = (a.z + b.z + c.z + d.z) * 0.25;

          faces.push({ a, b, c, d, n, avgZ, u: a.u });
        }
      }

      // Sort back-to-front
      faces.sort((f1, f2) => f2.avgZ - f1.avgZ);

      // Primary & Rim Lights for glossy iridescent chrome look
      const light1 = normalize({ x: -0.5, y: -0.7, z: -0.8 });
      const light2 = normalize({ x: 0.8, y: 0.4, z: -0.5 });

      for (const face of faces) {
        // Backface culling optimization
        if (face.n.z > 0.25) continue;

        const diff1 = Math.max(0, -(face.n.x * light1.x + face.n.y * light1.y + face.n.z * light1.z));
        const diff2 = Math.max(0, -(face.n.x * light2.x + face.n.y * light2.y + face.n.z * light2.z));

        // Specular highlight for glossy finish
        const spec = Math.pow(diff1, 20) * 0.95;
        const rim = Math.pow(1 - Math.abs(face.n.z), 3) * 0.55;

        // Iridescent blue/violet/cyan hue shift
        const hue = 242 + Math.sin(face.u * 2 + time) * 32 + diff2 * 25;
        const sat = 78;
        const light = Math.min(96, 12 + diff1 * 46 + rim * 28 + spec * 65);

        const color = `hsl(${hue.toFixed(0)}, ${sat}%, ${light.toFixed(1)}%)`;

        ctx.beginPath();
        ctx.moveTo(face.a.sx, face.a.sy);
        ctx.lineTo(face.b.sx, face.b.sy);
        ctx.lineTo(face.c.sx, face.c.sy);
        ctx.lineTo(face.d.sx, face.d.sy);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.7;
        ctx.fill();
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        time += 0.012;
        requestAnimationFrame(drawSculpture);
      }
    }

    drawSculpture();
  }
});