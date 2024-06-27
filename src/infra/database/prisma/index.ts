import { Prisma, PrismaClient } from "@prisma/client";
import kyselyExtension from "prisma-extension-kysely";
import {
  CamelCasePlugin,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "kysely";
import { DB } from "prisma/kysely";

function configurePrisma() {
  const prisma = new PrismaClient<
    Prisma.PrismaClientOptions,
    "query" | "info" | "warn" | "error"
  >({
    log: [
      { level: "query", emit: "event" },
      { level: "info", emit: "event" },
      { level: "warn", emit: "event" },
      { level: "error", emit: "event" },
    ],
  }).$extends(
    kyselyExtension({
      kysely: (driver) =>
        new Kysely<DB>({
          dialect: {
            createDriver: () => driver,
            createAdapter: () => new PostgresAdapter(),
            createIntrospector: (db) => new PostgresIntrospector(db),
            createQueryCompiler: () => new PostgresQueryCompiler(),
          },
          plugins: [new CamelCasePlugin()],
        }),
    }),
  );

  return prisma;
}

export let extendedPrismaClient = configurePrisma();

export function recreatePrismaInstance() {
  extendedPrismaClient.$disconnect();

  extendedPrismaClient = configurePrisma();

  return extendedPrismaClient;
}

export type ExtendedPrismaClient = typeof extendedPrismaClient;
