import { User } from '../../models';
import logger from '../../utils/logger';
import { IUser } from '../../types/user.type';

const sampleUsers = [
    {
        name: 'Nguyễn Văn Hùng',
        email: 'hungnguyenvan@example.com',
        password: 'password123',
        role: 'artist',
        bio: 'Nghệ sĩ nhạc pop với hơn 10 năm kinh nghiệm',
        image_url: 'https://example.com/images/hung.jpg',
        isActive: true
    },
    {
        name: 'Trần Thị Lan',
        email: 'lanthitran@example.com',
        password: 'password123',
        role: 'artist',
        bio: 'Nhạc sĩ rock và người sáng tác',
        image_url: 'https://example.com/images/lan.jpg',
        isActive: true
    },
    {
        name: 'Lê Minh Tuấn',
        email: 'tuanleminh@example.com',
        password: 'password123',
        role: 'artist',
        bio: 'Nhà sản xuất nhạc điện tử',
        image_url: 'https://example.com/images/tuan.jpg',
        isActive: true
    },
    {
        name: 'Phạm Thị Mai',
        email: 'maithipham@example.com',
        password: 'password123',
        role: 'user',
        bio: 'Người yêu âm nhạc và quản lý playlist',
        image_url: 'https://example.com/images/mai.jpg',
        isActive: true
    },
    {
        name: 'Quản Trị Viên',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        bio: 'Quản trị viên hệ thống',
        image_url: 'https://example.com/images/admin.jpg',
        isActive: true
    },
    {
        name: 'Hoàng Thị Linh',
        email: 'linhthihoang@example.com',
        password: 'password123',
        role: 'artist',
        bio: 'Ca sĩ jazz và nhà soạn nhạc',
        image_url: 'https://example.com/images/linh.jpg',
        isActive: true
    },
    {
        name: 'Võ Văn Nam',
        email: 'namvanvo@example.com',
        password: 'password123',
        role: 'user',
        bio: 'Người đam mê âm nhạc và nhà phê bình',
        image_url: 'https://example.com/images/nam.jpg',
        isActive: true
    },
    {
        name: 'Đặng Thị Hà',
        email: 'hathidang@example.com',
        password: 'password123',
        role: 'artist',
        bio: 'Ca sĩ kiêm nhạc sĩ indie folk',
        image_url: 'https://example.com/images/ha.jpg',
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
