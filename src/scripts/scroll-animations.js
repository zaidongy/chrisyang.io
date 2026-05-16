import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SCROLLER = '.portfolio';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 767px)').matches;

ScrollTrigger.defaults({ scroller: SCROLLER });

function splitTextToChars(element) {
  const children = Array.from(element.childNodes);
  let result = '';

  children.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent;
      for (const char of text) {
        if (char === ' ') {
          result += ' ';
        } else {
          result += `<span class="char">${char}</span>`;
        }
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const classes = child.className;
      const text = child.textContent;
      let inner = '';
      for (const char of text) {
        if (char === ' ') {
          inner += ' ';
        } else {
          inner += `<span class="char">${char}</span>`;
        }
      }
      result += `<span class="${classes}">${inner}</span>`;
    }
  });

  element.innerHTML = result;
}

// ── Hero: Character Clip-In ──

function initHeroAnimation() {
  const title = document.querySelector('.hero-title');
  const sub = document.querySelector('.hero-sub');
  if (!title) return;

  splitTextToChars(title);

  const duration = isMobile ? 0.3 : 0.5;

  gsap.fromTo('.hero-title .char', {
    y: 20,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    stagger: 0.03,
    ease: 'power2.out',
    duration: duration,
  });

  gsap.fromTo(sub, {
    y: 30,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    ease: 'power2.out',
    duration: duration + 0.1,
    delay: duration * 0.4,
  });

  gsap.to('.hero-title .green', {
    textShadow: '0 0 20px rgba(51, 255, 51, 0.5)',
    duration: 0.4,
    ease: 'power2.out',
    delay: duration * 0.6,
  });
}

// ── Services: Alternating Cascade ──

function initServicesAnimation() {
  const services = document.querySelectorAll('.service');
  const heading = document.querySelector('#services .section-heading');
  if (!services.length) return;

  const duration = isMobile ? 0.4 : 0.6;
  const stagger = isMobile ? 0.1 : 0.15;

  gsap.fromTo(heading, {
    y: 20,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    ease: 'power2.out',
    duration: 0.4,
    scrollTrigger: {
      trigger: '#services',
      start: 'top 80%',
      once: true,
    },
  });

  services.forEach((service, i) => {
    const fromX = isMobile ? -50 : (i % 2 === 0 ? -50 : 50);
    gsap.fromTo(service, {
      x: fromX,
      opacity: 0,
    }, {
      x: 0,
      opacity: 1,
      ease: 'power2.out',
      duration: duration,
      delay: 0.2 + i * stagger,
      scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
        once: true,
      },
    });
  });
}

// ── Posts: Horizontal Slide-In ──

function initPostsAnimation() {
  const activeCard = document.querySelector('.work-card.active');
  const nav = document.querySelector('.work-nav');
  const heading = document.querySelector('#posts .section-heading');
  if (!activeCard) return;

  const duration = isMobile ? 0.4 : 0.6;

  gsap.fromTo(heading, {
    y: 20,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    ease: 'power2.out',
    duration: 0.4,
    scrollTrigger: {
      trigger: '#posts',
      start: 'top 80%',
      once: true,
    },
  });

  gsap.fromTo(activeCard, {
    x: 80,
  }, {
    x: 0,
    ease: 'power3.out',
    duration: duration,
    delay: 0.2,
    scrollTrigger: {
      trigger: '#posts',
      start: 'top 80%',
      once: true,
    },
  });

  gsap.fromTo(nav, {
    y: 10,
  }, {
    y: 0,
    ease: 'power2.out',
    duration: 0.3,
    delay: 0.4,
    scrollTrigger: {
      trigger: '#posts',
      start: 'top 80%',
      once: true,
    },
  });
}

// ── About: Rising Stagger ──

function initAboutAnimation() {
  const lines = document.querySelectorAll('.about-bio .bio-line');
  const links = document.querySelectorAll('.about-link');
  const heading = document.querySelector('#about .section-heading');
  if (!lines.length) return;

  const duration = isMobile ? 0.35 : 0.5;
  const stagger = isMobile ? 0.08 : 0.12;

  gsap.fromTo(heading, {
    y: 20,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    ease: 'power2.out',
    duration: 0.4,
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      once: true,
    },
  });

  gsap.fromTo(lines, {
    y: 20,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    stagger: stagger,
    ease: 'power2.out',
    duration: duration,
    delay: 0.2,
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      once: true,
    },
  });

  gsap.fromTo(links, {
    y: 15,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    stagger: stagger,
    ease: 'power2.out',
    duration: duration,
    delay: 0.3,
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      once: true,
    },
  });
}

// ── Init ──

function init() {
  if (reducedMotion) {
    gsap.set('.hero-title .char, .hero-sub, .service, .work-card.active, .work-nav, .about-bio .bio-line, .about-link, .section-heading', {
      opacity: 1, y: 0, x: 0,
    });
    return;
  }

  initHeroAnimation();
  initServicesAnimation();
  initPostsAnimation();
  initAboutAnimation();

  // Refresh after a short delay to ensure layout has settled
  setTimeout(() => ScrollTrigger.refresh(), 100);
}

// Wait for portfolio to be visible (after terminal intro)
const portfolio = document.querySelector(SCROLLER);
if (portfolio.classList.contains('visible')) {
  init();
} else {
  portfolio.addEventListener('portfolio-ready', init, { once: true });
}
