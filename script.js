/* ══════════════════════════════════════════════════════════════
   INVITACIÓN XV AÑOS — ISABELLA ECHEVERRY FUENTES | script.js
   ══════════════════════════════════════════════════════════════ */

// ─── CONFIGURACIÓN ────────────────────────────────────────────
const EVENT_DATE = new Date('2026-09-19T20:00:00');

const PETAL_COLORS = [
  '#f5d5de', '#e8a8b8', '#fde8ee',
  '#e8d5a3', '#f0c5d0', '#fdf0f3',
  '#dba0b0', '#f5e8d5',
];

// ═══════════════════════════════════════════════════════════════
// PÉTALOS
// ═══════════════════════════════════════════════════════════════
function createPetal(container) {
  const petal = document.createElement('div');
  petal.classList.add('petal');

  const size  = Math.random() * 14 + 7;
  const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];

  petal.style.cssText = [
    `width:${size}px`,
    `height:${size * 0.75}px`,
    `background:${color}`,
    `left:${Math.random() * 108 - 4}%`,
    `animation-duration:${Math.random() * 6 + 5}s`,
    `animation-delay:${Math.random() * 5}s`,
    `opacity:${Math.random() * 0.5 + 0.35}`,
  ].join(';');

  container.appendChild(petal);

  petal.addEventListener('animationend', () => {
    petal.remove();
    createPetal(container);
  });
}

function spawnPetals(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    setTimeout(() => createPetal(container), Math.random() * 3500);
  }
}

// ═══════════════════════════════════════════════════════════════
// PANTALLA DE BIENVENIDA
// ═══════════════════════════════════════════════════════════════
function initWelcomeScreen() {
  spawnPetals('petals', 22);

  const enterBtn      = document.getElementById('enterBtn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainSite      = document.getElementById('main-site');

  if (!enterBtn) return;

  enterBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('fade-out');

    setTimeout(() => {
      welcomeScreen.classList.add('hidden');
      mainSite.classList.remove('hidden');
      document.body.style.overflow = '';

      initNavbar();
      initCountdown();
      initScrollReveal();
      initGalleryReel();
      initFloatingPlayer();
      spawnPetals('heroPetals', 14);
      spawnPetals('footerPetals', 8);
    }, 900);
  });
}

// ═══════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks?.classList.remove('open'));
  });
}

// ═══════════════════════════════════════════════════════════════
// CUENTA REGRESIVA — DINÁMICA
// ═══════════════════════════════════════════════════════════════
function initCountdown() {
  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl) return;

  function pad(n, d = 2) { return String(n).padStart(d, '0'); }

  function bump(el) {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 200);
  }

  let prev = {};

  function update() {
    const diff = EVENT_DATE - new Date();

    if (diff <= 0) {
      const wrap = daysEl.closest('.countdown-wrap');
      if (wrap) {
        wrap.innerHTML = `<p style="
          font-family:'Great Vibes',cursive;
          font-size:clamp(2rem,6vw,3.5rem);
          color:var(--pink-deep);
          text-align:center;
          width:100%;
        ">¡El gran día ha llegado! 🎊</p>`;
      }
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const vals = {
      days:    pad(d, d >= 100 ? 3 : 2),
      hours:   pad(h),
      minutes: pad(m),
      seconds: pad(s),
    };

    const els = { days: daysEl, hours: hoursEl, minutes: minutesEl, seconds: secondsEl };

    Object.entries(vals).forEach(([key, val]) => {
      if (val !== prev[key] && els[key]) {
        els[key].textContent = val;
        bump(els[key]);
      }
    });

    prev = { ...vals };
  }

  update();
  setInterval(update, 1000);
}

// ═══════════════════════════════════════════════════════════════
// REPRODUCTOR FLOTANTE DE MÚSICA
// ═══════════════════════════════════════════════════════════════
function initFloatingPlayer() {
  const audio      = document.getElementById('bgMusic');
  const player     = document.getElementById('floatingPlayer');
  const vinyl      = document.getElementById('fpVinyl');
  const playBtn    = document.getElementById('fpPlay');
  const backBtn    = document.getElementById('fpBack');
  const fwdBtn     = document.getElementById('fpForward');
  const progress   = document.getElementById('fpProgress');
  const iconPlay   = playBtn?.querySelector('.fp-icon-play');
  const iconPause  = playBtn?.querySelector('.fp-icon-pause');

  if (!audio || !player) return;

  // Mostrar el player cuando el usuario lleve más de 200px de scroll
  const heroHeight = window.innerHeight;
  window.addEventListener('scroll', () => {
    if (window.scrollY > heroHeight * 0.3) {
      player.classList.remove('hidden');
      player.classList.add('fp-visible');
    } else {
      player.classList.remove('fp-visible');
    }
  }, { passive: true });

  // Play / Pausa
  playBtn?.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  // Sincronizar estado visual
  audio.addEventListener('play', () => {
    vinyl?.classList.remove('fp-paused');
    if (iconPlay)  iconPlay.style.display  = 'none';
    if (iconPause) iconPause.style.display = 'block';
  });

  audio.addEventListener('pause', () => {
    vinyl?.classList.add('fp-paused');
    if (iconPlay)  iconPlay.style.display  = 'block';
    if (iconPause) iconPause.style.display = 'none';
  });

  audio.addEventListener('ended', () => {
    vinyl?.classList.add('fp-paused');
    if (iconPlay)  iconPlay.style.display  = 'block';
    if (iconPause) iconPause.style.display = 'none';
  });

  // Barra de progreso
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    progress.value = (audio.currentTime / audio.duration) * 100;
  });

  progress?.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (progress.value / 100) * audio.duration;
  });

  // Retroceder / Adelantar 10 segundos
  backBtn?.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });

  fwdBtn?.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  });

  // Estado inicial paused
  vinyl?.classList.add('fp-paused');
}

