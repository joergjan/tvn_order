import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/login");
  }

  try {
    const order: Order = await prismaClient.order.findUnique({
      where: {
        id: Number(params.orderId),
      },
      include: {
        table: {
          select: {
            name: true,
          },
        },
        orderedMenus: {
          select: {
            menuOrder: {
              select: {
                amount: true,
                menu: {},
              },
            },
          },
        },
        orderedDrinks: {
          select: {
            drinkOrder: {
              select: {
                amount: true,
                drink: {},
              },
            },
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (order.printed) {
      redirect(302, "/");
    }

    return {
      order: order,
    };
  } catch {
    return {};
  }
};

export const actions: Actions = {
  updateTable: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    let order: Order;

    try {
      order = await prismaClient.order.update({
        where: {
          id: Number(params.orderId),
        },
        data: {
          table: {
            connect: {
              id: Number(formData.table),
            },
          },
        },
      });
    } catch (err) {
      console.error("Error creating new Order:", err);
      return fail(500, { message: "Failed to create new Order" });
    }
  },
  updateMenus: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    const menuOrders = Object.keys(formData)
      .filter((key) => key.startsWith("menuCount")) // no check for amount
      .map((key) => ({
        menuId: key.slice(9), // remove 'menuCount' prefix to get the ID
        amount: Number(formData[key]), // convert to Number
      }));

    let order: Order;

    try {
      order = await prismaClient.order.update({
        where: {
          id: Number(params.orderId),
        },
        data: {
          orderedMenus: {
            update: {
              menuOrder: {
                deleteMany: {},
                create: menuOrders.map(({ menuId, amount }) => ({
                  menu: {
                    connect: {
                      id: Number(menuId),
                    },
                  },
                  amount: Number(amount),
                })),
              },
            },
          },
        },
      });
    } catch (err) {
      console.error("Error creating new Order:", err);
      return fail(500, { message: "Failed to create new Order" });
    }
  },
  updateDrinks: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    const drinkOrders = Object.keys(formData)
      .filter((key) => key.startsWith("drinkCount")) // no check for amount
      .map((key) => ({
        drinkId: key.slice(10), // remove 'drinkCount' prefix to get the ID
        amount: Number(formData[key]), // convert to Number
      }));

    let order: Order;

    try {
      order = await prismaClient.order.update({
        where: {
          id: Number(params.orderId),
        },
        data: {
          orderedDrinks: {
            update: {
              drinkOrder: {
                deleteMany: {},
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
          },
        },
      });
    } catch (err) {
      console.error("Error creating new Order:", err);
      return fail(500, { message: "Failed to create new Order" });
    }
  },
  updateName: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    let order: Order;

    try {
      order = await prismaClient.order.update({
        where: {
          id: Number(params.orderId),
        },
        data: {
          name: (formData.name as string) || "",
        },
      });
    } catch (err) {
      console.error("Error creating new Order:", err);
      return fail(500, { message: "Failed to create new Order" });
    }
  },
};
