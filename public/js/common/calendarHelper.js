import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid';
import { getDateStr, handleApiResponse } from './common.js';
import { request } from "./axios.js";

class CalendarHelper {
    constructor() {
        this.calendars = {};
        this.schedules = {};
    }


    /**
     * 달력 생성
     * @param {String} calendarId 
     * @param {Object} option 
     * @param {Boolean} isSynchronization
     */
    async init(calendarId, option = {}, isSynchronization = false) {
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

        if(isSynchronization) {
            this.changeCalendarType(calendarId, '');
        }
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
     * @param {Boolean} isSynchronization
     */
    setSchedule(calendarId, schedule, isSynchronization = false) {
        const calendar = this.getCalendar(calendarId);
            
        if (!calendar || !schedule || typeof schedule !== 'object') {
            return;
        }
        
        calendar.addEvent(schedule);

        if(isSynchronization) {
            schedule.createUserId = _userId;
            schedule.userId = _userId;
            schedule.updateUserId = _userId;
            schedule.startDay = schedule.start;
            schedule.endDay = schedule.end;
            if(schedule.type === '01' && ['APPROVAL', 'CONFIRMED'].includes(_coupleStatus))
                schedule.coupleId = _coupleId;
            this.#synchronizationDB('/register', 'post', schedule);
        }

        this.setScheduleData(calendarId, schedule);
    }

     /**
     * 달력 일정 제거
     * @param {String} calendarId
     * @param {String} id 
     * @param {Boolean} isSynchronization
     */
     removeSchedule(calendarId, id, isSynchronization = false) {
        if(!calendarId || !id) return;

        const calendar = this.getCalendar(calendarId);
        
        if (calendar) {
            calendar.getEventById(id).remove();
        }

        const allSchedules = this.schedules[calendarId];
        if(allSchedules) {
            for (let day in allSchedules) {
                allSchedules[day] = allSchedules[day].filter(schedule => schedule.id !== id);
            }
        }
        if(isSynchronization) {
            this.#synchronizationDB(`/${id}`, 'delete', null);
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

    /**
     * DB 동기화
     * @param {String} url 
     * @param {String} apiType 
     * @param {Object} data 
     * @returns 
     */
    async #synchronizationDB(url, apiType, data) {
        if(!apiType)
            return null;

        return handleApiResponse(
            () => request(apiType, `/api/calendar${url}`,  data),
            (res) => res?.data || null,
            false,
            ''
        );
    }

    /**
     * 달력 일정 타입 변경
     * @param {String} calendarId 
     * @param {null | "01" | "02" | "all"} type 01: 커플만, 02: 개인만, all: 전부
     * @returns 
     */
    async changeCalendarType(calendarId, type) {
        this.schedules[calendarId] = [];
        const calendar = this.getCalendar(calendarId);
        if (calendar) {
            calendar.removeAllEvents();
        }

        if(type == null)
            return;

        const dbDatas = await this.#synchronizationDB(`/${_userId}?type=${type}`, 'get', null);
        if(!!dbDatas && dbDatas.length > 0) {
            this.schedules[calendarId] = [];
            const calendar = this.getCalendar(calendarId);
            if (calendar) {
                calendar.removeAllEvents();
            }

            for(const data of dbDatas) {
                data.start = data.startDay;
                data.end = data.endDay;
                this.setSchedule(calendarId, data, false);
            }
        }
    }

     /**
     * 달력 일정 변경
     * @param {String} calendarId 
     * @param {Object} schedule 
     * @param {null | "01" | "02" | "all"} calendarType 01: 커플만, 02: 개인만, all: 전부
     * @param {Boolean} isSynchronization
     */
    updateSchedule(calendarId, schedule, calendarType, isSynchronization = false) {
        const calendar = this.getCalendar(calendarId);
            
        if (!calendar || !schedule || typeof schedule !== 'object') {
            return;
        }

        this.removeSchedule(calendarId, schedule.id);
        
        if(isSynchronization) {
            schedule.updateUserId = _userId;
            schedule.startDay = schedule.start;
            schedule.endDay = schedule.end;
            if(schedule.type === '01' && ['APPROVAL', 'CONFIRMED'].includes(_coupleStatus))
                schedule.coupleId = _coupleId;
            this.#synchronizationDB(`/${schedule.id}`, 'put', schedule);
        }

        if(calendarType !== 'all' && calendarType !== schedule.type)
            return;
        
        calendar.addEvent(schedule);
        this.setScheduleData(calendarId, schedule);
    }

    /**
     * 일정 데이터 Setting
     * @param {String} calendarId 
     * @param {Object} schedule 
     */
    setScheduleData(calendarId, schedule) {
        if(!calendarId || !schedule)
            return;

        const {id, start: startDate, end: endDate, title, type, userId} = schedule;

        const detail = {
            title,
            start: startDate,
            id,
            type,
            userId
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

}

export default new CalendarHelper();