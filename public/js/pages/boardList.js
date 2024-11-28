import GridHelper from "../common/gridHelper.js";

const GRID_ID = 'grid';

const exampleData = [
    {
        id: 100,
        category: '맛집',
        title: '제목임ㅋㅋㅋ11',
        author: '홍길동',
        createDate: '2020-03-31'
    },
    {
        id: 200,
        category: '맛집',
        title: '제목임ㅋㅋㅋ22',
        author: '박길동',
        createDate: '2020-03-31'
    },
    {
        id: 300,
        category: '놀거리',
        title: '제목임ㅋㅋㅋ33',
        author: '최길동',
        createDate: '2020-03-31'
    },
    {
        id: 400,
        category: '기념일',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 500,
        category: '선물',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 600,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 700,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 800,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 900,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1000,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1100,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1200,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1300,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1400,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1500,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1600,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1700,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1800,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
    {
        id: 1900,
        category: '기타',
        title: '제목임ㅋㅋㅋ44',
        author: '천길동',
        createDate: '2020-03-31'
    },
  ]

document.addEventListener('DOMContentLoaded', () => {
    initGrid();
    bindEvent();
});


const initGrid = () => {
    const gridOption = {
        columns: [
            { header: 'id', name: 'id', hidden: true },
            { header: '분류', name: 'category', width: '50', align: 'center' },
            { header: '제목', name: 'title', width: '800', align: 'left' },
            { header: '작성자', name: 'author', width: '100', align: 'center' },
            { header: '등록일', name: 'createDate', width: '100', align: 'center' }
        ],
        data: exampleData,
        pageOptions: {
            perPage: 10,
            useClient: true,
        },
        useRowNum: 'Y',
        rowNumOrder: 'desc'

    };

    GridHelper.init(GRID_ID, gridOption);
    // GridHelper.setClickEvent(GRID_ID, 'click', gridClickEvent);
    GridHelper.setClickEvent(GRID_ID, 'dblclick', gridClickEvent);
    // GridHelper.setDatas(GRID_ID, exampleData);
}

const gridClickEvent = (gridId, rowKey, rowData) => {
    const id = rowData.id;
    window.location.href = `/board/${id}`;
}

const bindEvent = () => {
    document.getElementById('write-btn').addEventListener('click', () => {
        window.location.href = 'board/new';
    })
}