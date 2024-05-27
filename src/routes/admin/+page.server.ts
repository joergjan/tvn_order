import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "../$types";
import { prismaClient } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session?.user.isAdmin) {
    throw redirect(302, "/login");
  }

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
      await prismaClient.table.create({
        data: {
          name: (formData.name as string) || "",
        },
      });
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
      await prismaClient.table.update({
        where: { id: Number(formData.id) },
        data: {
          name: (formData.name as string) || "",
        },
      });
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
      await prismaClient.table.delete({
        where: { id: Number(formData.id) },
      });
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
      await prismaClient.user.update({
        where: { id: id },
        data: {
          isAdmin: formData.isAdmin === "false",
        },
      });
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
      await prismaClient.user.delete({
        where: { id: id },
      });
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
      await prismaClient.drink.create({
        data: {
          name: (formData.name as string) || "",
          price: Number(formData.price),
        },
      });
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

    try {
      await prismaClient.drink.update({
        where: { id: Number(formData.id) },
        data: {
          name: (formData.name as string) || "",
          price: Number(formData.price),
        },
      });
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
      await prismaClient.drink.delete({
        where: { id: Number(formData.id) },
      });
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
      await prismaClient.menu.create({
        data: {
          name: (formData.name as string) || "",
          price: Number(formData.price),
        },
      });
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
      await prismaClient.menu.update({
        where: { id: Number(formData.id) },
        data: {
          name: (formData.name as string) || "",
          price: Number(formData.price),
        },
      });
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  deleteMenu: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.menu.delete({
        where: { id: Number(formData.id) },
      });
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  createStatus: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.status.create({
        data: {
          name: (formData.name as string) || "",
        },
      });
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  updateStatus: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.status.update({
        where: { id: Number(formData.id) },
        data: {
          name: (formData.name as string) || "",
        },
      });
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
  deleteStatus: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    try {
      await prismaClient.status.delete({
        where: { id: Number(formData.id) },
      });
    } catch (e) {
      console.error("Failed to create new Table" + e);
      return fail(500, { message: "Failed to create new Table" });
    }
  },
};
