import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index', { css: '', js: '/index' });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { layout: 'layouts/auth', css: 'pages/login', js: '' });
});

router.get('/signUp', (req, res) => {
  res.render('pages/signUp', { layout: 'layouts/auth', css: 'pages/signUp', js: '/signUp' });
});

router.get('/schedule', (req, res) => {
  res.render('pages/schedule', { css: 'pages/schedule', js: '/schedule' });
});

router.get('/board', (req, res) => {
  res.render('pages/boardList', { css: '', js: '/boardList' });
});

router.get('/board/new', (req, res) => {
  res.render('pages/boardEdit', { css: '', js: '/boardEdit' });
});

router.get('/board/:id', (req, res) => {
  const id = req.params.id;
  res.render('pages/boardView', { css: '', js: '/boardView', id: id });
});

router.get('/couple', (req, res) => {
  const isCouple = false;
  const page = isCouple ? 'pages/coupleView' : 'pages/coupleEdit';
  const css = '';
  const js = isCouple ? '/coupleView' : '/coupleEdit';
  res.render(page, { css: css, js: js });
});


router.get('/myPage', (req, res) => {
  res.render('pages/myPage', { css: '', js: '' });
});

export default router;
