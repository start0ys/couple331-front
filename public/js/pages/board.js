import GridHelper from "../common/gridHelper.js";

const GRID_ID = 'grid';

document.addEventListener('DOMContentLoaded', function() {
    initGrid();
});


const initGrid = () => {
    const gridOption = {
        columns: [
            {
              header: 'Name',
              name: 'name'
            },
            {
              header: 'Artist',
              name: 'artist'
            },
            {
              header: 'Release',
              name: 'release'
            },
            {
              header: 'Genre',
              name: 'genre'
            }
          ],
          data: [
            {
              name: 'Beautiful Lies',
              artist: 'Birdy',
              release: '2016.03.26',
              genre: 'Pop'
            },
            {
              name: 'Beautiful Lies',
              artist: 'Birdy',
              release: '2016.03.26',
              genre: 'Pop'
            },
            {
              name: 'Beautiful Lies',
              artist: 'Birdy',
              release: '2016.03.26',
              genre: 'Pop'
            }
          ]
    };

    GridHelper.init(GRID_ID, gridOption);
}