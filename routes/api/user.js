import express from "express";
import dotenv from 'dotenv';
import { request } from "../../public/js/common/axios.js";

dotenv.config();

const API_URL = process.env.API_URL;

const router = express.Router();


router.post('/register', (req, res) => {
  
    request("post", API_URL + '/users/register', req.body)
    .then(response => {
        res.json(response);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    })

});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const accessToken = req?.cookies?.accessToken;
    const headers = { Authorization: `Bearer ${accessToken}` };
    request("get", API_URL + `/users/${id}`, null, headers)
    .then(response => {
        res.json(response);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    })
  });

export default router;