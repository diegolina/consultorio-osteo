const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const aut = require('../middlewares/autenticacion');

const app = express();

function getQueryVariable(variable, termino) {
    // Estoy asumiendo que query es window.location.search.substring(1);
    var query = termino;
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

app.get('/usuario/respuestas/:termino', (req, res) => {

    let termino = req.params.termino;

    let correo = getQueryVariable('email', termino);
    let respuesta1 = getQueryVariable('respuesta1', termino);
    let respuesta2 = getQueryVariable('respuesta2', termino);
    let respuesta3 = getQueryVariable('respuesta3', termino);

    //Valida la llegada de parametros para armar el find

    let busqueda = {
        estado: true,
        email: correo,
        respuesta1: respuesta1,
        respuesta2: respuesta2,
        respuesta3: respuesta3
    };

    console.log(busqueda);

    Usuario.find(busqueda)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Usuario.count(busqueda, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cantidad: conteo
                });

            });

        });

});



app.get('/usuario/preguntas/:mail', (req, res) => {

    let mail = req.params.mail;

    let condicion = { estado: true, email: mail };

    Usuario.find(condicion, '_id pregunta1 pregunta2 pregunta3')
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Usuario.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cantidad: conteo
                });

            });

        });

});


app.get('/usuario', aut.verificaToken, (req, res) => {


    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });

    let condicion = { estado: true };

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find(condicion, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Usuario.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cantidad: conteo
                });

            });

        });

});



app.post('/usuario', /*[aut.verificaToken, aut.verificaAdminRole], */ function(req, res) {

    let body = req.body;

    let usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //hace el almacenamiento en la base
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', [aut.verificaToken, aut.verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/pass/:id', function(req, res) {

    let id = req.params.id;
    let body = req.body;

    let bodyNuevo = { password: bcrypt.hashSync(body.password, 10) }

    Usuario.findByIdAndUpdate(id, bodyNuevo, { new: true, runValidators: false }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});


app.delete('/usuario/:id', [aut.verificaToken, aut.verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = { estado: false };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: false }, (err, usuarioDel) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };


        if (usuarioDel === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });

        };

        res.json({
            ok: true,
            usuario: usuarioDel
        });

    });


});


module.exports = app;