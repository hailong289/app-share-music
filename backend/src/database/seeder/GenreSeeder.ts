import { Genre } from '../../models';
import logger from '../../utils/logger';

const sampleGenres = [
    {
        name: 'Nhạc Pop',
        description: 'Nhạc phổ biến với giai điệu bắt tai và thu hút đại chúng'
    },
    {
        name: 'Nhạc Rock',
        description: 'Nhạc đặc trưng với guitar điện, trống và nhịp mạnh mẽ'
    },
    {
        name: 'Nhạc Điện Tử',
        description: 'Nhạc được tạo ra bằng thiết bị điện tử và công nghệ số'
    },
    {
        name: 'Nhạc Jazz',
        description: 'Phong cách âm nhạc với hòa âm phức tạp và sự ứng tác'
    },
    {
        name: 'Nhạc Hip Hop',
        description: 'Thể loại có đặc trưng với lời rap nhịp nhàng và beat mạnh'
    },
    {
        name: 'Nhạc Cổ Điển',
        description: 'Nhạc giao hưởng và thính phòng truyền thống'
    },
    {
        name: 'Nhạc Dân Gian',
        description: 'Âm nhạc truyền thống được truyền qua các thế hệ'
    },
    {
        name: 'Nhạc Indie',
        description: 'Nhạc độc lập không được sản xuất bởi các hãng lớn'
    },
    {
        name: 'Nhạc Alternative',
        description: 'Nhạc rock không thuộc dòng chính với yếu tố thử nghiệm'
    },
    {
        name: 'Nhạc Blues',
        description: 'Thể loại âm nhạc có nguồn gốc từ cộng đồng người Mỹ gốc Phi'
    },
    {
        name: 'Nhạc Country',
        description: 'Phong cách âm nhạc có nguồn gốc từ vùng nông thôn miền Nam nước Mỹ'
    },
    {
        name: 'Nhạc R&B',
        description: 'Nhạc Rhythm and Blues với giọng hát đầy cảm xúc'
    },
    {
        name: 'Nhạc Trữ Tình',
        description: 'Nhạc nhẹ nhàng, tình cảm và sâu lắng'
    },
    {
        name: 'Nhạc Bolero',
        description: 'Thể loại nhạc Việt Nam với giai điệu buồn và lời ca tình cảm'
    },
    {
        name: 'Nhạc Trẻ',
        description: 'Nhạc hiện đại dành cho giới trẻ với giai điệu sôi động'
    }
];

export async function seedGenres(): Promise<any[]> {
    try {
        logger.info('Seeding genres...');

        // Clear existing genres
        await Genre.deleteMany({});

        // Create genres
        const createdGenres = await Genre.insertMany(sampleGenres);

        logger.info(`Successfully created ${createdGenres.length} genres`);
        return createdGenres;
    } catch (error) {
        logger.error('Error seeding genres:', error);
        throw error;
    }
}
