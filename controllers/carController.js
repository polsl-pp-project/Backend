const Car = require('./../models/carModel');
const Reservation = require('./../models/reservationModel');

// const cars = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/cars.json`));

exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();

        res.status(200).json({
            status: 'success',
            results: cars.length,
            data: {
                cars,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getAvailableCars = async (req, res) => {
    const { startDate, endDate } = req.body; // Assuming the start and end dates are provided in the request body
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    try {
        const reservations = await Reservation.find({
            $or: [
                { startDate: { $gte: newEndDate } }, // Reservations starting after the given period
                { endDate: { $lte: newStartDate } }, // Reservations ending before the given period
            ],
        });
        const carNumbers = reservations.map(
            (reservation) => reservation.carNumber
        );
        const matchingCars = await Car.find({
            $or: [{ number: { $in: carNumbers } }, { isOccupied: false }],
        });
        res.status(200).json({
            status: 'success',
            results: carNumbers.length,
            data: {
                matchingCars,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.getCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                car,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getCarByNumber = async (req, res) => {
    try {
        const car = await Car.findOne({ number: req.params.number });

        res.status(200).json({
            status: 'success',
            data: {
                car,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
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
exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                car,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.updateCarByNumber = async (req, res) => {
    try {
        const car = await Car.findOneAndUpdate(
            { number: req.params.number },
            req.body,
            {
                new: true,
                runValidators: true,
                useFindAndModify: false, // to avoid a deprecation warning
            }
        );
        res.status(200).json({
            status: 'success',
            data: {
                car,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
exports.deleteCarByNumber = async (req, res) => {
    try {
        await Car.findOneAndDelete({ number: req.params.number });
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
