const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'clave_secreta';

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ mensaje: 'Token inválido o expirado' });
        }

        req.user = user; 
        next(); 
    }
    );
}

module.exports = verificarToken;