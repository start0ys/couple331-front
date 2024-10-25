import { request } from "../common/axios.js";
import { targetShowOn, blockUI, unblockUI, showErrorModal } from '../common/common.js';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
const EMAIL_REGEX = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

const MESSAGE = Object.freeze({
    PASSWORD_CHECK: "비밀번호는 영문 대소문자,특수문자, 숫자를 혼합하여 8~20자로 입력해주세요",
    PASSWORD_CONFRIM_CHECK: "입력한 비밀번호와 일치하지 않습니다.",
    EMAIL_CHECK: "이메일의 형식이 올바르지 않습니다.",
    AGREE_EMPTY: "동의를 체크해주세요.",
    EMAIL_AUTH: "이메일 인증을 완료해주세요.",
    AUTH_NUM_EMPTY: "인증코드를 입력해주세요.",
    EMAIL_SUCCESS: "이메일 인증이 완료되었습니다.",
    gender: "성별을 체크해주세요.",
    email: "이메일을 입력해주세요.",
    password: "비밀번호를 입력해주세요.",
    name: "이름을 입력해주세요.",
    nickname: "닉네임을 입력해주세요."
});

let isEmailCheck = false;
let timerCount = 179;
let timer;

document.addEventListener('DOMContentLoaded', () => {
    bindEvent();
})


const bindEvent = () => {
    document.getElementById('signup').addEventListener('click', () => {
        signUp();
    })

    document.getElementById('password').addEventListener('keyup', function() {
        targetShowOn('passwordMsg', !!this.value && !PASSWORD_REGEX.test(this.value));
    })

    document.getElementById('passwordCheck').addEventListener('keyup', function() {
        const password = document.getElementById('password').value;
        targetShowOn('passwordCheckMsg', !!this.value && password !== this.value);
    })

    document.getElementById('email').addEventListener('keyup', function() {
        targetShowOn('emailMsg', !!this.value && !EMAIL_REGEX.test(this.value));
    })

    document.getElementById('emailBtn').addEventListener('click', function() {
        if(this.getAttribute('type') === 'reBtn') { 
            emailReInput();
        } else {
            emailCheck();
        }
    })

    document.getElementById('authCodeBtn').addEventListener('click', () => {
        authCodeCheck();
    })
}

const signUp = () => {
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const data = {
        gender : genderEl ? genderEl.value : '',
        name : document.getElementById('name').value,
        email : document.getElementById('email').value,
        password : document.getElementById('password').value,
        nickname : document.getElementById('nickname').value,
        userDesc : document.getElementById('desc').value
    };

    const errMsgs = signUpValidation(data);

    if(errMsgs.length > 0) {
        showErrorModal(errMsgs.join('<br>'));
        return;
    }

    blockUI();
    request('post', '/api/users/register', data)
    .then(res => {
        if(res?.status === 'SUCCESS') {
            alert("가입되었습니다.");
            window.location.href = '/login';
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

const signUpValidation = (data) => {
    const errMsgs = [];

    const confirmPassword = document.getElementById('passwordCheck').value;
    const agreeCheck = document.getElementById('agreeCheck').checked;

    for(const key in data) {
        if(key === 'userDesc')
            continue;

        const val = data[key];
        if(!val) {
            errMsgs.push(MESSAGE[key]);
        } else if(key === 'email' && !EMAIL_REGEX.test(val)) {
            errMsgs.push(MESSAGE.EMAIL_CHECK);
        } else if(key === 'password') {
            if(!PASSWORD_REGEX.test(val)) errMsgs.push(MESSAGE.PASSWORD_CHECK);
            if(val !== confirmPassword) errMsgs.push(MESSAGE.PASSWORD_CONFRIM_CHECK);
        }
    }

    if(!agreeCheck)
        errMsgs.push(MESSAGE.AGREE_EMPTY);

    if(!isEmailCheck)
        errMsgs.push(MESSAGE.EMAIL_AUTH);

    return errMsgs;
}

const emailCheck = () => {
    const emailEl = document.getElementById('email');
    const email = emailEl.value;
    if(!email || !EMAIL_REGEX.test(email)) {
        showErrorModal(MESSAGE.EMAIL_CHECK);
        return;
    }

    blockUI();
    request('post', '/api/auth/sendCode', {email}) 
    .then(res => {
        if(res?.status === 'SUCCESS') {
            const emailBtnEl = document.getElementById('emailBtn');
            emailBtnEl.setAttribute('type', 'reBtn');
            emailBtnEl.innerText = '재입력';
            emailEl.disabled = true;
            targetShowOn('authCodeDiv', true, '');
            const timerEl = document.getElementById('timer');
            timer = setInterval(() => {
                let minutes = parseInt((timerCount / 60)+'', 10);
                let seconds = parseInt((timerCount % 60)+'', 10);
    
                timerEl.innerText = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
                 if(timerCount == 0) {
                    clearInterval(timer);
                } else {
                    timerCount--;
                }
            }, 1000);
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

const emailReInput = () => {
    clearInterval(timer);
    targetShowOn('authCodeDiv', false);
    targetShowOn('emailMsg', false);
    const emailBtnEl = document.getElementById('emailBtn');
    emailBtnEl.setAttribute('type', '');
    emailBtnEl.innerText = '인증';
    isEmailCheck = false;
    timerCount = 179;
    document.getElementById('timer').innerText = '03:00';
    document.getElementById('email').disabled = false;
    document.getElementById('authCode').value = '';
}

const authCodeCheck = () => {
    const authCode = document.getElementById('authCode').value;
    if(!authCode) {
        showErrorModal(MESSAGE.AUTH_NUM_EMPTY);
        return;
    }
    const email = document.getElementById('email').value;

    blockUI();
    request('post', '/api/auth/verifyCode', {email, authCode}) 
    .then(res => {
       if(res?.status == 'SUCCESS') {
            clearInterval(timer);
            targetShowOn('authCodeDiv', false);
            const emailMsgEl = document.getElementById('emailMsg');
            emailMsgEl.innerText = MESSAGE.EMAIL_SUCCESS;
            emailMsgEl.style.color = '#35ff01';
            emailMsgEl.style.display = 'block';
            isEmailCheck = true;
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
