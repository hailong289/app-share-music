import { FilterQuery } from 'mongoose';
import { User } from '@/models';
import { BaseService } from './BaseService';
import logger from '../utils/logger';
import { IUser } from '../types/user.type';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = await this.create(userData);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.findOne({ email: email.toLowerCase() });
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by email with password (for authentication)
   */
  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    try {
      const user = await this.model.findOne({ email: email.toLowerCase() }).select('+password');
      return user;
    } catch (error) {
      logger.error('Error finding user by email with password:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, updateData: UpdateUserData): Promise<IUser | null> {
    try {
      // If email is being updated, check for duplicates
      if (updateData.email) {
        const existingUser = await this.findByEmail(updateData.email);
        if (existingUser && existingUser._id.toString() !== id) {
          throw new Error('User with this email already exists');
        }
        updateData.email = updateData.email.toLowerCase();
      }

      return await this.updateById(id, updateData);
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Find active users
   */
  async findActiveUsers(filter: FilterQuery<IUser> = {}): Promise<IUser[]> {
    try {
      return await this.find({ ...filter, isActive: true });
    } catch (error) {
      logger.error('Error finding active users:', error);
      throw error;
    }
  }

  /**
   * Deactivate user (soft delete)
   */
  async deactivateUser(id: string): Promise<IUser | null> {
    try {
      return await this.updateById(id, { isActive: false });
    } catch (error) {
      logger.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Activate user
   */
  async activateUser(id: string): Promise<IUser | null> {
    try {
      return await this.updateById(id, { isActive: true });
    } catch (error) {
      logger.error('Error activating user:', error);
      throw error;
    }
  }

  /**
   * Change user role
   */
  async changeUserRole(id: string, role: 'user' | 'admin'): Promise<IUser | null> {
    try {
      return await this.updateById(id, { role });
    } catch (error) {
      logger.error('Error changing user role:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
    users: number;
  }> {
    try {
      const [total, active, inactive, admins, users] = await Promise.all([
        this.count(),
        this.count({ isActive: true }),
        this.count({ isActive: false }),
        this.count({ role: 'admin' }),
        this.count({ role: 'user' })
      ]);

      return {
        total,
        active,
        inactive,
        admins,
        users
      };
    } catch (error) {
      logger.error('Error getting user statistics:', error);
      throw error;
    }
  }

  /**
   * Search users by name or email
   */
  async searchUsers(
    query: string,
    activeOnly: boolean = true
  ): Promise<IUser[]> {
    try {
      const searchRegex = new RegExp(query, 'i');
      const filter: FilterQuery<IUser> = {
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      };

      if (activeOnly) {
        filter.isActive = true;
      }

      return await this.find(filter);
    } catch (error) {
      logger.error('Error searching users:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
