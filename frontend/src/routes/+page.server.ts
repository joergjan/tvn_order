import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/login");
  }
};

export const actions: Actions = {
  createOrder: async ({ request, locals }) => {
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
      order = await prismaClient.order.create({
        data: {
          name: (formData.name as string) || "",
          table: {
            connect: {
              id: Number(formData.table),
            },
          },
          row: {
            connect: {
              id: Number(formData.row),
            },
          },
          user: {
            connect: {
              id: session.user.userId as string,
            },
          },
          comment: (formData.comment as string) || "",
          orderedMenus: {
            create: {
              menuOrder: {
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
          orderedDrinks: {
            create: {
              drinkOrder: {
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
        include: {
          table: {
            select: {
              name: true,
            },
          },
          row: {
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

      return {
        success: true,
        order: order,
        message: "Bestellung erfolgreich erstellt",
      };
      return {};
    } catch (err) {
      console.error("Error creating new Order:", err);
      return fail(500, {
        message: "Fehler: Bestellung konnte nicht gespeichert werden",
      });
    }
  },
};
