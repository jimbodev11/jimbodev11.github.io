(() => {
  'use strict';

  // --- 1/1 Exact 3D Perspective Tilt on Store Signature SVG ---
  (() => {
    if (matchMedia('(pointer: coarse)').matches) return;
    const storeSvg = document.querySelector('.store-svg-container svg');
    if (!storeSvg) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetRotX = 0;
    let targetRotY = 0;
    let currRotX = 0;
    let currRotY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (mouseX - centerX) / centerX;
      const moveY = (mouseY - centerY) / centerY;

      targetRotX = -moveY * 14;
      targetRotY = moveX * 14;
    }, { passive: true });

    const loop = () => {
      currRotX += (targetRotX - currRotX) * 0.1;
      currRotY += (targetRotY - currRotY) * 0.1;
      storeSvg.style.transform = `perspective(1000px) rotateX(${currRotX}deg) rotateY(${currRotY}deg) translateZ(15px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  })();

  // --- Product Catalog Database ---
  const PRODUCTS = [
    {
      id: 'vip_platinum',
      category: 'vip',
      badge: { text: 'LEGJOBB ÉRTÉK', type: 'badge-hot' },
      icon: '👑',
      luaFile: 'vip_platinum.lua',
      name: { hu: 'Platinum VIP Rang', en: 'Platinum VIP Rank' },
      desc: {
        hu: 'A legmagasabb szintű VIP státusz 30 napra, maximális prioritásos sorbanállással és extra juttatásokkal.',
        en: 'The highest tier VIP status for 30 days with top queue priority and maximum server perks.'
      },
      priceHUF: 5990,
      priceEUR: 14.99,
      perks: [
        { hu: 'Prioritásos szervercsatlakozás (Priority Queue)', en: 'Priority server queue bypass' },
        { hu: '2x fizetés minden legális és frakció munkánál', en: '2x salary multiplier on all legal/faction jobs' },
        { hu: '+5 extra garázs és jármű slot', en: '+5 extra garage & vehicle slots' },
        { hu: 'Egyedi arany Discord rang & csevegő szoba', en: 'Exclusive Gold Discord role & VIP lounge access' },
        { hu: 'Havonta 50.000$ in-game kezdőtőke bónusz', en: 'Monthly $50,000 in-game starter bonus' }
      ]
    },
    {
      id: 'vip_gold',
      category: 'vip',
      badge: { text: 'NÉPSZERŰ', type: 'badge-vip' },
      icon: '⭐',
      luaFile: 'vip_gold.lua',
      name: { hu: 'Gold VIP Rang', en: 'Gold VIP Rank' },
      desc: {
        hu: 'Kiváló kezdő rang haladó játékosoknak 30 napra, növelt fizetéssel és prioritással.',
        en: 'Perfect VIP tier for experienced roleplayers with boosted income and queue priority.'
      },
      priceHUF: 3490,
      priceEUR: 8.99,
      perks: [
        { hu: 'Közepes prioritásos csatlakozás', en: 'Medium queue priority' },
        { hu: '1.5x fizetés minden legális munkánál', en: '1.5x salary on legal jobs' },
        { hu: '+3 extra garázshely', en: '+3 extra garage slots' },
        { hu: 'Gold Discord rang', en: 'Gold Discord role' }
      ]
    },
    {
      id: 'car_gt3rs',
      category: 'vehicles',
      badge: { text: 'EXKLUZÍV', type: 'badge-exclusive' },
      icon: '🏎️',
      luaFile: 'porsche_gt3rs.meta',
      name: { hu: 'Porsche 911 GT3 RS', en: 'Porsche 911 GT3 RS' },
      desc: {
        hu: 'Egyedi import szupersportkocsi egyedi hangmodellel, prémium kezelhetőséggel és tuning opciókkal.',
        en: 'Custom import supercar with custom engine audio, realistic handling, and visual tuning.'
      },
      priceHUF: 7990,
      priceEUR: 19.99,
      perks: [
        { hu: 'Egyedi rendszám választási lehetőség', en: 'Custom personalized license plate' },
        { hu: 'Maxos motor és fék tuning azonnal beszerelve', en: 'Pre-installed Stage 3 engine & brake upgrades' },
        { hu: 'Elveszíthetetlen tulajdonjog (garantált biztosítás)', en: 'Permanent ownership & full insurance cover' }
      ]
    },
    {
      id: 'car_m5cs',
      category: 'vehicles',
      badge: null,
      icon: '🚗',
      luaFile: 'bmw_m5cs.meta',
      name: { hu: 'BMW M5 CS (F90)', en: 'BMW M5 CS (F90)' },
      desc: {
        hu: 'A tökéletes 4 személyes sleeper szedán. Bivalyerős V8 biturbo motor és agresszív külső.',
        en: 'The ultimate 4-seater sleeper luxury sedan. Twin-turbo V8 power with aggressive styling.'
      },
      priceHUF: 6490,
      priceEUR: 16.50,
      perks: [
        { hu: '4 férőhelyes prémium utastér', en: '4-seater high luxury interior' },
        { hu: 'Egyedi kipufogó durrogás hangzás', en: 'Custom crackle & pop exhaust tuning' },
        { hu: 'Kiemelkedő végsebesség és stabilitás', en: 'Top-tier top speed and highway stability' }
      ]
    },
    {
      id: 'prop_mansion',
      category: 'properties',
      badge: { text: 'LIMITÁLT', type: 'badge-exclusive' },
      icon: '🏰',
      luaFile: 'vinewood_mansion.xml',
      name: { hu: 'Vinewood Hills Villa', en: 'Vinewood Hills Mansion' },
      desc: {
        hu: 'Luxusvilla Vinewood dombjain, panorámás kilátással, helipaddal és privát medencével.',
        en: 'Luxury villa in the Vinewood Hills with panoramic skyline views, helipad, and private pool.'
      },
      priceHUF: 11990,
      priceEUR: 29.99,
      perks: [
        { hu: 'Privát 10 férőhelyes földalatti garázs', en: 'Private 10-car underground garage' },
        { hu: 'Tetőtéri helikopter leszállóhely (Helipad)', en: 'Rooftop private helicopter landing pad' },
        { hu: 'Egyedi beléptető rendszer barátoknak & frakciónak', en: 'Custom access management system for friends/gang' }
      ]
    },
    {
      id: 'coins_5000',
      category: 'coins',
      badge: null,
      icon: '🪙',
      luaFile: 'nocturne_coins.cfg',
      name: { hu: '5,000 Nocturne Coin', en: '5,000 Nocturne Coins' },
      desc: {
        hu: 'Játékon belüli prémium fizetőeszköz, amivel azonnal vásárolhatsz a Nocturne shopban.',
        en: 'In-game premium currency to spend inside the Nocturne Plaza shop directly.'
      },
      priceHUF: 2490,
      priceEUR: 6.50,
      perks: [
        { hu: 'Azonnali jóváírás a karaktereden', en: 'Instant credit to your active character' },
        { hu: 'Bármelyik karakteredre átruházható', en: 'Transferable between personal characters' }
      ]
    }
  ];

  // --- State ---
  let cart = JSON.parse(localStorage.getItem('nocturne_cart') || '[]');
  let activeCategory = 'all';
  let currentLang = localStorage.getItem('nocturne_lang') || 'en';

  // --- i18n Strings ---
  const I18N = {
    hero_sub: {
      hu: 'Támogasd a szerver fejlesztését és fenntartását, miközben prémium élményekkel gazdagodsz Los Santosban.',
      en: 'Support server development and infrastructure while gaining premium perks in Los Santos.'
    },
    feat_instant: { hu: 'Azonnali aktiváció', en: 'Instant Delivery' },
    feat_tebex: { hu: 'Tebex védelem', en: 'Tebex Secured' },
    feat_fivem: { hu: 'FiveM kompatibilis', en: 'FiveM Ready' },
    cat_all: { hu: 'Összes', en: 'All' },
    cat_vip: { hu: 'VIP Rangok', en: 'VIP Ranks' },
    cat_vehicles: { hu: 'Járművek', en: 'Vehicles' },
    cat_properties: { hu: 'Ingatlanok', en: 'Properties' },
    cat_coins: { hu: 'Nocturne Coin', en: 'Nocturne Coins' },
    cart_empty: { hu: 'A kosarad jelenleg üres.', en: 'Your cart is currently empty.' },
    checkout_btn: { hu: 'Tovább a Tebex fizetéshez', en: 'Proceed to Tebex Checkout' },
    footer_disc: {
      hu: 'A Nocturne RP nem áll kapcsolatban a Rockstar Games-szel vagy a Take-Two Interactive-val. Minden vásárlás a Tebex ÁSZF hatálya alá tartozik.',
      en: 'Nocturne RP is not affiliated with Rockstar Games or Take-Two Interactive. All purchases are handled through Tebex.'
    },
    btn_details: { hu: 'Részletek', en: 'Inspect' },
    btn_add_cart: { hu: 'Kosárba', en: 'Add' },
    toast_copied: { hu: 'FiveM csatlakozási parancs vágólapra másolva!', en: 'FiveM connect command copied to clipboard!' },
    toast_added: { hu: 'Termék hozzáadva a kosárhoz!', en: 'Item added to cart!' },
    toast_checkout: {
      hu: 'Átirányítás a hivatalos Tebex Checkout felületre...',
      en: 'Redirecting to official Tebex Checkout...'
    }
  };

  // --- Toast helper ---
  const showToast = (text) => {
    const t = document.getElementById('toast-notify');
    if (!t) return;
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(t.timeout);
    t.timeout = setTimeout(() => t.classList.remove('show'), 2600);
  };

  // --- Language Switcher ---
  const applyLanguage = () => {
    document.documentElement.lang = currentLang;
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = currentLang === 'en' ? 'HU' : 'EN';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (I18N[k] && I18N[k][currentLang]) {
        el.textContent = I18N[k][currentLang];
      }
    });

    renderProducts();
    updateCartUI();
  };

  const toggleLang = () => {
    currentLang = currentLang === 'en' ? 'hu' : 'en';
    localStorage.setItem('nocturne_lang', currentLang);
    applyLanguage();
  };

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', toggleLang);

  // --- FiveM Connect Command Copy ---
  const serverPill = document.getElementById('server-status');
  if (serverPill) {
    serverPill.addEventListener('click', async () => {
      const cmd = 'connect cfx.re/join/nocturnerp';
      try {
        if (navigator.clipboard) await navigator.clipboard.writeText(cmd);
        showToast(currentLang === 'hu' ? I18N.toast_copied.hu : I18N.toast_copied.en);
      } catch (e) {
        prompt('Másold ki a csatlakozási parancsot:', cmd);
      }
    });
  }

  // --- Render Products ---
  const productGrid = document.getElementById('product-grid');

  const formatPrice = (p) => {
    if (currentLang === 'en') return `€${p.priceEUR.toFixed(2)}`;
    return `${p.priceHUF.toLocaleString('hu-HU')} Ft`;
  };

  const renderProducts = () => {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    const filtered = PRODUCTS.filter(p => activeCategory === 'all' || p.category === activeCategory);

    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card editor';

      const badgeHtml = p.badge
        ? `<span class="card-badge ${p.badge.type}">${p.badge.text}</span>`
        : '';

      const perksHtml = p.perks.slice(0, 2).map(perk =>
        `<span class="perk-pill">✓ ${currentLang === 'hu' ? perk.hu : perk.en}</span>`
      ).join('');

      card.innerHTML = `
        <div class="editor-header">
          <div class="mac-btns"><span></span><span></span><span></span></div>
          <div class="mac-title">${p.luaFile}</div>
        </div>
        <div class="card-visual">
          ${badgeHtml}
          <span>${p.icon}</span>
        </div>
        <div class="card-body">
          <span class="card-category">${p.category}</span>
          <h3 class="card-title">${currentLang === 'hu' ? p.name.hu : p.name.en}</h3>
          <p class="card-desc">${currentLang === 'hu' ? p.desc.hu : p.desc.en}</p>
          <div class="card-meta-perks">${perksHtml}</div>
          <div class="card-footer">
            <span class="card-price">${formatPrice(p)}</span>
            <div class="card-actions">
              <button type="button" class="card-detail-btn" data-inspect="${p.id}">
                ${currentLang === 'hu' ? I18N.btn_details.hu : I18N.btn_details.en} ↗
              </button>
              <button type="button" class="card-add-btn" data-add="${p.id}">
                + ${currentLang === 'hu' ? I18N.btn_add_cart.hu : I18N.btn_add_cart.en}
              </button>
            </div>
          </div>
        </div>
      `;

      productGrid.appendChild(card);
    });
  };

  // --- Category Filters ---
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category');
      renderProducts();
    });
  });

  // --- Modal Logic ---
  const modal = document.getElementById('product-modal');
  const modalBody = document.getElementById('modal-body');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseX = document.getElementById('modal-close-x');
  const modalMacTitle = document.getElementById('modal-mac-title');

  const openModal = (productId) => {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p || !modal || !modalBody) return;

    if (modalMacTitle) modalMacTitle.textContent = `${p.luaFile} — inspect`;

    const allPerks = p.perks.map(perk => `
      <li class="modal-perk-item">
        <span class="check">✓</span>
        <span>${currentLang === 'hu' ? perk.hu : perk.en}</span>
      </li>
    `).join('');

    modalBody.innerHTML = `
      <div style="display:flex; align-items:center; gap:1.2rem; margin-bottom:1.5rem;">
        <div style="font-size:3.5rem; background:rgba(255,255,255,0.04); padding:10px 18px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
          ${p.icon}
        </div>
        <div>
          <span style="font-family:var(--mono); color:var(--k); font-size:0.8rem; text-transform:uppercase;">${p.category}</span>
          <h2 style="margin:0 0 4px; font-size:1.8rem; letter-spacing:-0.02em;">${currentLang === 'hu' ? p.name.hu : p.name.en}</h2>
          <span style="font-family:var(--mono); font-size:1.2rem; font-weight:700; color:#fff;">${formatPrice(p)}</span>
        </div>
      </div>
      <p style="color:#d1d1d6; line-height:1.6; margin:0 0 1.5rem; font-size:0.95rem;">
        ${currentLang === 'hu' ? p.desc.hu : p.desc.en}
      </p>
      <h4 style="font-family:var(--mono); font-size:0.85rem; color:var(--k); text-transform:uppercase; margin:0 0 0.75rem;">
        ${currentLang === 'hu' ? 'Csomag tartalma & Előnyök:' : 'Package Perks & Content:'}
      </h4>
      <ul class="modal-perk-list">
        ${allPerks}
      </ul>
      <div class="modal-footer">
        <span style="color:var(--muted); font-size:0.82rem; font-family:var(--mono);">
          FiveM / Tebex Instant Delivery
        </span>
        <button type="button" class="card-add-btn" data-add="${p.id}" style="padding:0.6rem 1.4rem; font-size:0.95rem;">
          🛒 ${currentLang === 'hu' ? 'Hozzáadás a kosárhoz' : 'Add to Cart'}
        </button>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCloseX) modalCloseX.addEventListener('click', closeModal);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // --- Cart Engine ---
  const saveCart = () => {
    localStorage.setItem('nocturne_cart', JSON.stringify(cart));
    updateCartUI();
  };

  const addToCart = (productId) => {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    cart.push(p);
    saveCart();
    showToast(currentLang === 'hu' ? I18N.toast_added.hu : I18N.toast_added.en);
  };

  const removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
  };

  const updateCartUI = () => {
    const badge = document.getElementById('cart-badge-count');
    const pillCount = document.getElementById('cart-item-count');
    const totalEl = document.getElementById('cart-total-price');
    const preview = document.getElementById('cart-items-preview');
    const checkoutBtn = document.getElementById('checkout-btn');

    const totalCount = cart.length;
    if (badge) badge.textContent = totalCount;
    if (pillCount) pillCount.textContent = totalCount;

    let totalHUF = 0;
    let totalEUR = 0;
    cart.forEach(item => {
      totalHUF += item.priceHUF;
      totalEUR += item.priceEUR;
    });

    if (totalEl) {
      totalEl.textContent = currentLang === 'en'
        ? `€${totalEUR.toFixed(2)}`
        : `${totalHUF.toLocaleString('hu-HU')} Ft`;
    }

    if (preview) {
      if (totalCount === 0) {
        preview.innerHTML = `<p class="cart-empty-text">${currentLang === 'hu' ? I18N.cart_empty.hu : I18N.cart_empty.en}</p>`;
        if (checkoutBtn) checkoutBtn.disabled = true;
      } else {
        preview.innerHTML = cart.map((item, idx) => `
          <div class="cart-item-row">
            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">
              ${item.icon} ${currentLang === 'hu' ? item.name.hu : item.name.en}
            </span>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-family:var(--mono); color:var(--muted); font-size:0.8rem;">
                ${currentLang === 'en' ? '€' + item.priceEUR.toFixed(2) : item.priceHUF + ' Ft'}
              </span>
              <button type="button" class="cart-item-remove" data-remove-idx="${idx}" title="Eltávolítás">&times;</button>
            </div>
          </div>
        `).join('');
        if (checkoutBtn) checkoutBtn.disabled = false;
      }
    }
  };

  // Event Delegation for inspecting and adding items
  document.addEventListener('click', e => {
    const inspectBtn = e.target.closest('[data-inspect]');
    if (inspectBtn) {
      openModal(inspectBtn.getAttribute('data-inspect'));
      return;
    }

    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      addToCart(addBtn.getAttribute('data-add'));
      return;
    }

    const removeBtn = e.target.closest('[data-remove-idx]');
    if (removeBtn) {
      const idx = parseInt(removeBtn.getAttribute('data-remove-idx'), 10);
      removeFromCart(idx);
      return;
    }
  });

  // Collapsible Cart Toggle (Spotify-style)
  const floatingCart = document.getElementById('floating-cart');
  const cartToggleHeader = document.getElementById('cart-toggle-header');
  const headerCartBtn = document.getElementById('header-cart-btn');

  if (cartToggleHeader && floatingCart) {
    cartToggleHeader.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingCart.classList.toggle('collapsed');
    });
  }

  if (headerCartBtn && floatingCart) {
    headerCartBtn.addEventListener('click', () => {
      floatingCart.classList.remove('collapsed');
      floatingCart.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- 1/1 Exact Topographical Wireframe Wave Mesh (Perlin Noise & Optical Glass Refraction) ---
  (() => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Classical 2D Perlin Noise
    const perm = new Uint8Array(512);
    {
      const p = Array.from({ length: 256 }, (_, i) => i);
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [p[i], p[j]] = [p[j], p[i]];
      }
      for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
      }
    }

    function fade(t) {
      return t * t * t * (t * (6 * t - 15) + 10);
    }

    function grad(hash, x, y) {
      const h = hash & 7;
      const u = h < 4 ? x : y;
      const v = h < 4 ? y : x;
      return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }

    function perlin2D(x, y) {
      const xi = Math.floor(x) & 255;
      const yi = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = fade(xf);
      const v = fade(yf);
      const aa = perm[perm[xi] + yi];
      const ab = perm[perm[xi] + yi + 1];
      const ba = perm[perm[xi + 1] + yi];
      const bb = perm[perm[xi + 1] + yi + 1];

      const x1 = grad(aa, xf, yf) + u * (grad(ba, xf - 1, yf) - grad(aa, xf, yf));
      const x2 = grad(ab, xf, yf - 1) + u * (grad(bb, xf - 1, yf - 1) - grad(ab, xf, yf - 1));
      return x1 + v * (x2 - x1);
    }

    const isMobile = matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const colStep = isMobile ? 18 : 10;
    const rowStep = isMobile ? 42 : 28;
    const overshoot = isMobile ? 60 : 140;

    let w = 0, h = 0;
    let cols = [];
    let time = 0;

    let mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      sx: -1000,
      sy: -1000,
      lastX: -1000,
      lastY: -1000
    };

    function updateMousePos(clientX, clientY) {
      if (mouse.lastX < -500) {
        mouse.lastX = clientX;
        mouse.lastY = clientY;
        mouse.sx = clientX;
        mouse.sy = clientY;
      }
      mouse.vx = clientX - mouse.lastX;
      mouse.vy = clientY - mouse.lastY;
      mouse.lastX = clientX;
      mouse.lastY = clientY;
      mouse.x = clientX;
      mouse.y = clientY;
    }

    window.addEventListener('mousemove', e => {
      updateMousePos(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.vx = 0;
      mouse.vy = 0;
    });

    window.addEventListener('touchmove', e => {
      if (e.touches && e.touches.length > 0) {
        updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.vx = 0;
      mouse.vy = 0;
    });

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = [];

      for (let x = -overshoot; x <= w + overshoot; x += colStep) {
        let pts = [];
        for (let y = -overshoot; y <= h + overshoot; y += rowStep) {
          pts.push({ x: x, y: y, dx: 0, vx: 0 });
        }
        cols.push(pts);
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Dynamic Glass Card Refraction Tracker (works on store cards, modal, cart)
    let glassCards = [];
    function updateGlassCards() {
      const els = document.querySelectorAll('.editor, .product-card, .floating-cart');
      glassCards = [];
      for (let i = 0; i < els.length; i++) {
        const r = els[i].getBoundingClientRect();
        if (r.bottom > -40 && r.top < h + 40 && r.right > -40 && r.left < w + 40) {
          glassCards.push({
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom,
            cx: (r.left + r.right) * 0.5,
            cy: (r.top + r.bottom) * 0.5,
            hw: (r.right - r.left) * 0.5,
            hh: (r.bottom - r.top) * 0.5
          });
        }
      }
    }

    function draw() {
      time += 0.003;

      // Smooth cursor interpolation and velocity decay
      if (mouse.x > -500) {
        mouse.sx += (mouse.x - mouse.sx) * 0.45;
        mouse.sy += (mouse.y - mouse.sy) * 0.45;
        mouse.vx *= 0.9;
        mouse.vy *= 0.9;
      } else {
        mouse.vx *= 0.8;
        mouse.vy *= 0.8;
      }

      const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      const radius = 175 + 0.5 * mouseSpeed;
      const hasCursor = mouse.x > -500;

      // Track active glass cards for optical refraction
      updateGlassCards();

      // Physics update for all points
      for (let c = 0; c < cols.length; c++) {
        let pts = cols[c];
        for (let r = 0; r < pts.length; r++) {
          let pt = pts[r];

          // Organic Perlin noise topographic folds
          let a = 12 * perlin2D(0.002 * pt.x + time, 0.0015 * pt.y + time);
          let curl = 32 * Math.cos(a) + 16 * Math.sin(a);

          let impulse = 0;
          if (hasCursor) {
            let ex = pt.x + pt.dx - mouse.sx;
            let ey = pt.y - mouse.sy;
            let dist = Math.sqrt(ex * ex + ey * ey);
            if (dist < radius) {
              impulse = mouse.vx * (1 - dist / radius) * mouseSpeed * 0.08;
            }
          }

          pt.vx += (-0.005 * pt.dx + 0.15 * curl + impulse) * 0.5;
          pt.vx *= 0.925;
          pt.dx = Math.max(-100, Math.min(100, pt.dx + pt.vx));

          // Compute optical liquid glass refraction behind product cards
          let rawX = pt.x + pt.dx;
          let rawY = pt.y;
          let refX = 0, refY = 0;

          for (let g = 0; g < glassCards.length; g++) {
            const gc = glassCards[g];
            if (rawX >= gc.left && rawX <= gc.right && rawY >= gc.top && rawY <= gc.bottom) {
              const dEdge = Math.min(rawX - gc.left, gc.right - rawX, rawY - gc.top, gc.bottom - rawY);
              const nx = (rawX - gc.cx) / (gc.hw || 1);
              const ny = (rawY - gc.cy) / (gc.hh || 1);

              // 1. Edge Bevel Prismatic Refraction: sharp optical bend near rounded glass border
              let bevel = 0;
              if (dEdge < 36) {
                bevel = Math.sin((dEdge / 36) * Math.PI) * 20 * nx;
              }

              // 2. Thick Glass Barrel Lens & Liquid Fluid Warping
              const lens = nx * (1 - Math.abs(ny) * 0.35) * 14;
              const liquid = Math.sin(rawY * 0.03 + time * 2.2) * 12 * (1 - Math.abs(nx) * 0.3);

              refX = bevel + lens + liquid;
              refY = Math.cos(rawX * 0.03 - time * 1.6) * 6;
              break;
            }
          }

          pt.drawX = rawX + refX;
          pt.drawY = rawY + refY;
        }
      }

      // Draw all vertical topographic curves in one single stroke
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();

      for (let c = 0; c < cols.length; c++) {
        let pts = cols[c];
        if (pts.length < 2) continue;

        ctx.moveTo(pts[0].drawX, pts[0].drawY);
        for (let r = 1; r < pts.length; r++) {
          let prev = pts[r - 1];
          let curr = pts[r];
          let midX = (prev.drawX + curr.drawX) * 0.5;
          let midY = (prev.drawY + curr.drawY) * 0.5;
          ctx.quadraticCurveTo(prev.drawX, prev.drawY, midX, midY);
        }
        let last = pts[pts.length - 1];
        ctx.lineTo(last.drawX, last.drawY);
      }

      ctx.lineWidth = 0.85;
      ctx.strokeStyle = 'rgba(235, 240, 255, 0.14)';
      ctx.stroke();

      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(draw);
      }
    }

  // Initialize UI
  applyLanguage();

  // --- Smooth Page Transition Engine (Entrance & Exit) ---
  (() => {
    const curtain = document.createElement('div');
    curtain.className = 'page-transition-curtain active';
    curtain.innerHTML = `
      <div class="transition-spinner"></div>
      <div class="transition-text">Loading Nocturne Store...</div>
    `;
    document.body.appendChild(curtain);

    // Smooth entrance fade-out
    requestAnimationFrame(() => {
      setTimeout(() => {
        curtain.classList.remove('active');
        setTimeout(() => curtain.remove(), 500);
      }, 200);
    });

    // Exit transition when clicking back link to main portfolio
    const backLink = document.querySelector('.back-link');
    if (backLink) {
      backLink.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const targetUrl = backLink.getAttribute('href');

        const exitCurtain = document.createElement('div');
        exitCurtain.className = 'page-transition-curtain';
        exitCurtain.innerHTML = `
          <div class="transition-spinner"></div>
          <div class="transition-text">Returning to jimbodev.hu...</div>
        `;
        document.body.appendChild(exitCurtain);

        requestAnimationFrame(() => {
          exitCurtain.classList.add('active');
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 380);
        });
      });
    }
  })();
})();

