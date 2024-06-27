import "dotenv/config";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { config } from "dotenv";
import { recreatePrismaInstance } from "@/infra/database/prisma";

config({ path: ".env.test", override: true });

let prisma: ReturnType<typeof recreatePrismaInstance>;

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  prisma = recreatePrismaInstance();

  execSync(`export DATABASE_URL=${databaseURL} && npx prisma migrate deploy`);
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`); // To see the alternative database, comment out this line and check it in DBeaver.
  await prisma.$disconnect();
});
