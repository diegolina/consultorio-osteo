const express = require('express');
const aut = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

const Tratamiento = require('../models/tratamiento');

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


// Muestra  tratamiento
app.get('/tratamiento/porid/:id', aut.verificaToken, (req, res) => {

    let id = req.params.id;

    Tratamiento.findById(id)
        .exec((err, tratamientos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Tratamiento.count((err, conteo) => {
                res.json({
                    ok: true,
                    tratamientos: tratamientos,
                    cantidad: conteo
                });

            });

        });

});

// Muestra todos tratamientos de las pacientes 
app.get('/tratamiento/:paciente', aut.verificaToken, (req, res) => {

    let pacienteB = req.params.paciente;

    let condicion = { paciente: pacienteB };

    Tratamiento.find(condicion)
        .limit(4)
        .sort({ _id: -1 })
        .exec((err, tratamientos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Tratamiento.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    tratamientos: tratamientos,
                    cantidad: conteo
                });

            });

        });

});

//Actualiza actualiza tratamiento
app.put('/tratamiento/modifica/:id', aut.verificaToken, (req, res) => {

    console.log('BODY: ', req.body);

    let id = req.params.id;

    let body = _.pick(req.body, ['fecha', 'titulo', 'tratamiento']);

    Tratamiento.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, tratamientoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            tratamiento: tratamientoDB
        });

    });


});

//Actualiza Cierra tratamiento
app.put('/tratamiento/cierre/:id', aut.verificaToken, (req, res) => {

    console.log('BODY: ', req.body);

    let id = req.params.id;

    let body = _.pick(req.body, ['comentarioCierre', 'Cierre']);

    Tratamiento.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, tratamientoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            tratamiento: tratamientoDB
        });

    });


});


//Crea un paciente
app.post('/tratamiento/crear', aut.verificaToken, (req, res) => {

    let body = req.body;

    let tratamiento = new Tratamiento({
        fecha: body.fecha,
        paciente: body.paciente,
        titulo: body.titulo,
        tratamiento: body.tratamiento,
        comentarioCierre: "",
        Cierre: false
    });


    //hace el almacenamiento en la base
    tratamiento.save((err, tratamientoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            tratamiento: tratamientoDB
        });

    });

});

module.exports = app;