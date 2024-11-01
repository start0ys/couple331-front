import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { request } from "../public/js/common/axios.js";

dotenv.config();

const API_URL = process.env.API_URL;

const refreshAccessToken = async (refreshToken) => {
    try {
        const headers = { Authorization: `Bearer ${refreshToken}` };
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
        if(publicPath.includes(url)) {
            return next();
        } else {
            return res.redirect('/login');  
        }
    }

    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
        const response = await request("post", API_URL + '/auth/validateToken', req.body, headers);
        const param = response?.message ? `?redirect=${encodeURIComponent('/login')}&message=${encodeURIComponent(response.message)}` : `?redirect=${encodeURIComponent('/login')}`;
        if (response && response.status === 'SUCCESS') {
            if(publicPath.includes(url)) {
                res.redirect('/'); 
            } else {
                const { userId: _userId, email: _email, name: _name, gender: _gender } = jwt.decode(accessToken);
                res.locals.userInfo = { _userId, _email, _name, _gender };
                next();
            }
        } else if (response && response.httpStatus === 401) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false});
                if(publicPath.includes(url)) {
                    res.redirect('/'); 
                } else {
                    const { userId: _userId, email: _email, name: _name, gender: _gender } = jwt.decode(newAccessToken);
                    res.locals.userInfo = { _userId, _email, _name, _gender };
                    next();
                }
            } else {
                res.cookie('accessToken','',{maxAge:0});
                res.cookie('refreshToken','',{maxAge:0});
                res.redirect('/redirect' + param);    
            }
        } else if (response && response.httpStatus === 403) {
            res.cookie('accessToken','',{maxAge:0});
            res.cookie('refreshToken','',{maxAge:0});
            res.redirect('/redirect' + param);    
        } else {
            res.redirect('/redirect' + param);    
        }
    } catch (err) {
        const param = err?.response?.message ? `?redirect=${encodeURIComponent('/login')}&message=${encodeURIComponent(err.response.message)}` : `?redirect=${encodeURIComponent('/login')}`;
        if (err.response && err.response.httpStatus === 401) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false });
                if(publicPath.includes(url)) {
                    res.redirect('/'); 
                } else {
                    const { userId: _userId, email: _email, name: _name, gender: _gender } = jwt.decode(newAccessToken);
                    res.locals.userInfo = { _userId, _email, _name, _gender };
                    next();
                }
            } else {
                res.cookie('accessToken','',{maxAge:0});
                res.cookie('refreshToken','',{maxAge:0});
                res.redirect('/redirect' + param);  
            }
        } else if (err.response && err.response.httpStatus === 403) {
            res.cookie('accessToken','',{maxAge:0});
            res.cookie('refreshToken','',{maxAge:0});
            res.redirect('/redirect' + param);  
        } else {
            res.redirect('/redirect' + param);  
        }
    }
}

const authenticatedRequest = async (req, res, method, url, data = null)=> {
    const accessToken = req?.cookies?.accessToken;
    const refreshToken = req?.cookies?.refreshToken;
  

    try {
        const response = await request(method, API_URL + url, data, { Authorization: `Bearer ${accessToken}` });
        if (response && response.status === 'SUCCESS') {
            return response;
        } else if (response && response.httpStatus === 401) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false});
                const reTry = await request(method, API_URL + url, data, { Authorization: `Bearer ${newAccessToken}` });
                return reTry;
            } else {
                res.cookie('accessToken','',{maxAge:0});
                res.cookie('refreshToken','',{maxAge:0});
                return response;
            }
        } else if (response && response.httpStatus === 403) {
            res.cookie('accessToken','',{maxAge:0});
            res.cookie('refreshToken','',{maxAge:0});
            return response;
        } else {
            return response;
        }
    } catch (err) {
        return null;
    }
}


export { isAuthenticated, authenticatedRequest };