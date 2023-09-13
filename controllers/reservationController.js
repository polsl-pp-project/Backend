const Reservation = require('./../models/reservationModel');
const Car = require('./../models/carModel');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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

exports.createReservation = catchAsync(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(token);
        console.log(decoded);
        const userId = decoded.id;
        const user = await User.findOne({
            _id: userId,
        });

        const { ...reservationData } = req.body;
        const newStartDate = new Date(reservationData.startDate);
        const newEndDate = new Date(reservationData.endDate);
        console.log(newStartDate, newEndDate);
        const car = await Car.findOne({ number: reservationData.carNumber });
        if (!car) throw new Error('Car not found');

        const existingReservations = await Reservation.find({
            carNumber: reservationData.carNumber,
        });
        if (existingReservations.length > 0) {
            existingReservations.forEach((reservation) => {
                console.log(reservation);
                if (
                    reservation.startDate >= newEndDate ||
                    reservation.endDate <= newStartDate
                ) {
                    console.log('Car is not occuppied within this time period');
                } else {
                    throw new Error('Car is occuppied within this time period');
                }
            });
        }
        console.log(existingReservations);
        // if (car.isOccupied) throw new Error('Car is already occupied');

        // car.isOccupied = true;
        await car.save();
        console.log('reservationData:', reservationData);
        console.log('reservationData.customId:', reservationData.customId);
        const reservationCustomId = uuidv4();
        user.reservations.push(reservationCustomId);
        user.markModified('reservations');
        await user.save();

        const newReservation = await Reservation.create({
            ...reservationData,
            customId: reservationCustomId,
        });
        console.log(newReservation);

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
});
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
        // car.isOccupied = false;
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
