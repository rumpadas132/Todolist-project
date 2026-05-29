import { AppError } from '../utils/AppError.js';

/**
 * Centralized error handler: operational AppErrors become JSON; others log as 500.
 */
export function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate ${field}. Please use another value.`,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid identifier' });
  }

  const status = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.isOperational ? err.message : 'Something went wrong',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && !err.isOperational) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}

export function notFound(req, res, next) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}
