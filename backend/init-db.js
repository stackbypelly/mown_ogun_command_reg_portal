import { connectDatabase, closeDatabase } from './config/database.js';

async function initializeDatabase() {
  try {
    await connectDatabase();
    console.log('MongoDB indexes and initial records are ready.');
  } catch (error) {
    console.error('MongoDB initialization failed:', error.message);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}

initializeDatabase();
