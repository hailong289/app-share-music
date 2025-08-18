import { User } from '../../models';
import logger from '../../utils/logger';
import { IUser } from '../../types/user.type';

const sampleUsers = [
    {
        name: 'Quản Trị Viên',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        bio: 'Quản trị viên hệ thống',
        image_url: 'https://icotar.com/initials/A.png',
        isActive: true
    },
    {
        name: 'Sơn Tùng M-TP',
        email: 'sontungmtp@example.com',
        password: '123456',
        role: 'artist',
        bio: 'Nghệ sĩ nổi tiếng với nhiều bản hit',
        image_url: 'https://icotar.com/initials/ST.png',
        isActive: true
    },
    {
        name: 'Võ Văn Nam',
        email: 'namvanvo@example.com',
        password: '123456',
        role: 'user',
        bio: 'Người đam mê âm nhạc và nhà phê bình',
        image_url: 'https://icotar.com/initials/N.png',
        isActive: true
    },
    {
      name: "Đinh Hải Long",
      email: "dinhhailong@example.com",
      password: "123456",
      role: "user",
      bio: "Người yêu thích âm nhạc và công nghệ",
      image_url: "https://icotar.com/initials/D.png",
      isActive: true
    }
];

export async function seedUsers(): Promise<any[]> {
    try {
        logger.info('Seeding users...');

        // Clear existing users
        await User.deleteMany({});

        // Create users
        const createdUsers = await User.insertMany(sampleUsers);

        logger.info(`Successfully created ${createdUsers.length} users`);
        return createdUsers;
    } catch (error) {
        logger.error('Error seeding users:', error);
        throw error;
    }
}
