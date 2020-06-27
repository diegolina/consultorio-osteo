const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let turnoSchema = new Schema({
    tipo: {
        type: String,
        required: [true, 'El tipo de atencion es necesario']
    },
    fecha: {
        type: String,
    },
    hora: {
        type: String,
    },
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente'
    },
    estado: {
        type: String,
    },
    fecha_asig: {
        type: String,
    },
    asistencia: {
        type: String,
    }
});

//usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico!' });
module.exports = mongoose.model('Turno', turnoSchema);