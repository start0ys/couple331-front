import express from "express";
import { authenticatedRequest } from "../authUtils.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const page = req.query.page || '0';
    const size = req.query.size || '10';
    const searchWord = req.query.searchWord || '';
    const searchType = req.query.searchType || 'title';
    const includeClobDataYn = req.query.includeClobDataYn || 'N';
    const response = await authenticatedRequest(req, res, "get", `/board/?page=${page}&size=${size}&searchWord=${searchWord}&searchType=${searchType}&includeClobDataYn=${includeClobDataYn}`);
    res.json(response);
});

router.get('/:boardId', async (req, res) => {
    const boardId = req.params.boardId;
    const page = req.query.page || '0';
    const size = req.query.size || '10';
    const response = await authenticatedRequest(req, res, "get", `/board/${boardId}?page=${page}&size=${size}`);
    res.json(response);
});

router.post('/register', async (req, res) => {
    const response = await authenticatedRequest(req, res, "post", '/board/register', req.body);
    res.json(response);
});

router.patch('/:boardId', async (req, res) => {
    const boardId = req.params.boardId;
    const response = await authenticatedRequest(req, res, "patch", `/board/${boardId}`, req.body);
    res.json(response);
});

router.delete('/:boardId', async (req, res) => {
    const boardId = req.params.boardId;
    const response = await authenticatedRequest(req, res, "delete", `/board/${boardId}`);
    res.json(response);
});

router.get('/:boardId/comment', async (req, res) => {
    const boardId = req.params.boardId;
    const page = req.query.page || '0';
    const size = req.query.size || '10';
    const response = await authenticatedRequest(req, res, "get", `/board/${boardId}/comment?page=${page}&size=${size}`);
    res.json(response);
});

router.post('/:boardId/comment/register', async (req, res) => {
    const boardId = req.params.boardId;
    const response = await authenticatedRequest(req, res, "post", `/board/${boardId}/comment/register`, req.body);
    res.json(response);
});

router.patch('/:boardId/comment/:commentId', async (req, res) => {
    const boardId = req.params.boardId;
    const commentId = req.params.commentId;
    const response = await authenticatedRequest(req, res, "patch", `/board/${boardId}/comment/${commentId}`, req.body);
    res.json(response);
});

router.delete('/:boardId/comment/:commentId', async (req, res) => {
    const boardId = req.params.boardId;
    const commentId = req.params.commentId;
    const response = await authenticatedRequest(req, res, "delete", `/board/${boardId}/comment/${commentId}`);
    res.json(response);
});




export default router;