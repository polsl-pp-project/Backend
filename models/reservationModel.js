const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reservationSchema = new mongoose.Schema({
    customId: { type: String, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    carNumber: { type: Number, required: true },
    userId: { type: String, required: true },
    startPlace: { type: String, required: true },
    endPlace: { type: String, required: true },
});

reservationSchema.pre('save', function (next) {
    if (!this.customId) {
        this.customId = uuidv4();
    }
    next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
