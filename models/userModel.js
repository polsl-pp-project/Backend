const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter your name'],
    },
    lastName: {
        type: String,
        required: [true, 'Enter your last name'],
    },
    email: {
        type: String,
        required: [true, 'Enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Enter valid email'],
    },
    password: {
        type: String,
        required: [true, 'Enter your password'],
        minlength: 5, //minimalna dlugosc hasla (tutaj przykladowo 5 znaków)
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same',
        },
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);

        this.passwordConfirm = undefined;
        next();
    } catch (err) {}
});

const User = mongoose.model('User', userSchema);
module.exports = User;
