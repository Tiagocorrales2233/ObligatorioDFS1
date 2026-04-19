import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js"; // Importamos el modelo real

const ROUNDS = 12;

export const ingresarUsuario = async (req, res) => { // Agregamos async
    const { email, password } = req.body; 
    
    // Buscamos en la base de datos, no en el array
    const usuario = await Usuario.findOne({ email }); 
    
    if (!usuario) {
        return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const valid = bcrypt.compareSync(password, usuario.password);
    if (!valid) {
        return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
        { id: usuario._id, rol: usuario.rol, plan: usuario.plan }, // Guardamos más info en el token
        process.env.SECRET_JWT,
        { expiresIn: "10d" });

    res.status(200).json({ message: "Login exitoso", token });
};

export const registrarUsuario = async (req, res) => { // Agregamos async
    const body = req.validatedBody || req.body;
    let { email, password, confirmPassword, rol, plan } = body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    // Validación en la base de datos
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
        return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = bcrypt.hashSync(password, ROUNDS);

    // Creamos el usuario en MongoDB con los campos del obligatorio
    const nuevoUsuario = await Usuario.create({ 
        email, 
        password: hashedPassword,
        rol: rol || 'cliente', 
        plan: plan || 'plus' 
    });

    const token = jwt.sign(
        { id: nuevoUsuario._id, rol: nuevoUsuario.rol, plan: nuevoUsuario.plan }, 
        process.env.SECRET_JWT,
        { expiresIn: "10d" });

    res.status(201).json({
        message: "Registro exitoso",
        token,
        usuario: {
            email: nuevoUsuario.email,
            rol: nuevoUsuario.rol,
            plan: nuevoUsuario.plan
        }
    }); // Status 201 es para creación [cite: 56]
}