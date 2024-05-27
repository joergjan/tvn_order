/// <reference types="svelte-adapter-azure-swa" />
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
  User as PrismaUser,
  Table as PrismaTable,
  Menu as PrismaMenu,
  Drink as PrismaDrink,
  Order as PrismaOrder,
  MenuOrder as PrismaMenuOrder,
  DrinkOrder as PrismaDrinkOrder,
  Status as PrismaStatus,
  PaymentStatus as PrismaPaymentStatus,
  Session as PrismaSession,
  Key as PrismaKey,
} from "@prisma/client";

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

  type User = PrismaUser;
  type Table = PrismaTable;
  type Menu = PrismaMenu;
  type Drink = PrismaDrink;
  type Order = PrismaOrder;
  type MenuOrder = PrismaMenuOrder;
  type DrinkOrder = PrismaDrinkOrder;
  type Status = PrismaStatus;
  type PaymentStatus = PrismaPaymentStatus;
  type Session = PrismaSession;
  type Key = PrismaKey;
}

export {};
