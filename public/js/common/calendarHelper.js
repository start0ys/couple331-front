import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

class CalendarHelper {
    constructor() {
    }

    init(calendarId) {
        const calendarEl = document.querySelector('#calendar');
        let calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth'
        });
        console.log('테스트중2');
        calendar.render();
    }
}

export default new CalendarHelper();