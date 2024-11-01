import express from "express";
import { isAuthenticated, authenticatedRequest } from "../authUtils.js";

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
    const _screen = 'index';
    res.render('pages/index', { css: '', js: '/index', param: {_screen} });
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
    const _screen = 'schedule';
    res.render('pages/schedule', { css: 'pages/schedule', js: '/schedule', param: {_screen} });
});

router.get('/board', isAuthenticated, (req, res) => {
    const _screen = 'boardList';
    res.render('pages/boardList', { css: '', js: '/boardList', param: {_screen} });
});

router.get('/board/new', isAuthenticated, (req, res) => {
    const _screen = 'boardEdit';
    res.render('pages/boardEdit', { css: '', js: '/boardEdit', param: {_screen} });
});

router.get('/board/:id', isAuthenticated, (req, res) => {
    const _screen = 'boardView';
    const id = req.params.id;
    res.render('pages/boardView', { css: '', js: '/boardView', id: id, param: {_screen} });
});

router.get('/couple', isAuthenticated, async (req, res) => {
    const userId = res?.locals?.userInfo?._userId || 0;
    const coupleStatusInfo = await authenticatedRequest(req, res, "get", `/couple/${userId}/status`);
    if(coupleStatusInfo && coupleStatusInfo.data) {
        const status = coupleStatusInfo.data.status || '';
        const message = coupleStatusInfo.data.message || '';
        const senderYn =  coupleStatusInfo.data.senderYn;

        const css = '';
        let page = 'pages/coupleWait';
        let js = '/coupleWait';
        let param = {};

        switch(status) {
            case 'REQUEST':
                param.status = status;
                param._screen = 'coupleWait';
                break;
            case 'REJECT':
            case 'BREAKUP':
                if(senderYn === 'N') {
                    param.status = status;
                    param._screen = 'coupleWait';
                } else {
                    page = 'pages/coupleEdit';
                    js = '/coupleEdit';
                    param._screen = 'coupleEdit';
                }
                break;
            case 'APPROVAL':
                page = 'pages/coupleView';
                js = '/coupleView';
                param._screen = 'coupleView';
                break;
            case 'TERMINATED':
            default:
                page = 'pages/coupleEdit';
                js = '/coupleEdit';
                param._screen = 'coupleEdit';
                break;
        }

        res.render(page, { css, js, param, message, senderYn });
    } else {
        res.render('pages/coupleEdit', { css: '', js: '/coupleEdit', param: {_screen: 'coupleEdit'} });
    }
});

router.get('/myPage', isAuthenticated, (req, res) => {
    const _screen = 'myPage';
    res.render('pages/myPage', { css: '', js: '', param: {_screen} });
});

export default router;
