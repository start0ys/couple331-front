import express from "express";
import { isAuthenticated } from "../authUtils.js";

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
  res.render('pages/index', { css: '', js: '/index', param: null });
});

router.get('/redirect', (req, res) => {
  const message = req.query.message || '';
  const redirect = req.query.redirect || '';
  res.render('common/redirect', { layout: false, message, redirect });
});

router.get('/login', isAuthenticated, (req, res) => {
  res.render('pages/login', { layout: 'layouts/auth', css: 'pages/login', js: '/login', param: null });
});

router.get('/signUp', isAuthenticated, (req, res) => {
  res.render('pages/signUp', { layout: 'layouts/auth', css: 'pages/signUp', js: '/signUp', param: null });
});

router.get('/schedule', isAuthenticated, (req, res) => {
  res.render('pages/schedule', { css: 'pages/schedule', js: '/schedule', param: null });
});

router.get('/board', isAuthenticated, (req, res) => {
  res.render('pages/boardList', { css: '', js: '/boardList', param: null });
});

router.get('/board/new', isAuthenticated, (req, res) => {
  res.render('pages/boardEdit', { css: '', js: '/boardEdit', param: null });
});

router.get('/board/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  res.render('pages/boardView', { css: '', js: '/boardView', id: id, param: null });
});

router.get('/couple', isAuthenticated, (req, res) => {
  const coupleId = res?.locals?.userInfo?.coupleId || 0;
  const page = coupleId > 0 ? 'pages/coupleView' : 'pages/coupleEdit';
  const css = '';
  const js = coupleId > 0 ? '/coupleView' : '/coupleEdit';
  res.render(page, { css: css, js: js, param: null });
});


router.get('/myPage', isAuthenticated, (req, res) => {
  res.render('pages/myPage', { css: '', js: '', param: null });
});

export default router;
