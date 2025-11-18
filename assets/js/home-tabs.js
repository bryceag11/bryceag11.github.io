(function () {
  const controls = document.querySelectorAll('[data-home-tab]');
  const panels = document.querySelectorAll('[data-home-panel]');
  if (!controls.length || !panels.length) return;

  function setActive(id) {
    panels.forEach((panel) => {
      const match = panel.dataset.homePanel === id;
      panel.classList.toggle('is-active', match);
      panel.setAttribute('aria-hidden', match ? 'false' : 'true');
    });

    controls.forEach((control) => {
      const match = control.dataset.homeTab === id;
      control.classList.toggle('is-active', match);
      control.setAttribute('aria-selected', match ? 'true' : 'false');
      control.setAttribute('tabindex', match ? '0' : '-1');
    });
  }

  controls.forEach((control) => {
    control.addEventListener('click', () => setActive(control.dataset.homeTab));
    control.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActive(control.dataset.homeTab);
      }
    });
  });

  setActive('highlights');
})();
