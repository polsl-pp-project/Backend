const Reservation = require('./../models/reservationModel');

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
        const newReservation = await Reservation.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                reservation: newReservation,
            },
        });
    } catch (err) {
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
        await Reservation.findOneAndDelete({ customId: req.params.customId });
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
