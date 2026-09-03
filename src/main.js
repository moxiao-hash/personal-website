import { profile, projects } from './data/site-data.js';
import { applyProfile } from './ui/profile.js';
import { createProjectCardMarkup } from './ui/projects.js';
import { initializePointerGlow } from './ui/pointer-glow.js';
import { initializeReveal } from './ui/reveal.js';
import { initializeCursor } from './ui/cursor.js';
import { initializeMagnetic } from './ui/magnetic.js';

const projectList = document.querySelector('#project-list');

applyProfile(document, profile);

if (projectList) {
  projectList.innerHTML = projects.map(createProjectCardMarkup).join('');
}

initializeReveal();
initializePointerGlow();
initializeCursor(document);
initializeMagnetic(document);
