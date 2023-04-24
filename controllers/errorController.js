const AppError = require('./../utils/appError');

const handleJWTError = (err) =>
    new AppError('Invalid token. Please log in again', 401);

if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
