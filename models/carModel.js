const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    carBrand: String,
    price: Number,
    year: Number,
    mileage: Number,
    body: String,
    fuelType: String,
    transmission: String,
    doors: Number,
    color: String,
    drive: String,
    power: Number,
    engineCapacity: Number,
    trunkCapacity: Number,
    fuelConsumption: Number,
    description: String,
});
const Car = mongoose.model('Car', carSchema);

module.exports = Car;
