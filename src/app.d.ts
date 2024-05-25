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
      isAdmin: boolean;
      userId: string;
    };
    type PageData = {
      table?: Table[];
      menu?: Menu[];
      drink?: Drink[];
    };
    type DatabaseSessionAttributes = {};
  }

  type Table = {
    id: number;
    name: string;
    order?: Order[];
  };

  type Order = {
    id: number;
    table: Table;
    tableId: number;
    time: Date;
    status?: Status;
    statusId?: number;
    menu?: Menu[];
    user: User;
    userId?: string;
    drink?: Drink[];
  };

  type Status = {
    id: number;
    name: string;
    order?: Order[];
  };

  type Menu = {
    id: number;
    name: string;
    price: number;
    order?: Order;
    orderId?: number;
  };

  type Drink = {
    id: number;
    name: string;
    price: number;
    order?: Order;
    orderId?: number;
  };

  type User = {
    id: string;
    username: string;
    isAdmin: boolean;
    order?: Order;
    key?: Key[];
    auth_session?: Session[];
  };

  type Session = {
    id: string;
    user_id: string;
    active_expires: bigint;
    idle_expires: bigint;
    user: User;
  };

  type Key = {
    id: string;
    hashed_password?: string;
    user_id: string;
    user: User;
  };
}

export {};
