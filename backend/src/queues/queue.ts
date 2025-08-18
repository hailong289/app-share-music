import logger from "@/utils/logger";
import Bull from "bull";
import dotenv from 'dotenv';
dotenv.config();
class AppQueue {
    private static instance: AppQueue;
    private queueKey: string = 'defaultQueue';
    private queue: Bull.Queue;

    private constructor() {
        try {
            this.queue = new Bull(this.queueKey, {
                redis: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                    password: process.env.REDIS_PASSWORD,
                }
            });
        } catch (error) {
            logger.error('Error initializing queue:', error);
            throw new Error('Failed to initialize queue');
        }
    }

    public static getInstance(): AppQueue {
        if (!AppQueue.instance) {
            AppQueue.instance = new AppQueue();
        }
        return AppQueue.instance;
    }

    public async start(): Promise<void> {
        await this.processJobs();
    }

    public async addJob(jobClass: any, params?: any): Promise<void> {
        try {
            let jobInstance;
            let className;
            let constructorArgs: any[] = [];

            if (typeof jobClass === 'function') {
                className = jobClass.name;
                if (params) {
                    constructorArgs = Object.values(params);
                    jobInstance = new jobClass(...constructorArgs);
                } else {
                    jobInstance = new jobClass();
                }
            } else {
                className = jobClass.constructor.name;
                jobInstance = jobClass;
            }

            await this.queue.add({
                name: className,
                data: {
                    constructorArgs: constructorArgs,
                    jobData: jobInstance.toJSON ? jobInstance.toJSON() : {
                        to: jobInstance.to,
                        subject: jobInstance.subject,
                        body: jobInstance.body
                    }
                }
            });
        } catch (error) {
            logger.error('Error adding job to the queue:', error);
        }
    }

    public async processJobs(): Promise<void> {
        console.log(`Processing jobs in queue: ${this.queueKey}`);
        this.queue.process(async (job) => {
            const jobHandlerName = job.data.name;
            try {
                const jobInstance = await this.getJobHandle(jobHandlerName, job.data.data);
                if (!jobInstance || typeof jobInstance.handle !== 'function') {
                    throw new Error(`Job handler ${jobHandlerName} does not have a handle method`);
                }
                await jobInstance.handle();
                console.log(`Job ${job.id} processed successfully`);
            } catch (error) {
                logger.error(`Failed to load job handler: ${jobHandlerName}`, error);
                throw error;
            }
        });

        this.queue.on('completed', (job) => {
            this.removeJob(job.id as string); // Remove job after completion
        });

        this.queue.on('failed', async (job, err) => {
            logger.error(`Job failed: ${job.id}, Error: ${err.message}`);
            try {
                const jobHandlerName = job.data.name;
                const jobInstance = await this.getJobHandle(jobHandlerName, job.data.data);
                if (jobInstance && typeof jobInstance.failed === 'function') {
                    await jobInstance.failed(err);
                }
            } catch (retryError) {}
        });
    }

    public getQueue(): Bull.Queue {
        return this.queue;
    }

    public getQueueKey(): string {
        return this.queueKey;
    }

    public async close(): Promise<void> {
        await this.queue.close();
    }

    public async clear(): Promise<void> {
        await this.queue.empty();
    }

    public async removeJob(jobId: string): Promise<void> {
        const job = await this.queue.getJob(jobId);
        if (job) {
            await job.remove();
        } else {
            console.log(`Job not found: ${jobId}`);
        }
    }

    public async getJob(jobId: string): Promise<Bull.Job | null> {
        return await this.queue.getJob(jobId);
    }

    public async getJobHandle(name: string, data: any): Promise<any> {
        const jobModule = await import(`./jobs/${name}`);
        const JobHandlerClass = jobModule.default;
        const { constructorArgs, jobData } = data;
        let jobInstance;
        if (constructorArgs && Array.isArray(constructorArgs) && constructorArgs.length > 0) {
            jobInstance = new JobHandlerClass(...constructorArgs);
        } else if (jobData) {
            // Tạo instance từ jobData nếu không có constructorArgs
            jobInstance = new JobHandlerClass(jobData.to, jobData.subject, jobData.body);
        } else {
            jobInstance = new JobHandlerClass();
        }

        return jobInstance;
    }
    public async processJobsOnce(): Promise<void> {
        const jobs = await this.queue.getWaiting(0, 0); // Lấy 1 job đầu tiên (start=0, end=0)
        if (jobs.length > 0) {
            const job = jobs[0];
            try {
                const jobInstance = await this.getJobHandle(job.data.name, job.data.data);
                if (jobInstance?.handle) {
                    await jobInstance.handle();
                    console.log(`Job ${job.id} processed successfully`);
                    await job.remove();
                }
            } catch (error) {
                logger.error(`Job ${job.id} failed`, error);
            }
        } else {
            console.log('No jobs waiting in queue');
        }
    }
}

export const appQueue = AppQueue.getInstance();
