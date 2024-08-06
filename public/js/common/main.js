import '@fontsource/lobster';
import 'bootstrap/dist/css/bootstrap.min.css';

document.addEventListener('DOMContentLoaded', () => {
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
}

