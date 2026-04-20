import jwt from "jsonwebtoken";

export const authorizationMiddleware = (req, res, next) => {

    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({ message: "No hay header de autorización" });
    }

    const rawToken = auth.toLowerCase().startsWith("bearer ")
        ? auth.slice(7)
        : auth;

    // Limpia comillas y espacios/saltos de linea al pegar desde respuestas JSON.
    const token = rawToken.replace(/^"|"$/g, "").replace(/\s+/g, "");

    if (!token) {
        return res.status(401).json({ message: "No hay token" });
    }

    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido", details: err.message });
        }
        req.user = decoded;
        next();
    });
};