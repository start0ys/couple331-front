import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index', { css: '', js: '' });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { layout: false });
});

router.get('/signUp', (req, res) => {
  res.render('pages/signUp', { layout: false });
});

router.get('/myPage', (req, res) => {
  res.render('pages/myPage', { css: '', js: '' });
});

router.get('/calendar', (req, res) => {
  res.render('pages/calendar', { css: 'pages/calendar', js: '/calendar' });
});

export default router;
