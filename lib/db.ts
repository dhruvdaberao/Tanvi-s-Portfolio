import { MongoClient, Db } from "mongodb";

function getMongoUri() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("Missing MONGO_URI environment variable");
  }

  return uri;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(getMongoUri());
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const mongoClient = await connectDB();
  return mongoClient.db();
}

export async function connectDB(): Promise<MongoClient> {
  return clientPromise;
}
