export class AppError extends Error {
    constructor(statusCode, message, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const notFound = (req, res, next) => {
    next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let errors = err.errors || null;

    if (statusCode >= 500 && !err.isOperational) {
        console.error("Unexpected error:", err);
    }

    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern || {})[0] || "field";
        message = `${field} already exists`;
        errors = { ...(errors || {}), [field]: message };
    }

    if (err.name === "ValidationError" && err.errors) {
        statusCode = 400;
        errors = {};
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });
        message = "Validation failed";
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Invalid or expired token";
    }

    const response = {
        success: false,
        message,
        errors: { message, ...(errors || {}) },
    };

    res.status(statusCode).json(response);
};