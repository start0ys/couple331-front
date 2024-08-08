import CalendarHelper from "../common/calendarHelper.js";

const CALENDAR_ID = 'calendar';

document.addEventListener('DOMContentLoaded', function() {
  CalendarHelper.init(CALENDAR_ID, {dateClick: dateClick});
  bindEvent();
  scheduleDetail(new Date());
});

const bindEvent = () => {
  document.querySelectorAll('[change-type]').forEach(btn => {
    btn.addEventListener('click', () => {
        CalendarHelper.changeMonth(CALENDAR_ID, btn.getAttribute('change-type'));      
    })
  })

  document.getElementById('addSchedule').addEventListener('click', () => {
    const targetDay = document.getElementById('todoDay').value;
    const scheduleText = document.getElementById('scheduleText').value;
    CalendarHelper.setSchedule(CALENDAR_ID, {
      title: scheduleText,
      start: targetDay,
      end: targetDay
     })
     document.getElementById('closeModal').click();
  })
}

const getDateStr = (date) =>{
  const dayObj = { 0 : '일요일' ,1: '월요일' ,2: '화요일' ,3: '수요일' ,4: '목요일' ,5: '금요일' ,6: '토요일' };
  const getTimeNumber = time => time < 10 ? '0' + time : time;
  const year = date.getFullYear();
  const month = getTimeNumber(date.getMonth() + 1);
  const day = getTimeNumber(date.getDate());
  return {
    dayStr: `${year}년 ${month}월 ${day}일 ${dayObj[date.getDay()]}`,
    day: `${year}-${month}-${day}`
  }
}

const scheduleDetail = (date) => {
  if(!date) return;

  const todoDayStrEl = document.getElementById('todoDayStr');
  const todoDayEl = document.getElementById('todoDay');


  const dateObj = getDateStr(date)

  todoDayStrEl.innerText = dateObj.dayStr;
  todoDayEl.value = dateObj.day;
}

const dateClick = (info) => {
  scheduleDetail(info.date);
}

