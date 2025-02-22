import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      const mongooseInstance = await mongoose.connect(MONGODB_URI, opts);
      cached!.conn = mongooseInstance;
      cached!.promise = Promise.resolve(mongooseInstance);
      return cached.conn;
    } catch (e) {
      throw e;
    }
  }

  try {
    const conn = await cached.promise;
    cached!.conn = conn;
    return conn;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }
} 