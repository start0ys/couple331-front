import EditorHelper from "../common/editorHelper.js";
import { handleApiResponse } from '../common/common.js';
import { request } from "../common/axios.js";

const EDITOR_ID = 'editor';

document.addEventListener('DOMContentLoaded', () => {
    setData();
    bindEvent();
});

const setData = () => {
    handleApiResponse(
        () => request('get', `/api/couple/${_coupleId_}/detail`, null),
        (res) => {
            const data = res?.data || {};
            const {manName, womanName, coupleDesc} = data;
            document.getElementById('manName').innerHTML = manName;
            document.getElementById('womanName').innerHTML = womanName;
            initEditor(coupleDesc);
        },
        true,
        ''
    );
}

const initEditor = (initialValue = '') => {
    const option = { initialValue };

    EditorHelper.init(EDITOR_ID, true, option);
}

const bindEvent = () => {
    document.getElementById('editBtn').addEventListener('click', () => {
        window.location.href = '/couple/edit';
    })
}