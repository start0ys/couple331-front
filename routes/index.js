import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get('/login', (req, res) => {
  res.render('pages/login', { layout: false });
});

router.get('/calendar', (req, res) => {
  res.render('pages/calendar');
});

export default router;
