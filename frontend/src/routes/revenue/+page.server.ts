import { prismaClient } from "$lib/server/db/prisma";
import { Prisma } from "@prisma/client";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async () => {
  try {
    // Fetch the total amount of all ordered menus
    const totalMenuAmount: { total_earnings: number }[] =
      await prismaClient.$queryRaw(
        Prisma.sql`SELECT SUM(mo.amount * m.price) AS total_earnings FROM MenuOrder mo JOIN Menu m ON mo.menuId = m.id`
      );

    const totalDrinkAmount: { total_earnings: number }[] =
      await prismaClient.$queryRaw(
        Prisma.sql`SELECT SUM(do.amount * d.price) AS total_earnings FROM DrinkOrder do JOIN Drink d ON mo.menuId = m.id`
      );

    const totalAmount =
      totalDrinkAmount[0].total_earnings + totalMenuAmount[0].total_earnings;

    const ordersAmount = await prismaClient.order.count();

    return {
      totalMenuAmount,
      totalDrinkAmount,
      totalAmount,
      ordersAmount,
    };
  } catch (err) {
    console.error("Error fetching total amounts:", err);
    return {
      error: "Failed to fetch total amounts",
    };
  }
};
