import express from "express";
import { ingresarUsuario, registrarUsuario } from "../controllers/auth.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { registerSchema } from "../validators/auth.validators.js";

const router = express.Router({ mergeParams: true });

router.post("/login", ingresarUsuario);
router.post("/register", validateBodyMiddleware(registerSchema), registrarUsuario);

export default router;