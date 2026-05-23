/*
  Portfolio: Akshay Maheshwari
  Script: Interactivity, animations, typewriter, counters
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. CUSTOM CURSOR
  ============================================ */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    // Ring follows with slight lag
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Grow on interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .chip, .contact-method');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '52px';
        ring.style.height = '52px';
        ring.style.borderColor = 'rgba(0,212,170,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(0,212,170,0.5)';
      });
    });
  }


  /* ============================================
     2. STICKY HEADER on scroll
  ============================================ */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* ============================================
     3. HAMBURGER MOBILE MENU
  ============================================ */
  const hamburger    = document.getElementById('hamburger');
  const navLinks     = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      hamburger.classList.add('open');
      navLinks.classList.add('open');
      mobileOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  });

  mobileOverlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* ============================================
     4. SMOOTH SCROLLING with header offset
  ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 16;
      const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ============================================
     5. SCROLL REVEAL ANIMATIONS
  ============================================ */
  const revealEls = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ============================================
     6. TYPEWRITER EFFECT
  ============================================ */
  const typedEl = document.getElementById('typedText');

  const phrases = [
    'full-stack web apps',
    'AI-powered SaaS',
    'fast MVPs',
    'intelligent tools',
    'clean, modern UIs',
  ];

  let pIdx  = 0;
  let cIdx  = 0;
  let isDeleting = false;
  function type() {
    const currentPhrase = phrases[pIdx];

    if (isDeleting) {
      typedEl.textContent = currentPhrase.substring(0, cIdx - 1);
      cIdx--;
    } else {
      typedEl.textContent = currentPhrase.substring(0, cIdx + 1);
      cIdx++;
    }

    let delay = isDeleting ? 45 : 80;

    if (!isDeleting && cIdx === currentPhrase.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && cIdx === 0) {
      isDeleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Start after a short delay
  setTimeout(type, 800);


  /* ============================================
     7. COUNTER ANIMATION
  ============================================ */
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el       = entry.target;
        const target   = parseInt(el.dataset.target, 10);
        const duration = 1200;
        const startTime = performance.now();

        function tick(now) {
          const elapsed  = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));




  /* ============================================
     9. CONTACT FORM with Formspree + validation
  ============================================ */
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitTxt = document.getElementById('submitText');
  const successEl = document.getElementById('formSuccess');
  const errorEl   = document.getElementById('formError');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.classList.remove('show');

      submitBtn.disabled = true;
      submitTxt.textContent = 'Sending...';

      try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          successEl.classList.add('show');
          submitBtn.style.display = 'none';
          setTimeout(() => {
            successEl.classList.remove('show');
            submitBtn.style.display = '';
            submitBtn.disabled = false;
            submitTxt.textContent = 'Send Message';
          }, 5000);
        } else {
          throw new Error('failed');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitTxt.textContent = 'Send Message';
        errorEl.classList.add('show');
        setTimeout(() => errorEl.classList.remove('show'), 6000);
      }
    });
  }


  /* ============================================
     10. ACTIVE NAV LINK on scroll
  ============================================ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  }, {
    threshold: 0.4,
  });

  sections.forEach(s => sectionObserver.observe(s));

});
