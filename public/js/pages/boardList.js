import GridHelper from "../common/gridHelper.js";
import { handleApiResponse } from '../common/common.js';
import { request } from "../common/axios.js";

const GRID_ID = 'grid';
const SIZE = 10;

document.addEventListener('DOMContentLoaded', () => {
    initGrid();
    bindEvent();
});


const initGrid = () => {
    const gridOption = {
        columns: [
            { header: 'id', name: 'id', hidden: true },
            { header: '분류', name: 'category', width: '50', align: 'center', className: 'grid-red-font' },
            { header: '제목', name: 'title', width: '800', align: 'left'},
            { header: '작성자', name: 'author', width: '100', align: 'center' },
            { header: '등록일', name: 'createDate', width: '100', align: 'center' }
        ],
        // pageOptions: {
        //     perPage: SIZE,
        //     useClient: true,
        // },
        // useRowNum: 'Y',
        rowNumOrder: 'desc'

    };

    GridHelper.init(GRID_ID, gridOption);
    GridHelper.setClickEvent(GRID_ID, 'click', gridClickEvent);
    searchData(1);
}

const gridClickEvent = (gridId, rowKey, rowData) => {
    const id = rowData.id;
    window.location.href = `/board/${id}`;
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

const searchData = async (page = 1) => {
    const data = await getBoarList(page);
    const content = data.content || [];
    GridHelper.setDatas(GRID_ID, content);
	GridHelper.setPagination('pagination', data.totalElements, page, SIZE, 5, searchData);
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