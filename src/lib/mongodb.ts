import { Resolver } from "node:dns/promises";
import type { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "career-skill-tree";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

async function resolveWindowsAtlasUri(connectionUri: string) {
  if (process.platform !== "win32" || !connectionUri.startsWith("mongodb+srv://")) {
    return connectionUri;
  }

  const parsed = new URL(connectionUri);
  const resolver = new Resolver();
  resolver.setServers(["1.1.1.1", "8.8.8.8"]);

  const [records, txtRecords] = await Promise.all([
    resolver.resolveSrv(`_mongodb._tcp.${parsed.hostname}`),
    resolver.resolveTxt(parsed.hostname),
  ]);

  const hosts = records.map(({ name, port }) => `${name}:${port}`).join(",");
  const credentials = parsed.username
    ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ""}@`
    : "";
  const params = new URLSearchParams(parsed.searchParams);

  for (const entry of txtRecords.flatMap((record) => record.join("").split("&"))) {
    const [key, value] = entry.split("=");
    if (key && value && !params.has(key)) params.set(key, value);
  }
  params.set("tls", "true");

  return `mongodb://${credentials}${hosts}${parsed.pathname}?${params.toString()}`;
}

async function connectMongoClient(): Promise<MongoClient> {
  const connectionUri = await resolveWindowsAtlasUri(uri!);
  const { MongoClient } = await import("mongodb");
  return new MongoClient(connectionUri).connect();
}

export function getMongoClient(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");

  if (process.env.NODE_ENV === "development") {
    global.mongoClientPromise ??= connectMongoClient().catch((error) => {
      global.mongoClientPromise = undefined;
      throw error;
    });
    return global.mongoClientPromise;
  }

  clientPromise ??= connectMongoClient().catch((error) => {
    clientPromise = null;
    throw error;
  });
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  return (await getMongoClient()).db(databaseName);
}
