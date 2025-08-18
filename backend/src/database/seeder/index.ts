import { Connection } from '../connection';
import logger from '../../utils/logger';
import { seedUsers } from '@database/seeder/UserSeeder';
import { seedGenres } from '@database/seeder/GenreSeeder';
import { seedAlbums } from '@database/seeder/AlbumSeeder';
import { seedSongs } from '@database/seeder/SongSeeder';
import { seedPlaylists } from './PlaylistSeeder';
import { User, Genre, Album, Song, Playlist, PlaylistSong, SongGenre, Comment, Follow, Like, ListeningHistory, Share } from '../../models';

class DatabaseSeeder {
    private async connectToDatabase(): Promise<void> {
        try {
            const connection = Connection.getInstance();
            await connection.connectDB();
            logger.info('Connected to database for seeding');
        } catch (error) {
            logger.error('Failed to connect to database:', error);
            throw error;
        }
    }

    private async disconnectFromDatabase(): Promise<void> {
        try {
            const mongoose = require('mongoose');
            await mongoose.connection.close();
            logger.info('Disconnected from database');
        } catch (error) {
            logger.error('Error disconnecting from database:', error);
        }
    }

    /**
     * Clear all data from the database
     */
    async clear(): Promise<void> {
        try {
            await this.connectToDatabase();

            logger.info('Clearing all data from database...');

            // Clear all collections in the correct order (considering dependencies)
            await Comment.deleteMany({});
            await Follow.deleteMany({});
            await Like.deleteMany({});
            await ListeningHistory.deleteMany({});
            await Share.deleteMany({});
            await PlaylistSong.deleteMany({});
            await Playlist.deleteMany({});
            await SongGenre.deleteMany({});
            await Song.deleteMany({});
            await Album.deleteMany({});
            await Genre.deleteMany({});
            await User.deleteMany({});

            logger.info('All data cleared successfully');
        } catch (error) {
            logger.error('Error clearing database:', error);
            throw error;
        } finally {
            await this.disconnectFromDatabase();
        }
    }

    /**
     * Run all seeders in the correct order
     */
    async run(): Promise<void> {
        try {
            await this.connectToDatabase();

            logger.info('Starting database seeding...');

            // Clear existing data first
            await this.clearDataOnly();

            // Seed data in the correct order (considering dependencies)
            logger.info('='.repeat(50));
            logger.info('SEEDING DATABASE');
            logger.info('='.repeat(50));

            // Step 1: Seed independent entities
            const users = await seedUsers();
            const genres = await seedGenres();

            // Step 2: Seed entities that depend on users
            const albums = await seedAlbums(users);

            // Step 3: Seed entities that depend on users, albums, and genres
            const songs = await seedSongs(users, albums, genres);

            // Step 4: Seed entities that depend on users and songs
            const playlists = await seedPlaylists(users, songs);

            logger.info('='.repeat(50));
            logger.info('SEEDING COMPLETED SUCCESSFULLY');
            logger.info('='.repeat(50));
            logger.info(`Summary:`);
            logger.info(`- Users: ${users.length}`);
            logger.info(`- Genres: ${genres.length}`);
            logger.info(`- Albums: ${albums.length}`);
            logger.info(`- Songs: ${songs.length}`);
            logger.info(`- Playlists: ${playlists.length}`);
            logger.info('='.repeat(50));

        } catch (error) {
            logger.error('Error during database seeding:', error);
            throw error;
        } finally {
            await this.disconnectFromDatabase();
        }
    }

    /**
     * Clear data without disconnecting (for internal use)
     */
    private async clearDataOnly(): Promise<void> {
        logger.info('Clearing existing data...');

        // Clear all collections in the correct order (considering dependencies)
        await Comment.deleteMany({});
        await Follow.deleteMany({});
        await Like.deleteMany({});
        await ListeningHistory.deleteMany({});
        await Share.deleteMany({});
        await PlaylistSong.deleteMany({});
        await Playlist.deleteMany({});
        await SongGenre.deleteMany({});
        await Song.deleteMany({});
        await Album.deleteMany({});
        await Genre.deleteMany({});
        await User.deleteMany({});

        logger.info('Existing data cleared');
    }

    /**
     * Seed specific entity type
     */
    async seedSpecific(entityType: string): Promise<void> {
        try {
            await this.connectToDatabase();

            logger.info(`Seeding ${entityType}...`);

            switch (entityType.toLowerCase()) {
                case 'users':
                    await seedUsers();
                    break;
                case 'genres':
                    await seedGenres();
                    break;
                case 'albums':
                    const users = await User.find({});
                    await seedAlbums(users);
                    break;
                case 'songs':
                    const allUsers = await User.find({});
                    const allAlbums = await Album.find({});
                    const allGenres = await Genre.find({});
                    await seedSongs(allUsers, allAlbums, allGenres);
                    break;
                case 'playlists':
                    const playlistUsers = await User.find({});
                    const playlistSongs = await Song.find({});
                    await seedPlaylists(playlistUsers, playlistSongs);
                    break;
                default:
                    throw new Error(`Unknown entity type: ${entityType}`);
            }

            logger.info(`${entityType} seeded successfully`);
        } catch (error) {
            logger.error(`Error seeding ${entityType}:`, error);
            throw error;
        } finally {
            // await this.disconnectFromDatabase();
        }
    }
}

export { DatabaseSeeder };
