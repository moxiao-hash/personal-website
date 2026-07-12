export function initializeReveal({
  documentRef = globalThis.document,
  IntersectionObserverCtor = globalThis.IntersectionObserver,
  matchMedia = globalThis.matchMedia?.bind(globalThis),
} = {}) {
  const prefersReducedMotion = matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  if (!documentRef || typeof IntersectionObserverCtor !== 'function' || prefersReducedMotion) {
    return;
  }

  const elements = documentRef.querySelectorAll('.reveal');
  documentRef.documentElement.classList.add('reveal-enabled');

  const observer = new IntersectionObserverCtor((entries, activeObserver) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}
