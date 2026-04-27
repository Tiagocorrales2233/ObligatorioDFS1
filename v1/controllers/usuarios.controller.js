import Usuario from "../models/usuario.model.js";

export const cambiarPlan = async (req, res) => {
    try {
        if (req.user?.rol !== "admin") {
            return res.status(403).json({ error: "Solo un admin puede cambiar planes" });
        }

        const usuarioId = req.body?.usuarioId || req.params?.id || req.user?.id;
        const planSolicitado = req.body?.plan ? String(req.body.plan).toLowerCase() : null;

        if (planSolicitado && !["plus", "premium"].includes(planSolicitado)) {
            return res.status(400).json({ error: "El plan debe ser plus o premium" });
        }

        if (!usuarioId) {
            return res.status(400).json({ error: "Debe indicar usuarioId para cambiar el plan" });
        }

        const usuario = await Usuario.findById(usuarioId);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const planActual = String(usuario.plan).toLowerCase();
        const nuevoPlan = planSolicitado || (planActual === "premium" ? "plus" : "premium");

        if (planActual === nuevoPlan) {
            return res.status(400).json({ error: `El usuario ya tiene plan ${nuevoPlan}` });
        }

        usuario.plan = nuevoPlan;
        await usuario.save();

        res.status(200).json({ 
            message: `Plan actualizado exitosamente de ${planActual} a ${nuevoPlan}`,
            usuarioId: usuario._id,
            planAnterior: planActual,
            planActual: usuario.plan 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al procesar el cambio de plan", details: error?.message });
    }
};