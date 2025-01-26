const toggleSidebar = () => {
  document.querySelector('#sidebar').classList.toggle('hidden');
  document.querySelector('#sidebar').classList.toggle('flex');
  const contentEl = document.querySelector('#main');
  contentEl.removeEventListener('click', toggleSidebar);
};

(function() {
  const displayButton = document.querySelector('#display-navigation');
  if (displayButton) {
    displayButton.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleSidebar();
      const contentEl = document.querySelector('#main');
      contentEl.addEventListener('click', toggleSidebar, { once: true })
    });
  }
  const closeSidebarButton = document.querySelector('#close-sidebar');
  if (closeSidebarButton) {
    closeSidebarButton.addEventListener('click', toggleSidebar);
  }
})();