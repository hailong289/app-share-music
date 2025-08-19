import { Connection } from '../connection';
import logger from '../../utils/logger';
import { seedUsers } from '@database/seeder/UserSeeder';
import { seedGenres } from '@database/seeder/GenreSeeder';
import { seedAlbums } from '@database/seeder/AlbumSeeder';
import { User, Genre, Album, Song, Playlist, PlaylistSong, SongGenre, Comment, Follow, Like, ListeningHistory, Share } from '../../models';
import { seedSessions } from './SessionsSeeder';
import { seedSessionsItems } from './SessionsItemSeeder';

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
            // Seed data in the correct order (considering dependencies)
            logger.info('='.repeat(50));
            logger.info('SEEDING DATABASE');
            logger.info('='.repeat(50));
            // Step 1: Seed independent entities
            const users = await seedUsers();
            const genres = await seedGenres();
            const albums = await seedAlbums(users);
            const sessions = await seedSessions();
            const sessionItems = await seedSessionsItems();
            logger.info('='.repeat(50));
            logger.info('SEEDING COMPLETED SUCCESSFULLY');
            logger.info('='.repeat(50));
            logger.info(`Summary:`);
            logger.info(`- Users: ${users.length}`);
            logger.info(`- Genres: ${genres.length}`);
            logger.info(`- Albums: ${albums.length}`);
            logger.info(`- Sessions: ${sessions.length}`);
            logger.info(`- Session Items: ${sessionItems.length}`);
            logger.info('='.repeat(50));
        } catch (error) {
            logger.error('Error during database seeding:', error);
            throw error;
        } finally {
            await this.disconnectFromDatabase();
        }
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
                case 'playlists':
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
