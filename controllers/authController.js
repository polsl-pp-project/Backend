const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = signToken(newUser._id);

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
};

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// Check if the user is already logged in
	if (req.user) {
		return next(new AppError('You are already logged in!', 403));
	}

	// Checking if the user exists
	if (!email || !password) {
		return next(new AppError('Please provide email and password!', 400));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	const token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token,
	});
});
exports.protect = catchAsync(async (req, res, next) => {
	//1) Getting token and check if it's there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(
			new AppError('You are not logged in! Log in to get access', 401)
		);
	}
	//2) Verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	//3) Check if token has expired
	if (Date.now() >= decoded.exp * 1000) {
		return next(
			new AppError('Token has expired. Please log in again', 401)
		);
	}

	//4) Check if user still exists
	const currentUser = await User.findById(decoded.id);

	if (!currentUser) {
		return next(
			new AppError(
				'The user belonging to this token does no longer exist'
			),
			401
		);
	}

	//5) Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded).iat) {
		return next(
			AppError('User recently changed password! Log in again'),
			401
		);
	}
	//grants access to protected route
	req.user = currentUser;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError('You do not have permission to do this'),
				403
			);
		}

		next();
	};
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	//1) Get user based on POSTed email

	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError('email not found', 404));
	}

	//2) Generate the random reset token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	//3)send email
	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Click here to reset your password ${resetURL}.\n If u didn't forget your password, ignore this message`;
	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token is valid for 10 min',
			message,
		});

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				'There was an error sending the email. Try again later'
			),
			500
		);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	//1)Get user based on token
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	//2)Check
	if (!user) {
		return next(new AppError('Token has expired or is incorrect', 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	//3)Log in

	const token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token,
	});
});
exports.verifyToken = catchAsync((req, res) => {
	const token = req.headers.authorization.split(' ')[1];

	// Verify the token using your secret key
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	// If the token is valid and not expired, send a response with status code 200
	res.status(200).send({ message: 'Token is valid and active' });
});
