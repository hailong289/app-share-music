import AppQueue from './queue';
import Producer from './producer';
import Worker from './worker';
import { JobPayload } from './producer';
import { JobHandler } from './worker';

// Export singleton instances for easy access
export const queueInstance = AppQueue.getInstance();
export const producerInstance = Producer.getInstance();
export const workerInstance = Worker.getInstance();

// Export classes
export {
    AppQueue,
    Producer,
    Worker
};

// Export types
export type { JobPayload } from './producer';
export type { JobHandler } from './worker';

// Export legacy compatibility
export { producerInstance as queueService };

export default {
    queue: queueInstance,
    producer: producerInstance,
    worker: workerInstance
};
