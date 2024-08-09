import '@fontsource/lobster';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
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

    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
        toggle.addEventListener('click', () => {
            changeTheme(toggle);
          })
    })
}
