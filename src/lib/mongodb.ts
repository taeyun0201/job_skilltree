import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "career-skill-tree";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClient(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");

  if (process.env.NODE_ENV === "development") {
    global.mongoClientPromise ??= new MongoClient(uri).connect();
    return global.mongoClientPromise;
  }

  clientPromise ??= new MongoClient(uri).connect();
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  return (await getMongoClient()).db(databaseName);
}
