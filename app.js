const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log('middleware');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// app.use('/api/v1/cars', carRouter);
// app.use('/api/v1/users', userRouter);

module.exports = app;
