import jwt from "jsonwebtoken";

const generateJWT = datos => jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '1d' });

const generateToken = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export { generateToken, generateJWT };