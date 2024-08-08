import CalendarHelper from "../common/calendarHelper.js";

const CALENDAR_ID = 'calendar';

document.addEventListener('DOMContentLoaded', function() {
  CalendarHelper.init(CALENDAR_ID);


  document.querySelectorAll('[change-type]').forEach(btn => {
    btn.addEventListener('click', () => {
        CalendarHelper.changeMonth(CALENDAR_ID, btn.getAttribute('change-type'));
      })
})
});

