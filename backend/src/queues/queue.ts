import { Queue } from '@upstash/queue';
import { Redis } from '@upstash/redis';

class AppQueue {
    private static instance: AppQueue;
    private queue: Queue;
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL || 'https://bold-seahorse-17302.upstash.io',
            token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AUOWAAIjcDFkZjY1MGVlM2U5ZDQ0MTlmODJiMmMyMGEwMmZmMTkzNHAxMA',
        });
        this.queue = new Queue({ redis: this.redis });
    }

    // Singleton pattern
    public static getInstance(): AppQueue {
        if (!AppQueue.instance) {
            AppQueue.instance = new AppQueue();
        }
        return AppQueue.instance;
    }

    public getQueue(): Queue {
        return this.queue;
    }

    public getRedis(): Redis {
        return this.redis;
    }

    public async start(): Promise<void> {
        try {
            console.log('Queue service started successfully');
        } catch (error) {
            console.error('Failed to start queue service:', error);
        }
    }

    public async stop(): Promise<void> {
        try {
            console.log('Queue service stopped successfully');
        } catch (error) {
            console.error('Failed to stop queue service:', error);
        }
    }
}

export default AppQueue;