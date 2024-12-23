import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';
import { getDateStr, handleApiResponse } from '../common/common.js';
import { request } from "../common/axios.js";


document.addEventListener('DOMContentLoaded', () => {
  	setDatePicker();
});


const setDatePicker = () => {
    const datepicker = new DatePicker('#wrapper', {
        // date: new Date(),
        input: {
            element: '#schedulePicker',
            format: 'yyyy-MM-dd'
        },
        showAlways: true,
        language: 'ko'
    });

    datepicker.on('change', () => {
        const day = getDateStr(datepicker.getDate(), 'yyyy-MM-dd');
        setSchedule(day);
        console.log(111);
    });
    datepicker.setDate(new Date());
}


const setSchedule = (day) => {

    if (!day) return;
    
    handleApiResponse(
        () => request('get', `api/schedule/detail/${day}`, null),
        (res) => {
            const datas = res?.data || [];
            const scheduleEl = document.getElementById('scheduleList');
            scheduleEl.innerHTML = '';

            for(const data of datas) {
                const {type, title, completedYn} = data;
                const parseType = type.toString();
                const typeEl = parseType === '-2' ? '<span style="font-weight: bold;">[Todo]</span>' : parseType === _coupleId_ ? '<span style="color:red;font-weight: bold;">[커플]</span>' : '<span style="color:blue;font-weight: bold;">[개인]</span>';
                const style = completedYn === 'Y' ? 'style="text-decoration: line-through;"' : '';
                const str = `<li ${style}>${typeEl}<span>${title}</span></li>`;
                scheduleEl.insertAdjacentHTML("beforeend", str);
            }
            
        },
        false,
        ''
    );
}
