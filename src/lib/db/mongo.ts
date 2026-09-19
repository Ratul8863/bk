import 'server-only';
import { MongoClient, type Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'bksr';

declare global {
  // eslint-disable-next-line no-var
  var __bksrMongoClientPromise: Promise<MongoClient> | undefined;
}

function createClient(): MongoClient {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  return new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
  });
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export function getMongoClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global.__bksrMongoClientPromise) {
      global.__bksrMongoClientPromise = createClient().connect();
    }
    return global.__bksrMongoClientPromise;
  }

  if (!global.__bksrMongoClientPromise) {
    global.__bksrMongoClientPromise = createClient().connect();
  }
  return global.__bksrMongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(dbName);
}
