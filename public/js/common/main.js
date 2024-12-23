import '@fontsource/lobster';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { initTheme, changeTheme, showNotification, handleApiResponse, targetShowOn  } from "./common.js";
import { request } from "./axios.js";

document.addEventListener('DOMContentLoaded', () => {
    setCoupleStatus();
    initTheme();
    bindEvent();
});



const bindEvent = () => {
    // document.querySelector('#toggle-sidebar').addEventListener('click', () => {
    //     const sidebar = document.querySelector('#sidebar');
    //     const main = document.querySelector('#main');
        
    //     sidebar.classList.toggle('close-sidebar');
    //     main.classList.toggle('close-main');
    // });

    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
        toggle.addEventListener('click', () => {
            changeTheme(toggle);
          })
    })

    document.getElementById('logoutBtn').addEventListener('click', logout);
}

const logout = () => {
    handleApiResponse(
        () => request('post', '/api/auth/logout', null),
        (res) => {
            window.location.href = '/login';
        },
        true
    );
}

const setCoupleStatus = () => {
    handleApiResponse(
        () => request('get', `/api/couple/${_userId}/status`, null),
        (res) => {
            const data = res?.data || {};
            _coupleStatus = data.status;
            _coupleId = data.coupleId;
            setDaysTogether(data.daysTogether);
            if(!['coupleWait','coupleEdit','coupleView','index'].includes(_screen ) && data.senderYn == 'N' && data.message)
                showNotification(data.message, '/couple');
            if(_screen === 'schedule' && !['APPROVAL', 'CONFIRMED'].includes(_coupleStatus)) {
                targetShowOn('calendar-type', false);
            }
        },
        false,
        ''
    );
}

const setDaysTogether = (daysTogether) => {
    if(!daysTogether)
        return;

    document.getElementById('daysTogether').insertAdjacentHTML("beforeend", `<i class="bi bi-suit-heart-fill" style="color: red;"></i>${daysTogether}일`);
}
