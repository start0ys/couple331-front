import express from "express";
import dotenv from 'dotenv';
import { authenticatedRequest } from "../authUtils.js";

dotenv.config();

const API_URL = process.env.API_URL;

const router = express.Router();


router.post('/register', (req, res) => {
  
    // request("post", API_URL + '/users/register', req.body)
    // .then(response => {
    //     res.json(response);
    // })
    // .catch(err => {
    //     res.status(500).json({ error: err.message });
    // })

});


router.get('/:id/status', async (req, res) => {
    const id = req.params.id;
    const response = await authenticatedRequest(req, res, "get", `/couple/${id}/status`);
    res.json(response);
  });

export default router;