import Grid from 'tui-grid';

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
            el: gridEl
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
}

export default new GridHelper();