import type { LayoutServerLoad } from "./$types";
import { prismaClient } from "$lib/server/db/prisma";

export const load: LayoutServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  if (session?.user) {
    const getRows = async () => {
      const rows = await prismaClient.row.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          table: true,
        },
      });
      return rows;
    };

    const getMenus = async () => {
      const menus = await prismaClient.menu.findMany({
        orderBy: {
          id: "asc",
        },
      });
      return menus;
    };

    const getDrinks = async () => {
      const drinks = await prismaClient.drink.findMany({
        orderBy: {
          id: "asc",
        },
      });
      return drinks;
    };

    const getUsers = async () => {
      const users = await prismaClient.user.findMany({
        orderBy: {
          id: "asc",
        },

        where: {
          NOT: {
            username: "admin",
          },
        },
      });
      return users;
    };

    return {
      rows: await getRows(),
      menus: await getMenus(),
      drinks: await getDrinks(),
      users: await getUsers(),
      isAdmin: session.user.isAdmin,
      username: session.user.username,
      userId: session.user.userId,
    };
  }
};
