import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index', {
    css: [],
    js: []
  });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { layout: false });
});

router.get('/calendar', (req, res) => {
  res.render('pages/calendar', {
    css: [
      'https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css',
      // 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
      // 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css',
    ],
    js: [
      { path: 'https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js'},
      { path: 'https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/locales-all.min.js'},
      // { path: '/js/pages/calender.js', type: 'module' }
      { path: '/js/pages/calendar.js'}
    ]
  });
});

export default router;
