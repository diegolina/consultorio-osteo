const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let horarioSchema = new Schema({
    orden: {
        type: Number
    },
    horario: {
        type: String
    }

});

//usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico!' });
module.exports = mongoose.model('Horario', horarioSchema);