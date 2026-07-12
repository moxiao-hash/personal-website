import { projects } from './data/site-data.js';
import { createProjectCardMarkup } from './ui/projects.js';
import { initializeReveal } from './ui/reveal.js';

const projectList = document.querySelector('#project-list');

if (projectList) {
  projectList.innerHTML = projects.map(createProjectCardMarkup).join('');
}

initializeReveal();

const finePointer = window.matchMedia('(pointer: fine)');

if (finePointer.matches) {
  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
  }, { passive: true });
}
