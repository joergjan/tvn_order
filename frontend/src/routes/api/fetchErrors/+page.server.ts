import type { Actions } from "./$types";
import { prismaClient } from "$lib/server/db/prisma";

export const actions: Actions = {
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
