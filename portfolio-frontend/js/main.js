/* ═══════════════════════════════════════════════
   Muhammad Bilal Portfolio — main.js
═══════════════════════════════════════════════ */

/* ── Config ── */
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : `${window.location.protocol}//${window.location.hostname}/api`;

/* ════════════════════════════════════════
   1. PARTICLE CANVAS BACKGROUND

════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let mx = W / 2, my = H / 2;

  const PARTICLE_COUNT = 80;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '0,212,255' : '124,58,237'
  }));

  const hexagons = Array.from({ length: 8 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 60 + 30,
    angle: Math.random() * Math.PI * 2,
    speed: (Math.random() - 0.5) * 0.003,
    opacity: Math.random() * 0.04 + 0.01,
    color: Math.random() > 0.5 ? '0,212,255' : '124,58,237'
  }));

  function drawHex(cx, cy, r, angle) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = angle + (i * Math.PI) / 3;
      if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      else         ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Hexagons (mouse-attracted)
    hexagons.forEach(h => {
      h.angle += h.speed;
      h.x += (mx - h.x) * 0.00004;
      h.y += (my - h.y) * 0.00004;
      ctx.strokeStyle = `rgba(${h.color},${h.opacity})`;
      ctx.lineWidth = 0.5;
      drawHex(h.x, h.y, h.r, h.angle);
      ctx.stroke();
    });

    // Particles
    particles.forEach(p => {
      const dx = mx - p.x, dy = my - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 200) { p.x += dx * 0.0002; p.y += dy * 0.0002; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          const op = (1 - dist / 120) * 0.07;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,212,255,${op})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  draw();
})();

/* ════════════════════════════════════════
   2. CUSTOM CURSOR
════════════════════════════════════════ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let rx = 0, ry = 0, tx = 0, ty = 0;

  window.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top  = ty + 'px';
  });

  function animateCursor() {
    rx += (tx - rx) * 0.12;
    ry += (ty - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover scale effect
  document.querySelectorAll('a, button, .filter-btn, .star-btn, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
})();

/* ════════════════════════════════════════
   3. TYPING ANIMATION
════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typed');
  if (!el) return;

  const words = [
    'intelligent AI systems',
    'real-time ML models',
    'full stack web apps',
    'Android applications',
    'graph database solutions'
  ];

  let wi = 0, ci = 0, deleting = false, wait = 0;

  function loop() {
    if (wait > 0) { wait--; setTimeout(loop, 60); return; }
    const w = words[wi];
    if (!deleting) {
      el.textContent = w.slice(0, ci + 1);
      ci++;
      if (ci === w.length) { deleting = true; wait = 28; }
      setTimeout(loop, 80);
    } else {
      el.textContent = w.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; wait = 6; }
      setTimeout(loop, 42);
    }
  }
  loop();
})();

/* ════════════════════════════════════════
   4. SCROLL HANDLER (nav, reveal, bars)
════════════════════════════════════════ */
(function initScroll() {
  const navbar    = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');
  const navLinks  = document.querySelectorAll('.nav-links a');
  let skillsAnimated = false;

  function onScroll() {
    const sy = window.scrollY;

    // Navbar style
    if (navbar) navbar.classList.toggle('scrolled', sy > 50);

    // Scroll-to-top visibility
    if (scrollTop) scrollTop.classList.toggle('visible', sy > 400);

    // Active nav link
    navLinks.forEach(a => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        const rect = target.getBoundingClientRect();
        a.classList.toggle('active', rect.top <= 90 && rect.bottom > 90);
      }
    });

    // Reveal elements
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 70) {
        el.classList.add('visible');
      }
    });

    // Skill bars (fire once)
    if (!skillsAnimated) {
      document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        if (bar.getBoundingClientRect().top < window.innerHeight - 50) {
          bar.style.width = bar.dataset.w + '%';
          skillsAnimated = true;
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load
})();

/* ════════════════════════════════════════
   5. SCROLL TO TOP
════════════════════════════════════════ */
document.getElementById('scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ════════════════════════════════════════
   6. COUNTER ANIMATION
════════════════════════════════════════ */
(function initCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = () => {
      current = Math.min(current + 1, target);
      el.textContent = current;
      if (current < target) setTimeout(step, 80);
    };
    setTimeout(step, 500);
  });
})();

/* ════════════════════════════════════════
   7. PROJECT FILTER
════════════════════════════════════════ */
(function initFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;

      document.querySelectorAll('.project-card').forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? 'flex' : 'none';
        if (show) setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
      });
    });
  });
})();

