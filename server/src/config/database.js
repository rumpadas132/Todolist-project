import mongoose from 'mongoose';

/** In-process MongoMemoryServer instance when no MONGODB_URI is provided (dev only). */
let memoryServer = null;

/**
 * Connects to MongoDB:
 * - Uses MONGODB_URI when set.
 * - Otherwise in non-production, starts mongodb-memory-server (no local Mongo required).
 */
export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  let uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      console.error('MONGODB_URI is required in production.');
      process.exit(1);
    }

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log('[dev] Using in-memory MongoDB (no install / Docker required).');
    } catch (err) {
      console.error('Failed to start in-memory MongoDB:', err.message);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
