const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
	number: Number,
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
	car_image: String,
});

carSchema.pre('save', async function (next) {
	if (!this.isNew) {
		return next();
	}
	const latestCar = await this.constructor.findOne(
		{},
		{},
		{ sort: { number: -1 } }
	);
	if (!latestCar) {
		this.number = 1;
	} else {
		this.number = latestCar.number + 1;
	}
	next();
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
