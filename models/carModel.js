const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    carBrand: String, //marka
    price: Number, //cena za miesiac wynajmu
    year: Number, //rocznik
    mileage: Number, //przebieg
    body: String, //rodzaj nadwozia
    fuelType: String, //rodzaj paliwa
    transmission: String, //skrzynia biegow
    doors: Number, //ilosc drzwi
    color: String, //kolor
    drive: String, //naped
    power: Number, //il koni mechanicznych
    engineCapacity: Number, //pojemnosc silnika
    trunkCapacity: Number, //pojemnosc bagaznika
    fuelConsumption: Number, //spalanie
    description: String, //krotki opis
});
const Car = mongoose.model('Car', carSchema);

module.exports = Car;
