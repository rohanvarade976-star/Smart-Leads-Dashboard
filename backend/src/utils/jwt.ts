import jwt from 'jsonwebtoken';
import config from '../config';
import { JwtPayload, UserRole } from '../types';

export const generateToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ userId, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
};
