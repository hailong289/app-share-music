import { Playlist, PlaylistSong, Like, Comment, Follow, ListeningHistory } from '../../models';
import logger from '../../utils/logger';

const samplePlaylists = [
    {
        name: 'Bài Hát Yêu Thích',
        description: 'Tuyển tập những bài hát yêu thích nhất của tôi',
        is_public: true
    },
    {
        name: 'Nhạc Tập Gym',
        description: 'Những bài hát sôi động cho buổi tập thể hình',
        is_public: true
    },
    {
        name: 'Buổi Tối Thư Giãn',
        description: 'Âm nhạc thư giãn cho một buổi tối yên bình',
        is_public: true
    },
    {
        name: 'Những Ca Khúc Du Lịch',
        description: 'Nhạc hoàn hảo cho những chuyến đi xa',
        is_public: true
    },
    {
        name: 'Nhạc Tập Trung Học Tập',
        description: 'Nhạc không lời và ambient để tập trung',
        is_public: false
    },
    {
        name: 'Playlist Tiệc Tung',
        description: 'Nhạc sôi động để bắt đầu bữa tiệc',
        is_public: true
    },
    {
        name: 'Tuyển Tập Jazz',
        description: 'Những bản jazz cổ điển và hiện đại được tuyển chọn',
        is_public: true
    },
    {
        name: 'Không Khí Điện Tử',
        description: 'Những track nhạc điện tử và EDM hay nhất',
        is_public: true
    },
    {
        name: 'Nhạc Trữ Tình Việt Nam',
        description: 'Những ca khúc trữ tình bất hủ của Việt Nam',
        is_public: true
    },
    {
        name: 'Bolero Kinh Điển',
        description: 'Tuyển tập những bài bolero hay nhất mọi thời đại',
        is_public: true
    }
];

const sampleComments = [
    'Bài hát tuyệt vời! Tôi rất thích!',
    'Nghe mà nhớ lại bao kỷ niệm',
    'Beat cực hay!',
    'Phù hợp với tâm trạng của tôi',
    'Một trong những bài yêu thích',
    'Lựa chọn tuyệt vời',
    'Bài này không bao giờ cũ',
    'Giọng hát tuyệt vời',
    'Yêu giai điệu này',
    'Nghệ sĩ tài năng!',
    'Nghe mãi không chán',
    'Ca khúc hay nhất năm',
    'Làm tôi cảm động',
    'Nhạc này rất chill',
    'Nghe để thư giãn tuyệt vời'
];

export async function seedPlaylists(users: any[], songs: any[]): Promise<any[]> {
    try {
        logger.info('Seeding playlists and user interactions...');

        // Clear existing data
        await Promise.all([
            Playlist.deleteMany({}),
            PlaylistSong.deleteMany({}),
            Like.deleteMany({}),
            Comment.deleteMany({}),
            Follow.deleteMany({}),
            ListeningHistory.deleteMany({})
        ]);

        // Create playlists
        const playlistsWithUsers = samplePlaylists.map((playlist, index) => ({
            ...playlist,
            user_id: users[index % users.length]._id
        }));

        const createdPlaylists = await Playlist.insertMany(playlistsWithUsers);

        // Create playlist-song relationships
        const playlistSongRelations = [];
        for (let i = 0; i < createdPlaylists.length; i++) {
            const playlist = createdPlaylists[i];
            const songsToAdd = Math.floor(Math.random() * 5) + 3; // 3-7 songs per playlist

            for (let j = 0; j < songsToAdd; j++) {
                const randomSong = songs[Math.floor(Math.random() * songs.length)];
                playlistSongRelations.push({
                    playlist_id: playlist._id,
                    song_id: randomSong._id,
                    position: j + 1
                });
            }
        }

        await PlaylistSong.insertMany(playlistSongRelations);

        // Create likes for songs
        const likes = [];
        for (let i = 0; i < Math.min(50, users.length * 10); i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            likes.push({
                user_id: randomUser._id,
                song_id: randomSong._id
            });
        }

        await Like.insertMany(likes);

        // Create comments for songs
        const comments = [];
        for (let i = 0; i < Math.min(30, users.length * 5); i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomSong = songs[Math.floor(Math.random() * songs.length)];
            const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];

            comments.push({
                user_id: randomUser._id,
                song_id: randomSong._id,
                content: randomComment
            });
        }

        await Comment.insertMany(comments);

        // Create follow relationships
        const follows = [];
        const regularUsers = users.filter(user => user.role === 'user');
        const artists = users.filter(user => user.role === 'artist');

        for (const user of regularUsers) {
            // Each regular user follows 2-4 artists
            const followCount = Math.floor(Math.random() * 3) + 2;
            const shuffledArtists = [...artists].sort(() => 0.5 - Math.random());

            for (let i = 0; i < Math.min(followCount, shuffledArtists.length); i++) {
                follows.push({
                    follower_id: user._id,
                    following_id: shuffledArtists[i]._id
                });
            }
        }

        await Follow.insertMany(follows);

        // Create listening history
        const listeningHistory = [];
        for (let i = 0; i < Math.min(100, users.length * 15); i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            // Random listening time within the last 30 days
            const randomDate = new Date();
            randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

            listeningHistory.push({
                user_id: randomUser._id,
                song_id: randomSong._id,
                listened_at: randomDate,
                duration_listened: Math.floor(Math.random() * randomSong.duration) + 30 // At least 30 seconds
            });
        }

        await ListeningHistory.insertMany(listeningHistory);

        logger.info(`Successfully created ${createdPlaylists.length} playlists`);
        logger.info(`Successfully created ${playlistSongRelations.length} playlist-song relations`);
        logger.info(`Successfully created ${likes.length} likes`);
        logger.info(`Successfully created ${comments.length} comments`);
        logger.info(`Successfully created ${follows.length} follow relationships`);
        logger.info(`Successfully created ${listeningHistory.length} listening history records`);

        return createdPlaylists;
    } catch (error) {
        logger.error('Error seeding playlists and user interactions:', error);
        throw error;
    }
}
