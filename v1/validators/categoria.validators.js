import Joi from "joi";

export const categoriaSchema = Joi.object({
  nombre: Joi.string()
    .valid("Arquero", "Defensa", "Mediocampista", "Delantero")
    .required()
    .messages({
      "any.only": "La categoría debe ser Arquero, Defensa, Mediocampista o Delantero",
      "any.required": "El nombre de la categoría es obligatorio",
    }),
  descripcion: Joi.string().allow("", null).optional(),
  usuario: Joi.string().optional(),
});
