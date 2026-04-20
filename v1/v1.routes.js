//Estoy en carpeta V1 (peticiones que llegaron a /v1) 
//y espero rutas a /paises -> /v1/paises

import express from 'express';
import usuariosRouter from './routes/usuarios.routes.js';
import authRouter from './routes/auth.routes.js';
import { authorizationMiddleware } from './middlewares/authorization.middleware.js';

const router = express.Router({mergeParams: true});

//login y registro
router.use("/auth", authRouter);//todo:crear el authRouter con rutas de login y registro

router.use(authorizationMiddleware);

//rutas protegidas
router.use("/usuarios", usuariosRouter);

export default router;