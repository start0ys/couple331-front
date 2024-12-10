import EditorHelper from "../common/editorHelper.js";
import { getDateStr, handleApiResponse } from '../common/common.js';
import { request } from "../common/axios.js";

const EDITOR_ID = 'editor';
const CATEGORY_OBJ = Object.freeze({
    '01': '맛집',
    '02': '놀거리',
    '03': '여행',
    '04': '취미',
    '05': '쇼핑',
    '06': '선물',
    '07': '기념일',
    '00': '기타'
});

let _size = 10;
let _page = 0

const COMMENT_TEMPLATE = comment => {
    const {commentId, createDateTime, content, author, parentAuthor} = comment;
    return `
        <div style="border-bottom: 1px solid #e5e5e5; margin-top: 5px; display: flex; padding: 10px;">
            <div style="width: 35px;">
                <i class="bi bi-person-circle" style="color: #919699; font-size: 30px; margin-right: 0;"></i>
            </div>
            <div style="width: calc(100% - 35px);">
                <div style="font-size: 14px;">${author}</div>
                <div style="font-size: 14px;">${content.replaceAll('\n','<br>')}</div>
                <div>
                    <small class="text-body-secondary">${getDateStr(new Date(createDateTime), 'yyyy-MM-dd')}</small>
                    <small class="text-body-secondary">답글달기</small>
                </div>
            </div>
        </div>
    `
}


document.addEventListener('DOMContentLoaded', () => {
    setData();
    bindEvent();
});

const setData = () => {
    
    handleApiResponse(
        () => request('get', `/api/board/${_boardId}?page=${_page}&size=${_size}`, null),
        (res) => {
            const data = res?.data || {};
            const board = data.board || {};
            const commentInfo = data.comments || {};

            const {author, category, content, createDateTime, title} = board;
            document.getElementById('category').textContent = `[${CATEGORY_OBJ[category]}]`;
            document.getElementById('title').textContent = title;
            document.getElementById('author').textContent = author;
            document.getElementById('createDateTime').textContent = getDateStr(new Date(createDateTime), 'yyyy-MM-dd hh:mm');
            initEditor(content);
            _page = commentInfo.number || _page;
            const comments = commentInfo.content || [];
            const commentEl = document.getElementById('comment');
            for(const comment of comments) {
                commentEl.insertAdjacentHTML("beforeend", COMMENT_TEMPLATE(comment));
            }
        },
        true,
        ''
    );
}

const initEditor = (initialValue = '') => {
    const option = { initialValue };

    EditorHelper.init(EDITOR_ID, true, option);
}

const bindEvent = () => {
    document.getElementById('comment-btn').addEventListener('click', saveComment);
}

const saveComment = () => {
    const content = document.getElementById('content').value;
    const data = { content, boardId: _boardId, createUserId: _userId };
  
    handleApiResponse(
        () => request('post', `/api/board/${_boardId}/comment/register`, data),
        (res) => {
            const comment = res?.data || data;
            comment.author = _name;
            document.getElementById('content').value = '';
            document.getElementById('comment').insertAdjacentHTML("beforeend", COMMENT_TEMPLATE(comment));
        },
        true
    );
}