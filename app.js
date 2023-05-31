const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const carRouter = require('./routes/carRoutes');
const userRouter = require('./routes/userRoutes');
const reservationRouter = require('./routes/reservationRoutes');

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use((req, res, next) => {
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/cars', carRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reservations', reservationRouter);

module.exports = app;
