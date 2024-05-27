import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/login");
  }

  const newOrders: Order[] = await prismaClient.order.findMany({
    include: {
      table: {
        select: {
          name: true,
        },
      },
      MenuOrder: {
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
      DrinkOrder: {
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
      user: {
        select: {
          username: true,
        },
      },
    },
    where: {
      status: 1,
    },
  });

  const ready: Order[] = await prismaClient.order.findMany({
    include: {
      table: {
        select: {
          name: true,
        },
      },
      MenuOrder: {
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
      DrinkOrder: {
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
      user: {
        select: {
          username: true,
        },
      },
    },
    where: {
      status: 2,
    },
  });

  return {
    ready: ready,
    newOrders: newOrders,
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
  changeStatusToReady: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.order.update({
        where: { id: Number(formData.id) },
        data: {
          status: 2,
        },
      });
    } catch (err) {
      console.error("Error updating order", err);
      return fail(500, { message: "Failed to update order" });
    }
  },
  changeStatusToServed: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.order.update({
        where: { id: Number(formData.id) },
        data: {
          status: 3,
        },
      });
    } catch (err) {
      console.error("Error updating order", err);
      return fail(500, { message: "Failed to update order" });
    }
  },
  updatePaymentStatus: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.order.update({
        where: { id: Number(formData.id) },
        data: {
          paid: true,
        },
      });
    } catch (err) {
      console.error("Error updating order", err);
      return fail(500, { message: "Failed to update order" });
    }
  },
};
