const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let pacienteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    obra_soc: {
        type: String
    },
    plan: {
        type: String
    },
    afiliado: {
        type: String
    },
    telefono: {
        type: String
    },
    observacion: {
        type: String
    },
    estado: {
        type: String,
        required: [true, 'El estado es necesario']
    },
    fecha_baja: {
        type: String,
        required: [true, 'La fecha de baja es necesario']
    },
    fecha_creacion: {
        type: String,
        required: [true, 'La fecha de creacion es necesario']
    },
    antecedentes: {
        type: String
    }

});


module.exports = mongoose.model('Paciente', pacienteSchema);