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
      case 'yyyyMMdd':
          str = `${year}${month}${day}`;
          break;
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

const targetShowOn = (tartgetId, isShow, showType = 'block') => {
  const target = document.getElementById(tartgetId);
  if(!target)
      return;

  target.style.display = isShow ? showType : 'none';
}

const blockUI = () => {
  // 블록 UI 요소 생성
  const spinnerContainer = document.createElement("div");
  spinnerContainer.className = "spinner-container";
  spinnerContainer.innerHTML = `
      <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
      </div>
  `;

  // body에 추가
  document.body.appendChild(spinnerContainer);
}

const unblockUI = () => {
  // 블록 UI 요소 제거
  const spinnerContainer = document.querySelector(".spinner-container");
  if (spinnerContainer) {
      document.body.removeChild(spinnerContainer);
  }
}

const  showErrorModal2 = (errMsg) => {
  // 모달 요소 생성
  const modal = document.createElement("div");
  const modalId = "err-modal";
  const backdropId = "err-backdrop";
  modal.id = modalId;
  modal.className = "modal fade show";
  modal.tabIndex = "-1";
  modal.style.display = "block";
  modal.innerHTML = `
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5">오류</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="err-modal-btn"></button>
              </div>
              <div class="modal-body" style="text-align: center; font-weight: bold;">
                  <p>${errMsg}</p>
              </div>
              
          </div>
      </div>
  `;

  document.body.appendChild(modal);

  const backdrop = document.createElement("div");
  backdrop.id = backdropId;
  backdrop.className = "modal-backdrop fade show";
  document.body.appendChild(backdrop);

  document.getElementById("err-modal-btn").addEventListener('click', () => {
    document.body.removeChild(document.getElementById(modalId));
    document.body.removeChild(document.getElementById(backdropId));
  })
}


const createModalElement = (modalId, modalContent) => {
  const modal = document.createElement("div");
  modal.id = modalId;
  modal.className = "modal fade show";
  modal.tabIndex = "-1";
  modal.style.display = "block";
  modal.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content">
          ${modalContent}
        </div>
    </div>
  `;
  return modal;
};

const createBackdropElement = (backdropId) => {
  const backdrop = document.createElement("div");
  backdrop.id = backdropId;
  backdrop.className = "modal-backdrop fade show";
  return backdrop;
};

const removeElementsById = (ids = []) => {
  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      document.body.removeChild(element);
    }
  });
};

const showErrorModal = (errMsg = '오류가 발생하였습니다.') => {
  const modalId = "err-modal";
  const backdropId = "err-backdrop";
  const modalRemoveBtnId = "err-modal-btn";

  const modalContent = `
      <div class="modal-header">
        <h1 class="modal-title fs-5">오류</h1>
        <button type="button" class="btn-close" aria-label="Close" id="${modalRemoveBtnId}"></button>
      </div>
      <div class="modal-body" style="text-align: center; font-weight: bold;">
          <p>${errMsg}</p>
      </div>
  `

  const modal = createModalElement(modalId, modalContent);
  const backdrop = createBackdropElement(backdropId);

  document.body.appendChild(modal);
  document.body.appendChild(backdrop);

  const removeModal = () => {
    removeElementsById([modalId, backdropId]);
    document.removeEventListener('keydown', handleEscape);
  };

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      removeModal();
    }
  };

  document.getElementById(modalRemoveBtnId).addEventListener('click', removeModal);
  document.addEventListener('keydown', handleEscape);
};


const showNotification = (msg = '', url = '') => {
    // Toast 컨테이너가 이미 있는지 확인하고, 없으면 추가
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        document.body.insertAdjacentHTML("beforeend", `
            <div class="toast-container position-fixed top-0 end-0 p-3"></div>
        `);
        toastContainer = document.querySelector('.toast-container');
    }
 
    
    // Toast HTML 템플릿 생성
    const toastHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="bi bi-suit-heart-fill" style="color: red;"></i>
                <strong class="me-auto">알림</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${msg}
                ${url ? `<br><a href="${url}">바로가기</a>` : ''}
            </div>
        </div>
    `;

    // 새 Toast 추가
    toastContainer.insertAdjacentHTML("beforeend", toastHTML);
};


export { changeTheme, initTheme, getDateStr, generateUUID, targetShowOn, blockUI, unblockUI, showErrorModal, showNotification }