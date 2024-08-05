import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index', { css: '', js: '' });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { layout: false });
});

router.get('/calendar', (req, res) => {
  res.render('pages/calendar', { css: '', js: 'calendar' });
});

export default router;
