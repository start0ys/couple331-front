import express from "express";
import { authenticatedRequest } from "../authUtils.js";

const router = express.Router();


router.post('/calendar/register', async (req, res) => {
    const response = await authenticatedRequest(req, res, "post", '/calendar/register', req.body);
    res.json(response);
});

router.post('/todo/register', async (req, res) => {
    const response = await authenticatedRequest(req, res, "post", '/todo/register', req.body);
    res.json(response);
});

router.patch('/todo', async (req, res) => {
    const response = await authenticatedRequest(req, res, "patch", '/todo', req.body);
    res.json(response);
});

router.delete('/todo/:id', async (req, res) => {
    const id = req.params.id;
    const response = await authenticatedRequest(req, res, "delete", `/todo/${id}`);
    res.json(response);
});

router.get('/todo/:id', async (req, res) => {
    const id = req.params.id;
    const response = await authenticatedRequest(req, res, "get", `/todo/${id}`);
    res.json(response);
});


export default router;