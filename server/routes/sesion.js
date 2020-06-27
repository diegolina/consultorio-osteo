const express = require('express');
const aut = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

const Sesion = require('../models/sesion');

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
    let fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
    return fecha;
};

//Elimina sesion de la base directamente
app.delete('/sesion/borrar/:id', aut.verificaToken, (req, res) => {

    let id = req.params.id;

    Sesion.findByIdAndRemove(id, (err, sesionesDel) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            sesiones: sesionesDel
        });

    });

});


// Muestra  todas las sesiones de un tratamiento
app.get('/sesion/tratamiento/:termino', aut.verificaToken, (req, res) => {

    let termino = req.params.termino;

    let idTrat = getQueryVariable('id', termino);
    let desde = getQueryVariable('desde', termino)

    console.log(idTrat);
    console.log(desde);

    let nuevoDesde = Number(desde);

    let condicion = { tratamiento: idTrat };

    Sesion.find(condicion)
        .skip(nuevoDesde)
        .limit(5)
        .sort({ _id: -1 })
        .exec((err, sesiones) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Sesion.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    sesiones: sesiones,
                    cantidad: conteo
                });

            });

        });

});

app.post('/sesion/crear', aut.verificaToken, (req, res) => {

    let body = req.body;

    let sesion = new Sesion({
        tratamiento: body.tratamiento,
        fecha: body.fecha,
        sesion: body.sesion,
    });


    //hace el almacenamiento en la base
    sesion.save((err, sesionDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            sesion: sesionDB
        });

    });

});

module.exports = app;