import { request } from "../common/axios.js";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
const EMAIL_REGEX = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

const MESSAGE = Object.freeze({
    PASSWORD_CHECK: "비밀번호는 영문 대소문자,특수문자, 숫자를 혼합하여 8~20자로 입력해주세요",
    PASSWORD_CONFRIM_CHECK: "입력한 비밀번호와 일치하지 않습니다.",
    EMAIL_CHECK: "이메일의 형식이 올바르지 않습니다.",
    AGREE_EMPTY: "동의를 체크해주세요.",
    EMAIL_AUTH: "이메을 인증을 완료해주세요.",
    gender: "성별을 체크해주세요.",
    email: "이메일을 작성해주세요.",
    password: "비밀번호를 작성해주세요.",
    name: "이름을 작성해주세요.",
    nickName: "닉네임을 작성해주세요."
});

document.addEventListener('DOMContentLoaded', () => {
    bindEvent();
})


const bindEvent = () => {
    document.getElementById('signup').addEventListener('click', () => {
        signUp();
    })

    document.getElementById('password').addEventListener('keyup', function() {
        const target = document.getElementById('passwordMsg');
        if(!this.value || PASSWORD_REGEX.test(this.value)) {
            target.style.display = 'none';
        } else {
            target.style.display = 'block';
        }
    })

    document.getElementById('passwordCheck').addEventListener('keyup', function() {
        const target = document.getElementById('passwordCheckMsg');
        const password = document.getElementById('password').value;
        if(!this.value || password === this.value) {
            target.style.display = 'none';
        } else {
            target.style.display = 'block';
        }
    })
}

const signUp = () => {
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const data = {
        gender : genderEl ? genderEl.value : '',
        name : document.getElementById('name').value,
        email : document.getElementById('email').value,
        password : document.getElementById('password').value,
        nickName : document.getElementById('nickName').value,
        userDesc : document.getElementById('desc').value
    };

    const errMsgs = signUpValidation(data);

    if(errMsgs.length > 0) {
        showErrorMsg(errMsgs.join('\n'));
        return;
    }

    request('post', '/api/user/register', data)
    .then((res) => {
        console.log(res);
        if(!!res) {
            navigate('/', { replace: true});
        } else {
            console.log('회원가입 실패');
            showErrorMsg();
        }
        
    })
    .catch((err) => {
        console.log(err);
        showErrorMsg();
    });

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

    return errMsgs;
}


const showErrorMsg = (err = '오류가 발생하였습니다.') => {
    // TODO 모달로 변경 필요
    alert(err);
}