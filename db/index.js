import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

let db;

export async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export function getDB() {
  return db;
}

