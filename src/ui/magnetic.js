// 磁吸按钮：精指针设备上，按钮在 cursor 附近时轻微吸附跟随。
// 尊重 prefers-reduced-motion；指针离开时复位。
export function initializeMagnetic(root) {
  if (
    typeof window === 'undefined' ||
    typeof root === 'undefined' ||
    !window.matchMedia('(pointer: fine)').matches
  ) {
    return;
  }

  const buttons = root.querySelectorAll('.button');

  buttons.forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);

      button.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
    });

    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });
}
