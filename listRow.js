export function createListRow(iconUrl, primary, secondary, actionLabel) {
  const row = document.createElement('div');
  row.className = 'list-row';
  const icon = document.createElement('img');
  icon.src = iconUrl;
  icon.className = 'icon';
  const textWrap = document.createElement('div');
  const primaryEl = document.createElement('div');
  primaryEl.textContent = primary;
  primaryEl.className = 'primary';
  const secondaryEl = document.createElement('div');
  secondaryEl.textContent = secondary;
  secondaryEl.className = 'secondary';
  textWrap.append(primaryEl, secondaryEl);
  row.append(icon, textWrap);
  if (actionLabel) {
    const actionBtn = document.createElement('button');
    actionBtn.textContent = actionLabel;
    actionBtn.className = 'action';
    row.append(actionBtn);
  }
  return row;
}
