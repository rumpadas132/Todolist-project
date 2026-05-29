import { verifyToken } from '../utils/token.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

/**
 * Protects routes: expects `Authorization: Bearer <token>`.
 * Attaches req.user with id and email for downstream handlers.
 */
export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Not authorized, token missing', 401);
    }

    const raw = header.slice(7);
    const decoded = verifyToken(raw);
    const user = await User.findById(decoded.sub).select('email name');

    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    req.user = { id: user._id.toString(), email: user.email, name: user.name };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Not authorized, invalid token', 401));
    }
    next(err);
  }
}
