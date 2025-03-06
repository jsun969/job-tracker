'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '~/db';
import { applicationsTable } from '~/db/schema';
import { actionClient } from '~/lib/safe-action';
import { updateApplicationSchema } from '~/schemas';
import { getUser } from '~/utils/get-user';

export const updateApplication = actionClient
	.schema(updateApplicationSchema)
	.action(async ({ parsedInput }) => {
		const user = await getUser();
		if (!user) throw new Error('User not found');

		const res = await db
			.update(applicationsTable)
			.set(parsedInput)
			.where(
				and(
					eq(applicationsTable.id, parsedInput.id),
					eq(applicationsTable.userId, user.id),
				),
			)
			.returning();

		if (res.length === 0) {
			throw new Error('Application not found or unauthorized');
		}

		revalidatePath('/dashboard/applications/[id]', 'page');
		return { success: true };
	});
