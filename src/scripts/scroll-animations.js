import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SCROLLER = '.portfolio';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 767px)').matches;
let isAnimating = false;

function lockScroll() {
  isAnimating = true;
  document.querySelector(SCROLLER).style.overflowY = 'hidden';
}

function unlockScroll() {
  isAnimating = false;
  document.querySelector(SCROLLER).style.overflowY = 'auto';
}

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

  const tl = gsap.timeline({ paused: true });

  tl.from('.hero-title .char', {
    y: 20,
    opacity: 0,
    stagger: 0.03,
    ease: 'power2.out',
    duration: duration,
  });

  tl.from(sub, {
    y: 30,
    opacity: 0,
    ease: 'power2.out',
    duration: duration + 0.1,
  }, `-=${duration * 0.6}`);

  tl.to('.hero-title .green', {
    textShadow: '0 0 20px rgba(51, 255, 51, 0.5)',
    duration: 0.4,
    ease: 'power2.out',
  }, `-=${duration * 0.4}`);

  tl.eventCallback('onComplete', unlockScroll);

  // Hero is visible immediately — play right away with scroll lock
  lockScroll();
  tl.play();
}

// ── Services: Alternating Cascade ──

function initServicesAnimation() {
  const services = document.querySelectorAll('.service');
  const heading = document.querySelector('#services .section-heading');
  if (!services.length) return;

  const duration = isMobile ? 0.4 : 0.6;
  const stagger = isMobile ? 0.1 : 0.15;

  const tl = gsap.timeline({ paused: true });

  tl.from(heading, {
    y: 20,
    opacity: 0,
    ease: 'power2.out',
    duration: 0.4,
  });

  services.forEach((service, i) => {
    const fromX = isMobile ? -50 : (i % 2 === 0 ? -50 : 50);
    tl.from(service, {
      x: fromX,
      opacity: 0,
      ease: 'power2.out',
      duration: duration,
    }, i === 0 ? `-=${duration * 0.3}` : `>+=${stagger}`);
  });

  tl.eventCallback('onComplete', unlockScroll);

  ScrollTrigger.create({
    trigger: '#services',
    scroller: SCROLLER,
    start: 'top 80%',
    onEnter: () => {
      lockScroll();
      tl.play();
    },
  });
}

// ── Posts: Horizontal Slide-In ──

function initPostsAnimation() {
  const activeCard = document.querySelector('.work-card.active');
  const nav = document.querySelector('.work-nav');
  const heading = document.querySelector('#posts .section-heading');
  if (!activeCard) return;

  const duration = isMobile ? 0.4 : 0.6;

  const tl = gsap.timeline({ paused: true });

  tl.from(heading, {
    y: 20,
    opacity: 0,
    ease: 'power2.out',
    duration: 0.4,
  });

  tl.from(activeCard, {
    x: 80,
    opacity: 0,
    ease: 'power3.out',
    duration: duration,
  }, '-=0.2');

  tl.from(nav, {
    opacity: 0,
    ease: 'power2.out',
    duration: 0.3,
  }, '-=0.2');

  tl.eventCallback('onComplete', unlockScroll);

  ScrollTrigger.create({
    trigger: '#posts',
    scroller: SCROLLER,
    start: 'top 80%',
    onEnter: () => {
      lockScroll();
      tl.play();
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

  const tl = gsap.timeline({ paused: true });

  tl.from(heading, {
    y: 20,
    opacity: 0,
    ease: 'power2.out',
    duration: 0.4,
  });

  tl.from(lines, {
    y: 20,
    opacity: 0,
    stagger: stagger,
    ease: 'power2.out',
    duration: duration,
  }, '-=0.2');

  tl.from(links, {
    y: 15,
    opacity: 0,
    stagger: stagger,
    ease: 'power2.out',
    duration: duration,
  }, '-=0.2');

  tl.to(links, {
    textShadow: '0 0 8px rgba(51, 255, 51, 0.4)',
    duration: 0.3,
    ease: 'power2.out',
  }, '-=0.2');

  tl.eventCallback('onComplete', unlockScroll);

  ScrollTrigger.create({
    trigger: '#about',
    scroller: SCROLLER,
    start: 'top 80%',
    onEnter: () => {
      lockScroll();
      tl.play();
    },
  });
}

// ── Snap with Easing ──

function initSnap() {
  const scroller = document.querySelector(SCROLLER);
  const sections = document.querySelectorAll('.hero, #services, #posts, #about');
  let snapTimeout;

  scroller.addEventListener('scroll', () => {
    if (isAnimating) return;
    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      if (isAnimating) return;

      const scrollTop = scroller.scrollTop;
      const viewportHeight = scroller.clientHeight;
      const scrollCenter = scrollTop + viewportHeight / 2;

      let closest = null;
      let closestDist = Infinity;

      sections.forEach(section => {
        const sectionCenter = section.offsetTop + section.offsetHeight / 2;
        const dist = Math.abs(scrollCenter - sectionCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = section;
        }
      });

      // Only snap if within 35% of viewport height
      if (closest && closestDist < viewportHeight * 0.35) {
        const targetTop = closest.offsetTop;
        // Only snap if not already there
        if (Math.abs(scrollTop - targetTop) > 5) {
          gsap.to(scroller, {
            scrollTo: { y: targetTop },
            duration: 0.6,
            ease: 'power2.out',
          });
        }
      }
    }, 150);
  }, { passive: true });
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
  initSnap();
}

// Wait for portfolio to be visible (after terminal intro)
const portfolio = document.querySelector(SCROLLER);
if (portfolio.classList.contains('visible')) {
  init();
} else {
  portfolio.addEventListener('portfolio-ready', init, { once: true });
}
