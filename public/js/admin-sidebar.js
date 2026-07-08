document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector('.admin-sidebar');
  const overlay = document.createElement('div');
  overlay.classList.add('sidebar-overlay');
  document.body.appendChild(overlay);

  const toggleButton = document.querySelector('.menu-toggle');

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    });
  }

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
  });
});