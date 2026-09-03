// 自定义光标跟随环（增强装饰）：仅限精指针设备、且在允许动画时启用。
// 系统光标保留不动，环只是额外的视觉跟随，不改变可访问性。
export function initializeCursor(root) {
  if (
    typeof window === 'undefined' ||
    typeof root === 'undefined' ||
    !window.matchMedia('(pointer: fine)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const ring = root.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  ring.style.transform = 'translate(-100px, -100px)';
  root.body.appendChild(ring);

  let ready = false;

  window.addEventListener('pointermove', (event) => {
    if (!ready) {
      ready = true;
      // 首次定位后再启用平滑，避免初始跳变。
      ring.style.transition = 'transform 90ms linear';
    }

    ring.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });
}
