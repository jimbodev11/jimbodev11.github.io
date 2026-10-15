/**
 * JimboDev.hu — Scroll-Driven 3D Ribbed Metallic Torus Engine
 * Recreates the exact monochrome ribbed sculpture & camera choreography from the reference video.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. CUSTOM CURSOR
     ========================================================================== */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  if (window.matchMedia('(pointer: fine)').matches && dot && ring) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    const tickCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tickCursor);
    };
    requestAnimationFrame(tickCursor);

    document.querySelectorAll('a, button, [data-hover]').forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
    });
  }

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
});