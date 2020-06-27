const jwt = require('jsonwebtoken');



// Verificar Token
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: err

            });

        };

        req.usuario = decoded.usuario;
        next();

    });

};



// Verificar Admin Role
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: 'El Rol no tiene permisos'

        });

    };

};

// Verificar Token para imagen
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: err

            });

        };

        req.usuario = decoded.usuario;
        next();

    });

};


module.exports = { verificaToken, verificaAdminRole, verificaTokenImg };