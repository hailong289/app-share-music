import { FilterQuery } from 'mongoose';
import { User } from '@/models';
import { BaseService } from './BaseService';
import logger from '../utils/logger';
import { IUser } from '../types/user.type';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  image_url?: string;
  role?: 'user' | 'admin' | 'artist';
  isActive?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'user' | 'admin' | 'artist';
  isActive?: boolean;
}

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async login(email: string, password: string): Promise<{ user?: IUser; msg: string, status?: number }> {
    try {
      const user = await this.findOne({ email });
      if (!user) {
        return {
           msg: "Tài khoản không tồn tại",
           status: 0
        }
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return {
           msg: "Mật khẩu không hợp lệ",
           status: 0
        }
      }
      return {
        user,
        msg: "Đăng nhập thành công",
        status: 1
      };
    } catch (error) {
      return {
        msg: "Đăng nhập thất bại",
        status: 0
      };
    }
  }

  async createUser(userData: CreateUserData): Promise<{ status: number; msg?: string; user?: IUser }> {
    const existingUser = await this.findOne({ email: userData.email });
    if (existingUser) {
      return {
        status: 0,
        msg: "Tài khoản đã tồn tại với email này"
      };
    }
    const user = await this.create(userData);
    return {
      status: 1,
      user
    };
  }


  /**
   * Update user profile
   */
  async updateUser(id: string, updateData: UpdateUserData): Promise<IUser | null> {
    try {
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

  /**
   * Get all users
   */
  async getArtist(query: Record<string, any>): Promise<IUser[]> {
    try {
      return await this.find({ ...query, role: 'artist' });
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
