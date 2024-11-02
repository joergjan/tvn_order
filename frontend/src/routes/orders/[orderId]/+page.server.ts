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
  updateOrder: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    // Extract menu and drink orders from formData
    // Extract menu and drink orders from formData
    const menuOrders = Object.keys(formData)
      .filter((key) => key.startsWith("menuCount")) // no check for amount
      .map((key) => ({
        menuId: key.slice(9), // remove 'menuCount' prefix to get the ID
        amount: Number(formData[key]), // convert to Number
      }));

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
          name: (formData.name as string) || "",
          table: {
            update: {
              id: Number(formData.table),
            },
          },
          user: {
            update: {
              id: session.user.userId as string,
            },
          },
          orderedMenus: {
            update: {
              menuOrder: {
                upsert: menuOrders.map(({ menuId, amount }) => ({
                  where: {
                    menu: {
                      id: Number(menuId),
                    },
                  },
                  menu: {
                    update: {
                      id: Number(menuId),
                    },
                  },
                  amount: Number(amount),
                })),
              },
            },
          },
          orderedDrinks: {
            update: {
              drinkOrder: {
                upsert: drinkOrders.map(({ drinkId, amount }) => ({
                  where: {
                    drink: {
                      id: Number(drinkId),
                    },
                  },
                  drink: {
                    update: {
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
};
