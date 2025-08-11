export function createResizablePanel(title) {
  const panel = document.createElement('div');
  panel.className = 'resizable-panel';
  panel.style.width = '240px';
  panel.style.height = '180px';

  const header = document.createElement('div');
  header.className = 'panel-header';
  const titleSpan = document.createElement('span');
  titleSpan.textContent = title;
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '▾';
  header.append(titleSpan, toggleBtn);
  panel.append(header);

  const content = document.createElement('div');
  content.className = 'panel-content';
  panel.append(content);

  let collapsed = false;
  toggleBtn.addEventListener('click', () => {
    collapsed = !collapsed;
    content.style.display = collapsed ? 'none' : 'block';
    toggleBtn.textContent = collapsed ? '▸' : '▾';
    panel.dispatchEvent(new CustomEvent('collapsed_changed', { detail: collapsed }));
  });

  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const w = Math.round(entry.contentRect.width / 12) * 12;
      const h = Math.round(entry.contentRect.height / 12) * 12;
      panel.style.width = w + 'px';
      panel.style.height = h + 'px';
      panel.dispatchEvent(new Event('resized'));
    }
  });
  resizeObserver.observe(panel);

  return { panel, content };
}
