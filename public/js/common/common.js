import '@fontsource/lobster';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


const setStoredTheme = theme => localStorage.setItem('couple331-theme', theme);
const getStoredTheme = () => localStorage.getItem('couple331-theme') || 'light';

const setTheme = theme => {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }

const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
      return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = document.querySelector('#theme-icon-active')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    // const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    // activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    activeThemeIcon.className = btnToActive.getAttribute('icon-class');
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
}

const changeTheme = (toggle) => {
    const theme = toggle.getAttribute('data-bs-theme-value');
    setStoredTheme(theme);
    setTheme(theme);
    showActiveTheme(theme, true);
}

const initTheme = () => {
    const theme = getStoredTheme();
    setStoredTheme(theme);
    setTheme(theme);
    showActiveTheme(theme, true);
}

export { changeTheme, initTheme }