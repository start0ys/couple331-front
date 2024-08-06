import { initTheme, changeTheme } from "../common/common.js";

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
}
