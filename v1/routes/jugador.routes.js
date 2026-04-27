import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { authorizationMiddleware } from "../middlewares/authorization.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { runMulterSingle } from "../utils/multer.util.js";
import {
	crearJugador,
	obtenerJugadores,
	obtenerJugadorPorId,
	actualizarJugador,
	eliminarJugador,
} from "../controllers/jugador.controller.js";
import { jugadorSchema, jugadorUpdateSchema } from "../validators/jugador.validators.js";

const router = express.Router({ mergeParams: true });

const parseJugadorImagen = async (req, res, next) => {
	try {
		await runMulterSingle(upload, "imagen", req, res);
		next();
	} catch (error) {
		return res.status(400).json({
			error: "Error al procesar la imagen",
			details: error?.message || "No se pudo leer el archivo",
		});
	}
};

router.post("/", authorizationMiddleware, parseJugadorImagen, validateBodyMiddleware(jugadorSchema), crearJugador);
router.get("/", authorizationMiddleware, obtenerJugadores);
router.get("/:id", authorizationMiddleware, obtenerJugadorPorId);
router.patch("/:id", authorizationMiddleware, validateBodyMiddleware(jugadorUpdateSchema), actualizarJugador);
router.delete("/:id", authorizationMiddleware, eliminarJugador);

export default router;
