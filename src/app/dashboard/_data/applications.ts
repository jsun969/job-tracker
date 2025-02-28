import { cache } from 'react';

import { ApplicationProcess } from '~/constants';
import { db } from '~/db';

export const getApplication = cache(async (userId: string) => {
	const applications = await db.query.applicationsTable.findMany({
		where: (applications, { eq }) => eq(applications.userId, userId),
		with: {
			interviews: {
				orderBy: (interviews, { desc }) => desc(interviews.date),
				limit: 1,
			},
		},
	});
	return applications
		.map((app) => {
			let date = app.appliedDate;
			let status: ApplicationProcess = 'Apply';
			if (app.closedDate) {
				date = app.closedDate;
				status = app.status;
			} else if (app.interviews.length > 0) {
				date = app.interviews[0].date;
				status = app.interviews[0].type;
			}
			return { ...app, mostRecentStatus: { date, status } };
		})
		.toSorted(
			(a, b) =>
				b.mostRecentStatus.date.getTime() - a.mostRecentStatus.date.getTime(),
		);
});

export type Application = Awaited<ReturnType<typeof getApplication>>[number];
