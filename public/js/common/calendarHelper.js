import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid';
import { getDateStr } from './common.js';

class CalendarHelper {
    constructor() {
        this.calendars = {};
        this.schedules = {};
    }


    /**
     * 달력 생성
     * @param {String} calendarId 
     * @param {Object} option 
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
        this.schedules[calendarId] = [];
    }

    /**
     * 달력 가져오기
     * @param {String} calendarId 
     * @returns {Calendar}
     */
    getCalendar(calendarId) {
        return this.calendars[calendarId] || null;
    }

    /**
     * 달력 월 변경
     * @param {String} calendarId 
     * @param {String} target 
     * @param {String} day 
     */
    changeMonth(calendarId, target, day) {
        const calendar = this.getCalendar(calendarId);
        
        if (!calendar) {
            return;
        }

        if(['next', 'prev', 'today'].includes(target)) {
            calendar[target]();
        } else if(!!day) {
            calendar.gotoDate(new Date(day));
        }
    }

    /**
     * 달력 일정 등록
     * @param {String} calendarId 
     * @param {Object} schedule 
     */
    setSchedule(calendarId, schedule) {
        const calendar = this.getCalendar(calendarId);
            
        if (!calendar || !schedule || typeof schedule !== 'object') {
            return;
        }
        
        calendar.addEvent(schedule);

        const {id, start: startDate, end: endDate, title} = schedule;

        const detail = {
            title,
            start: startDate,
            id
        }

        let currentDate = new Date(startDate);

        if(startDate === endDate) {
            const details = this.schedules[calendarId][startDate] || [];
            detail.end = startDate;
            details.push(detail);
            this.schedules[calendarId][startDate] = details;
        } else {
            while (currentDate < new Date(endDate)) {
                const date = getDateStr(currentDate, 'yyyy-MM-dd');
                const details = this.schedules[calendarId][date] || [];
                detail.end = date;
                details.push(detail);
                this.schedules[calendarId][date] = details;
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    }

    /**
     * 해당 날짜의 일정 가져오기
     * @param {String} calendarId
     * @param {String} day 
     * @returns {Array}
     */
    getSchedules(calendarId, day) {
        return this.schedules[calendarId][day] || [];
    }

    /**
     * 현재 달력의 날짜 가져오기
     * @param {String} calendarId 
     * @returns {Date}
     */
    getDate(calendarId) {
        const calendar = this.getCalendar(calendarId);
        
        if (!calendar) {
            return null;
        }

        return calendar.getDate();
    }

    /**
     * 현재 달력의 날짜 패턴으로 가져오기
     * @param {String} calendarId 
     * @param {String} pattern 
     * @returns {String}
     */
    getDateStr(calendarId, pattern) {
        return getDateStr(this.getDate(calendarId), pattern);
    }

}

export default new CalendarHelper();