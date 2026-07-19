
    function pad(n){ return n < 10 ? '0' + n : String(n); }
    function fmtDate(d){ return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`; }
    function sameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

    function daysInMonth(y,m){ return new Date(y, m+1, 0).getDate(); }
    function firstWeekdayMon(y,m){ const d = new Date(y,m,1).getDay(); return d===0 ? 6 : d-1; }

    function buildMonthWeeks(y,m){
      const first = firstWeekdayMon(y,m);
      const total = daysInMonth(y,m);
      const cells = [];
      for(let i=0;i<first;i++) cells.push(null);
      for(let d=1; d<=total; d++) cells.push(d);
      while(cells.length % 7 !== 0) cells.push(null);
      const weeks = [];
      for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));
      return weeks;
    }