/* ════════════════════════════════════════
   8. STAR RATING
════════════════════════════════════════ */
let starRating = 0;
(function initStars() {
  const buttons = document.querySelectorAll('.star-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      starRating = parseInt(btn.dataset.val);
      highlightStars(starRating);
    });
    btn.addEventListener('mouseenter', () => {
      highlightStars(parseInt(btn.dataset.val));
    });
    btn.addEventListener('mouseleave', () => {
      highlightStars(starRating);
    });
  });

  function highlightStars(n) {
    buttons.forEach((b, i) => b.classList.toggle('lit', i < n));
  }
})();

/* ════════════════════════════════════════
   9. REVIEW FORM SUBMIT
════════════════════════════════════════ */
document.getElementById('btn-review-submit')?.addEventListener('click', async () => {
  const name    = document.getElementById('r-name')?.value.trim();
  const email   = document.getElementById('r-email')?.value.trim();
  const company = document.getElementById('r-company')?.value.trim();
  const role    = document.getElementById('r-role')?.value.trim();
  const message = document.getElementById('r-msg')?.value.trim();
  const msgEl   = document.getElementById('review-form-msg');
  const btn     = document.getElementById('btn-review-submit');

  if (!name || !email || !message || !starRating) {
    showMsg(msgEl, 'error', '⚠️ Please fill in all required fields and select a star rating.');
    return;
  }

  btn.textContent = 'Submitting...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company, role, rating: starRating, message })
    });
    const data = await res.json();
    if (data.success) {
      showMsg(msgEl, 'success', '✅ ' + data.message);
      ['r-name','r-email','r-company','r-role','r-msg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      starRating = 0;
      document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('lit'));
    } else {
      showMsg(msgEl, 'error', data.message || 'Submission failed. Please try again.');
    }
  } catch (err) {
    console.error('Review submission error:', err);
    showMsg(msgEl, 'error', '⚠️ Could not submit review. Please try again later.');
  }

  btn.textContent = 'Submit Review';
  btn.disabled = false;
});

/* ════════════════════════════════════════
   10. CONTACT FORM SUBMIT
════════════════════════════════════════ */
document.getElementById('contact-form')?.addEventListener('submit', async e => {
  e.preventDefault();

  const payload = {
    name:    document.getElementById('c-name')?.value.trim(),
    email:   document.getElementById('c-email')?.value.trim(),
    phone:   document.getElementById('c-phone')?.value.trim(),
    subject: document.getElementById('c-subject')?.value.trim(),
    message: document.getElementById('c-msg')?.value.trim()
  };

  const msgEl = document.getElementById('contact-form-msg');
  const btn   = document.getElementById('btn-contact-submit');

  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    showMsg(msgEl, 'error', '⚠️ Please fill in all required fields.');
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showMsg(msgEl, 'success', '✅ ' + data.message);
      document.getElementById('contact-form').reset();
    } else {
      showMsg(msgEl, 'error', data.message || 'Failed to send. Please try again.');
    }
  } catch (err) {
    console.error('Contact form error:', err);
    showMsg(msgEl, 'error', '⚠️ Message could not be sent. Please try again later.');
  }

  btn.textContent = 'Send Message →';
  btn.disabled = false;
});

/* ════════════════════════════════════════
   11. VISITOR COUNTER (from API)
════════════════════════════════════════ */
(async function fetchVisitorCount() {
  try {
    const res  = await fetch(`${API_BASE}/visitors/count`);
    const data = await res.json();
    if (data.success) {
      const el = document.getElementById('visitor-count');
      if (el) el.textContent = data.data.totalUniqueVisitors.toLocaleString();
    }
  } catch {
    // Backend offline — keep default value
  }
})();

/* ════════════════════════════════════════
   12. THEME TOGGLE
════════════════════════════════════════ */
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  // Load saved preference
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
})();

/* ════════════════════════════════════════
   13. MOBILE NAV TOGGLE
════════════════════════════════════════ */
(function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const links     = document.getElementById('navLinks');
  if (!hamburger || !links) return;

  hamburger.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* ════════════════════════════════════════
   14. UTILITY HELPERS
════════════════════════════════════════ */
function showMsg(el, type, text) {
  if (!el) return;
  el.className = 'form-msg ' + type;
  el.textContent = text;
  // Auto-hide after 6 seconds
  setTimeout(() => {
    if (el.className.includes('form-msg')) {
      el.className = 'form-msg';
      el.textContent = '';
    }
  }, 6000);
}

/* ════════════════════════════════════════
   15. SMOOTH ANCHOR SCROLL (override)
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      window.scrollTo({
        top: target.offsetTop - navH,
        behavior: 'smooth'
      });
    }
  });
});
