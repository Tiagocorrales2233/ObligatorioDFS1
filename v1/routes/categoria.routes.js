import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { authorizationMiddleware } from "../middlewares/authorization.middleware.js";
import {
  crearPosicion as crearCategoria,
  obtenerPosiciones as obtenerCategorias,
  obtenerPosicionPorId as obtenerCategoriaPorId,
  actualizarPosicion as actualizarCategoria,
  eliminarPosicion as eliminarCategoria,
} from "../controllers/categoria.controller.js";
import { categoriaSchema } from "../validators/categoria.validators.js";

const router = express.Router({ mergeParams: true });

router.post("/", authorizationMiddleware, validateBodyMiddleware(categoriaSchema), crearCategoria);
router.get("/", authorizationMiddleware, obtenerCategorias);
router.get("/:id", authorizationMiddleware, obtenerCategoriaPorId);
router.patch("/:id", authorizationMiddleware, validateBodyMiddleware(categoriaSchema), actualizarCategoria);
router.delete("/:id", authorizationMiddleware, eliminarCategoria);

export default router;