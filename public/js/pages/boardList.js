import GridHelper from "../common/gridHelper.js";
import { getDateStr, handleApiResponse } from '../common/common.js';
import { request } from "../common/axios.js";

const GRID_ID = 'grid';
const SIZE = 10;

document.addEventListener('DOMContentLoaded', () => {
    initGrid();
    bindEvent();
});


const initGrid = () => {

    const categoryOptions = [{text: '', value: ''},{text: '맛집', value: '01'},{text: '놀거리', value: '02'},{text: '여행', value: '03'},{text: '취미', value: '04'},{text: '쇼핑', value: '05'},{text: '선물', value: '06'},{text: '기념일', value: '07'},{text: '기타', value: '00'}]

    const gridOption = {
        columns: [
            { header: 'boardId', name: 'boardId', hidden: true },
            { header: '분류', name: 'category', width: '50', align: 'center', className: 'grid-red-font', formatter: 'listItemText', editor: {options: {type: 'select', listItems: categoryOptions}}},
            { header: '제목', name: 'title', width: '800', align: 'left'},
            { header: '작성자', name: 'author', width: '100', align: 'center' },
            { header: '등록일', name: 'createDate', width: '100', align: 'center' }
        ],
        useRowNum: 'Y'

    };

    GridHelper.init(GRID_ID, gridOption);
    GridHelper.setClickEvent(GRID_ID, 'click', gridClickEvent);
    searchData(1);
}

const gridClickEvent = (gridId, rowKey, rowData) => {
    const boardId = rowData.boardId;
    window.location.href = `/board/${boardId}`;
}

const bindEvent = () => {
    document.getElementById('write-btn').addEventListener('click', () => {
        window.location.href = 'board/new';
    })

    document.getElementById('search-btn').addEventListener('click', () => { 
        searchData(1)
    });

    document.getElementById('searchWord').addEventListener('keyup', function(e) {
        if(e.key === 'Enter') {
			searchData(1);
		}
    });
}

const getCreateDate = (date) => {
    if(!date)
        return '';

    const toDay = getDateStr(new Date(), 'yyyy-MM-dd');
    const day = getDateStr(new Date(date), 'yyyy-MM-dd');
    if(toDay === day) {
        return getDateStr(new Date(date), 'hh:mm:ss');
    } else {
        return day;    
    }
}

const searchData = async (page = 1) => {
    const data = await getBoarList(page);
    const content = data.content || [];
    const totalSize = data.totalElements;
    let rowNum = totalSize - ((page - 1) * SIZE);
    for(const gridData of content) {
        gridData.rowNum = rowNum--;
        gridData.createDate = getCreateDate(gridData.createDateTime);
    }


    GridHelper.setDatas(GRID_ID, content);
	GridHelper.setPagination('pagination', totalSize, page, SIZE, 5, searchData);
}

const getBoarList = async (page = 1) => {
    const searchType = document.getElementById('searchType').value;
    const searchWord = document.getElementById('searchWord').value;
    
    return handleApiResponse(
        () => request('get', `/api/board?page=${page - 1}&size=${SIZE}&searchType=${searchType}&searchWord=${searchWord}`, null),
        (res) => res?.data || {},
        true,
        {}
    );
};