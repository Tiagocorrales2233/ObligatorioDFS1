import Joi from "joi";

export const agregarUsuarioSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos {#limit} caracteres",
    "string.max": "El nombre no puede tener más de {#limit} caracteres",
    "any.required": "El nombre es obligatorio"
  }),
  email: Joi.string().email().required().messages({
    "string.base": "El email debe ser un texto",
    "string.empty": "El email no puede estar vacío",
    "string.email": "El email debe ser válido"
  }),
  edad: Joi.number().min(18).max(100).required().messages({
    "number.base": "La edad debe ser un número",
    "number.min": "La edad debe ser al menos 18",
    "number.max": "La edad no puede ser mayor a 100",
    "any.required": "La edad es obligatoria"
  }),
  contraseña: Joi.string().min(6).pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/).required().messages({
    "string.base": "La contraseña debe ser un texto",
    "string.empty": "La contraseña no puede estar vacía",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "string.pattern.base": "La contraseña debe contener al menos una letra y un número"
  }),
  repetirContraseña: Joi.string().valid(Joi.ref('contraseña')).required().messages({
    "any.only": "Las contraseñas no coinciden"
  }),
  aceptaTerminos: Joi.boolean().valid(true).required().messages({
    "boolean.base": "Debe aceptar los términos y condiciones",
    "boolean.valid": "Debe aceptar los términos y condiciones"
  })
});