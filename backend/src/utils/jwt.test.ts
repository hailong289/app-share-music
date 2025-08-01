import { JWTUtil, JWTPayload } from './jwt';
import { Types } from 'mongoose';

// Mock user data for testing
const mockUser = {
  _id: new Types.ObjectId(),
  name: 'Test User',
  email: 'test@example.com',
  role: 'user' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  password: 'hashedpassword',
  comparePassword: async () => true,
  isModified: () => false,
  save: async () => mockUser,
  toJSON: () => ({ ...mockUser, password: undefined })
} as any;

// Test JWT functionality
describe('JWTUtil', () => {
  let token: string;

  test('should generate a valid JWT token', () => {
    token = JWTUtil.generateToken(mockUser);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  test('should verify and decode a valid token', () => {
    const decoded = JWTUtil.verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(mockUser._id.toString());
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe(mockUser.role);
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp).toBeDefined();
  });

  test('should decode token without verification', () => {
    const decoded = JWTUtil.decodeToken(token);
    expect(decoded).toBeDefined();
    expect(decoded?.id).toBe(mockUser._id.toString());
    expect(decoded?.email).toBe(mockUser.email);
    expect(decoded?.role).toBe(mockUser.role);
  });

  test('should throw error for invalid token verification', () => {
    expect(() => {
      JWTUtil.verifyToken('invalid.token.here');
    }).toThrow('Invalid token');
  });

  test('should return null for invalid token decoding', () => {
    const decoded = JWTUtil.decodeToken('invalid.token');
    expect(decoded).toBeNull();
  });

  test('should throw error when JWT_SECRET is not set', () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    expect(() => {
      JWTUtil.generateToken(mockUser);
    }).toThrow('JWT_SECRET is not defined in environment variables');

    // Restore the original secret
    process.env.JWT_SECRET = originalSecret;
  });
});

export { mockUser };
