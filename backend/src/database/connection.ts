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
                // Sử dụng DNS chuỗi kết nối (MongoDB Atlas)
                mongoUri = dbConfig.dns;
            } else {
                if (dbConfig.connection) {
                    // Nếu có kết nối, sử dụng kết nối đã chỉ định
                    mongoUri = `${dbConfig.connection}://`;
                }
                
                // Add username and password before host for mongodb+srv
                if (dbConfig.user && dbConfig.pass) {
                    mongoUri += `${dbConfig.user}:${dbConfig.pass}@`;
                }
                
                if (dbConfig.host) {
                    mongoUri += dbConfig.host;
                }
                if (dbConfig.port && dbConfig.connection !== 'mongodb+srv') {
                    mongoUri += `:${dbConfig.port}`;
                }
                if (dbConfig.name) {
                    mongoUri += `/${dbConfig.name}`;
                }
                
                // Add query parameters
                if (dbConfig.query) {
                    if (dbConfig.query.startsWith('?')) {
                        mongoUri += dbConfig.query;
                    } else {
                        mongoUri += `?${dbConfig.query}`;
                    }
                }
            }

            logger.info(`Connecting to MongoDB at: ${mongoUri.replace(/:[^:]*@/, ':****@')}`);

            let options: mongoose.ConnectOptions = {
                serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
                socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            };

            await mongoose.connect(mongoUri, options);

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
