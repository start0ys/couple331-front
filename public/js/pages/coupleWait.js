import { blockUI, unblockUI, showErrorModal } from '../common/common.js';
import { request } from "../common/axios.js";

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.status-change-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const approvalStatusType = btn.getAttribute('approval-status-type');
            updateCoupleStatus(approvalStatusType);
          })
    })
})


const updateCoupleStatus = (approvalStatusType = '') => {
    const message = approvalStatusType === '01' ? '승인하셨습니다.' : approvalStatusType === '02' ? '거절하셨습니다.' : '확인되었습니다.';

    blockUI();
    request('patch', `/api/couple/${_coupleId_}/status`,  {approvalStatusType, updateUserId: _userId} )
    .then(res => {
        if(res?.status === 'SUCCESS') {
            alert(message);
            window.location.href = '/couple';
        } else if(res?.httpStatus === 401) {
            const param = res?.message ? `?redirect=${encodeURIComponent('/login')}&message=${encodeURIComponent(res.message)}` : `?redirect=${encodeURIComponent('/login')}`;
            window.location.href = '/redirect' + param;
        } else {
            showErrorModal(res?.message);
        }
        
    })
    .catch(err => {
        console.log(err);
        showErrorModal();
    })
    .finally(unblockUI);
}