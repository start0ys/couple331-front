import EditorHelper from "../common/editorHelper.js";
import { showErrorModal, handleApiResponse } from '../common/common.js';
import { request } from "../common/axios.js";

const EDITOR_ID = 'editor';

const MESSAGE = Object.freeze({
    title: "제목을 입력해주세요.",
    category: "분류를 선택해주세요."
});

document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    bindEvent();
})

const initEditor = () => {
    const option = {};
    EditorHelper.init(EDITOR_ID, false, option);
}

const bindEvent = () => {
    document.getElementById('applyBtn').addEventListener('click', saveData);
}

const saveValidation = (data) => {
    const errMsgs = [];

    for(const key in data) {
        if(!data[key])
            errMsgs.push(MESSAGE[key]);
    }


    return errMsgs;
}

const saveData = () => {
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const data = { title, category };
  
    const errMsgs = saveValidation(data);

    if(errMsgs.length > 0) {
        showErrorModal(errMsgs.join('<br>'));
        return;
    }

    data.content = EditorHelper.getHTML(EDITOR_ID);
    data.createUserId = _userId;

    handleApiResponse(
        () => request('post', `/api/board/register`, data),
        (res) => {
            alert('저장되었습니다.');
            window.location.href = '/board';
        },
        true
    );
}