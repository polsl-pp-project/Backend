const Car = require('./../models/carModel');

// const cars = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/cars.json`));

exports.getAllCars = async (req, res) => {
    const cars = await Car.find();

    res.status(200).json({
        status: 'success',
        results: cars.length,
        data: {
            cars,
        },
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

exports.createCar = async (req, res) => {
    try {
        const newCar = await Car.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                car: newCar,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent',
        });
    }
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
