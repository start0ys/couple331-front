const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
// app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
    res.render('pages/index');
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})

app.get('/calendar', (req, res) => {
    res.render('pages/calendar');
})


app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`)
})