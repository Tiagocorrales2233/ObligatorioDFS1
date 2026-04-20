import express from 'express';
import { getModels, useGemini25Flash } from '../controllers/ai.controller.js';

const router = express.Router({mergeParams: true});


router.get("/", getModels);
router.post("/", useGemini25Flash);
router.post("/gemini-2.5-flash", useGemini25Flash);

export default router;