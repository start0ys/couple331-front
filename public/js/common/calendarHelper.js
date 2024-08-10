import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid';
import { getDateStr } from './common.js';

class CalendarHelper {
    constructor() {
        this.calendars = {};
        this.schedules = {};
        this.todos = {};
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

    setSchedule(calendarId, schedule) {
        const calendar = this.getCalendar(calendarId);
            
        if (!calendar || !schedule || typeof schedule !== 'object') {
            return;
        }
        
        calendar.addEvent(schedule);

        const startDate = schedule.start;
        const endDate = schedule.end;
        const title = schedule.title;
        const detail = {
            title: title,
            start: startDate
        }

        let currentDate = new Date(startDate);

        if(startDate === endDate) {
            const details = this.schedules[startDate] || [];
            detail.end = startDate;
            details.push(detail);
            this.schedules[startDate] = details;
        } else {
            while (currentDate < new Date(endDate)) {
                const date = getDateStr(currentDate, 'yyyy-MM-dd');
                const details = this.schedules[date] || [];
                detail.end = date;
                details.push(detail);
                this.schedules[date] = details;
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    }

    getDetailSchedules(day) {
        return this.schedules[day] || [];
    }

    setTodo(day, id, todo) {
        if(!day || !id || !todo) return;

        const todos = this.todos[day] || [];
        todos.push({
            id: id,
            todo: todo,
            isFinish: false
        });
        this.todos[day] = todos;
    }

    getTodos(day) {
        return this.todos[day] || [];
    }

    removeTodo(day, id) {
        if(!day || !id) return;
        this.todos[day] = this.todos[day].filter(todo => todo.id !== id)
    }

    changeTodo(day, id, isFinish) {
        if(!day || !id) return;
        this.todos[day].find(todo => todo.id === id).isFinish = isFinish;
    }
}

export default new CalendarHelper();