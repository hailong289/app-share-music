import { appQueue } from '../queues/queue';

async function processQueue() {
    await appQueue.start();
}


processQueue();