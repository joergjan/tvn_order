import { prismaClient } from "$lib/server/db/prisma";

import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals }) {
  const session = await locals.auth.validate();

  if (session?.user) {
    const getMenus = async () => {
      const menus = await prismaClient.menu.findMany({});
      return menus;
    };

    const getDrinks = async () => {
      const drinks = await prismaClient.drink.findMany({});
      return drinks;
    };

    return json({
      menus: await getMenus(),
      drinks: await getDrinks(),
    });
  } else {
    return json({
      status: 404,
      message: "Not Found",
    });
  }
}
