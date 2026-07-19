// --- Circle button toggles a dropdown panel that expands down to the
// same height as the "text" box under the greeting ---
// --- The circle itself expands into a stadium shape containing options.
// Click the cap to open/close; click outside the stadium to close it. ---
//
// This component does not know about the Router. It only knows that when
// someone picks a route, it should call whatever function it was handed
// at init time. That function is supplied by index.html as `onNavigate`.

function initCircleMenu(onNavigate) {
  const circleMenu = document.getElementById('circleMenu');
  const circleCap = document.getElementById('circleCap');
  let menuOpen = false; //menu is closed by default

  const STADIUM_HEIGHT = 420; 

  function openMenu() {
    circleMenu.style.height = STADIUM_HEIGHT + 'px';
    circleMenu.classList.add('open');
    menuOpen = true; //
  }

  function closeMenu() {
    circleMenu.style.height = '60px';
    circleMenu.classList.remove('open');
    menuOpen = false;
  }

  circleCap.addEventListener('click', (e) => { //
    e.stopPropagation();
    menuOpen ? closeMenu() : openMenu(); //check if menu is open or closed and toggle accordingly
  });

  document.addEventListener('click', (e) => { 
    if (menuOpen && !circleMenu.contains(e.target)) closeMenu(); //is menu open and click is outside of menu? then close menu
  });

  document.querySelectorAll('.circle-menu-options li[data-route]').forEach(li => {
    li.addEventListener('click', () => {
      onNavigate(li.dataset.route);
      closeMenu();
    });
  });
}
