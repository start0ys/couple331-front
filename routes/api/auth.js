import express from "express";
import dotenv from 'dotenv';
import { request } from "../../public/js/common/axios.js";

dotenv.config();

const API_URL = process.env.API_URL;

const router = express.Router();


router.post('/sendCode', (req, res) => {

    request("post", API_URL + '/auth/sendCode', req.body)
    .then(response => {
        res.json(response);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    })

});

router.post('/verifyCode', (req, res) => {
    request("post", API_URL + '/auth/verifyCode', req.body)
    .then(response => {
        res.json(response);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    })
  });

  router.post('/login', (req, res) => {
    request("post", API_URL + '/auth/login', req.body)
    .then(response => {
        let data = response.data || {};
        const { accessToken, refreshToken } = data;
        const isSuccess = accessToken && refreshToken;

        if(isSuccess) {
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: false});
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false});
        }

        delete data.accessToken;
        delete data.refreshToken;
        res.json(response);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    })
  });

  router.post('/logout', (req, res) => {
    let token = req?.cookies?.accessToken || req?.cookies?.refreshToken;
    const headers = { Authorization: `Bearer ${token}` };
    request("post", API_URL + '/auth/logout', null, headers)
    .then(response => {
        if (response && response?.status === 'SUCCESS') {
            res.clearCookie('accessToken', { httpOnly: true, secure: false});
            res.clearCookie('refreshToken', { httpOnly: true, secure: false});
        }
        res.json(response);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    })
  });


export default router;