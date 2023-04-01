const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app.js');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log('DB connection successful!');
    });

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

const testCar = new Car({
    carBrand: 'Test Car2',
    year: 2002,
    price: 3400,
    description: 'test description2',
});

testCar
    .save()
    .then((doc) => {
        console.log(doc);
    })
    .catch((err) => {
        console.log('ERROR:', err);
    });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app running on port ${port}`);
});
