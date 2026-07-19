
    function checkForNewDay(){
      const now = new Date();
      if (sameDay(now, today)) return;

      today = now;

      // Reset the calendar back to a fresh view of the new current month.
      cursorY = today.getFullYear();
      cursorM = today.getMonth();
      monthsContainer.innerHTML = '';
      monthsContainer.appendChild(renderMonthBlock(cursorY, cursorM, true));
      calendarScroll.style.height = 'auto';
      requestAnimationFrame(() => {
        calendarScroll.style.height = monthsContainer.offsetHeight + 'px';
      });

      // Recompute the current week and re-render the tracker.
      weekDates = computeWeekDates();
      render();
    }
    setInterval(checkForNewDay, 60000);