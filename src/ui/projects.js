export function getProjectState(url) {
  if (typeof url !== 'string' || url.trim() === '') {
    return 'coming-soon';
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
      ? 'live'
      : 'coming-soon';
  } catch {
    return 'coming-soon';
  }
}

function normalizeProjectUrl(url) {
  if (getProjectState(url) !== 'live') {
    return null;
  }

  return new URL(url.trim()).href;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function createProjectCardMarkup(project) {
  const name = escapeHtml(project.name);
  const description = escapeHtml(project.description);
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const tagMarkup = tags
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join('');
  const normalizedUrl = normalizeProjectUrl(project.url);
  const actionMarkup = normalizedUrl
    ? `<a href="${escapeHtml(normalizedUrl)}" target="_blank" rel="noopener noreferrer" aria-label="访问 ${name}">访问作品</a>`
    : '<span>即将上线</span>';

  return `
    <article>
      <h3>${name}</h3>
      <p>${description}</p>
      <ul>${tagMarkup}</ul>
      ${actionMarkup}
    </article>
  `;
}
