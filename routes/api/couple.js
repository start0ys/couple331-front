import express from "express";
import { authenticatedRequest } from "../authUtils.js";

const router = express.Router();


router.post('/register', async (req, res) => {
    const response = await authenticatedRequest(req, res, "post", '/couple/register', req.body);
    res.json(response);
});


router.get('/:id/status', async (req, res) => {
    const id = req.params.id;
    const response = await authenticatedRequest(req, res, "get", `/couple/${id}/status`);
    res.json(response);
});

router.patch('/:coupleId/status', async (req, res) => {
    const coupleId = req.params.coupleId;
    const response = await authenticatedRequest(req, res, "patch", `/couple/${coupleId}/status`, req.body);
    res.json(response);
});

router.get('/:coupleId/detail', async (req, res) => {
    const coupleId = req.params.coupleId;
    const response = await authenticatedRequest(req, res, "get", `/couple/${coupleId}/detail`, req.body);
    res.json(response);
});

router.patch('/:coupleId/desc', async (req, res) => {
    const coupleId = req.params.coupleId;
    const response = await authenticatedRequest(req, res, "patch", `/couple/${coupleId}/desc`, req.body);
    res.json(response);
});


export default router;