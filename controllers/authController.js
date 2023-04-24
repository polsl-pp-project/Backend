const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

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

    //checking if the user exists
    if (!email || !password) {
        return next(
            new AppError('Remember to provide both the email and the password')
        );
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
            new AppError('You are not loged in! Log in to get access', 401)
        );
    }
    //2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist'
            ),
            401
        );
    }

    //4) Check if user changed password after the token was issued

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

    const user = await User.findOne({ email: ewq.body.email });

    if (!user) {
        return next(new AppError('email not found'), 404);
    }

    //2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3)send email
});

exports.resetPassword = (req, res, next) => {};
