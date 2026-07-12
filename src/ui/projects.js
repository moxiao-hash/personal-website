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
