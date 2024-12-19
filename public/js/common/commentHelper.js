
import { getDateStr } from './common.js';

class CommentHelper {
    constructor() {
        this.saveFunc = null;
    }

    init(tartgetId, saveFunc) {
        if(saveFunc && typeof saveFunc === 'function') {
            this.saveFunc = saveFunc;
        }
        this.setCommentInput(tartgetId);
    }

    setCommentInput(tartgetId, parentId = '', parentName = '') {
        const tartgetEl = document.getElementById(tartgetId);
        if(tartgetEl === null)
            return;

        const existingElement = document.getElementById(`commentInput_${parentId}`);
        if(existingElement) {
            existingElement.remove();
            return;
        }

        tartgetEl.insertAdjacentHTML("beforeend", `
            <div id="commentInput_${parentId}" style="width: 100%; padding: 25px;">
                <div style="width: 95%; margin: 0 auto; border: 2px solid rgb(229 229 229); border-radius: 6px; box-sizing: border-box; padding: 10px;">
                    <i class="bi bi-person-circle" style="color: #919699; font-size: 18px; margin-right: 0;"></i>
                    <span style="font-weight: bold; margin-right: 5px;">${_name}</span>
                    <textarea id="content_${parentId}" class="form-control" style="width: 100%; font-size: 13px; border: 0;" placeholder="댓글을 남겨보세요"></textarea>  
                    <div style="display: flex; justify-content: flex-end;">    
                        <span id="comment-btn_${parentId}" class="cursor-pointer bold-hover">등록</span>
                    </div>
                </div>
            </div>
        `);

        if(this.saveFunc && typeof this.saveFunc === 'function') {
            document.getElementById(`comment-btn_${parentId}`).addEventListener('click', () => {
                this.saveFunc(parentId, parentName);
            });
        }
    }

    setCommnet(tartgetId, comment) {
        const tartgetEl = document.getElementById(tartgetId);
        if(tartgetEl === null || !comment)
            return;

        const lvl = parseInt(tartgetEl.getAttribute('lvl'));
        const {commentId, createDateTime, content, author, parentAuthor} = comment;

        const replayTag = parentAuthor ? `<span style="color:blue; margin-right: 5px;">@${parentAuthor}</span>` : '';

        tartgetEl.insertAdjacentHTML("beforeend", `
            <div style="border-bottom: 1px solid #e5e5e5; margin-top: 5px; padding: 10px; margin-left: ${lvl * 50}px;">
                <div style="display: flex;">
                    <div style="width: 35px;">
                        <i class="bi bi-person-circle" style="color: #919699; font-size: 30px; margin-right: 0;"></i>
                    </div>
                    <div style="width: calc(100% - 35px);">
                        <div style="font-size: 14px;">${author}</div>
                        <div style="font-size: 14px;">${replayTag}${content.replaceAll('\n','<br>')}</div>
                        <div>
                            <small class="text-body-secondary">${getDateStr(new Date(createDateTime), 'yyyy-MM-dd')}</small>
                            <small class="text-body-secondary cursor-pointer" id="replay-btn_${commentId}" comment-id="${commentId}">답글달기</small>
                        </div>
                    </div>
                </div>
                <div id="commentInputArea_${commentId}"></div>
            </div>
            <div id="commentArea_${commentId}" style="margin-bottom: 5px;" lvl="${lvl+1}"></div>
        `);


        document.getElementById(`replay-btn_${commentId}`).addEventListener('click', () => {
            this.setCommentInput(`commentInputArea_${commentId}`, commentId, author);
        });
    }


}

export default new CommentHelper();