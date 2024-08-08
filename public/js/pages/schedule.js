import CalendarHelper from "../common/calendarHelper.js";
import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';

const CALENDAR_ID = 'calendar';
let picker = null;

document.addEventListener('DOMContentLoaded', function() {
	CalendarHelper.init(CALENDAR_ID, {dateClick: dateClick});
  	bindEvent();
  	setDatePicker();
  	dateClick({
		date: new Date(),
		dayEl: document.querySelector('.fc-day-today')
	});
});

const bindEvent = () => {
  	document.querySelectorAll('[change-type]').forEach(btn => {
    	btn.addEventListener('click', () => {
        	CalendarHelper.changeMonth(CALENDAR_ID, btn.getAttribute('change-type'));      
    	})
  	})

	document.querySelectorAll('[target-date]').forEach(dateIcon => {
    	dateIcon.addEventListener('click', () => {
        	const targetId = dateIcon.getAttribute('target-date');
			document.getElementById(targetId).click();
    	})
  	})

	document.getElementById('addSchedule').addEventListener('click', () => {
 		const date = new Date(document.getElementById('todoDay').value);
    	picker.setStartDate(date);
    	picker.setEndDate(date);
  	})

	document.getElementById('editSchedule').addEventListener('click', () => {
		const scheduleText = document.getElementById('scheduleText').value;
		const startDateStr = document.getElementById('startDate').value;
		let endDateStr = document.getElementById('endDate').value;

		if(startDateStr !== endDateStr) {
			const endDate = new Date(endDateStr);
			const tomorrow = new Date(endDate.setDate(endDate.getDate() + 1)); // fullcalender에 기간 표시될 때 마지막날에서 하루 더 해야함
			endDateStr = getDateStr(tomorrow).day;
		}

		CalendarHelper.setSchedule(CALENDAR_ID, {
			title: scheduleText,
			start: startDateStr,
			end: endDateStr
		})
		document.getElementById('closeModal').click();
	})

	document.getElementById('closeModal').addEventListener('click', () => {
		document.getElementById('scheduleText').value='';
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

	const className = 'active-calendar';

	document.querySelectorAll(`.${className}`).forEach(i => i.classList.remove(className));

	info.dayEl.classList.add(className);
}

const setDatePicker = () => {
	const date = document.getElementById('todoDay').value;
	picker = DatePicker.createRangePicker({
			startpicker: {
				date: new Date(date),
				input: '#startDate',
				container: '#startpicker-container'
			},
			endpicker: {
				date: new Date(date),
				input: '#endDate',
				container: '#endpicker-container'
			},
			language: 'ko',
			format: 'YYYY-MM-dd'
		});

}

