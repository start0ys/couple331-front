import { request } from "../common/axios.js";
import { blockUI, unblockUI, showErrorModal } from '../common/common.js';

const MESSAGE = Object.freeze({
    email: "이메일을 입력해주세요.",
    password: "비밀번호를 입력해주세요."
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').addEventListener('click', login);
    document.querySelectorAll('.form-control').forEach(formControl => {
        formControl.addEventListener('keyup', e => {
            if(e.key === 'Enter')
                login();
        });
    })
})

const login = () => {
    const data = {
        email : document.getElementById('email').value,
        password : document.getElementById('password').value
    };

    const errMsgs = loginValidation(data);

    if(errMsgs.length > 0) {
        showErrorModal(errMsgs.join('<br>'));
        return;
    }

    blockUI();
    request('post', '/api/auth/login', data)
    .then(res => {
        if(res?.status === 'SUCCESS') {
            window.location.href = '/';
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

const loginValidation = (data) => {
    const errMsgs = [];


    for(const key in data) {

        const val = data[key];
        if(!val) {
            errMsgs.push(MESSAGE[key]);
        }
    }
    return errMsgs;
}