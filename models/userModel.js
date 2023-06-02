const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    customId: { type: String, unique: true },
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
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Enter your password'],
        minlength: 5, //minimalna dlugosc hasla (tutaj przykladowo 5 znaków)
        select: false,
    },
    passwordConfirm: {
        type: String,
        // required: [true, 'Confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    reservations: [{type: String}]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12); //drugi parametr oznacza jak dokładne ma byc hashowanie - defaultowo 10

    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.customId) {
        this.customId = uuidv4();
    }
    next();
});

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
    return await bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    //false means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex'); //32 oznacza długość wygenerowanego tokenu

    this.passwordResetToken = crypto
        .createHash('sha256') //sha256 is hashing algorithm
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
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
