// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw redirect(302, "/login");
    }
};
