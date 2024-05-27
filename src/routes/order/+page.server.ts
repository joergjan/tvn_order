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

    console.log(formData);

    let order: Order;

    try {
      order = await prismaClient.order.create({
        data: {
          tableId: Number(formData.table),
          user: {
            connect: {
              id: session.user.userId,
            },
          },
        },
      });
    } catch (err) {
      console.error("Error creating new Person:", err);
      return fail(500, { message: "Failed to create new Person" });
    }
  },
};

const getMenues = async () => {
  const menues = await prismaClient.menu.findMany({
    include: {
      order: true,
    },
  });
  return menues;
};

const getDrinks = async () => {
  const drinks = await prismaClient.drink.findMany({
    include: {
      order: true,
    },
  });
  return drinks;
};

const drinks = await getDrinks();
const menues = await getMenues();
