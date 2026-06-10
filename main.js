/* =========================================
   FDS TECHNOLOGY & CONSULTING – MAIN JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  // ===== SCROLL TO TOP =====
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) item.classList.add('active');
    });
  };
  window.addEventListener('scroll', updateActiveNav);

  // ===== INTERSECTION OBSERVER (scroll reveal) =====
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, observerOptions);

  // Timeline items
  document.querySelectorAll('.tl-item').forEach((el, i) => {
    el.dataset.delay = i * 80;
    revealObserver.observe(el);
  });

  // Generic aos elements
  document.querySelectorAll('[data-aos]').forEach((el, i) => {
    el.dataset.delay = el.dataset.delay || i * 60;
    revealObserver.observe(el);
  });

  // Cards with stagger
  const staggerGroups = [
    { selector: '.nos-card', delay: 80 },
    { selector: '.serv-card', delay: 60 },
    { selector: '.sol-card', delay: 80 },
    { selector: '.cert-card', delay: 80 },
    { selector: '.kpi-card', delay: 100 },
    { selector: '.tech-badge', delay: 30 },
    { selector: '.pillar', delay: 100 },
    { selector: '.ci-item', delay: 100 }
  ];

  staggerGroups.forEach(group => {
    document.querySelectorAll(group.selector).forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, i * group.delay);
            cardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

      cardObserver.observe(el);
    });
  });

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.kpi-num[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const step = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-form');
    const originalContent = btn.innerHTML;

    btn.innerHTML = `<span>Enviando...</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>`;
    btn.disabled = true;
    btn.style.opacity = '0.8';

    // Simulate sending
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.disabled = false;
      btn.style.opacity = '';
      contactForm.reset();
      showToast('✓ Mensaje enviado correctamente. Le responderemos pronto.');
    }, 2000);
  });

  // ===== TOAST =====
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ===== SMOOTH SCROLL FOR ANCHORS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== HERO PARALLAX (subtle) =====
  const hero = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    if (hero) {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }
  }, { passive: true });

  // ===== CSS SPIN KEYFRAME (for loading) =====
  if (!document.querySelector('#spin-style')) {
    const style = document.createElement('style');
    style.id = 'spin-style';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  // ===== HERO ENTRANCE ANIMATION =====
  const heroElements = [
    '.hero-eyebrow',
    '.hero-title',
    '.hero-subtitle',
    '.hero-actions',
    '.hero-stats'
  ];

  heroElements.forEach((selector, i) => {
    const el = document.querySelector(selector);
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 120);
    }
  });

});
