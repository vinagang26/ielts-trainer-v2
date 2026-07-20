 // ============================================================
    // START → router/routes.js  (data) + router/router.js (logic)
    // ============================================================
    // View switching / router: swaps the visible "page" within this single
    // file. Each route gets its own URL hash and Back/Forward works via the
    // History API — no separate documents, matches the project's existing
    // single-file, no-build-step convention.
    //
    // ROUTES is the single source of truth: label is shown as the big page
    // title, and as the menu item text. Adding a new page later means
    // adding one entry here — nothing else needs to change.
    const ROUTES = [
      { key: 'home',       label: 'Dashboard' },
      { key: 'reading',    label: 'Reading' },
      { key: 'listening',  label: 'Listening' },
      { key: 'writing',    label: 'Writing' },
      { key: 'speaking',   label: 'Speaking' },
      { key: 'vocabulary', label: 'Vocabulary' },
      { key: 'grammar',    label: 'Grammar' },
      { key: 'setting',    label: 'Setting' },
    ];

    // Build the placeholder page for every route except home (home already
    // exists as the hand-built dashboard content further up the page).
    const pagesContainer = document.getElementById('pagesContainer');
    ROUTES.forEach(route => {
      if (route.key === 'home') return;
      const view = document.createElement('div');
      view.id = `view-${route.key}`;
      view.className = 'app-view view-hidden';
      view.innerHTML = `
        <section class="content-page">
          <h1 class="page-title">${route.label}</h1>
        </section>
      `;
      pagesContainer.appendChild(view);
    });

    // VIEWS maps every route key to its DOM element: home view was already
    // in the HTML, the rest were just generated above.
    const VIEWS = { home: document.getElementById('homeView') };
    ROUTES.forEach(route => {
      if (route.key !== 'home') {
        VIEWS[route.key] = document.getElementById(`view-${route.key}`);
      }
    });

    function showView(name, { pushHistory = true } = {}) {
      if (!VIEWS[name]) name = 'home'; // unknown hash falls back to home
      Object.entries(VIEWS).forEach(([key, el]) => {
        if (key === name) {
          el.classList.remove('view-hidden');
          el.classList.add('view-entering');
          requestAnimationFrame(() => el.classList.remove('view-entering'));
        } else {
          el.classList.add('view-hidden');
        }
      });
      if (name === 'home') {
        // Regression fix: if the app loaded directly on a non-home route,
        // the calendar's height gets measured further down while its
        // container is still display:none, which returns 0 and gets
        // stuck. Re-measuring here, after home becomes visible, corrects
        // that — same measuring pattern already used in checkForNewDay().
        requestAnimationFrame(() => {
          calendarScroll.style.height = monthsContainer.offsetHeight + 'px';
        });
      }
      if (pushHistory) {
        const url = name === 'home' ? location.pathname : `#${name}`;
        history.pushState({ view: name }, '', url);
      }
    }

    window.addEventListener('popstate', (e) => {
      const name = (e.state && e.state.view) || 'home';
      showView(name, { pushHistory: false });
    });



    // If the page loads with a route already in the URL hash (e.g. someone
    // bookmarked #grammar or hit refresh), show that page instead of always
    // defaulting to home.
    const initialRoute = location.hash ? location.hash.slice(1) : 'home';
    showView(initialRoute, { pushHistory: false });
    initCircleMenu(showView);
    // ============================================================
    // END → router/routes.js + router/router.js
    // NOTE: showView() reads calendarScroll / monthsContainer, which are
    // defined further down in the Calendar block. That's a real ordering
    // dependency — Calendar's DOM refs must exist before showView() can
    // safely be called. Keep this in mind when you split files apart.
    // ============================================================