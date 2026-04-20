import jwt from "jsonwebtoken";

export const authorizationMiddleware = (req, res, next) => {

    const auth = req.headers.authorization
    if (!auth) {
        return res.status(401).json({ message: "No hay header de autorización" });
    }

    const token = auth.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No hay token" });
    }

    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido" });
        }
        req.user = decoded;
        next();
    });
}