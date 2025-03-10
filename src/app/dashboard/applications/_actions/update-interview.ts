'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '~/db';
import { interviewsTable } from '~/db/schema';
import { actionClient } from '~/lib/safe-action';
import { updateInterviewSchema } from '~/schemas';
import { getUser } from '~/utils/get-user';

import { authInterview } from './auth-interview';

export const updateInterview = actionClient
	.schema(updateInterviewSchema)
	.action(async ({ parsedInput }) => {
		const user = await getUser();
		if (!user) throw new Error('User not found');

		await authInterview(parsedInput.id, user.id);

		await db
			.update(interviewsTable)
			.set(parsedInput)
			.where(eq(interviewsTable.id, parsedInput.id));

		revalidatePath('/dashboard/applications/[id]', 'page');
		return { success: true };
	});
