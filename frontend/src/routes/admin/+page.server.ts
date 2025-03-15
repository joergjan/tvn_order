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
  createRow: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const row = await prismaClient.row.create({
        data: {
          name: (formData.name as string) || "",
        },
      });

      return {
        success: true,
        message: `Reihe ${row.name} erfasst`,
      };
    } catch (e) {
      console.error("Failed to create new row" + e);
      return fail(500, { message: e.message });
    }
  },
  updateRow: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const row = await prismaClient.row.update({
        where: { id: Number(formData.id) },
        data: {
          name: (formData.name as string) || "",
        },
      });

      return {
        success: true,
        message: `Reihe ${row.name} aktualisiert`,
      };
    } catch (e) {
      console.error("Failed to create new row" + e);
      return fail(500, { message: e.message });
    }
  },
  deleteRow: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      const row = await prismaClient.row.delete({
        where: { id: Number(formData.id) },
      });

      return {
        success: true,
        message: `Reihe ${row.name} wurde wurde gelöscht`,
      };
    } catch (e) {
      console.error("Failed to delete row " + e);

      if (e.code === "P2003") {
        return fail(500, {
          message:
            "Diese Reihe kann nicht gelöscht werden, da Bestellungen dafür bestehen.",
        });
      }

      return fail(500, { message: e.message });
    }
  },
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
          rowId: Number(formData.rowId),
        },
        include: {
          row: true,
        },
      });

      return {
        success: true,
        message: `Tisch ${table.name} erfasst für Reihe ${table.row.name}`,
      };
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: e.message });
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
      return fail(500, { message: e.message });
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
      console.error("Failed to delete Table " + e);

      if (e.code === "P2003") {
        return fail(500, {
          message:
            "Dieser Tisch kann nicht gelöscht werden, da Bestellungen dafür bestehen.",
        });
      }

      return fail(500, { message: e.message });
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
      console.error("Failed to update User" + e);
      return fail(500, { message: e.message });
    }
  },
  deleteUser: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());
    const id = formData.id as string;

    let user: User;

    try {
      user = await prismaClient.user.delete({
        where: { id: id },
      });

      return {
        success: true,
        message: `Benutzer ${user.username} wurde gelöscht`,
      };
    } catch (e) {
      console.error("Failed to delete user" + e);

      if (e.code === "P2003") {
        return fail(500, {
          message: `Dieser Benutzer kann nicht gelöscht werden, da er bereits Bestellungen erfasst hat.`,
        });
      }

      return fail(500, { message: e.message });
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
      return fail(500, { message: e.message });
    }
  },
  updateDrink: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

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
      return fail(500, { message: e.message });
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

      return fail(500, { message: e.message });
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
      return fail(500, { message: e.message });
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
      return fail(500, { message: e.message });
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

      return fail(500, { message: e.message });
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
