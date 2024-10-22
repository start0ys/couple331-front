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
    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
        toggle.addEventListener('click', () => {
            changeTheme(toggle);
          })
    })

    document.querySelectorAll('.page-move-span').forEach(span => {
        span.addEventListener('click', () => {
            const page = span.getAttribute('page-move') || '';
            if(page)
                window.location.href = page;
          })
    })
}
