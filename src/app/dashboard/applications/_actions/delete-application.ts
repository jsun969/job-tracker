'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as v from 'valibot';

import { db } from '~/db';
import { applicationsTable } from '~/db/schema';
import { actionClient } from '~/lib/safe-action';
import { getUser } from '~/utils/get-user';

const schema = v.object({
	id: v.string(),
});

export const deleteApplication = actionClient
	.schema(schema)
	.action(async ({ parsedInput }) => {
		const user = await getUser();
		if (!user) throw new Error('User not found');

		const res = await db
			.delete(applicationsTable)
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

		revalidatePath('/dashboard/applications');
		return { success: true };
	});
