const express = require('express');
const aut = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

const Turno = require('../models/turno');
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


// Muestra todos los turnos para un dia seleccionado y especialidad

app.get('/turno/buscar/:termino', aut.verificaToken, (req, res) => {

    let termino = req.params.termino;

    let fecha_turno = getQueryVariable('fecha', termino);
    let especialidad = getQueryVariable('especialidad', termino)

    //Valida la llegada de parametros para armar el find

    let busqueda = {
        fecha: fecha_turno,
        tipo: especialidad
    };


    Turno.find(busqueda)
        .populate('paciente', 'nombre obra_soc afiliado telefono plan')
        .exec((err, turnos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Turno.count(busqueda, (err, conteo) => {
                res.json({
                    ok: true,
                    turnos: turnos,
                    cantidad: conteo
                });

            });

        });

});

// Busqueda de paciente en buscador de DAr Turno

app.get('/turno/buscarnombre/:termino', aut.verificaToken, (req, res) => {

    let termino = req.params.termino;

    let nombre = getQueryVariable('nombre', termino);

    console.log('NOMBRE: ' + nombre);

    //Valida la llegada de parametros para armar el find
    let busqueda = { nombre: { $regex: '.*' + nombre + '.*' } };

    Paciente.find(busqueda)
        .exec((err, pacientes) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Turno.count(busqueda, (err, conteo) => {
                res.json({
                    ok: true,
                    pacientes: pacientes,
                    cantidad: conteo
                });

            });

        });

});

//Liberar un turno
app.put('/turno/liberar/:id', aut.verificaToken, (req, res) => {

    let id = req.params.id;
    body = { estado: "libre", paciente: null, asistencia: "" }

    console.log(body);

    Turno.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, turnoDB) => {

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

//Liberar un turno
app.put('/turno/ocupar/:id', aut.verificaToken, (req, res) => {

    let id = req.params.id;
    body = { estado: "ocupado", paciente: null, asistencia: "" }

    console.log(body);

    Turno.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, turnoDB) => {

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

//MARCAR ASISTENCIA
app.put('/turno/marcar/:id', aut.verificaToken, (req, res) => {

    let id = req.params.id;
    body = req.body;

    console.log('BODY RECIBIDO: ', body);

    Turno.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, turnoDB) => {

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



//Asigna Turno cuando selecciona desde el boton BUSCAR
app.put('/turno/dar', aut.verificaToken, (req, res) => {
    //let id = req.params.id;
    let body = req.body;
    let id = body.idAg;

    let darTurno = { paciente: body.idPac, estado: 'tomado' }

    Turno.findByIdAndUpdate(id, darTurno, { new: true, runValidators: false }, (err, turnoDB) => {

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


//Crea el paciente y da el turno con el paciente recientemente creado
app.post('/turno/creadar', aut.verificaToken, (req, res) => {

    let body = req.body;

    let paciente = new Paciente({
        nombre: body.nombre,
        obra_soc: body.obra[0],
        plan: body.plan[0],
        telefono: body.telefono[0],
        observacion: body.observac,
        afiliado: '',
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

    });

    let id = body.idAg;

    let darTurno = { paciente: paciente._id, estado: 'tomado' }

    Turno.findByIdAndUpdate(id, darTurno, { new: true, runValidators: false }, (err, turnoDB) => {

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