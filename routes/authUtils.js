import dotenv from 'dotenv';
import { request } from "../public/js/common/axios.js";

dotenv.config();

const API_URL = process.env.API_URL;

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await request("post", API_URL + '/auth/refreshAccessToken', { refreshToken });
        return response?.data?.accessToken || null;
    } catch (err) {
        return null;
    }
};

const isAuthenticated = async  (req, res, next) => {
    const accessToken = req?.cookies?.accessToken;
    const refreshToken = req?.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.redirect('/login');  
    }

    const headers = { 'Jwt-Auth-Token': accessToken };

    try {
        const response = await request("post", API_URL + '/auth/validateToken', req.body, headers);
        if (response && response?.status === 'SUCCESS') {
            next(); 
        } else if (response?.httpStatus === 401) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false});
                next();
            } else {
                res.redirect('/login');    
            }
        } else {
            res.redirect('/login');    
        }
    } catch (err) {
        if (err.response && err.response.httpStatus === 401) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false });
                next();
            } else {
                res.redirect('/login');    
            }
        } else {
            res.redirect('/login');    
        }
    }


}

export { isAuthenticated };