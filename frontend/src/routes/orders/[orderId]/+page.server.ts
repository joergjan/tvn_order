import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/login");
  }

  try {
    const order = await prismaClient.order.findUnique({
      where: {
        id: Number(params.orderId),
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
      order: order,
    };
  } catch {
    return fail(500, {
      message: "Ein Fehler ist aufgetreten",
    });
  }
};

export const actions: Actions = {
  updateRow: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    let order: Order;

    try {
      order = await prismaClient.order.findUnique({
        where: {
          id: Number(params.orderId),
        },
      });
    } catch (err) {
      console.error("Error finding Order:", err);
      return fail(500, { message: "Bestellung konnte nicht gefunden werden" });
    }

    if (!order.printed) {
      try {
        await prismaClient.order.update({
          where: {
            id: Number(params.orderId),
          },
          data: {
            updatedOn: new Date(),
            row: {
              connect: {
                id: Number(formData.row),
              },
            },
          },
        });

        return {
          success: true,
          message: "Reihe wurde aktualisiert",
          order: order,
        };
      } catch (err) {
        console.error("Error updating row:", err);
        return fail(500, {
          message: "Reihe konnte nicht aktualisiert werden:",
        });
      }
    } else {
      return fail(405, {
        message: "Fehler: Bestellung wurde bereits gedruckt",
      });
    }
  },
  updateTable: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    let order: Order;

    try {
      order = await prismaClient.order.findUnique({
        where: {
          id: Number(params.orderId),
        },
      });
    } catch (err) {
      console.error("Error updateing table:", err);
      return fail(500, { message: "Bestellung konnte nicht gefunden werden." });
    }

    if (!order.printed) {
      try {
        await prismaClient.order.update({
          where: {
            id: Number(params.orderId),
          },
          data: {
            updatedOn: new Date(),
            table: {
              connect: {
                id: Number(formData.table),
              },
            },
          },
        });

        return {
          success: true,
          message: "Tisch wurde aktualisiert",
          order: order,
        };
      } catch (err) {
        console.error("Error updating table:", err);
        return fail(500, {
          message: "Tisch konnte nicht aktualisiert werden:",
        });
      }
    } else {
      return fail(405, {
        message: "Fehler: Bestellung wurde bereits gedruckt",
      });
    }
  },
  updateMenus: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    const menuOrders = Object.keys(formData)
      .filter((key) => key.startsWith("menuCount")) // no check for amount
      .map((key) => ({
        menuId: key.slice(9), // remove 'menuCount' prefix to get the ID
        amount: Number(formData[key]), // convert to Number
      }));

    let order: Order;

    try {
      order = await prismaClient.order.findUnique({
        where: {
          id: Number(params.orderId),
        },
      });
    } catch (err) {
      console.error("Error finding Order:", err);
      return fail(500, { message: "Bestellung konnte nicht gefunden werden" });
    }

    if (!order.printed) {
      try {
        order = await prismaClient.order.update({
          where: {
            id: Number(params.orderId),
          },
          data: {
            updatedOn: new Date(),
            orderedMenus: {
              update: {
                menuOrder: {
                  deleteMany: {},
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
          },
        });

        return {
          success: true,
          message: "Menus wurden aktualisiert",
          order: order,
        };
      } catch (err) {
        console.error("Error updating menus:", err);
        return fail(500, {
          message: "Menus konnten nicht aktualisiert werden" + err,
        });
      }
    } else {
      return fail(405, {
        message: "Fehler: Bestellung wurde bereits gedruckt",
      });
    }
  },
  updateDrinks: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    const drinkOrders = Object.keys(formData)
      .filter((key) => key.startsWith("drinkCount")) // no check for amount
      .map((key) => ({
        drinkId: key.slice(10), // remove 'drinkCount' prefix to get the ID
        amount: Number(formData[key]), // convert to Number
      }));

    let order: Order;

    try {
      order = await prismaClient.order.findUnique({
        where: {
          id: Number(params.orderId),
        },
      });
    } catch (err) {
      console.error("Error finding Order:", err);
      return fail(500, { message: "Bestellung konnte nicht gefunden werden" });
    }

    if (!order.printed) {
      try {
        order = await prismaClient.order.update({
          where: {
            id: Number(params.orderId),
          },
          data: {
            updatedOn: new Date(),
            orderedDrinks: {
              update: {
                drinkOrder: {
                  deleteMany: {},
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
        });

        return {
          success: true,
          message: "Getränke wurden aktualisiert",
          order: order,
        };
      } catch (err) {
        console.error("Error updating drinks:", err);
        return fail(500, {
          message: "Getränke konnten nicht aktualisiert werden" + err,
        });
      }
    } else {
      return fail(405, {
        message: "Fehler: Bestellung wurde bereits gedruckt",
      });
    }
  },
  updateName: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    let order;

    try {
      order = await prismaClient.order.findUnique({
        where: {
          id: Number(params.orderId),
        },
      });
    } catch (err) {
      console.error("Error finding Order:", err);
      return fail(500, { message: "Bestellung konnte nicht gefunden werden" });
    }

    if (!order.printed) {
      try {
        order = await prismaClient.order.update({
          where: {
            id: Number(params.orderId),
          },
          data: {
            updatedOn: new Date(),
            name: (formData.name as string) || "",
          },
        });

        return {
          success: true,
          message: "Name wurde aktualisiert",
          order: order,
        };
      } catch (err) {
        console.error("Error updating Name:", err);
        return fail(500, {
          message: "Name konnten nicht aktualisiert werden" + err,
        });
      }
    } else {
      return fail(405, {
        message: "Fehler: Bestellung wurde bereits gedruckt",
      });
    }
  },
  updateComment: async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    const formData = Object.fromEntries(await request.formData());

    let order: Order;

    try {
      order = await prismaClient.order.findUnique({
        where: {
          id: Number(params.orderId),
        },
      });
    } catch (err) {
      console.error("Error finding Order:", err);
      return fail(500, { message: "Bestellung konnte nicht gefunden werden" });
    }

    if (!order.printed) {
      try {
        order = await prismaClient.order.update({
          where: {
            id: Number(params.orderId),
          },
          data: {
            updatedOn: new Date(),
            comment: (formData.comment as string) || "",
          },
        });

        return {
          success: true,
          message: "Spezialwünsche wurden aktualisiert",
          order: order,
        };
      } catch (err) {
        console.error("Error updating comment: ", err);
        return fail(500, {
          message: "Spezialwünsche konnten nicht aktualisiert werden" + err,
        });
      }
    } else {
      return fail(405, {
        message: "Fehler: Bestellung wurde bereits gedruckt",
      });
    }
  },
};
