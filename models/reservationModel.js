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
    price: {type: Number}
});

reservationSchema.pre('save', async function (next) {
    if (!this.customId) {
        this.customId = uuidv4();
    }
    if (!this.price) {
        const Car = mongoose.model('Car');
        const car = await Car.findOne({ number: this.carNumber });

        if (!car) {
            throw new Error('Car not found.');
        }

        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Calculate the number of days

        this.price = car.price * days;
    }

    next();


});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
