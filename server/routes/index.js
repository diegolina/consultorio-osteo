const express = require('express');
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./paciente'));
app.use(require('./turno'));
app.use(require('./tratamiento'));
app.use(require('./sesion'));
app.use(require('./horario'));

module.exports = app;