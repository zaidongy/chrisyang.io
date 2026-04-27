# Scroll Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Apple-style pinned section animations with scroll locking, per-section entrance effects, and proximity-based snap easing to the portfolio landing page.

**Architecture:** A single `scroll-animations.js` module uses GSAP ScrollTrigger to detect when sections enter the viewport. On entry, scroll is locked (`overflow: hidden`), the section's entrance timeline plays, and scroll unlocks on completion. A debounced scroll listener provides proximity-based snap with eased scrollTo. The terminal intro dispatches a `portfolio-ready` event that triggers scroll animation initialization.

**Tech Stack:** GSAP 3 (ScrollTrigger + ScrollToPlugin), vanilla JS, Astro

---

### Task 1: Install GSAP and update CSS

**Files:**
- Modify: `package.json`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Install gsap**

Run: `npm install gsap`
Expected: gsap added to dependencies in package.json

- [ ] **Step 2: Remove CSS scroll-snap rules from global.css**

Remove `scroll-snap-type: y proximity;` from `.portfolio` (line 102):

```css
/* REMOVE this line from .portfolio: */
scroll-snap-type: y proximity;
```

Remove `scroll-snap-align: start;` from `.hero` (line 169):

```css
/* REMOVE this line from .hero: */
scroll-snap-align: start;
```

Remove `scroll-snap-align: start;` from `.section` (line 201):

```css
/* REMOVE this line from .section: */
scroll-snap-align: start;
```

- [ ] **Step 3: Add initial hidden states for animated elements**

Add these rules to `src/styles/global.css` after the existing `.green` rule (after line 180), before the `/* Sections */` comment:

```css
/* ── Scroll animation initial states ── */

.hero-title .char,
.hero-sub {
  opacity: 0;
}

.service {
  opacity: 0;
}

.work-card.active,
.work-nav {
  opacity: 0;
}

.about-bio .bio-line,
.about-link {
  opacity: 0;
}

.section-heading {
  opacity: 0;
}
```

- [ ] **Step 4: Update reduced-motion media query**

In the `@media (prefers-reduced-motion: reduce)` block (line 425), add rules to make all animated elements visible immediately. The existing reduced-motion block should become:

```css
@media (prefers-reduced-motion: reduce) {
  .prompt-line.slide-out { animation: none; }
  .cursor { animation: blink 1s step-end infinite; }
  .portfolio {
    transform: none;
    transition: opacity 0.2s;
    scroll-behavior: auto;
  }
  .hero-title .char,
  .hero-sub,
  .service,
  .work-card.active,
  .work-nav,
  .about-bio .bio-line,
  .about-link,
  .section-heading {
    opacity: 1;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/styles/global.css
git commit -m "Install gsap, remove CSS scroll-snap, add animation initial states"
```

---

### Task 2: Update HTML and script imports

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Split about bio into separate lines**

Replace the about bio paragraph (line 90) with individual `<span class="bio-line">` elements:

```html
<p class="about-bio">
  <span class="bio-line">12 years deep in ServiceNow.</span>
  <span class="bio-line">Certified Technical Architect.</span>
  <span class="bio-line">Knowledge speaker.</span>
  <span class="bio-line">Detail-oriented builder currently exploring where AI meets enterprise automation.</span>
</p>
```

- [ ] **Step 2: Add bio-line display style**

Add this rule in `src/styles/global.css` inside the `/* About */` section, after the `.about-bio` rule:

```css
.bio-line {
  display: block;
}
```

- [ ] **Step 3: Add scroll-animations.js script import**

Add this line after the existing `<script src="../scripts/terminal.js"></script>` at line 109:

```html
<script src="../scripts/scroll-animations.js"></script>
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/styles/global.css
git commit -m "Split about bio into lines, add scroll-animations script import"
```

---

### Task 3: Update terminal.js to dispatch portfolio-ready event

**Files:**
- Modify: `src/scripts/terminal.js`

- [ ] **Step 1: Add event dispatch in skipIntro function**

In the `skipIntro()` function (line 26), add a custom event dispatch after the portfolio becomes visible. Replace the function with:

