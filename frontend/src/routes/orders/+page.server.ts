import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";

export const actions: Actions = {
  deleteOrder: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.order.delete({
        where: { id: Number(formData.id) },
      });

      return { success: true, message: "Bestellung wurde gelöscht" };
    } catch (err) {
      console.error("Error deleting order", err);
      return fail(500, { message: "Bestellung konnte nicht gelöscht werden." });
    }
  },
  searchOrder: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    const tableid = Number(formData.tableid) || null;
    const username = (formData.username as string) || null;
    const printed: boolean = Boolean(formData.printed) || false;

    let orders;

    try {
      if (tableid && username) {
        orders = await prismaClient.order.findMany({
          where: {
            user: {
              username: username,
            },
            table: {
              id: tableid,
            },
            printed: printed,
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
      } else if (tableid) {
        orders = await prismaClient.order.findMany({
          where: {
            table: {
              id: tableid,
            },
            printed: printed,
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
      } else if (username) {
        orders = await prismaClient.order.findMany({
          where: {
            user: {
              username: username,
            },
            printed: printed,
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
      } else {
        orders = await prismaClient.order.findMany({
          where: {
            printed: printed,
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
      }

      return { message: "", type: "success", orders: orders };
    } catch (err) {
      console.error("An error occurred, try again later", err);
      return fail(500, {
        message: "Ein Fehler ist aufgetreten, versuche es später erneut.",
      });
    }
  },
};
