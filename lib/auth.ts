import jwt from 'jsonwebtoken';

export interface UserPayload {
  _id: string;
  email: string;
  username: string;
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
} 