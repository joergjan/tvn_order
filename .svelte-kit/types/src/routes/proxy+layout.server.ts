// @ts-nocheck
import type { LayoutServerLoad } from "./$types";

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
    const session = await locals.auth.validate();

    if (session?.user) {
        return {
            isAdmin: session.user.isAdmin,
            username: session.user.username,
        };
    }
};
