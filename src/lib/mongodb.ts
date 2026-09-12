import { setServers } from "node:dns";
import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "career-skill-tree";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

// 일부 Windows 네트워크에서는 Node.js의 기본 DNS가 Atlas SRV 조회를
// ECONNREFUSED로 거부합니다. 앱 프로세스에서만 공용 DNS를 사용합니다.
if (process.platform === "win32") {
  setServers(["1.1.1.1", "8.8.8.8"]);
}

export function getMongoClient(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");

  if (process.env.NODE_ENV === "development") {
    global.mongoClientPromise ??= new MongoClient(uri).connect().catch((error) => {
      global.mongoClientPromise = undefined;
      throw error;
    });
    return global.mongoClientPromise;
  }

  clientPromise ??= new MongoClient(uri).connect().catch((error) => {
    clientPromise = null;
    throw error;
  });
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  return (await getMongoClient()).db(databaseName);
}
