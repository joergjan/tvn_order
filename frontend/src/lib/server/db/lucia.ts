// src/lib/server/lucia.ts
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { prisma } from "@lucia-auth/adapter-prisma";
import { prismaClient } from "$lib/server/db/prisma";

export const auth = lucia({
  env: "DEV",
  middleware: sveltekit(),
  adapter: prisma(prismaClient),
  getUserAttributes: (data) => {
    return {
      username: data.username,
      isAdmin: data.isAdmin,
      userId: data.id,
    };
  },
  csrfProtection: false,
  SessionCookieAttributes: {
    sameSite: "none",  
  },
});

export type Auth = typeof auth;
