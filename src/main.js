import { projects } from './data/site-data.js';
import { createProjectCardMarkup } from './ui/projects.js';

const projectList = document.querySelector('#project-list');

if (projectList) {
  projectList.innerHTML = projects.map(createProjectCardMarkup).join('');
}
