import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/login");
  }
  const printedOrders: Order[] = await prismaClient.order.findMany({
    where: {
      printed: true,
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
              menu: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      },
      orderedDrinks: {
        select: {
          drinkOrder: {
            select: {
              amount: true,
              drink: {
                select: {
                  name: true,
                  price: true,
                },
              },
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

  const unprintedOrders: Order[] = await prismaClient.order.findMany({
    where: {
      printed: false,
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
              menu: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      },
      orderedDrinks: {
        select: {
          drinkOrder: {
            select: {
              amount: true,
              drink: {
                select: {
                  name: true,
                  price: true,
                },
              },
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
    printedOrders: printedOrders,
    unprintedOrders: unprintedOrders,
  };
};

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
    } catch (err) {
      console.error("Error deleting order", err);
      return fail(500, { message: "Failed to delete order" });
    }
  },
  updateOrder: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.orderedMenus.delete({
        where: { id: Number(formData.id) },
      });
    } catch (err) {
      console.error("Error deleting order", err);
      return fail(500, { message: "Failed to delete order" });
    }
  },

  fetchErrors: async ({}) => {
    const error = await prismaClient.error.findFirst({
      where: {
        solved: false,
      },
    });
    return {
      error: JSON.stringify(await error),
    };
  },
};
