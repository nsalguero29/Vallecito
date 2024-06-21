var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const { iniciarDB } = require('./db/main');

iniciarDB('alter') // 'force' tira todo y crea nuevo / 'alter' modifica lo que haya / vacio toma lo que haya o si no lo crea
.then(() => console.log("DB inicializada"))
.catch((error) => console.error('DB error:', error))

var indexRouter = require('./routes/index');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
