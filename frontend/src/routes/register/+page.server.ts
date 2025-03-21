import { auth } from "$lib/server/db/lucia";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

/*
export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw redirect(302, "/");
    }
};
*/

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { username } = Object.fromEntries(await request.formData()) as Record<
      string,
      string
    >;
    try {
      await auth.createUser({
        key: {
          providerId: "username",
          providerUserId: username,
          password: username,
        },
        attributes: {
          username,
        },
      });

      const key = await auth.useKey("username", username, username);
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {}, // expects `Lucia.DatabaseSessionAttributes`
      });
      locals.auth.setSession(session);

      return { success: true, message: "Registrierung erfolgreich" };
    } catch (err: Error | any) {
      console.error(err);

      if (err.code == "P2002") {
        return fail(400, {
          message: "Dieser Benutzername exisiert bereits",
        });
      }

      return fail(400, {
        message: "Registrierung nicht erfolgreich. Versuche es erneut",
      });
    }
  },
};
