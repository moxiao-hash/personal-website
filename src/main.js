import { profile, projects } from './data/site-data.js';
import { applyProfile } from './ui/profile.js';
import { createProjectSlideMarkup } from './ui/projects.js';
import { initializePointerGlow } from './ui/pointer-glow.js';
import { initializeReveal } from './ui/reveal.js';
import { initializeCursor } from './ui/cursor.js';
import { initializeMagnetic } from './ui/magnetic.js';

const projectList = document.querySelector('#project-list');

function initializeCarousel(root) {
  const track = root.querySelector('#project-list');
  const slides = track ? [...track.querySelectorAll('.project-slide')] : [];
  const prevButton = root.querySelector('.carousel-prev');
  const nextButton = root.querySelector('.carousel-next');
  const currentEl = root.querySelector('.carousel-current');

  if (!track || slides.length === 0 || !prevButton || !nextButton) {
    return;
  }

  let index = 0;

  function show(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    if (currentEl) {
      currentEl.textContent = String(index + 1).padStart(2, '0');
    }
  }

  prevButton.addEventListener('click', () => show(index - 1));
  nextButton.addEventListener('click', () => show(index + 1));
}

applyProfile(document, profile);

if (projectList && projectList.querySelectorAll('.project-slide').length === 0) {
  projectList.innerHTML = projects.map(createProjectSlideMarkup).join('');
}

initializeCarousel(document);
initializeReveal();
initializePointerGlow();
initializeCursor(document);
initializeMagnetic(document);
