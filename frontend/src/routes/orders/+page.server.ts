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

    const tableid = Number(formData.tableid);
    const userid = formData.userid as string;

    const result = await searchOrdersHelper({
      tableid,
      userid,
    });

    if ("type" in result && "orders" in result) {
      const { message, type, orders } = result;
      return { message, type, orders };
    } else if ("message" in result) {
      const { message } = result;
      return fail(500, {
        message: "Ein Fehler ist aufgetreten, versuche es später erneut.",
      });
    }
  },
  changePrintStatus: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(302, "/");
    }

    if (!session.user.isAdmin) {
      return fail(403, {
        message: "Nur Administratoren können den Status auf gedruckt ändern.",
      });
    }

    const formData = Object.fromEntries(await request.formData());

    const tableid = Number(formData.tableid);
    const userid = formData.userid as string;

    console.log(userid, tableid);

    try {
      const order = await prismaClient.order.update({
        where: { id: Number(formData.id) },
        data: {
          printed: true,
        },
      });

      const result = await searchOrdersHelper({
        tableid,
        userid,
      });

      if ("type" in result && "orders" in result) {
        const { message, type, orders } = result;
        return {
          message: "Der Bestellstatus wurde erfolgreich geändert",
          type,
          orders,
        };
      } else if ("message" in result) {
        const { message } = result;
        return fail(500, {
          message,
        });
      }
    } catch (err) {
      console.error("Error changing order status", err);
      return fail(500, {
        message: "Bestellstatus konnte nicht geändert werden.",
      });
    }
  },
};

async function searchOrdersHelper({
  tableid,
  userid,
}: {
  tableid: number;
  userid: string;
}) {
  let orders;
  try {
    if (tableid && userid) {
      orders = await prismaClient.order.findMany({
        where: {
          user: {
            id: userid,
          },
          table: {
            id: tableid,
          },
        },
        orderBy: {
          updatedOn: "desc",
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
        },
        orderBy: {
          createdOn: "desc",
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
    } else if (userid) {
      orders = await prismaClient.order.findMany({
        where: {
          user: {
            id: userid,
          },
        },
        orderBy: {
          createdOn: "desc",
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
        orderBy: {
          createdOn: "desc",
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
}
