// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Redis from "ioredis";
import type { Prisma as PrismaType } from "@prisma/client";

const { KV_URL } = process.env;
const redis = new Redis(KV_URL!, {
  maxRetriesPerRequest: 1,
  connectTimeout: 10000,
  tls: {
    rejectUnauthorized: true,
  },
});

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

const cacheMiddleware: PrismaType.Middleware = createPrismaRedisCache({
  models: [{ model: "Level" }],
  storage: {
    type: "redis",
    options: {
      client: redis,
      invalidation: { referencesTTL: 300 },
      log: console,
    },
  },
  cacheTime: 3600,
  onHit: (key) => {
    console.log("hit", key);
  },
  onMiss: (key) => {
    console.log("miss", key);
  },
  onError: (key) => {
    console.log("error", key);
  },
});

prisma.$use(cacheMiddleware);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
