#!/usr/bin/env node
/**
 * Database Seeder Script
 *
 * Usage:
 *   npm run seed        - Run all seeders
 *   npm run seed:clear  - Clear all data
 */
import logger from '../utils/logger';
import { DatabaseSeeder } from '../database/seeder';

async function main() {
    const seeder = new DatabaseSeeder();
    const command = process.argv[2] || 'seed';
    try {
        switch (command) {
            case 'clear':
                await seeder.clear();
                logger.info('Database cleared successfully!');
                break;

            case 'seed:specific':
                const entityType = process.argv[3];
                if (!entityType) {
                    throw new Error('Entity type must be specified for seeding specific entities');
                }
                await seeder.seedSpecific(entityType);
                logger.info(`Specific entity type "${entityType}" seeded successfully!`);
                break;

            case 'seed':
            case 'run':
                await seeder.run();
                logger.info('Database seeded successfully!');
                break;
        }

        process.exit(0);
    } catch (error) {
        logger.error('Seeder failed:', error);
        process.exit(1);
    }
}

main();
