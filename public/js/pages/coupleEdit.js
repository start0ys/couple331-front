import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';
import EditorHelper from "../common/editorHelper.js";
import { getDateStr } from '../common/common.js';

const EDITOR_ID = 'editor';
let picker = null;

document.addEventListener('DOMContentLoaded', () => {
    coupleSelectSettingAndEventBind();
    initEditor();
    setDatePicker();
    bindEvent();
});


const coupleSelectSettingAndEventBind = () => {
    const displayCopleOption = document.getElementById('displayCopleOption');
    const coupleSelect = document.getElementById('coupleSelect');
    const searchInput = document.getElementById('searchInput');

    // 숨겨진 select 요소의 옵션을 드롭다운 메뉴로 추가
    Array.from(coupleSelect.options).forEach(option => {
        if (option.value) {
            const listItem = document.createElement('li');
            listItem.className = 'dropdown-item';
            listItem.textContent = option.text;
            listItem.dataset.value = option.value;
            
            // 항목 클릭 시 선택된 값 업데이트
            listItem.addEventListener('click', function () {
                const selectedValue = this.dataset.value;
                const selectedText = this.textContent;
                document.querySelector('#displayCoupleSelect').textContent = selectedText;
                coupleSelect.value = selectedValue;
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            });

            displayCopleOption.appendChild(listItem);
        }
    });

    // 드롭다운 검색 기능 구현
    searchInput.addEventListener('input', function () {
        const searchText = searchInput.value.toLowerCase();
        Array.from(displayCopleOption.querySelectorAll('.dropdown-item:not(:first-child)')).forEach(item => {
            const itemText = item.textContent.toLowerCase();
            item.style.display = itemText.includes(searchText) ? '' : 'none';
        });
    });
}

const setDatePicker = () => {
	picker = new DatePicker('#startDate', {
        date: new Date(),
        language: 'ko',
        input: {
            element: '#datepicker-input',
            format: 'yyyy-MM-dd',
        }
    });
}

const bindEvent = () => {
    document.getElementById('applyBtn').addEventListener('click', () => {
        const couple = document.getElementById('coupleSelect').value;
        const startDate = getDateStr(picker.getDate(), 'yyyyMMdd');
        console.log(couple);
        console.log(startDate);
    })
}

const initEditor = () => {
    const option = {

    };

    EditorHelper.init(EDITOR_ID, false, option);
}