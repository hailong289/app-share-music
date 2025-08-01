import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../types';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class JWTUtil {
  private static getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return secret;
  }
  
  public static generateToken(user: IUser): string {
    const payload: JWTPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    
    const options = {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    } as SignOptions;
    
    return jwt.sign(payload, this.getSecret(), options);
  }
  
  public static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.getSecret()) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
  public static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
}
