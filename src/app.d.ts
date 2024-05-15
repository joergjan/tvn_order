/// <reference types="svelte-adapter-azure-swa" />
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            auth: import("lucia").AuthRequest;
        }
        // interface PageData {}
        // interface Platform {}
    }

    var __prisma: PrismaClient;

    /// <reference types="lucia-auth" />
    declare namespace Lucia {
        type Auth = import("$lib/server/db/lucia").Auth;
        type UserAttributes = {
            username: string;
            name: string;
        };
        type DatabaseSessionAttributes = {};
    }

    type User = {
        id: string;
        username: string;
        isAdmin: boolean;
    };

    type Session = {
        id: string;
        user_id: string;
        active_expires: bigint;
        idle_expires: bigint;
    };

    type Key = {
        id: string;
        hashed_password: string | null;
        user_id: string;
    };
}

export {};
