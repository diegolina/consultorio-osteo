const express = require('express');
const aut = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

const Paciente = require('../models/paciente');

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

// Muestra todos las pacientes 
app.get('/paciente', aut.verificaToken, (req, res) => {

    let condicion = { estado: 'activo' };

    Paciente.find(condicion)
        //.sort('nombre')
        //.populate('usuario', 'nombre email')
        .limit(15)
        .exec((err, pacientes) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Paciente.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    pacientes: pacientes,
                    cantidad: conteo
                });

            });

        });

});

// busca si existe el afiliado 
app.get('/paciente/afiliado/:afiliado', aut.verificaToken, (req, res) => {

    let afiliad = req.params.afiliado;

    Paciente.find({ afiliado: afiliad, estado: 'activo' })
        .exec((err, pacientes) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Paciente.count({ afiliado: afiliad }, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo
                });

            });

        });

});


// Muestra un paciente por ID
app.get('/paciente/porid/:id', aut.verificaToken, (req, res) => {
    let id = req.params.id;

    //Categoria.findById();

    Paciente.findById(id)

    .exec((err, pacientes) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });

        };

        Paciente.count((err, conteo) => {
            res.json({
                ok: true,
                pacientes: pacientes,
                cantidad: conteo
            });

        });

    });

});



// Muestra una paciente por criterio de busqueda
app.get('/paciente/buscar/:termino', aut.verificaToken, (req, res) => {
    let termino = req.params.termino;

    let nombre = getQueryVariable('pacienteBus', termino);
    let obra = getQueryVariable('obraSocBus', termino)

    //Valida la llegada de parametros para armar el find

    let busqueda = { estado: 'activo' };

    if (!nombre) {
        if (!obra) {
            busqueda = { estado: 'activo' };
        } else {
            busqueda = [{ obra_soc: { $regex: '.*' + obra + '.*' } }];
        }

    } else {
        if (!obra) {
            busqueda = [{ nombre: { $regex: '.*' + nombre + '.*' } }];
        } else {

            busqueda = [{
                    nombre: { $regex: '.*' + nombre + '.*' }
                },
                { obra_soc: { $regex: '.*' + obra + '.*' } }
            ]
        }
    };

    Paciente.find({ $and: busqueda })
        .limit(15)
        .exec((err, pacientes) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Paciente.count({ $and: busqueda }, (err, conteo) => {
                res.json({
                    ok: true,
                    pacientes: pacientes,
                    cantidad: conteo
                });

            });

        });

});



//Crea un paciente
app.post('/paciente/crear', aut.verificaToken, (req, res) => {

    let body = req.body;

    let paciente = new Paciente({
        nombre: body.nombre,
        obra_soc: body.obra,
        plan: body.plan,
        afiliado: body.afiliado,
        telefono: body.telefono,
        observacion: body.observac,
        estado: 'activo',
        fecha_baja: '31/12/2099',
        fecha_creacion: fechaActual()
    });


    //hace el almacenamiento en la base
    paciente.save((err, pacienteDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            paciente: pacienteDB
        });

    });

});


//Actualiza una paciente
app.put('/paciente/actualizar/:id', aut.verificaToken, (req, res) => {


    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'obra_soc', 'afiliado', 'plan', 'telefono', 'observacion']);

    Paciente.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, pacienteDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            paciente: pacienteDB
        });

    });

});


//Actualiza una antecedente del paciente
app.put('/paciente/actualizarAntec/:id', aut.verificaToken, (req, res) => {

    console.log('BODY: ', req.body);

    let id = req.params.id;

    let body = _.pick(req.body, ['antecedentes']);

    Paciente.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, pacienteDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            paciente: pacienteDB
        });

    });


});

//Borra una paciente
app.delete('/paciente/borrar/:id', aut.verificaToken, (req, res) => {


    let id = req.params.id;
    let cambiaEstado = { estado: 'inactivo', fecha_baja: fechaActual() };

    console.log('ID= ' + id);

    Paciente.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: false }, (err, pacienteDel) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        if (pacienteDel === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Paciente no encontrado'
                }
            });

        };

        res.json({
            ok: true,
            paciente: pacienteDel
        });

    });

});





module.exports = app;