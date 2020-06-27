const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let tratamientoSchema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente'

    },

    fecha: {
        type: String
    },

    titulo: {
        type: String
    },

    tratamiento: {
        type: String
    },

    comentarioCierre: {
        type: String,
    },

    Cierre: {
        type: Boolean,
    }
});

//usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico!' });
module.exports = mongoose.model('Tratamiento', tratamientoSchema);