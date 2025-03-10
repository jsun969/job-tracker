'use server';

import { revalidatePath } from 'next/cache';

import { db } from '~/db';
import { interviewsTable } from '~/db/schema';
import { actionClient } from '~/lib/safe-action';
import { insertInterviewSchema } from '~/schemas';
import { getUser } from '~/utils/get-user';

export const createInterview = actionClient
	.schema(insertInterviewSchema)
	.action(async ({ parsedInput }) => {
		const user = await getUser();
		if (!user) throw new Error('User not found');

		const application = await db.query.applicationsTable.findFirst({
			where: (applications, { eq }) =>
				eq(applications.id, parsedInput.applicationId),
		});
		if (!application) throw new Error('Application not found');
		if (application.userId !== user.id) throw new Error('Forbidden');

		await db.insert(interviewsTable).values(parsedInput);

		revalidatePath('/dashboard/applications/[id]', 'page');

		return { success: true };
	});
