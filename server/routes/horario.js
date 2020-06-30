const express = require('express');
const aut = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

const Horario = require('../models/horario');
const Turno = require('../models/turno');

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

function fechaActual() {

    let f = new Date;
    let fecha = f.getDate() + "-" + (f.getMonth() + 1) + "-" + f.getFullYear();
    return fecha;
};


// Muestra  todas las horarios
app.get('/horario/validar/:termino', aut.verificaToken, (req, res) => {

    let termino = req.params.termino;

    let fecha_turno = getQueryVariable('fecha', termino);
    let especialidad = getQueryVariable('tipo', termino)


    console.log(fecha_turno);
    console.log(especialidad);

    var condicion = { fecha: fecha_turno, tipo: especialidad };

    Turno.find(condicion)
        .exec((err, turnos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Horario.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    turnos: turnos,
                    cantidad: conteo
                });

            });

        });


});


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


//Crea una agenda libre
app.post('/horario/agenda/', aut.verificaToken, (req, res) => {

    let body = req.body;

    let turno = new Turno({
        tipo: body.tipo,
        fecha: body.fecha,
        hora: body.hora,
        paciente: null,
        estado: 'libre',
        asistencia: '',
        fecha_asig: fechaActual()

    });

    //hace el almacenamiento en la base
    turno.save((err, turnoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            turno: turnoDB
        });

    });

});


module.exports = app;