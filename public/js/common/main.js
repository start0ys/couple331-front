import '@fontsource/lobster';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { initTheme, changeTheme, blockUI, unblockUI, showErrorModal, showNotification  } from "./common.js";
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

    document.getElementById('logoutBtn').addEventListener('click', () => {
        blockUI();
        request('post', '/api/auth/logout', null)
        .then(res => {
            if(res?.status === 'SUCCESS') {
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
    })
}

const setCoupleStatus = () => {
    if(['coupleWait','coupleEdit','coupleView'].includes(_screen ))
        return;

    request('get', `/api/couple/${_userId}/status`, null)
    .then(res => {
        if(res?.status === 'SUCCESS') {
            const data = res?.data || {};
            _coupleStatus = data.status;
            _coupleId = data.coupleId;
            if(data.senderYn == 'N' && data.message)
                showNotification(data.message, '/couple');
        } else if(res?.httpStatus === 401) {
            const param = res?.message ? `?redirect=${encodeURIComponent('/login')}&message=${encodeURIComponent(res.message)}` : `?redirect=${encodeURIComponent('/login')}`;
            window.location.href = '/redirect' + param;
        }
    })
    .catch(err => {
        console.log(err);
    })
}
