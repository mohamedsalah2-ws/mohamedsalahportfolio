// ─── Loading Screen ──────────────────────────────────────────────
const loader = document.createElement('div');
loader.id = 'page-loader';
loader.innerHTML = `
  <div class="loader-inner">
    <div class="loader-logo">MS<span>_</span>DEV</div>
    <div class="loader-bar"><div class="loader-progress"></div></div>
    <div class="loader-percent">0%</div>
  </div>
`;
loader.style.cssText = `
  position:fixed; inset:0; background:#050508; z-index:99999;
  display:flex; align-items:center; justify-content:center;
  transition: opacity 0.6s ease, transform 0.6s ease;
`;
loader.innerHTML += `<style>
  .loader-inner { text-align:center; }
  .loader-logo  { font-family:'Space Mono',monospace; font-size:18px; color:#00d4ff;
                  letter-spacing:4px; margin-bottom:32px; }
  .loader-logo span { animation: blink 1s infinite; }
  .loader-bar   { width:200px; height:1px; background:#1e1e2e; margin:0 auto 12px; }
  .loader-progress { height:100%; width:0%; background:linear-gradient(90deg,#00d4ff,#00c4f4);
                     transition:width 0.05s linear; }
  .loader-percent { font-family:'Space Mono',monospace; font-size:11px; color:#5a5a7a;
                    letter-spacing:2px; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
</style>`;
document.body.prepend(loader);

let progress = 0;
const progressBar = loader.querySelector('.loader-progress');
const percentEl   = loader.querySelector('.loader-percent');
const interval = setInterval(() => {
  progress += Math.random() * 15;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    setTimeout(() => {
      loader.style.opacity   = '0';
      loader.style.transform = 'translateY(-20px)';
      setTimeout(() => loader.remove(), 600);
    }, 300);
  }
  progressBar.style.width = progress + '%';
  percentEl.textContent   = Math.floor(progress) + '%';
}, 80);

// ─── Mobile Menu ─────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── Custom Cursor ───────────────────────────────────────────────
const cursor = document.getElementById('cursor');
let cursorX = 0, cursorY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX - 4;
  cursorY = e.clientY - 4;
});

// Smooth cursor follow
function animateCursor() {
  currentX += (cursorX - currentX) * 0.15;
  currentY += (cursorY - currentY) * 0.15;
  cursor.style.left = currentX + 'px';
  cursor.style.top  = currentY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card, .skill-card, .auto-card, .tool-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform  = 'scale(3)';
    cursor.style.opacity    = '0.5';
    cursor.style.background = '#00c4f4';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform  = 'scale(1)';
    cursor.style.opacity    = '1';
    cursor.style.background = '#00d4ff';
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

// ─── Smooth Scroll for Anchor Links ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ─── Nav Scroll Effect ───────────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background    = 'rgba(5,5,8,0.98)';
    nav.style.borderBottom  = '1px solid rgba(0,212,255,0.15)';
  } else {
    nav.style.background    = 'rgba(5,5,8,0.92)';
    nav.style.borderBottom  = '1px solid #1e1e2e';
  }
}, { passive: true });

// ─── Active Nav Link on Scroll ───────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--accent)'
      : '';
  });
}, { passive: true });

// ─── Scroll Progress Bar ─────────────────────────────────────────
const scrollBar = document.createElement('div');
scrollBar.style.cssText = `
  position:fixed; top:0; left:0; height:2px; width:0%;
  background:linear-gradient(90deg,#00d4ff,#00c4f4,#7b61ff);
  z-index:10000; transition:width 0.1s linear; pointer-events:none;
`;
document.body.appendChild(scrollBar);

window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });

// ─── Scroll Fade-In (Cards & Items) ──────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0) scale(1)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.project-card, .auto-card, .skill-card, .tool-item').forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(30px) scale(0.97)';
  el.style.transition = `opacity 0.6s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1),
                          transform 0.6s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1),
                          border-color 0.3s, background 0.3s`;
  fadeObserver.observe(el);
});

// ─── Section Label Fade-In ───────────────────────────────────────
const labelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateX(0)';
      labelObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.section-label').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateX(-20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  // skip about section — handled by textObserver
  if (el.closest('#about')) return;
  labelObserver.observe(el);
});

// ─── Section Title Reveal ─────────────────────────────────────────
document.querySelectorAll('.section-title').forEach(el => {
  // skip about — handled by textObserver
  if (el.closest('#about')) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(el);
});

// ─── About Text Fade-In ──────────────────────────────────────────
document.querySelectorAll('.about-text p').forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  el.style.transition = `opacity 0.6s ${i * 0.15}s ease, transform 0.6s ${i * 0.15}s ease`;
});

const textObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Show paragraphs
      entry.target.querySelectorAll('.about-text p').forEach(el => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
      // Show section-title inside about
      entry.target.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('is-visible');
      });
      // Show section-label inside about
      entry.target.querySelectorAll('.section-label').forEach(el => {
        el.style.opacity   = '1';
        el.style.transform = 'translateX(0)';
      });
      textObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

const aboutSection = document.getElementById('about');
if (aboutSection) textObserver.observe(aboutSection);

// ─── Counter Animate ─────────────────────────────────────────────
function animateCounter(el, target, suffix) {
  let current = 0;
  const step  = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + suffix;
  }, 35);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.counter-num');
      const data = [
        { val: 15, suffix: '+' },
        { val: 20, suffix: '+' },
        { val: 2,  suffix: '+' },
      ];
      nums.forEach((el, i) => {
        if (data[i]) animateCounter(el, data[i].val, data[i].suffix);
      });
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroCounter = document.querySelector('.hero-counter');
if (heroCounter) counterObs.observe(heroCounter);

