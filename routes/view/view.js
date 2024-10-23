import express from "express";
import { isAuthenticated } from "../authUtils.js";

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
  res.render('pages/index', { css: '', js: '/index' });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { layout: 'layouts/auth', css: 'pages/login', js: '/login' });
});

router.get('/signUp', (req, res) => {
  res.render('pages/signUp', { layout: 'layouts/auth', css: 'pages/signUp', js: '/signUp' });
});

router.get('/schedule', isAuthenticated, (req, res) => {
  res.render('pages/schedule', { css: 'pages/schedule', js: '/schedule' });
});

router.get('/board', isAuthenticated, (req, res) => {
  res.render('pages/boardList', { css: '', js: '/boardList' });
});

router.get('/board/new', isAuthenticated, (req, res) => {
  res.render('pages/boardEdit', { css: '', js: '/boardEdit' });
});

router.get('/board/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  res.render('pages/boardView', { css: '', js: '/boardView', id: id });
});

router.get('/couple', isAuthenticated, (req, res) => {
  const isCouple = false;
  const page = isCouple ? 'pages/coupleView' : 'pages/coupleEdit';
  const css = '';
  const js = isCouple ? '/coupleView' : '/coupleEdit';
  res.render(page, { css: css, js: js });
});


router.get('/myPage', isAuthenticated, (req, res) => {
  res.render('pages/myPage', { css: '', js: '' });
});

export default router;
