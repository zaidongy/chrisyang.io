const promptLine = document.getElementById('prompt-line');
const promptText = document.getElementById('prompt-text');
const cursor = document.getElementById('cursor');
const portfolio = document.getElementById('portfolio');

const isTouchDevice = 'ontouchstart' in window || matchMedia('(pointer: coarse)').matches;
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasSeenIntro = sessionStorage.getItem('intro-seen');

const dots = '...';
const actionText = isTouchDevice ? ' tap to enter' : ' Press Enter';

function typeString(text, speed, callback) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      promptText.textContent += text[i];
      i++;
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

function skipIntro() {
  promptLine.style.display = 'none';
  portfolio.classList.add('visible');
  portfolio.dispatchEvent(new Event('portfolio-ready'));
}

if (prefersReducedMotion || hasSeenIntro) {
  skipIntro();
} else {
  setTimeout(() => {
    let d = 0;
    const dotInterval = setInterval(() => {
      if (d < dots.length) {
        promptText.textContent += dots[d];
        d++;
      } else {
        clearInterval(dotInterval);
        setTimeout(() => {
          typeString(actionText, 70);
        }, 300);
      }
    }, 300);
  }, 100);
}

let entered = false;

function enter() {
  if (prefersReducedMotion || entered) return;
  entered = true;
  sessionStorage.setItem('intro-seen', '1');

  cursor.style.animation = 'none';
  cursor.style.opacity = '1';

  promptLine.classList.add('slide-out');
  portfolio.classList.add('visible');

  promptLine.addEventListener('animationend', () => {
    promptLine.style.display = 'none';
    portfolio.dispatchEvent(new Event('portfolio-ready'));
  }, { once: true });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') enter();
});

document.addEventListener('click', enter);

// Posts slider
const cards = document.querySelectorAll('.work-card');
const prevBtn = document.getElementById('work-prev');
const nextBtn = document.getElementById('work-next');
const currentSpan = document.getElementById('work-current');
let currentIndex = 0;

function showCard(index) {
  cards.forEach(c => c.classList.remove('active'));
  cards[index].classList.add('active');
  currentSpan.textContent = index + 1;
  currentIndex = index;
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    showCard(currentIndex === 0 ? cards.length - 1 : currentIndex - 1);
  });
  nextBtn.addEventListener('click', () => {
    showCard(currentIndex === cards.length - 1 ? 0 : currentIndex + 1);
  });
}

// Home button — scroll to top smoothly
const navHome = document.getElementById('nav-home');
if (navHome) {
  navHome.addEventListener('click', (e) => {
    e.preventDefault();
    skipIntro();
    portfolio.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
