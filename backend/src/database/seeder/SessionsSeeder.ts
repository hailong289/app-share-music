import { Genre, Sessions } from '../../models';
import logger from '../../utils/logger';

const sampleSessions = [
  {
    "context_id": null,
    "context_type": "home",
    "name": "Những bài hát thịnh hành",
    "order_index": 1
  },
  {
    "context_id": null,
    "context_type": "home",
    "name": "Nghệ sĩ phổ biến",
    "order_index": 2
  },
  {
    "context_id": null,
    "context_type": "home",
    "name": "Album và đĩa đơn nổi tiếng",
    "order_index": 3
  },
  {
    "context_id": null,
    "context_type": "home",
    "name": "Radio phổ biến",
    "order_index": 4
  },
  {
    "context_id": null,
    "context_type": "home",
    "name": "Bảng xếp hạng nổi bật",
    "order_index": 5
  }
];

export async function seedSessions(): Promise<any[]> {
    try {
        logger.info('Seeding sessions...');
        // Clear existing sessions
        await Sessions.deleteMany({});
        // Create sessions
        const createdSessions = await Sessions.insertMany(sampleSessions);
        logger.info(`Successfully created ${createdSessions.length} sessions`);
        return createdSessions;
    } catch (error) {
        logger.error('Error seeding sessions:', error);
        throw error;
    }
}
