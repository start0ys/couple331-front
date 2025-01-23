import express from "express";
import { isAuthenticated, authenticatedRequest } from "../authUtils.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
import fs from "fs";

const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 기본적으로 자바스크립트 파일의 경로를 설정하는 함수
const getJsPath = (jsName) => {
    if (isProduction) {
      // 운영 환경에서는 manifest 파일을 사용해서 정확한 파일 이름을 찾아 반환
      const manifestPath = path.join(__dirname, '../../dist/manifest.json');
      const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) : {};
      return manifest[jsName] ? manifest[jsName].replaceAll('/dist','') : '';
    } else {
      // 개발 환경에서는 별도의 번들링된 파일 경로를 지정
      return `/${jsName}`;
    }
  };

const mainJs = getJsPath('main.js');
const authJs = getJsPath('auth.js');


router.get('/', isAuthenticated, async(req, res) => {
    const _screen = 'index';
    const jsList = [getJsPath('index.js')];
    const userId = res?.locals?.userInfo?._userId || 0;
    const coupleStatusInfo = await authenticatedRequest(req, res, "get", `/couple/${userId}/status`);
    if(coupleStatusInfo && coupleStatusInfo.data) {
        const status = coupleStatusInfo.data.status || '';
        const message = coupleStatusInfo.data.message || '';
        const senderYn =  coupleStatusInfo.data.senderYn;
        const coupleId = coupleStatusInfo.data.coupleId || '';

        const css = '';
        let js = getJsPath('coupleWait.js');
        let couplePage = '';
        let param = {_screen};

        switch(status) {
            case 'REQUEST':
                param.status = status;
                param._coupleId_ = coupleId;
                couplePage = 'coupleWait';
                break;
            case 'REJECT':
            case 'BREAKUP':
                if(senderYn === 'N') {
                    param.status = status;
                    param._coupleId_ = coupleId;
                    couplePage = 'coupleWait';
                } else {
                    page = 'pages/coupleEdit';
                    js = getJsPath('coupleEdit.js');
                    param._coupleId_ = coupleId;
                    couplePage = 'coupleEdit';
                }
                break;
            case 'APPROVAL':
                if(senderYn === 'N')
                    await authenticatedRequest(req, res, "patch", `/couple/${coupleId}/status`, {approvalStatusType: '06', updateUserId: userId});
            case 'CONFIRMED':
                js = getJsPath('coupleView.js');
                param.status = status;
                param._coupleId_ = coupleId;
                couplePage = 'coupleView';
                break;
            case 'TERMINATED':
            default:
                js = getJsPath('coupleEdit.js');
                param._coupleId_ = coupleId;
                couplePage = 'coupleEdit';
                break;
        }
        jsList.push(js);
        res.render('pages/index', { css, jsList, param, message, senderYn, couplePage, mainJs });
    } else {
        jsList.push(getJsPath('coupleEdit.js'))
        res.render('pages/index', { css: '', jsList, param: {_screen}, couplePage: 'coupleEdit', mainJs});
    }



});

router.get('/redirect', (req, res) => {
    const message = req.query.message || '';
    const redirect = req.query.redirect || '';
    res.render('common/redirect', { layout: false, message, redirect });
});

router.get('/login', isAuthenticated, (req, res) => {
    res.render('pages/login', { layout: 'layouts/auth', css: 'pages/login', js: getJsPath('login.js'), param: null, authJs});
});

router.get('/signUp', isAuthenticated, (req, res) => {
    res.render('pages/signUp', { layout: 'layouts/auth', css: 'pages/signUp', js: getJsPath('signUp.js'), param: null, authJs });
});

router.get('/schedule', isAuthenticated, (req, res) => {
    const _screen = 'schedule';
    res.render('pages/schedule', { css: 'pages/schedule', jsList: [getJsPath('schedule.js')], param: {_screen},mainJs });
});

