function initCircleMenu(onNavigate) {
  const circleMenu = document.getElementById('circleMenu');
  const circleCap = document.getElementById('circleCap');
  let menuOpen = false;

  const STADIUM_HEIGHT = 420;

  function openMenu() {
    circleMenu.style.height = STADIUM_HEIGHT + 'px';
    circleMenu.classList.add('open');
    menuOpen = true;
  }

  function closeMenu() {
    circleMenu.style.height = '60px';
    circleMenu.classList.remove('open');
    menuOpen = false;
  }

  circleCap.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('click', (e) => {
    if (menuOpen && !circleMenu.contains(e.target)) closeMenu();
  });

  document.querySelectorAll('.circle-menu-options li[data-route]').forEach(li => {
    li.addEventListener('click', () => {
      onNavigate(li.dataset.route);
      closeMenu();
    });
  });
}