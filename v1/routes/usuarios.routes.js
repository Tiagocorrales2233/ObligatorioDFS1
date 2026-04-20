import express from "express";
import { cambiarPlan } from "../controllers/usuarios.controller.js";
import { authorizationMiddleware } from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.patch("/cambiar-plan", authorizationMiddleware, cambiarPlan);

export default router;