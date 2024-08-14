import Grid from 'tui-grid';
import 'tui-grid/dist/tui-grid.css';

class GridHelper {
    constructor() {
      this.grids = {};
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
            rowHeaders: ['rowNum'],
            header: {
              height: 40
            },
        };

        const grid = new Grid(Object.assign({}, defaultOption, option));

        
        this.grids[gridId] = grid;
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
}

export default new GridHelper();