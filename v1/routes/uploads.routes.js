import express from 'express';
import { subirImagen } from '../controllers/uploads.controller.js';
import { authorizationMiddleware } from '../middlewares/authorization.middleware.js';

const router = express.Router({mergeParams: true});

router.post("/", authorizationMiddleware, subirImagen);

export default router;