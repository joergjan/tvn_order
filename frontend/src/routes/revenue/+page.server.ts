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
        Prisma.sql`SELECT SUM(do.amount * d.price) AS total_earnings FROM DrinkOrder do JOIN Drink d ON do.drinkId = d.id`
      );

    const totalAmount =
      totalDrinkAmount[0].total_earnings + totalMenuAmount[0].total_earnings;

    const ordersAmount = await prismaClient.order.count();

    const drinkOrdersAmount = await prismaClient.drinkOrder.aggregate({
      _sum: {
        amount: true,
      },
    });

    const menuOrdersAmount = await prismaClient.menuOrder.aggregate({
      _sum: {
        amount: true,
      },
    });

    return {
      totalMenuAmount: totalMenuAmount[0].total_earnings,
      totalDrinkAmount: totalDrinkAmount[0].total_earnings,
      totalAmount,
      ordersAmount,
      drinkOrdersAmount: drinkOrdersAmount._sum.amount,
      menuOrdersAmount: menuOrdersAmount._sum.amount,
    };
  } catch (err) {
    console.error("Error fetching total amounts:", err);
    return {
      error: "Failed to fetch total amounts",
    };
  }
};
