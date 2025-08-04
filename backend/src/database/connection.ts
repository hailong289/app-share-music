import mongoose from 'mongoose';
import logger from '../utils/logger';
import getDatabaseConfig from '@/config/database';

export class Connection {
    private static instance: Connection;
    private isConnected: boolean = false;

    private constructor() { }

    public static getInstance(): Connection {
        if (!Connection.instance) {
            Connection.instance = new Connection();
        }
        return Connection.instance;
    }

    public isConnectedToDatabase(): boolean {
        return this.isConnected && mongoose.connection.readyState === 1;
    }

    public async connectDB(): Promise<void> {
        try {
            const dbConfig = getDatabaseConfig();
            let mongoUri = '';
            if (dbConfig.dns) {
                mongoUri = dbConfig.dns;
            } else {
                mongoUri = `${dbConfig.connection}://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;
                if (dbConfig.pass) {
                    mongoUri = `${dbConfig.connection}://${dbConfig.host}:${dbConfig.pass}@${dbConfig.port}/${dbConfig.name}`;
                }
            }

            if (dbConfig.query) {
                mongoUri += dbConfig.query;
            }

            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
                socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            });

            this.isConnected = true;
            logger.info('Connected to MongoDB successfully');

            mongoose.connection.on('error', (error) => {
                logger.error('MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                logger.info('MongoDB reconnected');
                this.isConnected = true;
            });

        } catch (error) {
            this.isConnected = false;
            logger.error('Failed to connect to MongoDB:', error);
            throw error; // Re-throw to let caller handle
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            logger.info('Disconnected from MongoDB');
        } catch (error) {
            logger.error('Error disconnecting from MongoDB:', error);
        }
    }
}
