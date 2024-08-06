import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

class CalendarHelper {
    constructor() {
    }

    init(calendarId) {
        let mode = '02';
        const headerToolbar = mode === '01' ? {
            left: 'title',
            right: 'today'
          } : {
            left: 'private couple',
            center: 'title',
            right: 'today prev,next'
          };
        const calendarEl = document.querySelector('#calendar');
        let calendar = new Calendar(calendarEl, {
            plugins: [dayGridPlugin],
            height: 'calc(100% - 25px)', // calendar 높이 설정
            headerToolbar: headerToolbar,
            initialView: 'dayGridMonth',
            expandRows: true, // 화면에 맞게 높이 재설정
            slotMinTime: '00:00', // Day 캘린더에서 시작 시간
            slotMaxTime: '24:00', // Day 캘린더에서 종료 시간
            editable: true, // 수정 가능?
            selectable: true, // 달력 일자 드래그 설정가능
            nowIndicator: true, // 현재 시간 마크
            dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
            longPressDelay: 100,
            locale: 'ko', // 한국어 설정
            customButtons:{
                private:{
                    text:'개인',
                    click: () => {
                    
                    }
                },
                // prev:{ text:'<', click: () => changeMonth('prev') },
                // next:{ text:'>', click: () => changeMonth('next') },
                couple:{
                  text:'커플',
                  click: () => {
   
                  }
                },
                // today:{ text:'오늘', click: () => changeMonth('today') }
            },
        });
        
        calendar.render();
    }
}

export default new CalendarHelper();