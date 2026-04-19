import Usuario from "../models/usuario.model.js";
// Este es el que ya tenías, lo hacemos async para MongoDB
export const agregarUsuario = async (req, res) => {
    try {
        // La lógica de creación ya la tienes en auth.controller, 
        // pero si necesitas una creación administrativa, iría aquí.
        res.status(201).json({ message: "Funcionalidad de administrador: Usuario agregado" });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar usuario" });
    }
};

// REQUERIMIENTO: Cambio de plan plus a premium [cite: 72]
export const cambiarPlan = async (req, res) => {
    try {
        // Obtenemos el ID del usuario del token (inyectado por el middleware de auth)
        const usuarioId = req.user.id; 

        const usuario = await Usuario.findById(usuarioId);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // El requerimiento dice: "Cambiar de plan solamente requiere estar en el plan plus" [cite: 73]
        if (usuario.plan !== 'plus') {
            return res.status(400).json({ error: "El usuario ya es premium o no es elegible" });
        }

        usuario.plan = 'premium';
        await usuario.save();

        res.status(200).json({ 
            message: "Plan actualizado a Premium exitosamente",
            plan: usuario.plan 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al procesar el cambio de plan" });
    }
};

// OPCIONAL: Obtener perfil del usuario logueado
export const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select("-password");
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};