import express from "express";
import { registrarUsuario, ingresarUsuario } from "../controllers/auth.controller.js";
import { cambiarPlan, obtenerPerfil } from "../controllers/usuarios.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { agregarUsuarioSchema } from "../validators/usuarios.validators.js";
import { authorizationMiddleware } from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.post("/registro", validateBodyMiddleware(agregarUsuarioSchema), registrarUsuario);

router.post("/login", ingresarUsuario);

router.patch("/cambiar-plan", authorizationMiddleware, cambiarPlan);

router.get("/perfil", authorizationMiddleware, obtenerPerfil);

export default router;