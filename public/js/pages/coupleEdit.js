import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';
import EditorHelper from "../common/editorHelper.js";
import { getDateStr, blockUI, unblockUI, showErrorModal } from '../common/common.js';
import { request } from "../common/axios.js";

const EDITOR_ID = 'editor';
let picker = null;

document.addEventListener('DOMContentLoaded', () => {
    coupleSelectSettingAndEventBind();
    initEditor();
    setDatePicker();
    bindEvent();
});

const getOppositeGenderSingleUsers = async () => {
    if(!_gender)
        return [];

    try {
        const res = await request('get', `/api/users/oppositeGender/singles?gender=${_gender}`, null);
        if(res?.status === 'SUCCESS') {
            return res?.data || [];
        } else if(res?.httpStatus === 401) {
            const param = res?.message ? `?redirect=${encodeURIComponent('/login')}&message=${encodeURIComponent(res.message)}` : `?redirect=${encodeURIComponent('/login')}`;
            window.location.href = '/redirect' + param;
        }
    } catch (err) {
        console.log(err);
        return [];
    }
}


const coupleSelectSettingAndEventBind = async () => {
    const oppositeGenderSingleUsers = await getOppositeGenderSingleUsers();
    
    const displayCopleOption = document.getElementById('displayCopleOption');
    const coupleSelect = document.getElementById('coupleSelect');
    const searchInput = document.getElementById('searchInput');

    oppositeGenderSingleUsers.forEach(user => {
        const {userId, email, name} = user;
        if(userId && email && name) {
            const option = document.createElement("option");
            option.text = `${name} [${email}]`;
            option.value = userId;
            coupleSelect.appendChild(option);
        }
    })

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

const initEditor = () => {
    const option = {};
    EditorHelper.init(EDITOR_ID, false, option);
}

const setDatePicker = () => {
	picker = new DatePicker('#startDate', {
        // date: new Date(),
        language: 'ko',
        input: {
            element: '#datepicker-input',
            format: 'yyyy-MM-dd',
        }
    });
}

const bindEvent = () => {
    document.getElementById('applyBtn').addEventListener('click', apply)
}

const apply = () => {
    const couple = document.getElementById('coupleSelect').value;
    const startDate = getDateStr(picker.getDate(), 'yyyyMMdd');
    const errMsgs = applyValidation(couple, startDate);

    if(errMsgs.length > 0) {
        showErrorModal(errMsgs.join('<br>'));
        return;
    }

    const manId = _gender === '01' ? _userId : couple;
    const womanId = _gender === '01' ? couple : _userId;
    const coupleDesc = EditorHelper.getHTML(EDITOR_ID);

    const data = { manId, womanId, coupleDesc, startDate, createUserId: _userId, updateUserId: _userId }

    blockUI();
    request('post', '/api/couple/register', data)
    .then(res => {
        if(res?.status === 'SUCCESS') {
            alert("커플을 신청하였습니다..");
            window.location.href = '/couple';
        } else if(res?.httpStatus === 401) {
            const param = res?.message ? `?redirect=${encodeURIComponent('/login')}&message=${encodeURIComponent(res.message)}` : `?redirect=${encodeURIComponent('/login')}`;
            window.location.href = '/redirect' + param;
        } else {
            showErrorModal(res?.message);
        }
        
    })
    .catch(err => {
        console.log(err);
        showErrorModal();
    })
    .finally(unblockUI);
}

const applyValidation = (couple, startDate) => {
    const errMsgs = [];


    if(!couple)
        errMsgs.push('커플을 선택해주세요.');

    if(!startDate)
        errMsgs.push('사귄 날짜를 선택해주세요.');
        

    return errMsgs;
}
