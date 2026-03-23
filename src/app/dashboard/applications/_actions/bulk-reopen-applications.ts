'use server';

import { and, eq, inArray, notInArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as v from 'valibot';

import { db } from '~/db';
import { applicationsTable } from '~/db/schema';
import { actionClient } from '~/lib/safe-action';
import { getUser } from '~/utils/get-user';

const schema = v.object({
	ids: v.pipe(v.array(v.string()), v.minLength(1)),
});

export const bulkReopenApplications = actionClient
	.schema(schema)
	.action(async ({ parsedInput }) => {
		const user = await getUser();
		if (!user) throw new Error('User not found');

		const updates = await db
			.update(applicationsTable)
			.set({
				status: 'Ongoing',
				closedDate: null,
			})
			.where(
				and(
					inArray(applicationsTable.id, parsedInput.ids),
					eq(applicationsTable.userId, user.id),
					notInArray(applicationsTable.status, ['Ongoing']),
				),
			)
			.returning({ id: applicationsTable.id });

		if (updates.length !== parsedInput.ids.length) {
			throw new Error('Some applications were not found or unauthorized');
		}

		revalidatePath('/dashboard/applications');
		return { success: true, count: updates.length };
	});
