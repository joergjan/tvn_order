import type { Actions, PageServerLoad } from '../$types';
import { fail, redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/db/prisma';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw redirect(302, '/login');
    }
}

let order: Order

export const actions: Actions = {
    createOrder: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, '/');
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            await prismaClient.order.create({
                data: {

                    table: {
                        connect: {
                            id: parseInt(formData.table)
                        }
                    },
                }
            })

        } catch (err) {
            console.error('Error creating new Person:', err);
            return fail(500, { message: 'Failed to create new Person' });
        }

        throw redirect(302, '/verwaltung');
    }
};
