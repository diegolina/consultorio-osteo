/////PUERTO//////////////////////////////////////

process.env.PORT = process.env.PORT || 3000;


/////ENVIRONMENT/////////////////////////////////

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/////VTO DEL TOKEN///////////////////////////////
process.env.CADUCIDAD_TOKEN = '24h';

/////SEED DE AUTENTICACION///////////////////////
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/////BASE DE DATOS///////////////////////////////

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/consultorio';
} else {
    urlDB = 'mongodb+srv://dhlinares:es32dDFNhNbljlH5@cluster0-fhkmo.mongodb.net/consultorio';
};

process.env.URLDB = urlDB;