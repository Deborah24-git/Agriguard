import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalCache = globalThis as unknown as { agriguardMongo?: ConnectionCache };
const cached: ConnectionCache = (globalCache.agriguardMongo ??= {
  conn: null,
  promise: null,
});

/** One shared connection per process, including hot reload. */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  cached.promise ??= mongoose.connect(MONGODB_URI, { bufferCommands: false });
  cached.conn = await cached.promise;
  return cached.conn;
}
