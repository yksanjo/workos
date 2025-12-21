import { readFileSync } from 'fs';
import { join } from 'path';
import { query, connectDatabase } from './index';
import { logger } from '../utils/logger';

async function migrate() {
  try {
    await connectDatabase();

    // Read migration file
    const migrationPath = join(__dirname, 'migrations', '001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Execute migration
    await query(migrationSQL);
    logger.info('Migration completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();

