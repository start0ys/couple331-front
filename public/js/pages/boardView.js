import EditorHelper from "../common/editorHelper.js";
import CommentHelper from "../common/commentHelper.js";
import { getDateStr, handleApiResponse } from '../common/common.js';
import { request } from "../common/axios.js";

const EDITOR_ID = 'editor';
const COMMENT_AREA_ID = 'commentArea_';
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


document.addEventListener('DOMContentLoaded', () => {
    CommentHelper.init('commentInputArea', saveComment);
    setData();
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
            for(const comment of comments) {
                const parentId = comment.parentId || '';
                CommentHelper.setCommnet(COMMENT_AREA_ID + parentId, comment);
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


const saveComment = (parentId = '', parentName = '') => {
    const content = document.getElementById(`content_${parentId}`).value;
    const data = { content, boardId: _boardId, createUserId: _userId };
    if(parentId)
        data.parentId = parentId;
  
    handleApiResponse(
        () => request('post', `/api/board/${_boardId}/comment/register`, data),
        (res) => {
            const comment = res?.data || data;
            comment.author = _name;
            comment.parentAuthor =  parentName;
            if(parentId) {
                document.getElementById(`commentInput_${parentId}`).remove();
            } else {
                document.getElementById('content_').value = '';
            }
            CommentHelper.setCommnet(COMMENT_AREA_ID + parentId, comment);
        },
        true
    );
}