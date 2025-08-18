import { Song, SongGenre } from '../../models';
import logger from '../../utils/logger';

const sampleSongs = [
    {
        title: 'Khiêu Vũ Dưới Ánh Trăng',
        duration: 240,
        audio_url: 'https://example.com/audio/khieu-vu-duoi-anh-trang.mp3',
        track_number: 1
    },
    {
        title: 'Cảm Giác Điện',
        duration: 210,
        audio_url: 'https://example.com/audio/cam-giac-dien.mp3',
        track_number: 2
    },
    {
        title: 'Thành Phố Nửa Đêm',
        duration: 280,
        audio_url: 'https://example.com/audio/thanh-pho-nua-dem.mp3',
        track_number: 1
    },
    {
        title: 'Gió Mùa Hè',
        duration: 195,
        audio_url: 'https://example.com/audio/gio-mua-he.mp3',
        track_number: 1
    },
    {
        title: 'Bài Ca Ngầm',
        duration: 320,
        audio_url: 'https://example.com/audio/bai-ca-ngam.mp3',
        track_number: 1
    },
    {
        title: 'Giấc Mơ Acoustic',
        duration: 255,
        audio_url: 'https://example.com/audio/giac-mo-acoustic.mp3',
        track_number: 1
    },
    {
        title: 'Tình Yêu Số',
        duration: 275,
        audio_url: 'https://example.com/audio/tinh-yeu-so.mp3',
        track_number: 1
    },
    {
        title: 'Biểu Diễn Trực Tiếp',
        duration: 300,
        audio_url: 'https://example.com/audio/bieu-dien-truc-tiep.mp3',
        track_number: 1
    },
    {
        title: 'Ánh Đèn Neon',
        duration: 225,
        audio_url: 'https://example.com/audio/anh-den-neon.mp3',
        track_number: 3
    },
    {
        title: 'Quán Cà Phê Jazz',
        duration: 310,
        audio_url: 'https://example.com/audio/quan-ca-phe-jazz.mp3',
        track_number: 2
    },
    {
        title: 'Bài Ca Rock',
        duration: 290,
        audio_url: 'https://example.com/audio/bai-ca-rock.mp3',
        track_number: 2
    },
    {
        title: 'Không Khí Thư Giãn',
        duration: 185,
        audio_url: 'https://example.com/audio/khong-khi-thu-gian.mp3',
        track_number: 2
    },
    {
        title: 'Nhịp Beat Rơi',
        duration: 200,
        audio_url: 'https://example.com/audio/nhip-beat-roi.mp3',
        track_number: 2
    },
    {
        title: 'Đại Lộ Hoàng Hôn',
        duration: 265,
        audio_url: 'https://example.com/audio/dai-lo-hoang-hon.mp3',
        track_number: 3
    },
    {
        title: 'Ánh Đèn Thành Phố',
        duration: 245,
        audio_url: 'https://example.com/audio/anh-den-thanh-pho.mp3',
        track_number: 2
    },
    {
        title: 'Về Đâu Mái Tóc Người Thương',
        duration: 260,
        audio_url: 'https://example.com/audio/ve-dau-mai-toc-nguoi-thuong.mp3',
        track_number: 1
    },
    {
        title: 'Tình Ca Mùa Xuân',
        duration: 220,
        audio_url: 'https://example.com/audio/tinh-ca-mua-xuan.mp3',
        track_number: 2
    },
    {
        title: 'Đôi Mắt Người Xưa',
        duration: 275,
        audio_url: 'https://example.com/audio/doi-mat-nguoi-xua.mp3',
        track_number: 1
    },
    {
        title: 'Sài Gòn Đêm Thứ 7',
        duration: 290,
        audio_url: 'https://example.com/audio/sai-gon-dem-thu-7.mp3',
        track_number: 3
    },
    {
        title: 'Nơi Tình Yêu Bắt Đầu',
        duration: 250,
        audio_url: 'https://example.com/audio/noi-tinh-yeu-bat-dau.mp3',
        track_number: 1
    }
];

export async function seedSongs(users: any[], albums: any[], genres: any[]): Promise<any[]> {
    try {
        logger.info('Seeding songs...');

        // Clear existing songs and song genres
        await Song.deleteMany({});
        await SongGenre.deleteMany({});

        // Get only artist users
        const artists = users.filter(user => user.role === 'artist');

        // Create songs with artists and albums
        const songsWithData = sampleSongs.map((song, index) => {
            const artist = artists[index % artists.length];
            // Find albums by this artist or assign to a random album
            const artistAlbums = albums.filter(album => album.artist_id.toString() === artist._id.toString());
            const album = artistAlbums.length > 0 ? artistAlbums[0] : albums[index % albums.length];

            return {
                ...song,
                artist_id: artist._id,
                album_id: album._id
            };
        });

        // Create songs
        const createdSongs = await Song.insertMany(songsWithData);

        // Create song-genre relationships
        const songGenreRelations = [];
        for (let i = 0; i < createdSongs.length; i++) {
            const song = createdSongs[i];
            const genre = genres[i % genres.length];

            songGenreRelations.push({
                song_id: song._id,
                genre_id: genre._id
            });

            // Some songs can have multiple genres
            if (i % 3 === 0 && genres.length > 1) {
                const secondGenre = genres[(i + 1) % genres.length];
                songGenreRelations.push({
                    song_id: song._id,
                    genre_id: secondGenre._id
                });
            }
        }

        await SongGenre.insertMany(songGenreRelations);

        logger.info(`Successfully created ${createdSongs.length} songs`);
        logger.info(`Successfully created ${songGenreRelations.length} song-genre relations`);
        return createdSongs;
    } catch (error) {
        logger.error('Error seeding songs:', error);
        throw error;
    }
}
