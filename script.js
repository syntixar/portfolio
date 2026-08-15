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

  /* ---------- 6. Card mouse-tracking spotlight ---------- */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    $$('.card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  }

  /* ---------- 7. Hero parallax ---------- */
  const heroContent = $('#heroContent');
  let ticking = false;
  function parallax() {
    const y = window.scrollY;
    if (heroContent && y > 0 && y < window.innerHeight && !prefersReduced) {
      heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.55)).toFixed(3);
      heroContent.style.transform = `translateY(${y * 0.18}px) scale(${Math.max(0.95, 1 - y / 8000)})`;
      heroContent.style.willChange = 'transform, opacity';
    } else if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'none';
    }
    ticking = false;
  }
  function requestParallax() {
    if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
  }
  window.addEventListener('scroll', requestParallax, { passive: true });
  requestParallax();

  /* ---------- 8. Back to top ---------- */
  const toTop = $('#toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));
  }

  /* ---------- 9. Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 10. Contact form (mailto fallback) ---------- */
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

  /* ---------- 11. Scrollspy cleanup ---------- */
  window.addEventListener('scroll', onScrollNav, { passive: true });
})();