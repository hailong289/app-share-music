import { Album } from '../../models';
import logger from '../../utils/logger';

const sampleAlbums = [
    {
        title: 'Những Ca Khúc Hay Nhất',
        release_date: new Date('2023-01-15'),
        cover_url: 'https://example.com/covers/nhung-ca-khuc-hay-nhat.jpg'
    },
    {
        title: 'Giấc Mơ Điện Tử',
        release_date: new Date('2023-03-20'),
        cover_url: 'https://example.com/covers/giac-mo-dien-tu.jpg'
    },
    {
        title: 'Đêm Nhạc Nửa Đêm',
        release_date: new Date('2023-05-10'),
        cover_url: 'https://example.com/covers/dem-nhac-nua-dem.jpg'
    },
    {
        title: 'Không Khí Mùa Hè',
        release_date: new Date('2023-06-01'),
        cover_url: 'https://example.com/covers/khong-khi-mua-he.jpg'
    },
    {
        title: 'Ngầm Lòng Đất',
        release_date: new Date('2023-08-15'),
        cover_url: 'https://example.com/covers/ngam-long-dat.jpg'
    },
    {
        title: 'Tuyển Tập Acoustic',
        release_date: new Date('2023-09-30'),
        cover_url: 'https://example.com/covers/tuyen-tap-acoustic.jpg'
    },
    {
        title: 'Chân Trời Số',
        release_date: new Date('2023-11-12'),
        cover_url: 'https://example.com/covers/chan-troi-so.jpg'
    },
    {
        title: 'Live Tại Nhà Hát Apollo',
        release_date: new Date('2024-01-20'),
        cover_url: 'https://example.com/covers/live-apollo.jpg'
    },
    {
        title: 'Tình Ca Bất Hủ',
        release_date: new Date('2024-02-14'),
        cover_url: 'https://example.com/covers/tinh-ca-bat-hu.jpg'
    },
    {
        title: 'Âm Hưởng Việt Nam',
        release_date: new Date('2024-03-10'),
        cover_url: 'https://example.com/covers/am-huong-viet-nam.jpg'
    }
];

export async function seedAlbums(users: any[]): Promise<any[]> {
    try {
        logger.info('Seeding albums...');

        // Clear existing albums
        await Album.deleteMany({});

        // Get only artist users
        const artists = users.filter(user => user.role === 'artist');

        // Assign albums to artists
        const albumsWithArtists = sampleAlbums.map((album, index) => ({
            ...album,
            artist_id: artists[index % artists.length]._id
        }));

        // Create albums
        const createdAlbums = await Album.insertMany(albumsWithArtists);

        logger.info(`Successfully created ${createdAlbums.length} albums`);
        return createdAlbums;
    } catch (error) {
        logger.error('Error seeding albums:', error);
        throw error;
    }
}
