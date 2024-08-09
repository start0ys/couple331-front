import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';
import CalendarHelper from "../common/calendarHelper.js";
import { getDateStr } from '../common/common.js';

const CALENDAR_ID = 'calendar';
let picker = null;

document.addEventListener('DOMContentLoaded', function() {
	initCalendar();
	bindEvent();
  	setDatePicker();
});

const bindEvent = () => {
	document.querySelectorAll('[target-date]').forEach(dateIcon => {
    	dateIcon.addEventListener('click', () => {
        	const targetId = dateIcon.getAttribute('target-date');
			document.getElementById(targetId).click();
    	})
  	})

	document.querySelector('.schedule-modal-opener').addEventListener('click', () => {
 		const date = new Date(document.getElementById('targetDay').value);
    	picker.setStartDate(date);
    	picker.setEndDate(date);
  	})

	document.getElementById('editSchedule').addEventListener('click', () => {
		const scheduleText = document.getElementById('scheduleText').value;
		const startDateStr = document.getElementById('startDate').value;
		const targetDayStr = document.getElementById('targetDay').value;
		let endDateStr = document.getElementById('endDate').value;

		if(startDateStr !== endDateStr) {
			const endDate = new Date(endDateStr);
			const tomorrow = new Date(endDate.setDate(endDate.getDate() + 1)); // fullcalender에 기간 표시될 때 마지막날에서 하루 더 해야함
			endDateStr = getDateStr(tomorrow, 'yyyy-MM-dd');
		}

		CalendarHelper.setSchedule(CALENDAR_ID, {
			title: scheduleText,
			start: startDateStr,
			end: endDateStr
		})

		setDetailSchedule(targetDayStr);
		document.getElementById('closeModal').click();
	})

	document.getElementById('closeModal').addEventListener('click', () => {
		document.getElementById('scheduleText').value='';
	})
}

const setDetailSchedule = (day) => {
	if(!day) return;
	const detailEl = document.getElementById('detailList');
	const TITLE_TEMPLATE = (detail) => {
		const start = detail.start;
		const end = detail.end;
		const period = start === end ? start : `${start}~${end}`;
		return `<li>
			<span>${detail.title}</span>
			<small class="text-body-secondary">
				<i class="bi bi-calendar-event"></i>${period}
			</small>
		</li>`
	};
	detailEl.innerHTML = '';
	CalendarHelper.getDetailSchedules(day).forEach(detail => detailEl.insertAdjacentHTML("beforeend", TITLE_TEMPLATE(detail)))
}

const scheduleDetail = (date) => {
	if(!date) return;

	const targetDayKoEl = document.getElementById('targetDayKo');
	const targetDayEl = document.getElementById('targetDay');

	targetDayKoEl.innerText = getDateStr(date, 'yyyy년 MM월 dd일 E요일');
	targetDayEl.value = getDateStr(date, 'yyyy-MM-dd');
}

const dateClick = (info) => {
 	scheduleDetail(info.date);

	const className = 'active-calendar';

	document.querySelectorAll(`.${className}`).forEach(i => i.classList.remove(className));

	info.dayEl.classList.add(className);

	const day = getDateStr(info.date);
	setDetailSchedule(day);
}

const setDatePicker = () => {
	const date = document.getElementById('targetDay').value;
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

const initCalendar = () => {
	const calendarOption = {
		dateClick: dateClick,
		headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'customToday next'
        },
		customButtons:{
			prev:{ text:'<', click: () => CalendarHelper.changeMonth(CALENDAR_ID, 'prev') },
			next:{ text:'>', click: () => CalendarHelper.changeMonth(CALENDAR_ID, 'next') },
			customToday:{ text:'오늘', click: () => {
				CalendarHelper.changeMonth(CALENDAR_ID, 'today');
				dateClick({
					date: new Date(),
					dayEl: document.querySelector('.fc-day-today')
				}); }
			}
		},
		dayCellContent: info => {
			const number = document.createElement('a');
			number.classList.add('view-mode-day-number');
			number.innerHTML = info.dayNumberText.replace('일', '');
			return {
				html : number.outerHTML
			};
		  }
	}

	CalendarHelper.init(CALENDAR_ID, calendarOption);
  	dateClick({
		date: new Date(),
		dayEl: document.querySelector('.fc-day-today')
	});
}

