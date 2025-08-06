import AppQueue from './queue';

export interface JobPayload {
    type: string;
    data: any;
    metadata?: {
        createdAt: Date;
        priority?: 'low' | 'normal' | 'high';
        attempts?: number;
    };
}

class Producer {
    private static instance: Producer;
    private appQueue: AppQueue;

    constructor() {
        this.appQueue = AppQueue.getInstance();
    }

    // Singleton pattern
    public static getInstance(): Producer {
        if (!Producer.instance) {
            Producer.instance = new Producer();
        }
        return Producer.instance;
    }

    /**
     * Send a message to the queue
     * @param payload Job payload
     * @param delayMs Delay in milliseconds (optional)
     * @returns Message ID or null if failed
     */
    public async sendMessage<T extends {}>(payload: JobPayload, delayMs: number = 0): Promise<string | null> {
        try {
            // Add metadata if not provided
            if (!payload.metadata) {
                payload.metadata = {
                    createdAt: new Date(),
                    priority: 'normal',
                    attempts: 3
                };
            }

            const queue = this.appQueue.getQueue();
            const messageId = await queue.sendMessage(payload, delayMs);
            
            console.log(`Message enqueued with ID: ${messageId}, Type: ${payload.type}`);
            return messageId;
        } catch (error) {
            console.error('Failed to send message:', error);
            return null;
        }
    }

    /**
     * Send an email job
     */
    public async sendEmailJob(to: string, subject: string, content: string, delayMs: number = 0): Promise<string | null> {
        const payload: JobPayload = {
            type: 'email',
            data: {
                to,
                subject,
                content
            },
            metadata: {
                createdAt: new Date(),
                priority: 'normal',
                attempts: 3
            }
        };

        return this.sendMessage(payload, delayMs);
    }

    /**
     * Send a notification job
     */
    public async sendNotificationJob(userId: string, message: string, type: string = 'info', delayMs: number = 0): Promise<string | null> {
        const payload: JobPayload = {
            type: 'notification',
            data: {
                userId,
                message,
                type
            },
            metadata: {
                createdAt: new Date(),
                priority: 'high',
                attempts: 2
            }
        };

        return this.sendMessage(payload, delayMs);
    }

    /**
     * Send a file processing job
     */
    public async sendFileProcessingJob(filePath: string, operation: string, delayMs: number = 0): Promise<string | null> {
        const payload: JobPayload = {
            type: 'file_processing',
            data: {
                filePath,
                operation
            },
            metadata: {
                createdAt: new Date(),
                priority: 'low',
                attempts: 1
            }
        };

        return this.sendMessage(payload, delayMs);
    }
}

export default Producer;
