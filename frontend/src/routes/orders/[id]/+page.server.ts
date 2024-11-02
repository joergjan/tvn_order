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
        id: Number(params.id),
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
                    id: true,
                  },
                },
              },
            },
            id: true,
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
                    id: true,
                  },
                },
              },
            },
            id: true,
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
  deleteOrder: async ({ request, locals }) => {
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
  updateOrder: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.order.update({
        where: { id: Number(formData.id) },
        data: {
          updatedOn: new Date(Date.now()),
          table: {
            id: Number(formData.table),
          },
        },
      });
    } catch (err) {
      console.error("Error deleting order", err);
      return fail(500, { message: "Failed to delete order" });
    }
  },
};
