/* ══════════════════════════════════════════════════════════════
   INVITACIÓN XV AÑOS — ISABELLA ECHEVERRY FUENTES | script.js
   ══════════════════════════════════════════════════════════════ */

// ─── CONFIGURACIÓN ────────────────────────────────────────────
// ⚠️ Cambia esta fecha por la fecha y hora real del evento
const EVENT_DATE = new Date('2026-09-19T20:00:00');

// ─── COLORES DE PÉTALOS (paleta beige/rosa/dorado) ───────────
const PETAL_COLORS = [
  '#f5d5de', '#e8a8b8', '#fde8ee',
  '#e8d5a3', '#f0c5d0', '#fdf0f3',
  '#dba0b0', '#f5e8d5', '#c9a84c33',
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
  spawnPetals('petals', 20);

  const enterBtn     = document.getElementById('enterBtn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainSite     = document.getElementById('main-site');

  if (!enterBtn) return;

  enterBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('fade-out');

    setTimeout(() => {
      welcomeScreen.classList.add('hidden');
      mainSite.classList.remove('hidden');
      document.body.style.overflow = '';

      // Lanza todas las funcionalidades del sitio
      initNavbar();
      initCountdown();
      initScrollReveal();
      initGalleryLightbox();
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

  // Efecto scroll
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // ejecutar al inicio por si ya está scrolleado

  // Hamburguesa
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Cierra menú móvil al navegar
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// CUENTA REGRESIVA — DINÁMICA Y VISIBLE
// ═══════════════════════════════════════════════════════════════
function initCountdown() {
  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl) return;

  function pad(n, digits = 2) { return String(n).padStart(digits, '0'); }

  // Animación visual al cambiar un número
  function bump(el) {
    el.classList.remove('bump');
    void el.offsetWidth; // fuerza reflow
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 200);
  }

  let prevDays = null, prevHours = null, prevMins = null, prevSecs = null;

  function updateCountdown() {
    const now  = new Date();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      // El gran día ha llegado
      const grid = daysEl.closest('.countdown-wrap');
      if (grid) {
        grid.innerHTML = `<p style="
          font-family:'Great Vibes',cursive;
          font-size:clamp(2rem,6vw,3.5rem);
          color:var(--pink-deep);
          text-align:center;
          width:100%;
          animation:fadeUpIn 0.6s ease forwards
        ">¡El gran día ha llegado! 🎊</p>`;
      }
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    const dStr = pad(days, days >= 100 ? 3 : 2);
    const hStr = pad(hours);
    const mStr = pad(minutes);
    const sStr = pad(seconds);

    if (daysEl    && dStr !== prevDays)    { daysEl.textContent    = dStr; bump(daysEl); }
    if (hoursEl   && hStr !== prevHours)   { hoursEl.textContent   = hStr; bump(hoursEl); }
    if (minutesEl && mStr !== prevMins)    { minutesEl.textContent = mStr; bump(minutesEl); }
    if (secondsEl && sStr !== prevSecs)    { secondsEl.textContent = sStr; bump(secondsEl); }

    prevDays = dStr; prevHours = hStr; prevMins = mStr; prevSecs = sStr;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ═══════════════════════════════════════════════════════════════
// ANIMACIONES DE ENTRADA (Intersection Observer)
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

  // Agrega clases y observa
  const toReveal = document.querySelectorAll(
    '.countdown-section .section-header, .cd-inner .countdown-wrap, .cd-note,' +
    '.about-image-wrap, .about-text,' +
    '.parents-section .section-header, .parents-cards, .parents-message,' +
    '.gallery-section .section-header, .gallery-item,' +
    '.event-section .section-header, .event-card,' +
    '.music-section .section-header, .music-player,' +
    '.rsvp-inner'
  );

  toReveal.forEach((el, i) => {
    if (!el.classList.contains('reveal') &&
        !el.classList.contains('reveal-left') &&
        !el.classList.contains('reveal-right')) {
      el.classList.add('reveal');
    }

    // Stagger para listas
    if (el.classList.contains('event-card') || el.classList.contains('gallery-item')) {
      el.style.transitionDelay = `${(i % 5) * 0.1}s`;
    }

    observer.observe(el);
  });

  // También observa los que ya tienen la clase
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ═══════════════════════════════════════════════════════════════
// GALERÍA — LIGHTBOX
// ═══════════════════════════════════════════════════════════════
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Crea el lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.style.cssText = `
    display:none;
    position:fixed;
    inset:0;
    z-index:2000;
    background:rgba(35,18,25,0.96);
    align-items:center;
    justify-content:center;
    cursor:zoom-out;
  `;

  lb.innerHTML = `
    <div style="position:relative;max-width:90vw;max-height:90vh;text-align:center;">
      <div id="lb-box" style="
        width:min(580px,82vw);height:min(440px,70vh);
        background:linear-gradient(145deg,#3a2a1e,#c9748a);
        border-radius:16px;display:flex;align-items:center;
        justify-content:center;flex-direction:column;gap:1.2rem;
        box-shadow:0 30px 80px rgba(0,0,0,0.4);
      ">
        <span id="lb-icon" style="font-size:4.5rem;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3))"></span>
        <p id="lb-label" style="
          color:rgba(255,255,255,0.9);
          font-family:'Great Vibes',cursive;
          font-size:2rem;
        "></p>
      </div>
      <button id="lb-close" aria-label="Cerrar" style="
        position:absolute;top:-44px;right:0;
        background:rgba(255,255,255,0.12);
        border:1px solid rgba(255,255,255,0.2);
        color:white;font-size:1.3rem;
        cursor:pointer;border-radius:50%;
        width:36px;height:36px;
        display:flex;align-items:center;justify-content:center;
        transition:background 0.3s;
      ">✕</button>
    </div>
  `;

  document.body.appendChild(lb);

  items.forEach(item => {
    item.addEventListener('click', () => {
      const icon  = item.querySelector('.g-icon')?.textContent || '🌸';
      const label = item.dataset.label || 'Foto';
      document.getElementById('lb-icon').textContent  = icon;
      document.getElementById('lb-label').textContent = label;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      // Animación entrada
      const box = document.getElementById('lb-box');
      if (box) {
        box.style.animation = 'none';
        box.style.opacity   = '0';
        box.style.transform = 'scale(0.9)';
        requestAnimationFrame(() => {
          box.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          box.style.opacity    = '1';
          box.style.transform  = 'scale(1)';
        });
      }
    });
  });

  function closeLb() {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  }

  document.getElementById('lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
}

// ═══════════════════════════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href   = anchor.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const offset = 68;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

// ═══════════════════════════════════════════════════════════════
// EFECTO PARALLAX SUTIL EN EL HERO
// ═══════════════════════════════════════════════════════════════
function initParallax() {
  const hero = document.querySelector('.hero-section');
  const overlay = hero?.querySelector('.hero-bg-overlay');
  if (!overlay) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      overlay.style.transform = `translateY(${scrollY * 0.25}px)`;
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════════
// ANIMACIÓN DEL NÚMERO DE CUENTA REGRESIVA (CSS bump)
// ═══════════════════════════════════════════════════════════════
(function injectBumpStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes numBump {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.14); color: var(--pink-deep, #d4788e); }
      100% { transform: scale(1); }
    }
    .cd-num.bump { animation: numBump 0.2s ease; }
  `;
  document.head.appendChild(style);
})();

// ═══════════════════════════════════════════════════════════════
// INICIO
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden'; // bloquea scroll en bienvenida
  initWelcomeScreen();
  initSmoothScroll();
  initParallax();
});
