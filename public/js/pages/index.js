import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';
import { getDateStr } from '../common/common.js';


document.addEventListener('DOMContentLoaded', () => {
  	setDatePicker();
});


const setDatePicker = () => {
    const datepicker = new DatePicker('#wrapper', {
        date: new Date(),
        input: {
            element: '#todoDataPicker',
            format: 'yyyy-MM-dd'
        },
        showAlways: true,
        language: 'ko'
    });

    datepicker.on('change', () => {
        console.log(`Selected date: ${getDateStr(datepicker.getDate(), 'yyyy-MM-dd')}`);
    });
}
