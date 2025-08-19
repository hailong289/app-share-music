import { Genre } from '../../models';
import logger from '../../utils/logger';

const sampleGenres = [
  {
    "name": "Dành cho bạn",
    "description": "Những gợi ý âm nhạc được cá nhân hoá theo sở thích của bạn.",
    "banner_image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
  },
  {
    "name": "Mới phát hành",
    "description": "Khám phá những bản nhạc mới nhất vừa ra mắt.",
    "banner_image": "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47"
  },
  {
    "name": "Nhạc Việt",
    "description": "Tuyển chọn nhạc Việt Nam đặc sắc từ xưa đến nay.",
    "banner_image": "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a"
  },
  {
    "name": "Pop",
    "description": "Âm nhạc Pop hiện đại, bắt tai và dễ nghe.",
    "banner_image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
  },
  {
    "name": "K-Pop",
    "description": "Nhạc Hàn Quốc sôi động và xu hướng toàn cầu.",
    "banner_image": "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
  },
  {
    "name": "Hip-Hop",
    "description": "Những giai điệu rap, trap và hip-hop chất lượng.",
    "banner_image": "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
  },
  {
    "name": "Bảng xếp hạng",
    "description": "Top ca khúc hot nhất hiện nay.",
    "banner_image": "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47"
  },
  {
    "name": "Tâm trạng",
    "description": "Nhạc cho mọi cung bậc cảm xúc.",
    "banner_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Rock",
    "description": "Âm nhạc rock mạnh mẽ và cuồng nhiệt.",
    "banner_image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
  },
  {
    "name": "La-tinh",
    "description": "Âm nhạc Latin rực lửa và đậm chất nhiệt đới.",
    "banner_image": "https://images.unsplash.com/photo-1525286116112-b59af11adad1"
  },
  {
    "name": "Dance/Điện tử",
    "description": "Nhạc EDM sôi động, remix đầy năng lượng.",
    "banner_image": "https://images.unsplash.com/photo-1518972559570-7cc1309f3229"
  },
  {
    "name": "Đồng quê",
    "description": "Giai điệu country mộc mạc, giản dị.",
    "banner_image": "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
  },
  {
    "name": "R&B",
    "description": "Âm nhạc R&B quyến rũ và ngọt ngào.",
    "banner_image": "https://images.unsplash.com/photo-1485579149621-3123dd979885"
  },
  {
    "name": "Thư giãn",
    "description": "Nhạc chill nhẹ nhàng, giảm stress.",
    "banner_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Ngủ ngon",
    "description": "Giai điệu êm ái giúp bạn dễ dàng chìm vào giấc ngủ.",
    "banner_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Tiệc tùng",
    "description": "Nhạc khuấy động không khí cho mọi bữa tiệc.",
    "banner_image": "https://images.unsplash.com/photo-1518972559570-7cc1309f3229"
  },
  {
    "name": "Tình yêu",
    "description": "Những bản nhạc lãng mạn dành cho tình yêu.",
    "banner_image": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85"
  },
  {
    "name": "Metal",
    "description": "Âm nhạc Metal mạnh mẽ và đầy lửa.",
    "banner_image": "https://images.unsplash.com/photo-1485579149621-3123dd979885"
  },
  {
    "name": "Jazz",
    "description": "Nhạc jazz đầy ngẫu hứng và tinh tế.",
    "banner_image": "https://images.unsplash.com/photo-1508973375-d33d5f3b7889"
  },
  {
    "name": "Thịnh hành",
    "description": "Các ca khúc được nghe nhiều nhất hiện tại.",
    "banner_image": "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47"
  },
  {
    "name": "Cổ điển",
    "description": "Nhạc giao hưởng và piano cổ điển bất hủ.",
    "banner_image": "https://images.unsplash.com/photo-1485217988980-11786ced9454"
  },
  {
    "name": "Dân gian & Acoustic",
    "description": "Âm nhạc truyền thống và acoustic mộc mạc.",
    "banner_image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
  },
  {
    "name": "Tập trung",
    "description": "Nhạc nền giúp bạn tập trung học tập và làm việc.",
    "banner_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Soul",
    "description": "Âm nhạc Soul đầy cảm xúc và lắng đọng.",
    "banner_image": "https://images.unsplash.com/photo-1485579149621-3123dd979885"
  },
  {
    "name": "Anime",
    "description": "Nhạc phim hoạt hình Nhật Bản đầy màu sắc.",
    "banner_image": "https://images.unsplash.com/photo-1525182008055-f88b95ff7980"
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
