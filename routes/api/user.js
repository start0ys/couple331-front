import express from "express";
import dotenv from 'dotenv';
import { request } from "../../public/js/common/axios.js";

dotenv.config();

const API_URL = process.env.API_URL;

const router = express.Router();


router.post('/register', (req, res) => {
  console.log(req.body);
  res.json({ message: 'Data saved successfully!', data: req.body })
  // request("post", API_URL + '/users/register', {});
});

  // pp.post('/save-data', async (req, res) => {
  //   const { name, age } = req.body;
  
  //   try {
  //     // 외부 API로 요청 보내기 (프론트엔드 서버가 처리)
  //     const apiUrl = process.env.API_URL;  // 외부 API URL
  //     const apiResponse = await axios.post(apiUrl, { name, age });
  
  //     // 외부 API로부터 응답을 받아 클라이언트에 전달
  //     res.json({ message: 'Data saved successfully!', data: apiResponse.data });
  //   } catch (error) {
  //     console.error('Error calling external API:', error);
  //     res.status(500).json({ message: 'Failed to save data' });
  //   }
  // });

export default router;