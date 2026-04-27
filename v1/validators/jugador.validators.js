import Joi from "joi";

export const jugadorSchema = Joi.object({
  nombre: Joi.string().min(2).max(50).required(),
  apellido: Joi.string().min(2).max(50).required(),
  edad: Joi.number().integer().min(16).max(50).required(),
  posicion: Joi.string().hex().length(24).required(), // ← ObjectId válido
  equipo: Joi.string().min(2).max(100).allow("", null).optional(),
  nacionalidad: Joi.string().min(2).max(50).required(),
  usuario: Joi.string().hex().length(24).optional(),
  folder: Joi.string().min(1).max(80).optional()
});

export const jugadorUpdateSchema = Joi.object({
  nombre: Joi.string().min(2).max(50).optional(),
  apellido: Joi.string().min(2).max(50).optional(),
  edad: Joi.number().integer().min(16).max(50).optional(),
  posicion: Joi.string().hex().length(24).optional(), 
  equipo: Joi.string().min(2).max(100).allow("", null).optional(),
  nacionalidad: Joi.string().min(2).max(50).optional(),
  usuario: Joi.string().hex().length(24).optional(),
  folder: Joi.string().min(1).max(80).optional()
});
