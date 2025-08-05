import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';

export interface JWTPayload {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'artist';
  image_url?: string;
  bio?: string;
  isActive?: boolean;
}

export class JWTUtil {
  private static JWT_PRIVATE_KEY_PATH = process.env.APP_JWT_PRIVATE_KEY_PATH || './src/secrets/private.pem';
  private static JWT_PUBLIC_KEY_PATH = process.env.APP_JWT_PUBLIC_KEY_PATH || './src/secrets/public.pem';

  static async createTokenJwt(payload: JWTPayload): Promise<{ 
    accessToken: string; 
    refreshToken: string;
    expiresIn?: number;
  }> {
    try {

      const privateKey = readFileSync(path.resolve(this.JWT_PRIVATE_KEY_PATH), 'utf8');

      const accessToken = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1d' // 1 day
      });

      const refreshToken = jwt.sign(
        { ...payload, type: 'refresh' },
        privateKey,
        {
          algorithm: 'RS256',
          expiresIn: '3m' // 3 months
        }
      );

      return { accessToken, refreshToken, expiresIn: 86400 }; // 1 day in seconds
    } catch (error) {
      throw new Error('Failed to create token');
    }
  }

  static async verifyTokenJwt(token: string): Promise<JWTPayload> {
    const publicKey = readFileSync(path.resolve(this.JWT_PUBLIC_KEY_PATH), 'utf8');
    const payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256']
    }) as JWTPayload;
    return payload;
  }

  static async refreshTokenJwt(refreshToken: string) {
    try {
      const publicKey = readFileSync(path.resolve(this.JWT_PUBLIC_KEY_PATH), 'utf8');

      const payload = jwt.verify(refreshToken, publicKey, {
        algorithms: ['RS256']
      });

      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async renewToken(refreshToken: string) {
    try {
      const payload = await this.refreshTokenJwt(refreshToken);
      if (typeof payload === 'string' || !payload || typeof payload === 'object' && !('type' in payload) || payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      const newTokens = await this.createTokenJwt(payload as JWTPayload);
      return newTokens;
    } catch (error) {
      throw new Error('Failed to renew token');
    }
  }

  static getTokenFromHeaders(headers: any): string | null {
    const authHeader = headers['authorization'] || headers['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
