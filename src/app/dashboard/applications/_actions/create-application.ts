'use server';

import * as v from 'valibot';

import { db } from '~/db';
import { applicationsTable } from '~/db/schema';
import { actionClient } from '~/lib/safe-action';
import { insertApplicationSchema } from '~/schemas';
import { getUser } from '~/utils/get-user';

const schema = v.omit(insertApplicationSchema, ['userId']);

export const createApplication = actionClient
	.schema(schema)
	.action(async ({ parsedInput }) => {
		const user = await getUser();
		if (!user) throw new Error('User not found');

		await db
			.insert(applicationsTable)
			.values({ ...parsedInput, userId: user.id });

		return { success: true };
	});
