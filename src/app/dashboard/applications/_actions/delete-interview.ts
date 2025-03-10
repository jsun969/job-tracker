'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as v from 'valibot';

import { db } from '~/db';
import { interviewsTable } from '~/db/schema';
import { actionClient } from '~/lib/safe-action';
import { getUser } from '~/utils/get-user';

import { authInterview } from './auth-interview';

const schema = v.object({
	id: v.pipe(v.number(), v.integer()),
});

export const deleteInterview = actionClient
	.schema(schema)
	.action(async ({ parsedInput }) => {
		const user = await getUser();
		if (!user) throw new Error('User not found');

		authInterview(parsedInput.id, user.id);

		await db
			.delete(interviewsTable)
			.where(and(eq(interviewsTable.id, parsedInput.id)));

		revalidatePath('/dashboard/applications/[id]', 'page');
		return { success: true };
	});
