const express = require('express');
const aut = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

const Horario = require('../models/horario');

// Muestra  todas las horarios
app.get('/horario', aut.verificaToken, (req, res) => {

    Horario.find()
        .sort({ orden: 1 })
        .exec((err, horarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Horario.count((err, conteo) => {
                res.json({
                    ok: true,
                    horarios: horarios,
                    cantidad: conteo
                });

            });

        });

});

module.exports = app;