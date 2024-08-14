import GridHelper from "../common/gridHelper.js";

const GRID_ID = 'grid';

document.addEventListener('DOMContentLoaded', function() {
    initGrid();
});


const initGrid = () => {
    const gridOption = {
        columns: [
            { 
                header: 'id',
                name: 'id',
                hidden: true
            },
            {
                header: '제목',
                name: 'title'
            },
            {
                header: '작성자',
                name: 'author'
            },
            {
                header: '등록일',
                name: 'createDate'
            }
          ],
          data: [
            {
                id: 100,
                title: '제목임ㅋㅋㅋ11',
                author: '홍길동',
                createDate: '2020-03-31'
            },
            {
                id: 200,
                title: '제목임ㅋㅋㅋ22',
                author: '박길동',
                createDate: '2020-03-31'
            },
            {
                id: 300,
                title: '제목임ㅋㅋㅋ33',
                author: '최길동',
                createDate: '2020-03-31'
            },
            {
                id: 400,
                title: '제목임ㅋㅋㅋ44',
                author: '천길동',
                createDate: '2020-03-31'
            }
          ]
    };

    GridHelper.init(GRID_ID, gridOption);
    GridHelper.setClickEvent(GRID_ID, 'dblclick', gridClickEvent);
}

const gridClickEvent = (gridId, rowKey, rowData) => {
    console.log(rowKey);
    console.log(rowData);
}