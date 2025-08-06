import AppQueue from './queue';
import { JobPayload } from './producer';

export interface JobHandler<T = any> {
    handle(data: T): Promise<void>;
}


// // File Processing Job Handler
// class FileProcessingJobHandler implements JobHandler {
//     async handle(data: { filePath: string; operation: string }): Promise<void> {
//         console.log(`Processing file: ${data.filePath}`);
//         console.log(`Operation: ${data.operation}`);
        
//         // Simulate file processing
//         await new Promise(resolve => setTimeout(resolve, 2000));
        
//         console.log(`File processed successfully: ${data.filePath}`);
//     }
// }

class Worker {
    private static instance: Worker;
    private appQueue: AppQueue;
    private isRunning: boolean = false;
    private handlers: Map<string, JobHandler> = new Map();

    constructor() {
        this.appQueue = AppQueue.getInstance();
        this.registerHandlers();
    }

    // Singleton pattern
    public static getInstance(): Worker {
        if (!Worker.instance) {
            Worker.instance = new Worker();
        }
        return Worker.instance;
    }

    /**
     * Register job handlers
     */
    private registerHandlers(): void {
        // this.handlers.set('email', new EmailJobHandler());
        // this.handlers.set('notification', new NotificationJobHandler());
        // this.handlers.set('file_processing', new FileProcessingJobHandler());
    }

    /**
     * Register a custom job handler
     */
    public registerHandler(jobType: string, handler: JobHandler): void {
        this.handlers.set(jobType, handler);
        console.log(`Handler registered for job type: ${jobType}`);
    }

    /**
     * Receive and process a single message
     */
    public async receiveMessage<T = JobPayload>(blockTimeMs: number = 5000): Promise<{ streamId: string; body: T } | null> {
        try {
            const queue = this.appQueue.getQueue();
            const message = await queue.receiveMessage<T>(blockTimeMs);
            
            if (message) {
                return { streamId: message.streamId, body: message.body };
            }
            return null;
        } catch (error) {
            console.error('Failed to receive message:', error);
            return null;
        }
    }

    /**
     * Verify a processed message
     */
    public async verifyMessage(streamId: string): Promise<'VERIFIED' | 'NOT VERIFIED'> {
        try {
            const queue = this.appQueue.getQueue();
            const result = await queue.verifyMessage(streamId);
            return result;
        } catch (error) {
            console.error('Failed to verify message:', error);
            return 'NOT VERIFIED';
        }
    }

    /**
     * Process a single job
     */
    public async processJob(message: { streamId: string; body: JobPayload }): Promise<boolean> {
        try {
            const { streamId, body } = message;
            const { type, data, metadata } = body;

            console.log(`Processing job: ${type} (Stream ID: ${streamId})`);
            
            const handler = this.handlers.get(type);
            if (!handler) {
                console.error(`No handler found for job type: ${type}`);
                return false;
            }

            // Process the job
            await handler.handle(data);

            // Verify the message after successful processing
            const verified = await this.verifyMessage(streamId);
            
            if (verified === 'VERIFIED') {
                console.log(`Job ${type} completed and verified successfully (Stream ID: ${streamId})`);
                return true;
            } else {
                console.error(`Job ${type} completed but verification failed (Stream ID: ${streamId})`);
                return false;
            }
        } catch (error) {
            console.error('Error processing job:', error);
            return false;
        }
    }

    /**
     * Start the worker to continuously process jobs
     */
    public async start(blockTimeMs: number = 5000): Promise<void> {
        this.isRunning = true;
        console.log('Worker started, listening for jobs...');

        while (this.isRunning) {
            try {
                const message = await this.receiveMessage<JobPayload>(blockTimeMs);
                
                if (message) {
                    await this.processJob(message);
                } else {
                    // No message received, continue polling
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.error('Worker error:', error);
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        console.log('Worker stopped');
    }

    /**
     * Stop the worker
     */
    public stop(): void {
        this.isRunning = false;
        console.log('Worker stopping...');
    }

    /**
     * Check if worker is running
     */
    public isWorkerRunning(): boolean {
        return this.isRunning;
    }
}

export default Worker;
