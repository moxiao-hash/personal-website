import { projects } from './data/site-data.js';
import { createProjectCardMarkup } from './ui/projects.js';
import { initializePointerGlow } from './ui/pointer-glow.js';
import { initializeReveal } from './ui/reveal.js';

const projectList = document.querySelector('#project-list');

if (projectList) {
  projectList.innerHTML = projects.map(createProjectCardMarkup).join('');
}

initializeReveal();
initializePointerGlow();
