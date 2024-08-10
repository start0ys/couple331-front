import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';
import CalendarHelper from "../common/calendarHelper.js";
import { getDateStr, generateUUID } from '../common/common.js';

const CALENDAR_ID = 'calendar';
const SCHEDULE_DETAIL_TEMPLATE = (detail) => {
	const start = detail.start;
	const end = detail.end;
	const period = start === end ? start : `${start}~${end}`;
	return `
		<li>
			<span>${detail.title}</span>
			<small class="text-body-secondary">
				<i class="bi bi-calendar-event"></i>${period}
			</small>
		</li>
	`
};
const TODO_TEMPLATE = (id, todo, isFinish) => {
	const checkd = isFinish ? 'checked' : '';
	return `
		 <div class="list-group list-group-horizontal rounded-0 bg-transparent" id="${id}">
			<div class="form-check">
			<input class="form-check-input me-0 todo-check" type="checkbox" value="" targe-id="${id}" ${checkd}/>
			</div>
			<p>${todo}</p>
			<div class="d-flex flex-row justify-content-end mb-1" style="margin-left: 5px;">
			<span class="text-info" data-mdb-tooltip-init title="Edit todo" style="cursor: pointer;"><i class="bi bi-pencil-fill todo-edit" targe-id="${id}"></i></span>
			<span class="text-danger" data-mdb-tooltip-init title="Delete todo" style="cursor: pointer;"><i class="bi bi-trash3-fill todo-delete" targe-id="${id}"></i></span>
			</div>
		</div>
	`
}
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
		const scheduleColor = document.getElementById('scheduleColor').value;
		let endDateStr = document.getElementById('endDate').value;

		if(startDateStr !== endDateStr) {
			const endDate = new Date(endDateStr);
			const tomorrow = new Date(endDate.setDate(endDate.getDate() + 1)); // fullcalender에 기간 표시될 때 마지막날에서 하루 더 해야함
			endDateStr = getDateStr(tomorrow, 'yyyy-MM-dd');
		}

		CalendarHelper.setSchedule(CALENDAR_ID, {
			title: scheduleText,
			start: startDateStr,
			end: endDateStr,
			color : scheduleColor,
            textColor: textColor(scheduleColor)
		})

		setDetailSchedule(targetDayStr);
		document.getElementById('closeModal').click();
	})

	document.getElementById('closeModal').addEventListener('click', () => {
		document.getElementById('scheduleText').value='';
		document.getElementById('scheduleColor').value='#3788d8';
	})

	document.getElementById('todoText').addEventListener('keyup', function(e) {
		if(e.keyCode === 13 && !!this.value) {
			const todoEl = document.getElementById('todoList');
			const targetDayStr = document.getElementById('targetDay').value;
			const id = generateUUID();
			todoEl.insertAdjacentHTML("beforeend", TODO_TEMPLATE(id, this.value, false));
			CalendarHelper.setTodo(targetDayStr, id, this.value);
			this.value = '';
		}
	})

	document.getElementById('todoList').addEventListener('click', function(e) {
		const target = e.target;
	
		if (target.classList.contains('todo-check')) {
			const todoId = target.getAttribute('targe-id');
			const targetDayStr = document.getElementById('targetDay').value;
			const isFinish = target.checked;
			CalendarHelper.changeTodo(targetDayStr, todoId, isFinish);
		}
	
		if (target.classList.contains('todo-edit')) {
			const todoId = target.getAttribute('targe-id');
			const targetDayStr = document.getElementById('targetDay').value;
		}
	
		if (target.classList.contains('todo-delete')) {
			const todoId = target.getAttribute('targe-id');
			const targetDayStr = document.getElementById('targetDay').value;
			document.getElementById(todoId).remove();
			CalendarHelper.removeTodo(targetDayStr, todoId);
		}
	});
}

const setDetailSchedule = (day) => {
	if(!day) return;
	const detailEl = document.getElementById('detailList');
	detailEl.innerHTML = '';
	CalendarHelper.getDetailSchedules(day).forEach(detail => detailEl.insertAdjacentHTML("beforeend", SCHEDULE_DETAIL_TEMPLATE(detail)))
}

const setTodo = (day) => {
	if(!day) return;
	const todoEl = document.getElementById('todoList');
	todoEl.innerHTML = '';
	CalendarHelper.getTodos(day).forEach(todo => todoEl.insertAdjacentHTML("beforeend", TODO_TEMPLATE(todo.id, todo.todo, todo.isFinish)))
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
	setTodo(day);
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

  /**
   * 배경색에 따라 text colr 흰색 or 검정색 return
   * @param {String} color 
   * @returns 
   */
const textColor = (color) => {
    if(!color) return '#fff';
    let hexColor = ''
    if(color.substring(0,1) == '#'){
       hexColor = color.substring(1);      // 색상 앞의 # 제거
    }else {
       if (color.search("rgb") == -1 )  return '#fff';
       color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
         function hex(x) {
              return ("0" + parseInt(x).toString(16)).slice(-2);
         }
         hexColor = hex(color[1]) + hex(color[2]) + hex(color[3]); 
    }
     
     const rgb = parseInt(hexColor, 16);   // rrggbb를 10진수로 변환
     const r = (rgb >> 16) & 0xff;  // red 추출
     const g = (rgb >>  8) & 0xff;  // green 추출
     const b = (rgb >>  0) & 0xff;  // blue 추출
     const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
     // 색상 선택
     return luma < 170.5 ? "#fff" : "#302c2c";
 };

