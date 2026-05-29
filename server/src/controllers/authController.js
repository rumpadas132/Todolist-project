import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';
import { AppError } from '../utils/AppError.js';

function userResponse(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError('Email already registered', 409));
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: { user: userResponse(user), token },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = signToken(user._id.toString());
    user.password = undefined;

    res.json({
      success: true,
      data: { user: userResponse(user), token },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.json({ success: true, data: { user: userResponse(user) } });
  } catch (err) {
    next(err);
  }
}
