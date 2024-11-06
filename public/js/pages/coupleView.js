import EditorHelper from "../common/editorHelper.js";
import { getDateStr, blockUI, unblockUI, showErrorModal } from '../common/common.js';
import { request } from "../common/axios.js";

const EDITOR_ID = 'editor';

document.addEventListener('DOMContentLoaded', () => {
    setData();
});

const setData = () => {
    blockUI();
    request('get', `/api/couple/${_coupleId_}/detail`, null)
    .then(res => {
        if(res?.status === 'SUCCESS') {
            const data = res?.data || {};
            const {manName, womanName, coupleDesc} = data;
            document.getElementById('manName').innerHTML = manName;
            document.getElementById('womanName').innerHTML = womanName;
            initEditor(coupleDesc);
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

const initEditor = (initialValue = '') => {
    const option = { initialValue };

    EditorHelper.init(EDITOR_ID, true, option);
}