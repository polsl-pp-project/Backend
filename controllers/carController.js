const Car = require('./../models/carModel');

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
