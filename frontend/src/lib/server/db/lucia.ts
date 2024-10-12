// src/lib/server/lucia.ts
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { prisma } from "@lucia-auth/adapter-prisma";
import { prismaClient } from "$lib/server/db/prisma";

export const auth = lucia({
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  adapter: prisma(prismaClient),
  getUserAttributes: (data) => {
    return {
      username: data.username,
      isAdmin: data.isAdmin,
      userId: data.id,
    };
  },
  sessionExpiresIn: {
    activePeriod: 43200000,
    idlePeriod: 604800000,
  },
});

export type Auth = typeof auth;
