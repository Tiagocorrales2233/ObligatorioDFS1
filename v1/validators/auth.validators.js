import Joi from "joi";

export const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "El email debe ser un texto",
        "string.empty": "El email no puede estar vacío",
        "string.email": "El email debe ser válido",
        "any.required": "El email es obligatorio"
    }),
    password: Joi.string().min(6).max(20).pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/).required().messages({
        "string.base": "La contraseña debe ser un texto",
        "string.empty": "La contraseña no puede estar vacía",
        "string.min": "La contraseña debe tener al menos {#limit} caracteres",
        "string.max": "La contraseña no puede tener más de {#limit} caracteres",
        "string.pattern.base": "La contraseña debe contener al menos una letra y un número",
        "any.required": "La contraseña es obligatoria"
    }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.only": "Las contraseñas deben coincidir",
        "any.required": "La confirmación de contraseña es obligatoria"
    }),
    rol: Joi.string().valid("admin", "cliente").optional(),
    plan: Joi.string().valid("plus", "premium").optional()
});