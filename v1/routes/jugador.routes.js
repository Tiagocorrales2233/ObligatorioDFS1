import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { authorizationMiddleware } from "../middlewares/authorization.middleware.js";
import {
	crearJugador,
	obtenerJugadores,
	obtenerJugadorPorId,
	actualizarJugador,
	eliminarJugador,
} from "../controllers/jugador.controller.js";
import { jugadorSchema } from "../validators/jugador.validators.js";

const router = express.Router({ mergeParams: true });

router.post("/", authorizationMiddleware, validateBodyMiddleware(jugadorSchema), crearJugador);
router.get("/", authorizationMiddleware, obtenerJugadores);
router.get("/:id", authorizationMiddleware, obtenerJugadorPorId);
router.patch("/:id", authorizationMiddleware, validateBodyMiddleware(jugadorSchema), actualizarJugador);
router.delete("/:id", authorizationMiddleware, eliminarJugador);

export default router;
