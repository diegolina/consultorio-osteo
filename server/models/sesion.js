const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let sesionSchema = new Schema({
    tratamiento: {
        type: Schema.Types.ObjectId,
        ref: 'Tratamiento'
    },

    fecha: {
        type: String
    },

    sesion: {
        type: String
    }

});

//usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico!' });
module.exports = mongoose.model('Sesion', sesionSchema);