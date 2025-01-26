const toggleTheme = () => {
  const isDark = document.querySelector('html').classList.toggle('dark');
  document.querySelector('#light-mode-icon').classList.toggle('hidden');
  document.querySelector('#dark-mode-icon').classList.toggle('hidden');
  localStorage.theme = isDark ? 'dark' : 'light';
};

const loadTheme = () => {
  // site defaults to dark
  if (localStorage.theme === 'light') {
    toggleTheme();
  }
};

(function() {
  loadTheme();
  const toggleThemeButton = document.querySelector('#toggle-theme');
  if (toggleThemeButton) {
    toggleThemeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleTheme();
    });
  }
})();