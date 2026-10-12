import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

router.get('/database', async (req, res) => {
  try {
    await db.command({ ping: 1 });

    console.log('✅ MongoDB connection successful');

    res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      database: db.databaseName,
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: error.message,
    });
  }
});

export default router;