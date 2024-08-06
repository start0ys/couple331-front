import { initTheme, changeTheme } from "./common.js";

document.addEventListener('DOMContentLoaded', () => {
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
    document.querySelector('#logo-couple331').addEventListener('click', () => {
        window.location.href='/';
    });

    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
        toggle.addEventListener('click', () => {
            changeTheme(toggle);
          })
    })
}
