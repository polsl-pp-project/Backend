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
        select: false,
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

    this.password = await bcrypt.hash(this.password, 12); //drugi parametr oznacza jak dokładne ma byc hashowanie - defaultowo 10

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
    return await bcrypt.compare(candidatePass, userPass);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

//example body of POST
// {
//     "name": "Tyler",
//     "lastName": "Durden",
//     "email": "testing@test.io",
//     "password": "password123",
//     "passwordConfirm": "password123"
// }
