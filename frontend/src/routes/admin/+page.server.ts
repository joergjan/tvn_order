import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "../$types";
import { prismaClient } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  /*
  if (!session?.user.isAdmin) {
    throw redirect(302, "/login");
  } 
 */

  const getUsers = async () => {
    const users: User[] = await prismaClient.user.findMany({});
    return users;
  };

  return {
    users: await getUsers(),
  };
};

export const actions: Actions = {
  createTable: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const table = await prismaClient.table.create({
        data: {
          name: (formData.name as string) || "",
        },
      });

      return {
        success: true,
        message: `Tisch ${table.name} erfasst`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  updateTable: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const table = await prismaClient.table.update({
        where: { id: Number(formData.id) },
        data: {
          name: (formData.name as string) || "",
        },
      });

      return {
        success: true,
        message: `Tisch ${table.name} aktualisiert`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  deleteTable: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const table = await prismaClient.table.delete({
        where: { id: Number(formData.id) },
      });

      return {
        success: true,
        message: `Tisch ${table.name} wurde wurde gelöscht`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  updateUser: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    const id = formData.id as string;

    try {
      const user = await prismaClient.user.update({
        where: { id: id },
        data: {
          isAdmin: formData.isAdmin === "on",
        },
      });
      return {
        success: true,
        message: `Benutzer ${user.username} aktualisiert`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  deleteUser: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());
    const id = formData.id as string;

    try {
      const user = await prismaClient.user.delete({
        where: { id: id },
      });

      return {
        success: true,
        message: `Benutzer ${user.username} wurde gelöscht`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  createDrink: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const drink = await prismaClient.drink.create({
        data: {
          name: (formData.name as string) || "",
          price: Number(formData.price),
        },
      });

      return {
        success: true,
        message: `Getränk ${drink.name} erfasst`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  updateDrink: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    console.log(formData);

    try {
      const drink = await prismaClient.drink.update({
        where: { id: Number(formData.id) },
        data: {
          name: (formData.name as string) || "",
          price: Number(formData.price),
        },
      });

      return {
        success: true,
        message: `Getränk ${drink.name} aktualisiert`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  deleteDrink: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const drink = await prismaClient.drink.delete({
        where: { id: Number(formData.id) },
      });

      return {
        success: true,
        message: `Getränk ${drink.name} wurde gelöscht`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  createMenu: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const menu = await prismaClient.menu.create({
        data: {
          name: (formData.name as string) || "",
          price: Number(formData.price),
        },
      });

      return {
        success: true,
        message: `Menu ${menu.name} erfasst`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  updateMenu: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const menu = await prismaClient.menu.update({
        where: { id: Number(formData.id) },
        data: {
          name: (formData.name as string) || "",
          price: Number(formData.price),
        },
      });

      return {
        success: true,
        message: `Menu ${menu.name} aktualisiert`,
      };
    } catch (e) {
      console.error("Failed to update drink" + e);
      return fail(500, { message: "Failed to update drink" });
    }
  },
  deleteMenu: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const menu = await prismaClient.menu.delete({
        where: { id: Number(formData.id) },
      });

      return {
        success: true,
        message: `Menu ${menu.name} wurde gelöscht`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  fetchErrors: async () => {
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
