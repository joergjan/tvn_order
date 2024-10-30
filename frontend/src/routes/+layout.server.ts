import type { Actions, LayoutServerLoad } from "./$types";
import { prismaClient } from "$lib/server/db/prisma";

export const load: LayoutServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  if (session?.user) {
    const getTables = async () => {
      const tables = await prismaClient.table.findMany({
        include: {
          order: true,
        },
      });
      return tables;
    };

    const getMenus = async () => {
      const menus = await prismaClient.menu.findMany({
        include: {
          order: true,
        },
      });
      return menus;
    };

    const getDrinks = async () => {
      const drinks = await prismaClient.drink.findMany({
        include: {
          order: true,
        },
      });
      return drinks;
    };

    const getMyTable = async () => {
      const table = await prismaClient.user.findFirst({
        where: {
          id: session.user.userId,
        },
        include: {
          table: true,
        },
      });

      return table?.tableId;
    };

    return {
      tables: await getTables(),
      menus: await getMenus(),
      drinks: await getDrinks(),
      isAdmin: session.user.isAdmin,
      username: session.user.username,
      userId: session.user.userId,
      myTable: await getMyTable(),
    };
  }
};