// ─── Magnetic Buttons ────────────────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-contact-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect   = btn.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ─── Rotating Wireframe (Hero Background) ────────────────────────
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Icosahedron vertices
  const phi = (1 + Math.sqrt(5)) / 2;
  const verts = [
    [-1, phi, 0], [1, phi, 0], [-1,-phi, 0], [1,-phi, 0],
    [0,-1, phi], [0, 1, phi], [0,-1,-phi], [0, 1,-phi],
    [phi, 0,-1], [phi, 0, 1], [-phi, 0,-1], [-phi, 0, 1]
  ].map(v => {
    const len = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
    return v.map(c => c / len * 200);
  });

  // Icosahedron edges
  const edges = [
    [0,1],[0,5],[0,7],[0,10],[0,11],
    [1,5],[1,7],[1,8],[1,9],
    [2,3],[2,6],[2,10],[2,11],[2,4],
    [3,4],[3,6],[3,8],[3,9],
    [4,5],[4,9],[4,11],
    [5,9],[5,11],
    [6,7],[6,8],[6,10],
    [7,8],[7,10],
    [8,9],[10,11]
  ];

  // Second larger wireframe (octahedron) in background
  const verts2 = [
    [0, 300, 0], [0,-300, 0],
    [300, 0, 0], [-300, 0, 0],
    [0, 0, 300], [0, 0,-300]
  ];
  const edges2 = [
    [0,2],[0,3],[0,4],[0,5],
    [1,2],[1,3],[1,4],[1,5],
    [2,4],[2,5],[3,4],[3,5]
  ];

  let rotX = 0, rotY = 0, rotZ = 0;
  let rotX2 = 0.5, rotY2 = 0.3;

  function rotateX(v, a) {
    const cos = Math.cos(a), sin = Math.sin(a);
    return [v[0], v[1]*cos - v[2]*sin, v[1]*sin + v[2]*cos];
  }
  function rotateY(v, a) {
    const cos = Math.cos(a), sin = Math.sin(a);
    return [v[0]*cos + v[2]*sin, v[1], -v[0]*sin + v[2]*cos];
  }
  function rotateZ(v, a) {
    const cos = Math.cos(a), sin = Math.sin(a);
    return [v[0]*cos - v[1]*sin, v[0]*sin + v[1]*cos, v[2]];
  }
  function project(v, cx, cy) {
    const fov = 600;
    const z   = v[2] + 600;
    return [cx + (v[0] * fov) / z, cy + (v[1] * fov) / z, z];
  }

  function drawWireframe(vertices, edgeList, cx, cy, color, angleX, angleY, angleZ) {
    const projected = vertices.map(v => {
      let r = rotateX(v, angleX);
      r = rotateY(r, angleY);
      r = rotateZ(r, angleZ);
      return project(r, cx, cy);
    });

    edgeList.forEach(([a, b]) => {
      const p1 = projected[a], p2 = projected[b];
      const depth = (p1[2] + p2[2]) / 2;
      const alpha = Math.min(1, Math.max(0.1, (depth - 300) / 600));

      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.strokeStyle = color.replace('OPA', (alpha * 0.7).toFixed(2));
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    // Draw vertices as dots
    projected.forEach(p => {
      const alpha = Math.min(1, Math.max(0.05, (p[2] - 300) / 600));
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2, 0, Math.PI * 2);
      ctx.fillStyle = color.replace('OPA', (alpha * 0.9).toFixed(2));
      ctx.fill();
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;

    // Background octahedron — slower, offset
    drawWireframe(
      verts2, edges2,
      cx + canvas.width * 0.28, cy,
      'rgba(123,97,255,OPA)',
      rotX2, rotY2, rotZ * 0.3
    );

    // Main icosahedron — centered, faster
    drawWireframe(
      verts, edges,
      cx - canvas.width * 0.05, cy,
      'rgba(0,212,255,OPA)',
      rotX, rotY, rotZ
    );

    rotX  += 0.003;
    rotY  += 0.005;
    rotZ  += 0.002;
    rotX2 += 0.002;
    rotY2 += 0.003;

    requestAnimationFrame(draw);
  }
  draw();
})();
const badge = document.querySelector('.hero-badge');
if (badge) {
  const originalText = badge.textContent.trim();
  badge.textContent  = '';
  const textSpan = document.createElement('span');
  badge.appendChild(textSpan);
  let i = 0;
  const typeInterval = setInterval(() => {
    textSpan.textContent += originalText[i];
    i++;
    if (i >= originalText.length) clearInterval(typeInterval);
  }, 60);
}

// ─── Smooth Reveal for Contact Section ───────────────────────────
const contactObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll(
        '.section-label, .contact-big, .contact-sub, .contact-links, .btn-primary'
      );
      children.forEach((el, i) => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(24px)';
        el.style.transition = `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease`;
        setTimeout(() => {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, 50);
      });
      contactObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

const contactSection = document.getElementById('contact');
if (contactSection) contactObs.observe(contactSection);

// ─── Footer Social Links Stagger ─────────────────────────────────
const footerObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.social-link').forEach((el, i) => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(16px)';
        el.style.transition = `opacity 0.4s ${i * 0.05}s ease, transform 0.4s ${i * 0.05}s ease,
                               color 0.2s, border-color 0.2s`;
        setTimeout(() => {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, 50);
      });
      footerObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const footer = document.querySelector('footer');
if (footer) footerObs.observe(footer);