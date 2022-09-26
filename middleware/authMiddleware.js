import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
            return next();
        } catch (error) {
            res.status(400).json({
                error,
                msg: 'Token no válido'
            });
        }
    }
    if (!token) {
        return res.status(401).json({
            status: 401,
            msg: 'Unauthorized'
        });
    }
}

export default checkAuth;