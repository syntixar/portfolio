/* ============================================================
   Adham Khaled — Portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Typing effect ---------- */
  const typingEl = $('#typing');
  const roles = ['Backend Software Engineer', 'Java Spring Boot Developer', '.NET Developer', 'Problem Solver'];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    if (!typingEl) return;
    const word = roles[roleIdx];
    typingEl.textContent = word.slice(0, charIdx);

    if (!deleting) {
      charIdx++;
      if (charIdx > word.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
      setTimeout(typeLoop, 65);
    } else {
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeLoop, 350);
        return;
      }
      setTimeout(typeLoop, 32);
    }
  }
  if (!prefersReduced) typeLoop(); else if (typingEl) typingEl.textContent = roles[0];

  /* ---------- 2. Navbar scroll state ---------- */
  const navbar = $('#navbar');
  function onScrollNav() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }
  onScrollNav();

  /* ---------- 3. Mobile menu ---------- */
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');

  function closeMenu() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove('mobile-open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('mobile-open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });
  }
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenu(); });

  /* ---------- 4. Scrollspy ---------- */
  const sections = $$('main section[id]');
  const linkMap = new Map();
  $$('.nav-links a').forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    if (id) linkMap.set(id, a);
  });

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      linkMap.forEach((link, id) => link.classList.toggle('active', id === entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ---------- 5. Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- 6. Word-by-word heading reveal ---------- */
  const heads = $$('.sec-title, .cta-title');
  if (!prefersReduced && heads.length) {
    const wrapWord = (frag, word, delayRef) => {
      const w = document.createElement('span');
      w.className = 'w';
      const wi = document.createElement('span');
      wi.className = 'wi';
      wi.textContent = word;
      w.appendChild(wi);
      w.style.setProperty('--d', `${delayRef.i * 0.03}s`);
      delayRef.i++;
      frag.appendChild(w);
      frag.appendChild(document.createTextNode(' '));
    };

    heads.forEach((head) => {
      const frag = document.createDocumentFragment();
      const delayRef = { i: 0 };
      Array.from(head.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.split(/\s+/).filter(Boolean).forEach((word) => wrapWord(frag, word, delayRef));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const clone = node.cloneNode(false);
          node.textContent.split(/\s+/).filter(Boolean).forEach((word) => wrapWord(clone, word, delayRef));
          frag.appendChild(clone);
          frag.appendChild(document.createTextNode(' '));
        }
      });
      head.textContent = '';
      head.appendChild(frag);
      head.classList.add('text-reveal');
    });

    const tr = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          tr.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    heads.forEach((h) => tr.observe(h));
  }

  /* ---------- 7. Card mouse-tracking spotlight ---------- */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    $$('.card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  }

  /* ---------- 8. Custom cursor glow + hero spotlight (desktop only) ---------- */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    const cursorGlow = $('#cursorGlow');
    const heroSpotlight = $('#heroSpotlight');
    const hero = $('#home');
    let gx = 0, gy = 0, tx = 0, ty = 0, moved = false;

    if (cursorGlow) {
      document.addEventListener('mousemove', (e) => {
        tx = e.clientX; ty = e.clientY;
        if (!moved) {
          moved = true;
          gx = tx; gy = ty;
          cursorGlow.classList.add('on');
        }
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', () => cursorGlow.classList.remove('on'));

      (function glowLoop() {
        gx += (tx - gx) * 0.18;
        gy += (ty - gy) * 0.18;
        cursorGlow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        requestAnimationFrame(glowLoop);
      })();
    }

    if (heroSpotlight && hero) {
      hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--sx', `${e.clientX - r.left}px`);
        hero.style.setProperty('--sy', `${e.clientY - r.top}px`);
        heroSpotlight.classList.add('on');
      }, { passive: true });
      hero.addEventListener('mouseleave', () => heroSpotlight.classList.remove('on'));
    }
  }

  /* ---------- 9. Hero parallax + scroll progress (rAF-throttled) ---------- */
  const heroContent = $('#heroContent');
  const progressBar = $('#scrollProgress span');
  const canParallax = !prefersReduced && !window.matchMedia('(hover: none)').matches;
  let ticking = false;
  function parallax() {
    const y = window.scrollY;
    if (heroContent && canParallax && y > 0 && y < window.innerHeight) {
      heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.55)).toFixed(3);
      heroContent.style.transform = `translateY(${y * 0.18}px) scale(${Math.max(0.95, 1 - y / 8000)})`;
    } else if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'none';
    }
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
    ticking = false;
  }
  function requestParallax() {
    if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
  }
  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax);
  requestParallax();

  /* ---------- 10. Pause ambient animations when tab hidden ---------- */
  const bg = document.querySelector('.bg');
  if (bg) {
    document.addEventListener('visibilitychange', () => {
      bg.classList.toggle('paused', document.hidden);
    });
  }

  /* ---------- 11. Back to top ---------- */
  const toTop = $('#toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));
  }

  /* ---------- 12. Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 13. Contact form (mailto fallback) ---------- */
  const form = $('#contactForm');
  const note = $('#formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name', form).value.trim();
      const email = $('#email', form).value.trim();
      const message = $('#message', form).value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        if (note) {
          note.textContent = 'Please fill in all fields with a valid email.';
          note.classList.add('error');
        }
        return;
      }

      const subject = encodeURIComponent(`Project inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:engadhamelsayed@gmail.com?subject=${subject}&body=${body}`;

      if (note) {
        note.classList.remove('error');
        note.textContent = 'Opening your email app... Thank you!';
      }
      form.reset();
    });
  }

  /* ---------- 14. Scrollspy cleanup ---------- */
  window.addEventListener('scroll', onScrollNav, { passive: true });
})();
