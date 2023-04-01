const fs = require('fs');
const Car = require('./../models/carModel');

// const cars = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/cars.json`));

exports.checkID = (req, res, next, val) => {
    console.log(`Car id is: ${val}`);

    if (req.params.id * 1 > cars.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid ID',
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    if (!req.body.carBrand || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'missing required parameters',
        });
    }
    next();
};

const getAllCars = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        // results: cars.length,
        // data: {
        //     cars,
        // },
    });
};

exports.getCar = (req, res) => {
    console.log(req.params);
    const id = req.params.id + 1;

    // const car = cars.find((el) => el.id === id);
    // if (!car) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'invalid ID',
    //     });
    // }
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         car,
    //     },
    // });
};

exports.createCar = (req, res) => {
    res.status(201).json({
        status: 'success',
        // data: {
        //     car: newCar,
        // },
    });
    // const newId = cars[cars.length - 1].id + 1;
    // const newCar = Object.assign({ id: newId }, req.body);
    // cars.push(newCar);
    // fs.writeFile(
    //     `${__dirname}/dev-data/cars.json`,
    //     JSON.stringify(cars),
    //     (err) => {
    //         res.status(201).json({
    //             status: 'success',
    //             data: {
    //                 car: newCar,
    //             },
    //         });
    //     }
    // );
};
exports.updateCar = (req, res) => {
    // if (req.params.id * 1 > cars.length) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'invalid ID',
    //     });
    // }
    res.status(200).json({
        status: 'success',
        data: {
            car: 'updated car here',
        },
    });
};
exports.deleteCar = (req, res) => {
    // if (req.params.id * 1 > cars.length) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'invalid ID',
    //     });
    // }
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
