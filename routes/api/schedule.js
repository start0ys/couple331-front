import express from "express";
import { authenticatedRequest } from "../authUtils.js";

const router = express.Router();


router.post('/calendar/register', async (req, res) => {
    const response = await authenticatedRequest(req, res, "post", '/calendar/register', req.body);
    res.json(response);
});

router.put('/calendar/:id', async (req, res) => {
    const id = req.params.id;
    const response = await authenticatedRequest(req, res, "put", `/calendar/${id}`, req.body);
    res.json(response);
});

router.delete('/calendar/:id', async (req, res) => {
    const id = req.params.id;
    const response = await authenticatedRequest(req, res, "delete", `/calendar/${id}`);
    res.json(response);
});

router.get('/calendar/:id', async (req, res) => {
    const id = req.params.id;
    const type = req.query.type || 'all';
    const response = await authenticatedRequest(req, res, "get", `/calendar/${id}?type=${type}`);
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