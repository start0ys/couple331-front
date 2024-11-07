import { handleApiResponse } from '../common/common.js';
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

    handleApiResponse(
        () => request('patch', `/api/couple/${_coupleId_}/status`,  {approvalStatusType, updateUserId: _userId} ),
        (res) => {
            alert(message);
            window.location.href = '/couple';
        },
        true
    );
}