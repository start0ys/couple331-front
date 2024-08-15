const dayObj = { 0 : '일요일' ,1: '월요일' ,2: '화요일' ,3: '수요일' ,4: '목요일' ,5: '금요일' ,6: '토요일' };

const setStoredTheme = theme => localStorage.setItem('couple331-theme', theme);
const getStoredTheme = () => localStorage.getItem('couple331-theme') || 'light';

const setTheme = theme => {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }

const showActiveTheme = (theme) => {
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
    activeThemeIcon.className = btnToActive.getAttribute('icon-class');
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)


}

const changeTheme = (toggle) => {
    const theme = toggle.getAttribute('data-bs-theme-value');
    setStoredTheme(theme);
    setTheme(theme);
    showActiveTheme(theme);
}

const initTheme = () => {
    const theme = getStoredTheme();
    setStoredTheme(theme);
    setTheme(theme);
    showActiveTheme(theme);
}

const getDateStr = (date, pattern = 'yyyy-MM-dd') => {
  if(!date instanceof Date) return '';

  const getTimeNumber = time => time < 10 ? '0' + time : time;
  const year = date.getFullYear();
  const month = getTimeNumber(date.getMonth() + 1);
  const day = getTimeNumber(date.getDate());

  let str = '';

  switch(pattern) {
      case 'yyyy-MM-dd':
          str = `${year}-${month}-${day}`;
          break;
        case 'yyyy-MM':
          str = `${year}-${month}`;
          break
      case 'yyyy년 MM월 dd일 E요일': 
          str = `${year}년 ${month}월 ${day}일 ${dayObj[date.getDay()]}`;
          break;
  }

  return str;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

export { changeTheme, initTheme, getDateStr, generateUUID }