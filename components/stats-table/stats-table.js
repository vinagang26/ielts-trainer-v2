// ============================================================
    // START → components/stats-table/stats-table.js
    // ============================================================
    const SUBJECTS = ['reading','listening','writing','speaking'];

    // --- Weekly stats table: real current week (Mon-Sun), click-to-log demo data ---
    function computeWeekDates(){
      const dow = today.getDay() === 0 ? 6 : today.getDay() - 1; // Mon=0
      const monday = new Date(today);
      monday.setDate(today.getDate() - dow);
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dates.push(d);
      }
      return dates;
    }
    let weekDates = computeWeekDates();

    // Demo-only tracking data, stored in localStorage — not a real backend/persistence layer.
    const STORAGE_KEY = 'weeklyTrackerDemo';
    function loadData(){
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
      catch(e) { return {}; }
    }
    function saveData(data){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    let data = loadData();

    function render(){
      const tbody = document.getElementById('statsBody');
      tbody.innerHTML = '';
      const totals = { reading:0, listening:0, writing:0, speaking:0, minutes:0 };

      weekDates.forEach(d => {
        const key = fmtDate(d);
        const entry = data[key] || {};
        const tr = document.createElement('tr');
        if (sameDay(d, today)) tr.classList.add('today-row');

        const dateTd = document.createElement('td');
        dateTd.className = 'static';
        dateTd.textContent = key;
        tr.appendChild(dateTd);

        let minutes = 0;
        SUBJECTS.forEach(subj => {
          const td = document.createElement('td');
          const on = !!entry[subj];
          if (on) { td.classList.add('on'); td.textContent = '1'; minutes += 5; totals[subj] += 1; }
          else { td.textContent = '-'; }
          td.addEventListener('click', () => {
            entry[subj] = !entry[subj];
            data[key] = entry;
            saveData(data);
            render();
          });
          tr.appendChild(td);
        });

        const timeTd = document.createElement('td');
        timeTd.className = 'static';
        timeTd.textContent = minutes + 'm';
        totals.minutes += minutes;
        tr.appendChild(timeTd);

        tbody.appendChild(tr);
      });

      const totalTr = document.createElement('tr');
      totalTr.className = 'total';
      totalTr.innerHTML = `<td>Tổng cộng</td><td>${totals.reading}</td><td>${totals.listening}</td><td>${totals.writing}</td><td>${totals.speaking}</td><td>${totals.minutes}m</td>`;
      tbody.appendChild(totalTr);
    }

    render();
    // ============================================================
    // END → components/stats-table/stats-table.js
    // NOTE: this block calls fmtDate() and sameDay() from
    // utils/dateUtils.js, and reads the shared `today` variable.
    // ============================================================