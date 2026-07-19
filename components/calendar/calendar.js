// ============================================================
    // START → components/calendar/calendar.js
    // ============================================================
    const WEEKDAYS = ['T2','T3','T4','T5','T6','T7','CN'];

    let cursorY = today.getFullYear();
    let cursorM = today.getMonth();

    function renderMonthBlock(y, m, markToday){
      const wrap = document.createElement('div');
      wrap.className = 'month-block';

      const label = document.createElement('div');
      label.className = 'month-label';
      label.textContent = `Tháng ${pad(m+1)} / ${y}`;
      wrap.appendChild(label);

      const grid = document.createElement('div');
      grid.className = 'calendar-grid';
      grid.appendChild(document.createElement('div'));
      WEEKDAYS.forEach(wd => {
        const el = document.createElement('div');
        el.className = 'weekday-label';
        el.textContent = wd;
        grid.appendChild(el);
      });

      const weeks = buildMonthWeeks(y, m);
      weeks.forEach((week, wi) => {
        const wlabel = document.createElement('div');
        wlabel.className = 'week-label';
        wlabel.textContent = `Tuần ${wi + 1}`;
        grid.appendChild(wlabel);

        week.forEach(day => {
          const cell = document.createElement('div');
          if (day === null) {
            cell.className = 'day-cell empty';
          } else {
            cell.className = 'day-cell';
            cell.textContent = day;
            if (markToday && day === today.getDate()) cell.classList.add('today');
          }
          grid.appendChild(cell);
        });
      });

      wrap.appendChild(grid);
      return wrap;
    }

    const monthsContainer = document.getElementById('monthsContainer');
    const calendarScroll = document.getElementById('calendarScroll');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Initial view: current month only, today marked
    monthsContainer.appendChild(renderMonthBlock(cursorY, cursorM, true));

    // Fit the viewport exactly to the current month's height by default
    requestAnimationFrame(() => {
      calendarScroll.style.height = monthsContainer.offsetHeight + 'px';
    });

    let isLoading = false;
    function loadPreviousMonth(){
      if (isLoading) return;
      isLoading = true;
      loadingIndicator.style.display = 'block';

      setTimeout(() => {
        cursorM -= 1;
        if (cursorM < 0) { cursorM = 11; cursorY -= 1; }

        const beforeHeight = monthsContainer.scrollHeight;
        const block = renderMonthBlock(cursorY, cursorM, false);
        monthsContainer.insertBefore(block, monthsContainer.firstChild);
        const afterHeight = monthsContainer.scrollHeight;

        // keep the visual scroll position stable after prepending
        calendarScroll.scrollTop += (afterHeight - beforeHeight);

        loadingIndicator.style.display = 'none';
        isLoading = false;
      }, 350);
    }

    // Scrolling UP near the top of the box loads more history, unlimited.
    // Scrolling down never loads anything beyond the current month.
    calendarScroll.addEventListener('wheel', (e) => {
      if (e.deltaY < 0 && calendarScroll.scrollTop <= 40) {
        loadPreviousMonth();
      }
    });
    // ============================================================
    // END → components/calendar/calendar.js
    // NOTE: this block calls pad() and buildMonthWeeks() from
    // utils/dateUtils.js, and reads the shared `today` variable.
    // ============================================================

    // ============================================================
    // START → components/stats-table/stats-table.js
    // ============================================================