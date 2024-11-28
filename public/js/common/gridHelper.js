import Grid from 'tui-grid';
import 'tui-grid/dist/tui-grid.css';
import 'tui-pagination/dist/tui-pagination.css';

class GridHelper {
    constructor() {
      this.grids = {};
      this.gridOption = {};
    }

    /**
     * 그리드 생성
     * @param {String} gridId 
     * @param {Object} option 
     */
    init(gridId, option = {}) {
        const gridEl = document.getElementById(gridId);

        const defaultOption = {
            el: gridEl,
            scrollX: false,
            // bodyHeight: 500,
            rowHeight: 35,
            // pageOptions: {
            //     perPage: 5
            // },
            header: {
              height: 40
            },
            scrollX: false,
            scrollY: false,
            contextMenu: null
        };

        const useRowNum = option.useRowNum === 'Y';
        if(useRowNum) option.columns.unshift({header: 'No.', name: 'rowNum', align: 'center', width: 30});

        const gridOption = Object.assign({}, defaultOption, option);

        const grid = new Grid(gridOption);

        
        this.grids[gridId] = grid;
        this.gridOption[gridId] = gridOption;
        if(useRowNum) this.setRowNum(gridId);
    }

    /**
     * 그리드 가져오기
     * @param {String} gridId 
     * @returns {Grid}
     */
    getGrid(gridId) {
        return this.grids[gridId] || null;
    }

    /**
     * Row 데이터 가져오기
     * @param {String} gridId 
     * @param {Number} rowKey 
     * @returns {Object}
     */
    getRowData(gridId, rowKey) {
        const grid = this.getGrid(gridId);
        if(!grid) {
            return {};
        }

        return grid.getRow(rowKey);
    }

    /**
     * 전체 Row 데이터 가져오기
     * @param {String} gridId 
     * @returns 
     */
    getAllRowData(gridId) {
        const grid = this.getGrid(gridId);
        if(!grid) {
            return [];
        }

        return grid.getData() || [];
    }
    

    /**
     * Click Event Setting
     * @param {String} gridId 
     * @param {"click" | "dblclick"} clickType 
     * @param {Function} callback 
     */
    setClickEvent(gridId, clickType, callback) {
        const grid = this.getGrid(gridId);

        if(grid && ['click', 'dblclick'].includes(clickType) && callback && typeof callback === 'function') {
            grid.on(clickType, (ev) => {
                const rowKey = ev.rowKey;
                const rowData = this.getRowData(gridId, rowKey);
                callback(grid, rowKey, rowData);
            });
        }
    }

    /**
     * Grid Option 반환
     * @param {String} gridId 
     * @param {String} optionName
     * @returns 
     */
    getGridOption(gridId, optionName) {
        const gridOption = this.gridOption[gridId] || {};
        return gridOption[optionName] || null;
    }

    /**
     * Grid Value Setting
     * @param {String} gridId 
     * @param {Integer} rowKey 
     * @param {String} colName 
     * @param {String} value 
     */
    setValue(gridId, rowKey, colName, value) {
        const grid = this.getGrid(gridId);
        if(!grid)
            return;
    
        if (rowKey && typeof rowKey === 'string') rowKey = parseInt(rowKey);

        grid.setValue(rowKey, colName, value);
    }

    /**
     * Row Num Setting
     * @param {String} gridId 
     */
    setRowNum(gridId) {
        if(!gridId)
            return;

        const useRowNum = this.getGridOption(gridId, 'useRowNum');
        const datas = this.getAllRowData(gridId);
        if(useRowNum !== 'Y' || datas.length === 0)
            return;

        const isDesc = this.getGridOption(gridId, 'rowNumOrder') === 'desc';
        const increment = isDesc ? -1 : 1; 
        let rowNum = isDesc ? datas.length : 1;

        for(const data of datas) {
            const rowKey = data.rowKey;
            this.setValue(gridId, rowKey, 'rowNum', rowNum);
            rowNum += increment;
        }
        
    }

    /**
     * 데이터 초기화
     * @param {String} gridId 
     */
    clearDatas(gridId) {
        const grid = this.getGrid(gridId);
        if(!grid)
            return;

        grid.clear();
    }

    setDatas(gridId, datas) {
        const grid = this.getGrid(gridId);
        if(!grid)
            return;

        grid.clear();
        if(datas.length === 0)
            return;

        const useRowNum = this.getGridOption(gridId, 'useRowNum');
        if(useRowNum === 'Y') {
            const isDesc = this.getGridOption(gridId, 'rowNumOrder') === 'desc';
            const increment = isDesc ? -1 : 1; 
            let rowNum = isDesc ? datas.length : 1;
    
            for(const data of datas) {
                data.rowNum = rowNum;
                rowNum += increment;
            }
        }

        grid.appendRows(datas);
    }

}

export default new GridHelper();