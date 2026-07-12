function setText(root, selector, value) {
  const element = root.querySelector(selector);

  if (element && typeof value === 'string') {
    element.textContent = value;
  }
}

function getSafeGithubUrl(value) {
  if (typeof value !== 'string') return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function getSafeMailto(value) {
  if (typeof value !== 'string') return null;

  const email = value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return `mailto:${encodeURIComponent(email).replace('%40', '@')}`;
}

function removeLinkAttributes(element) {
  element.removeAttribute('href');
  element.removeAttribute('target');
  element.removeAttribute('rel');
}

export function applyProfile(root, profile) {
  setText(root, '[data-profile-handle]', profile.handle);
  setText(root, '[data-profile-identity]', profile.identity);
  setText(root, '[data-profile-footer-handle]', profile.handle);

  const email = root.querySelector('[data-profile-email]');
  if (email) {
    setText(root, '[data-profile-email]', profile.emailLabel);
    const mailto = getSafeMailto(profile.email);
    if (mailto) {
      email.setAttribute('href', mailto);
      email.removeAttribute('target');
      email.removeAttribute('rel');
    } else {
      removeLinkAttributes(email);
    }
  }

  const github = root.querySelector('[data-profile-github]');
  if (github) {
    setText(root, '[data-profile-github]', profile.githubLabel);
    const githubUrl = getSafeGithubUrl(profile.github);
    if (githubUrl) {
      github.setAttribute('href', githubUrl);
      github.setAttribute('target', '_blank');
      github.setAttribute('rel', 'noopener noreferrer');
    } else {
      removeLinkAttributes(github);
    }
  }
}
