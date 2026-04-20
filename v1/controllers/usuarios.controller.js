import Usuario from "../models/usuario.model.js";

// REQUERIMIENTO: Cambio de plan plus a premium
export const cambiarPlan = async (req, res) => {
    try {
        // Obtenemos el ID del usuario del token (inyectado por el middleware de auth)
        const usuarioId = req.user.id; 

        const usuario = await Usuario.findById(usuarioId);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        // El requerimiento dice: "Cambiar de plan solamente requiere estar en el plan plus"
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