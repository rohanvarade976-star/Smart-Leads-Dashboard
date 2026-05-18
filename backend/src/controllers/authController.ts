import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'Email already registered', 409);
      return;
    }

    const user = await User.create({ name, email, password, role: role || 'sales' });
    const token = generateToken(user._id.toString(), user.role);

    sendSuccess(
      res,
      'Registration successful',
      {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      201
    );
  } catch (error) {
    sendError(res, 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    sendSuccess(res, 'Login successful', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    sendError(res, 'Login failed', 500);
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, 'User fetched', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch {
    sendError(res, 'Failed to fetch user', 500);
  }
};
