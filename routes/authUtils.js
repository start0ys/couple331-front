import dotenv from 'dotenv';
import { request } from "../public/js/common/axios.js";

dotenv.config();

const API_URL = process.env.API_URL;

const refreshAccessToken = async (refreshToken) => {
    try {
        const headers = { 'Jwt-Auth-Refresh-Token': refreshToken };
        const response = await request("post", API_URL + '/auth/refreshAccessToken', null, headers);
        return response?.data?.accessToken || null;
    } catch (err) {
        return null;
    }
};

const isAuthenticated = async  (req, res, next) => {
    const accessToken = req?.cookies?.accessToken;
    const refreshToken = req?.cookies?.refreshToken;
    const url = req.originalUrl;
    const publicPath = ['/login','/passwordFinder','/signUp'];

    if (!accessToken && !refreshToken) {
        if(publicPath.includes(url))
            return next();
        else
            return res.redirect('/login');  
    }

    const headers = { 'Jwt-Auth-Access-Token': accessToken, 'Jwt-Auth-Refresh-Token': refreshToken };

    try {
        const response = await request("post", API_URL + '/auth/validateToken', req.body, headers);
        const param = response.message ? `?message=${encodeURIComponent(response.message)}` : '';
        if (response && response.status === 'SUCCESS') {
            if(publicPath.includes(url)) {
                res.redirect('/'); 
            } else {
                next();
            }
        } else if (response && response.httpStatus === 401) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false});
                if(publicPath.includes(url)) {
                    res.redirect('/'); 
                } else {
                    next();
                }
            } else {
                res.cookie('accessToken','',{maxAge:0});
                res.cookie('refreshToken','',{maxAge:0});
                res.redirect('/login' + param);    
            }
        } else {
            res.redirect('/login' + param);    
        }
    } catch (err) {
        const param = err.response.message ? `?message=${encodeURIComponent(err.response.message)}` : '';
        if (err.response && err.response.httpStatus === 401) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false });
                if(publicPath.includes(url)) {
                    res.redirect('/'); 
                } else {
                    next();
                }
            } else {
                res.cookie('accessToken','',{maxAge:0});
                res.cookie('refreshToken','',{maxAge:0});
                res.redirect('/login' + param);  
            }
        } else {
            res.redirect('/login' + param);  
        }
    }


}

export { isAuthenticated };