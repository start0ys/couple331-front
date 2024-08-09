import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid';

class CalendarHelper {
    constructor() {
        this.calendars = {};
        this.schedules = {};
        this.dayObj = { 0 : '일요일' ,1: '월요일' ,2: '화요일' ,3: '수요일' ,4: '목요일' ,5: '금요일' ,6: '토요일' };
    }


    /**
     * @param {string} calendarId 
     */
    init(calendarId, option = {}) {
        const calendarEl = document.getElementById(calendarId);

        const defaultOption = {
            plugins: [dayGridPlugin, interactionPlugin],
        //   height: 'calc(100% - 25px)', // calendar 높이 설정
            height: '85vh', // calendar 높이 설정
            headerToolbar: {
                left: '',
                center: 'title',
                right: ''
            },
            initialView: 'dayGridMonth',
            expandRows: true, // 화면에 맞게 높이 재설정
            slotMinTime: '00:00', // Day 캘린더에서 시작 시간
            slotMaxTime: '24:00', // Day 캘린더에서 종료 시간
            editable: true, // 수정 가능?
            // selectable: true, // 달력 일자 드래그 설정가능
            nowIndicator: true, // 현재 시간 마크
            dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
            longPressDelay: 100,
            locale: 'ko', // 한국어 설정
      };

        const calendar = new Calendar(calendarEl, Object.assign({}, defaultOption, option));
        
        calendar.render();

        this.calendars[calendarId] = calendar;
    }

    /**
     * @param {string} calendarId 
     * @returns {Calendar}
     */
    getCalendar(calendarId) {
        return this.calendars[calendarId] || null;
    }

    /**
     * @param {String} calendarId 
     * @param {"next" | "prev" | "today"} target 
     */
    changeMonth(calendarId, target) {
        const calendar = this.getCalendar(calendarId);
        
        if (!calendar || !['next', 'prev', 'today'].includes(target)) {
            return;
        }

        calendar[target]();
    }

    getDateStr(date, pattern = 'yyyy-MM-dd') {
        if(!date instanceof Date) return '';

        const getTimeNumber = time => time < 10 ? '0' + time : time;
        const year = date.getFullYear();
        const month = getTimeNumber(date.getMonth() + 1);
        const day = getTimeNumber(date.getDate());

        let str = '';

        switch(pattern) {
            case 'yyyy-MM-dd':
                str = `${year}-${month}-${day}`;
                break
            case 'yyyy년 MM월 dd일 E요일': 
                str = `${year}년 ${month}월 ${day}일 ${this.dayObj[date.getDay()]}`;
                break;
        }

        return str;
    }

    

    setSchedule(calendarId, schedule) {
        const calendar = this.getCalendar(calendarId);
            
        if (!calendar || !schedule || typeof schedule !== 'object') {
            return;
        }
        
        calendar.addEvent(schedule);

        const startDate = schedule.start;
        const endDate = schedule.end;
        const title = schedule.title;

        let currentDate = new Date(startDate);

        if(startDate === endDate) {
            const details = this.schedules[startDate] || [];
            details.push(title);
            this.schedules[startDate] = details;
        } else {
            while (currentDate < new Date(endDate)) {
                const date = this.getDateStr(currentDate, 'yyyy-MM-dd');
                const details = this.schedules[date] || [];
                details.push(title);
                this.schedules[date] = details;
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    }

    getDetailSchedules(day) {
        return this.schedules[day] || [];
    }
}

export default new CalendarHelper();