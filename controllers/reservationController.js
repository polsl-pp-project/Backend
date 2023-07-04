const Reservation = require('./../models/reservationModel');
const Car = require('./../models/carModel');
const User = require('./../models/userModel');

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();

        res.status(200).json({
            status: 'success',
            results: reservations.length,
            data: {
                reservations,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            customId: req.params.customId,
        });

        res.status(200).json({
            status: 'success',
            data: {
                reservation,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { ...reservationData } = req.body;
        const car = await Car.findOne({ number: reservationData.carNumber });
        if (!car) throw new Error('Car not found');
        if (car.isOccupied) throw new Error('Car is already occupied');
        car.isOccupied = true;
        await car.save();

        const userId = reservationData.userId;
        const user = await User.findOne({ customId: userId });
        user.reservations.push(reservationData.customId);
        user.markModified('reservations');
        await user.save();

        const newReservation = await Reservation.create(reservationData);

        res.status(201).json({
            status: 'success',
            data: {
                reservation: newReservation,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent',
        });
    }
};
exports.updateReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findOneAndUpdate(
            { customId: req.params.customId },
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
                reservation,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
exports.deleteReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            customId: req.params.customId,
        });
        const carNumber = reservation.carNumber;
        const car = await Car.findOne({ number: carNumber });
        car.isOccupied = false;
        await car.save();

        const userId = reservation.userId;
        const user = await User.findOne({ customId: userId });
        const reservationsFiltered = user.reservations.filter(
            (r) => r != reservation.customId
        );
        user.reservations = reservationsFiltered;
        await user.save();

        await Reservation.findOneAndDelete({ customId: req.params.customId });
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'fail',
            message: 'failed to delete reservation',
        });
    }
};