// ═══════════════════════════════════════════════════════════════
// ANIMACIONES SCROLL
// ═══════════════════════════════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
    if (el.classList.contains('event-card') || el.classList.contains('reel-item')) {
      el.style.transitionDelay = `${(i % 5) * 0.1}s`;
    }
    observer.observe(el);
  });
}

// ═══════════════════════════════════════════════════════════════
// GALERÍA — ROLLO / CARRUSEL
// ═══════════════════════════════════════════════════════════════
function initGalleryReel() {
  const reel      = document.getElementById('galleryReel');
  const prevBtn   = document.getElementById('reelPrev');
  const nextBtn   = document.getElementById('reelNext');
  const dotsWrap  = document.getElementById('reelDots');

  if (!reel) return;

  const items = Array.from(reel.querySelectorAll('.reel-item'));
  let current = 0;

  // Crear puntos indicadores
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('reel-dot');
    dot.setAttribute('aria-label', `Foto ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  function getDots() {
    return dotsWrap ? Array.from(dotsWrap.querySelectorAll('.reel-dot')) : [];
  }

  function goTo(index) {
    current = (index + items.length) % items.length;
    const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(reel).gap || '16');
    reel.scrollTo({ left: current * itemWidth, behavior: 'smooth' });
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Swipe táctil
  let startX = 0;
  reel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  reel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Actualizar el dot activo al hacer scroll manual
  reel.addEventListener('scroll', () => {
    const itemWidth = items[0]?.offsetWidth || 1;
    const index = Math.round(reel.scrollLeft / itemWidth);
    if (index !== current) {
      current = index;
      getDots().forEach((d, i) => d.classList.toggle('active', i === current));
    }
  }, { passive: true });

  // Lightbox al hacer clic
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.style.cssText = `
    display:none;position:fixed;inset:0;z-index:2000;
    background:rgba(35,18,25,0.96);
    align-items:center;justify-content:center;cursor:zoom-out;
  `;
  lb.innerHTML = `
    <div style="position:relative;max-width:90vw;max-height:90vh;text-align:center;">
      <div id="lb-box" style="
        width:min(560px,82vw);height:min(420px,70vh);
        background:linear-gradient(145deg,#3a2a1e,#d4788e);
        border-radius:16px;display:flex;align-items:center;
        justify-content:center;flex-direction:column;gap:1.2rem;
        box-shadow:0 30px 80px rgba(0,0,0,0.4);overflow:hidden;
      ">
        <div id="lb-img-wrap" style="width:100%;height:100%;"></div>
        <span id="lb-icon" style="font-size:4rem;position:absolute;"></span>
        <p id="lb-label" style="
          position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);
          color:rgba(255,255,255,0.9);
          font-family:'Great Vibes',cursive;
          font-size:2rem;
          text-shadow:0 2px 8px rgba(0,0,0,0.5);
          white-space:nowrap;
        "></p>
      </div>
      <button id="lb-close" aria-label="Cerrar" style="
        position:absolute;top:-44px;right:0;
        background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);
        color:white;font-size:1.2rem;cursor:pointer;border-radius:50%;
        width:36px;height:36px;display:flex;align-items:center;justify-content:center;
      ">✕</button>
    </div>
  `;
  document.body.appendChild(lb);

  items.forEach(item => {
    item.addEventListener('click', () => {
      const label   = item.dataset.label || '';
      const photo   = item.querySelector('img');
      const iconEl  = item.querySelector('.g-icon');
      const wrap    = document.getElementById('lb-img-wrap');
      const lbIcon  = document.getElementById('lb-icon');
      const lbLabel = document.getElementById('lb-label');

      if (photo) {
        wrap.innerHTML = `<img src="${photo.src}" alt="${label}" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"/>`;
        lbIcon.textContent  = '';
      } else {
        wrap.innerHTML = '';
        lbIcon.textContent = iconEl?.textContent || '';
      }
      lbLabel.textContent = label;

      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      const box = document.getElementById('lb-box');
      if (box) {
        box.style.opacity = '0';
        box.style.transform = 'scale(0.9)';
        box.style.transition = 'none';
        requestAnimationFrame(() => {
          box.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          box.style.opacity = '1';
          box.style.transform = 'scale(1)';
        });
      }
    });
  });

  const closeLb = () => { lb.style.display = 'none'; document.body.style.overflow = ''; };
  document.getElementById('lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
}

// ═══════════════════════════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 68,
      behavior: 'smooth',
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// PARALLAX SUTIL EN EL HERO
// ═══════════════════════════════════════════════════════════════
function initParallax() {
  const overlay = document.querySelector('.hero-bg-overlay');
  if (!overlay) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      overlay.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════════
// INICIO
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';
  initWelcomeScreen();
  initSmoothScroll();
  initParallax();
});
