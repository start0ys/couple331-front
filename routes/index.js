import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index', { css: '', js: '/index' });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { layout: 'layouts/auth', css: 'pages/login', js: '' });
});

router.get('/signUp', (req, res) => {
  res.render('pages/signUp', { layout: 'layouts/auth', css: 'pages/signUp', js: '' });
});

router.get('/schedule', (req, res) => {
  res.render('pages/schedule', { css: 'pages/schedule', js: '/schedule' });
});

router.get('/board', (req, res) => {
  res.render('pages/board', { css: '', js: '/board' });
});

router.get('/myPage', (req, res) => {
  res.render('pages/myPage', { css: '', js: '' });
});

export default router;
