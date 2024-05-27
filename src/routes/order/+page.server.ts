import type { Actions, PageServerLoad } from "../$types";
import { fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/login");
  }
};

export const actions: Actions = {
  chooseTable: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.user.update({
        where: { id: session.user.userId },
        data: {
          tableId: Number(formData.table),
        },
      });
    } catch (err) {
      console.error("Error creating new Person:", err);
      return fail(500, { message: "Failed to create new Person" });
    }
  },
  createOrder: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    // Extract menu and drink orders from formData
    const menuOrders = Object.keys(formData)
      .filter((key) => key.startsWith("menuCount") && formData[key])
      .map((key) => ({
        menuId: key.slice(9), // remove 'menuCount' prefix to get the ID
        amount: formData[key],
      }));

    const drinkOrders = Object.keys(formData)
      .filter((key) => key.startsWith("drinkCount") && formData[key])
      .map((key) => ({
        drinkId: key.slice(10), // remove 'drinkCount' prefix to get the ID
        amount: formData[key],
      }));

    let order: Order;

    try {
      order = await prismaClient.order.create({
        data: {
          table: {
            connect: {
              id: Number(formData.table),
            },
          },
          user: {
            connect: {
              id: session.user.userId as string,
            },
          },
          MenuOrder: {
            create: menuOrders.map(({ menuId, amount }) => ({
              menu: {
                connect: {
                  id: Number(menuId),
                },
              },
              amount: Number(amount),
            })),
          },
          DrinkOrder: {
            create: drinkOrders.map(({ drinkId, amount }) => ({
              drink: {
                connect: {
                  id: Number(drinkId),
                },
              },
              amount: Number(amount),
            })),
          },
        },
      });
    } catch (err) {
      console.error("Error creating new Order:", err);
      return fail(500, { message: "Failed to create new Order" });
    }
  },
};
