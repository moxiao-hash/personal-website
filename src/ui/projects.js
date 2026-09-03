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

// 轮播大展示卡：左侧项目详情 + 右侧浏览器 mock 封面。
export function createProjectSlideMarkup(project, index) {
  const name = escapeHtml(project.name);
  const description = escapeHtml(project.description);
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const tagMarkup = tags
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join('');
  const cover = project.cover && typeof project.cover === 'object' ? project.cover : {};
  const accent = typeof cover.accent === 'string' ? cover.accent : '#2f7de6';
  const kicker = escapeHtml(cover.kicker || tags[0] || '');

  const normalizedUrl = normalizeProjectUrl(project.url);
  const isLive = Boolean(normalizedUrl);
  const repoLabel = normalizedUrl
    ? escapeHtml(new URL(normalizedUrl).host + new URL(normalizedUrl).pathname.replace(/\/$/, ''))
    : 'private · coming soon';
  const actionMarkup = normalizedUrl
    ? `<a class="button button--primary project-action" href="${escapeHtml(normalizedUrl)}" target="_blank" rel="noopener noreferrer" aria-label="访问 ${name}">访问作品 <span aria-hidden="true">↗</span></a>`
    : '<span class="project-action is-soon">即将上线</span>';

  const state = isLive ? 'live' : 'coming-soon';

  return `
    <article class="project-slide${index === 0 ? ' is-active' : ''}" data-index="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}">
      <div class="project-info">
        <p class="project-index">${String(index + 1).padStart(2, '0')} / ${escapeHtml(tags[0] || 'project')} · ${state.toUpperCase()}</p>
        <h3 class="project-title">${name}</h3>
        <p class="project-desc">${description}</p>
        <ul class="project-tags">${tagMarkup}</ul>
        <div class="project-actions">${actionMarkup}</div>
      </div>
      <div class="project-shot" aria-hidden="true">
        <div class="browser-mock" style="--shot-accent: ${escapeHtml(accent)}">
          <div class="browser-bar">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <em class="browser-url">${repoLabel}</em>
          </div>
          <div class="shot-page">
            <p class="shot-kicker">${kicker}</p>
            <h4 class="shot-title">${name}</h4>
            <p class="shot-sub">${escapeHtml(tags.join(' · '))}</p>
            <span class="shot-cta">${isLive ? 'LIVE ↗' : 'COMING SOON'}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}
