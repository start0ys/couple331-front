import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';
import EditorHelper from "../common/editorHelper.js";
import { getDateStr, showErrorModal, handleApiResponse } from '../common/common.js';
import { request } from "../common/axios.js";

const EDITOR_ID = 'editor';
let picker = null;
const isUpdate = ['APPROVAL', 'CONFIRMED'].includes(status);

document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    bindEvent()
});


const initializeData = () => {
    if (isUpdate) {
        setData();
    } else {
        coupleSelectSettingAndEventBind();
        setDatePicker();
        initEditor();
    }
};

const bindEvent = () => {
    if (isUpdate) {
        document.getElementById('saveBtn').addEventListener('click', saveData);
        document.getElementById('breakUpBtn').addEventListener('click', updateCoupleStatus);
    } else {
        document.getElementById('applyBtn').addEventListener('click', apply);
    }
};

const getOppositeGenderSingleUsers = async () => {
    if (!_gender) return [];
    
    return handleApiResponse(
        () => request('get', `/api/users/oppositeGender/singles?gender=${_gender}`, null),
        (res) => res?.data || [],
        true,
        []
    );
};

const coupleSelectSettingAndEventBind = async () => {
    const oppositeGenderSingleUsers = await getOppositeGenderSingleUsers();
    
    const displayCopleOption = document.getElementById('displayCopleOption');
    const coupleSelect = document.getElementById('coupleSelect');
    const searchInput = document.getElementById('searchInput');

    oppositeGenderSingleUsers.forEach(user => {
        const { userId, email, name } = user;
        if (userId && email && name) {
            const option = document.createElement("option");
            option.text = `${name} [${email}]`;
            option.value = userId;
            coupleSelect.appendChild(option);
        }
    });

    Array.from(coupleSelect.options).forEach(option => {
        if (option.value) {
            const listItem = document.createElement('li');
            listItem.className = 'dropdown-item';
            listItem.textContent = option.text;
            listItem.dataset.value = option.value;

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

    searchInput.addEventListener('input', function () {
        const searchText = searchInput.value.toLowerCase();
        Array.from(displayCopleOption.querySelectorAll('.dropdown-item:not(:first-child)')).forEach(item => {
            const itemText = item.textContent.toLowerCase();
            item.style.display = itemText.includes(searchText) ? '' : 'none';
        });
    });
};

const initEditor = (initialValue = '') => {
    const option = { initialValue };
    EditorHelper.init(EDITOR_ID, false, option);
};

const setDatePicker = () => {
    picker = new DatePicker('#startDate', {
        language: 'ko',
        input: {
            element: '#datepicker-input',
            format: 'yyyy-MM-dd',
        }
    });
};

const apply = () => {
    const couple = document.getElementById('coupleSelect').value;
    const startDate = getDateStr(picker.getDate(), 'yyyyMMdd');
    const errMsgs = applyValidation(couple, startDate);

    if (errMsgs.length > 0) {
        showErrorModal(errMsgs.join('<br>'));
        return;
    }

    const manId = _gender === '01' ? _userId : couple;
    const womanId = _gender === '01' ? couple : _userId;
    const coupleDesc = EditorHelper.getHTML(EDITOR_ID);

    const data = { manId, womanId, coupleDesc, startDate, createUserId: _userId, updateUserId: _userId };

    handleApiResponse(
        () => request('post', '/api/couple/register', data),
        (res) => {
            alert("커플을 신청하였습니다.");
            window.location.href = '/couple';
        },
        true
    );
};

const applyValidation = (couple, startDate) => {
    const errMsgs = [];
    if (!couple) errMsgs.push('커플을 선택해주세요.');
    if (!startDate) errMsgs.push('사귄 날짜를 선택해주세요.');
    return errMsgs;
};

const setData = () => {
    handleApiResponse(
        () => request('get', `/api/couple/${_coupleId_}/detail`, null),
        (res) => {
            const data = res?.data || {};
            const { manName, womanName, coupleDesc } = data;
            document.getElementById('manName').innerHTML = manName;
            document.getElementById('womanName').innerHTML = womanName;
            initEditor(coupleDesc);
        },
        true
    );
};

const saveData = () => {
    const coupleDesc = EditorHelper.getHTML(EDITOR_ID);

    handleApiResponse(
        () => request('patch', `/api/couple/${_coupleId_}/desc`, { coupleDesc, updateUserId: _userId }),
        (res) => {
            alert('저장되었습니다.');
            window.location.href = '/couple';
        },
        true
    );
};

const updateCoupleStatus = () => {
    if (!confirm('정말로 이별하시겠습니까?')) return;

    handleApiResponse(
        () => request('patch', `/api/couple/${_coupleId_}/status`, { updateUserId: _userId }),
        (res) => {
            alert('더 좋은 인연을 찾기를 바랍니다.');
            window.location.href = '/couple';
        },
        true
    );
};
