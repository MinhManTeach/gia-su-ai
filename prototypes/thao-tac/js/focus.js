/**
 * Giữ tiêu điểm bàn phím khi một chế độ vẽ lại toàn bộ bằng innerHTML.
 * Ghi lại phần tử đang được focus trong container, vẽ lại, rồi focus lại phần tử tương ứng.
 */

function renderKeepingFocus(container, renderFn) {
  const active = document.activeElement;
  let selector = null;
  if (active && container.contains(active)) {
    const attrs = ['id', 'data-id', 'data-key', 'data-field', 'data-option-id', 'data-action'];
    for (const attr of attrs) {
      const value = active.getAttribute(attr);
      if (value) {
        selector = `[${attr}="${CSS.escape(value)}"]`;
        break;
      }
    }
  }

  renderFn();

  if (selector) {
    const target = container.querySelector(selector);
    if (target) target.focus({ preventScroll: true });
  }
}

window.renderKeepingFocus = renderKeepingFocus;
