import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function makeSureDbIsReady() {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("MONGODB_URI not defined");

  cached.conn = null;
  cached.promise = null;

  cached.promise = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 30000,
  });

  cached.conn = await cached.promise;
  return cached.conn;
}
