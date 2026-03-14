import { MongoClient, Db } from "mongodb";

function getMongoUri() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("Missing MONGO_URI environment variable");
  }

  return uri;
}

let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise() {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(getMongoUri());
      global._mongoClientPromise = client.connect();
    }

    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    const client = new MongoClient(getMongoUri());
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const mongoClient = await getClientPromise();
  return mongoClient.db();
}

export async function connectDB(): Promise<void> {
  await getClientPromise();
}
