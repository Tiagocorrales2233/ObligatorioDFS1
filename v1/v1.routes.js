//Estoy en carpeta V1 (peticiones que llegaron a /v1) 
//y espero rutas a /paises -> /v1/paises

import express from 'express';
import usuariosRouter from './routes/usuarios.routes.js';
import authRouter from './routes/auth.routes.js';
import aiRouter from './routes/ai.routes.js';
import uploadsRouter from './routes/uploads.routes.js';
import { authorizationMiddleware } from './middlewares/authorization.middleware.js';

const router = express.Router({mergeParams: true});

//rutas desprotegidas
router.use("/auth", authRouter);//login y registro

router.use(authorizationMiddleware);

//rutas protegidas
router.use("/usuarios", usuariosRouter);
router.use("/uploads", uploadsRouter);
router.use("/ai", aiRouter);

export default router;