```javascript
function skipIntro() {
  promptLine.style.display = 'none';
  portfolio.classList.add('visible');
  document.body.style.overflow = 'auto';
  portfolio.dispatchEvent(new Event('portfolio-ready'));
}
```

- [ ] **Step 2: Add event dispatch after slide-out animation**

In the `enter()` function, inside the `animationend` listener (line 64), add the same event dispatch. Replace the animationend callback with:

```javascript
promptLine.addEventListener('animationend', () => {
  promptLine.style.display = 'none';
  document.body.style.overflow = 'auto';
  portfolio.dispatchEvent(new Event('portfolio-ready'));
}, { once: true });
```

- [ ] **Step 3: Commit**

```bash
git add src/scripts/terminal.js
git commit -m "Dispatch portfolio-ready event when intro completes"
```

---

### Task 4: Create scroll-animations.js with core setup and hero animation

**Files:**
- Create: `src/scripts/scroll-animations.js`

- [ ] **Step 1: Create the file with core setup**

Create `src/scripts/scroll-animations.js` with the following complete content:

```javascript
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
```

- [ ] **Step 2: Run dev server to verify hero animation works**

Run: `npm run dev`
Expected: Dev server starts. After terminal intro, hero characters clip in one by one, subtitle fades up, green letters glow. Scroll is locked during animation, then released.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/scroll-animations.js
git commit -m "Add scroll animations with GSAP ScrollTrigger"
```

---

### Task 5: Visual testing and refinements

**Files:**
- Potentially modify: `src/scripts/scroll-animations.js`
- Potentially modify: `src/styles/global.css`

- [ ] **Step 1: Test hero section**

Open the site in a browser. Verify:
- After terminal intro, characters clip in one by one
- Scroll is locked during the animation
- Green "yang" text glows at the end
- Subtitle fades up
- After animation completes, scroll unlocks

- [ ] **Step 2: Test services section**

Scroll down to services. Verify:
- Section heading fades up
- Cards cascade in from alternating sides (1 from left, 2 from right, 3 from left, 4 from right)
- Scroll is locked during animation
- After animation completes, scroll unlocks

- [ ] **Step 3: Test posts section**

Scroll down to posts. Verify:
- Section heading fades up
- Active post card slides in from the right
- Nav (prev/next) fades in last
- Scroll locks/unlocks correctly

- [ ] **Step 4: Test about section**

Scroll down to about. Verify:
- Section heading fades up
- Bio lines rise up one by one
- Social links rise up after bio
- Links glow green on settle
- Scroll locks/unlocks correctly

- [ ] **Step 5: Test snap behavior**

Scroll to a position between sections and stop. Verify:
- Page gently snaps to the nearest section with eased deceleration
- Snap doesn't trap you if you scroll past the midpoint

- [ ] **Step 6: Test reduced motion**

Enable `prefers-reduced-motion` in browser DevTools. Refresh the page. Verify:
- All content is visible immediately (no animations)
- No scroll locking occurs
- Snap does not trigger

- [ ] **Step 7: Test mobile viewport**

Resize to mobile width (<768px). Verify:
- Animations still work but are shorter
- Service cards slide in from one direction (left) instead of alternating
- Touch scrolling works smoothly
- No rubber-banding issues

- [ ] **Step 8: Fix any issues found during testing**

Adjust timing, easing, or distances as needed in `scroll-animations.js` or `global.css`.

- [ ] **Step 9: Final commit**

```bash
git add -A
git commit -m "Refine scroll animations based on visual testing"
```

---

### Task 6: Final verification and cleanup

**Files:**
- All modified files

- [ ] **Step 1: Run full build to verify no errors**

Run: `npm run build`
Expected: Build completes with no errors

- [ ] **Step 2: Verify the built site works**

Run: `npm run preview`
Open the preview URL. Repeat the visual tests from Task 5 to confirm production build works identically.

- [ ] **Step 3: Verify accessibility**

- Tab through the page — all interactive elements are reachable
- Anchor links (#services, #posts, #about) still work
- Screen reader would see all content (no aria-hidden from animations)

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "Final cleanup and verification for scroll animations"
```
