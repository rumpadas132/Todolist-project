import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

/**
 * Runs after express-validator chains; maps validation errors to 400 response.
 */
export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(new AppError('Validation failed', 400, details));
  }
  next();
}
