import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/user.type';

/**
 * Bảng người dùng
 * @typedef User
 * @property {string} name - Tên người dùng
 * @property {string} email - Email người dùng
 * @property {string} bio - Tiểu sử người dùng
 * @property {string} image_url - URL hình ảnh đại diện người dùng
 * @property {string} password - Mật khẩu người dùng
 * @property {string} role - Vai trò của người dùng (user, admin, artist)
 * @property {boolean} isActive - Trạng thái hoạt động của người dùng
 * @property {Date} created_at - Ngày tạo người dùng
 * @property {Date} updated_at - Ngày cập nhật người dùng
 */
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    image_url: {
      type: String,
      trim: true,
      get: (v: string) => {
        if (!v) return '';
        if (v.startsWith('http') || v.startsWith('https')) return v;
        return `${process.env.APP_URL}/${v}`;
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'artist'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
  this.password = await bcrypt.hash(this.password as string, saltRounds);
  next();
});

UserSchema.pre('insertMany', async function (next, docs) {
  for (const user of docs) {
    if (user.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
      user.password = await bcrypt.hash(user.password as string, saltRounds);
    }
  }
  next();
});

// So sánh mật khẩu
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

// Xóa mật khẩu khi chuyển đổi sang JSON
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.set('toObject', { getters: true });
UserSchema.set('toJSON', { getters: true });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