router.get('/board', isAuthenticated, (req, res) => {
    const _screen = 'boardList';
    res.render('pages/boardList', { css: '', jsList: [getJsPath('boardList.js')], param: {_screen}, mainJs });
});

router.get('/board/new', isAuthenticated, (req, res) => {
    const _screen = 'boardEdit';
    res.render('pages/boardEdit', { css: '', jsList: [getJsPath('boardEdit.js')], param: {_screen}, mainJs });
});

router.get('/board/:id', isAuthenticated, (req, res) => {
    const _screen = 'boardView';
    const _boardId = req.params.id;
    res.render('pages/boardView', { css: 'pages/boardView', jsList: [getJsPath('boardView.js')], param: {_screen, _boardId}, mainJs });
});

router.get('/couple', isAuthenticated, async (req, res) => {
    const userId = res?.locals?.userInfo?._userId || 0;
    const coupleStatusInfo = await authenticatedRequest(req, res, "get", `/couple/${userId}/status`);
    if(coupleStatusInfo && coupleStatusInfo.data) {
        const status = coupleStatusInfo.data.status || '';
        const message = coupleStatusInfo.data.message || '';
        const senderYn =  coupleStatusInfo.data.senderYn;
        const coupleId = coupleStatusInfo.data.coupleId || '';

        const css = '';
        let page = 'pages/coupleWait';
        let js = getJsPath('coupleWait.js');
        let param = {};
        const jsList = [];

        switch(status) {
            case 'REQUEST':
                param.status = status;
                param._screen = 'coupleWait';
                param._coupleId_ = coupleId;
                break;
            case 'REJECT':
            case 'BREAKUP':
                if(senderYn === 'N') {
                    param.status = status;
                    param._screen = 'coupleWait';
                    param._coupleId_ = coupleId;
                } else {
                    page = 'pages/coupleEdit';
                    js = getJsPath('coupleEdit.js');
                    param._screen = 'coupleEdit';
                    param._coupleId_ = coupleId;
                }
                break;
            case 'APPROVAL':
                if(senderYn === 'N')
                    await authenticatedRequest(req, res, "patch", `/couple/${coupleId}/status`, {approvalStatusType: '06', updateUserId: userId});
            case 'CONFIRMED':
                page = 'pages/coupleView';
                js = getJsPath('coupleView.js');
                param.status = status;
                param._screen = 'coupleView';
                param._coupleId_ = coupleId;
                break;
            case 'TERMINATED':
            default:
                page = 'pages/coupleEdit';
                js = getJsPath('coupleEdit.js');
                param._screen = 'coupleEdit';
                param._coupleId_ = coupleId;
                break;
        }
        jsList.push(js);
        res.render(page, { css, jsList, param, message, senderYn, mainJs });
    } else {
        res.render('pages/coupleEdit', { css: '', jsList: [getJsPath('coupleEdit.js')], param: {_screen: 'coupleEdit'}, mainJs });
    }
});

router.get('/couple/edit', isAuthenticated, async (req, res) => {
    const userId = res?.locals?.userInfo?._userId || 0;
    const coupleStatusInfo = await authenticatedRequest(req, res, "get", `/couple/${userId}/status`);
    if(coupleStatusInfo && coupleStatusInfo.data) {
        const coupleId = coupleStatusInfo.data.coupleId || '';
        const status = coupleStatusInfo.data.status || '';
        res.render('pages/coupleEdit', { css: '', jsList: [getJsPath('coupleEdit.js')], param: {_screen: 'coupleEdit', _coupleId_: coupleId, status}, mainJs });
    } else {
        res.render('pages/coupleEdit', { css: '', jsList: [getJsPath('coupleEdit.js')], param: {_screen: 'coupleEdit'}, mainJs });
    }
});

router.get('/myPage', isAuthenticated, (req, res) => {
    const _screen = 'myPage';
    res.render('pages/myPage', { css: '', jsList: [], param: {_screen}, mainJs });
});

export default router;
