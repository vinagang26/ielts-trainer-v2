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
      // Grammar skill training sub-pages. Keys must stay in sync with
      // GRAMMAR_SKILLS in pages/grammar/grammar.js (same key, same order
      // is not required, but the key string must match exactly).
      // These are placeholders: skill name centered, nothing else yet.
      // Future scope (not built): "Start Daily Grammar Training" is meant
      // to eventually pull a mixture of these pages together — do not
      // build tight per-page coupling that would make that harder later.
      { key: 'grammar-train-sentence-structure',   label: 'Sentence Structure' },
      { key: 'grammar-train-parts-of-speech',       label: 'Parts of Speech' },
      { key: 'grammar-train-basic-tenses',          label: 'Basic Tenses' },
      { key: 'grammar-train-articles-determiners',  label: 'Articles & Determiners' },
      { key: 'grammar-train-pronouns',               label: 'Pronouns' },
      { key: 'grammar-train-prepositions',           label: 'Prepositions' },
      { key: 'grammar-train-questions-negatives',    label: 'Questions & Negatives' },
      { key: 'grammar-train-modals',                 label: 'Modals' },
      { key: 'grammar-train-conditionals',           label: 'Conditionals' },
      { key: 'grammar-train-passive',                label: 'Passive Voice' },
      { key: 'grammar-train-reported-speech',        label: 'Reported Speech' },
      { key: 'grammar-train-clauses',                label: 'Clauses' },
      { key: 'grammar-train-gerunds-infinitives',    label: 'Gerunds & Infinitives' },
      { key: 'grammar-train-advanced-grammar',       label: 'Advanced Grammar' },
    ];

    // Build the placeholder page for every route except home (home already
    // exists as the hand-built dashboard content further up the page).
    const pagesContainer = document.getElementById('pagesContainer');
    ROUTES.forEach(route => {
      if (route.key === 'home') return;
      const view = document.createElement('div');
      view.id = `view-${route.key}`;
      view.className = 'app-view view-hidden';
      const isGrammarSkillPage = route.key.startsWith('grammar-train-');
      if (isGrammarSkillPage) {
        view.innerHTML = `
          <div class="grammar-fullscreen-training">
            <div id="exercise-mount-${route.key}" style="width: 100%; height: 100%;"></div>
          </div>
        `;
      } else {
        view.innerHTML = `
          <section class="content-page">
            <h1 class="page-title">${route.label}</h1>
          </section>
        `;
      }
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
      const circleMenu = document.getElementById('circleMenu');
      if (name.startsWith('grammar-train-')) {
        document.body.classList.add('grammar-fullscreen-active');
        if (circleMenu) circleMenu.style.display = 'none';
        if (window.GrammarExerciseUI) {
          window.GrammarExerciseUI.mountGrammarExercise(`exercise-mount-${name}`, name);
        }
      } else {
        document.body.classList.remove('grammar-fullscreen-active');
        if (circleMenu) circleMenu.style.display = '';
      }
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

    // Delegated handler for in-page nav links generated above (e.g. the
    // "Back to Grammar" link on skill training pages). Using a real click
    // handler here — not relying on the anchor's default hash-jump — since
    // showView() is what actually drives view switching, animation state,
    // and history; a bare hash change bypasses all of that (same bug the
    // Train button had before it called showView() directly).
    pagesContainer.addEventListener('click', (e) => {
      const link = e.target.closest('[data-nav]');
      if (!link) return;
      e.preventDefault();
      showView(link.dataset.nav);
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