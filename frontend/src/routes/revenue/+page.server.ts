import { prismaClient } from "$lib/server/db/prisma";
import { Prisma } from "@prisma/client";
import type { PageServerLoad } from "../$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  if (!session?.user.isAdmin) {
    throw redirect(302, "/login");
  }

  try {
    // Fetch the total amount of all ordered menus
    const menuEarningsByType: {
      menu_name: string;
      total_earnings: number;
      total_sold: number;
    }[] = await prismaClient.$queryRaw(
      Prisma.sql`SELECT m.name AS menu_name, 
                         SUM(mo.amount * m.price) AS total_earnings, 
                         SUM(mo.amount) AS total_sold
                  FROM MenuOrder mo 
                  JOIN Menu m ON mo.menuId = m.id 
                  GROUP BY m.id`
    );

    const drinkEarningsByType: {
      drink_name: string;
      total_earnings: number;
      total_sold: number;
    }[] = await prismaClient.$queryRaw(
      Prisma.sql`SELECT d.name AS drink_name, SUM(do.amount * d.price) AS total_earnings,
       SUM(do.amount) AS total_sold 
                 FROM DrinkOrder do 
                 JOIN Drink d ON do.drinkId = d.id 
                 GROUP BY d.id`
    );

    const totalMenuEarnings = menuEarningsByType.reduce(
      (sum, menu) => sum + menu.total_earnings,
      0
    );

    const totalDrinkEarnings = drinkEarningsByType.reduce(
      (sum, drink) => sum + drink.total_earnings,
      0
    );

    const totalAmount = totalMenuEarnings + totalDrinkEarnings;

    return {
      menuEarningsByType: menuEarningsByType,
      drinkEarningsByType: drinkEarningsByType,
      totalAmount,
    };
  } catch (err) {
    console.error("Error fetching total amounts:", err);
    return {
      error: "Failed to fetch total amounts",
    };
  }
};
