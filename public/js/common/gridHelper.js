import Grid from 'tui-grid';

class GridHelper {
    constructor() {}

    init(gridId) {
        const instance = new Grid({
            el: document.getElementById(gridId), // Container element
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
          });
          
          // instance.resetData(newData); // Call API of instance's public method
          
          // Grid.applyTheme('striped'); // Call API of static method
    }
}

export default new GridHelper();