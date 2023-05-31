const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
});

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            customId: req.params.customId,
        });

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent',
        });
    }
};
exports.updateUserById = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
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
                user,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
exports.deleteUserById = async (req, res) => {
    try {
        await User.findOneAndDelete({ customId: req.params.customId });
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
