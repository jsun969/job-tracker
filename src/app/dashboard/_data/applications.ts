import { cache } from 'react';

import { ApplicationCategory, ApplicationProcess } from '~/constants';
import { db } from '~/db';

const _getApplication = async (userId: string) => {
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
};
export const getApplication = cache(_getApplication);

export type ApplicationWithMostRecentStatus = Awaited<
	ReturnType<typeof getApplication>
>[number];

export type CategorizedApplications = Record<
	ApplicationCategory,
	Array<ApplicationWithMostRecentStatus>
>;
const _getCategorizedApplications = async (userId: string) => {
	const applications = await _getApplication(userId);

	const categorizedApplications: CategorizedApplications = applications.reduce(
		(acc, application) => {
			let category: ApplicationCategory = 'Closed';
			if (
				application.status === 'Rejected' ||
				application.status === 'Ghosted'
			) {
				category = 'Closed';
			} else if (application.status === 'Offer') {
				category = 'Offer';
			} else {
				const date = application.mostRecentStatus.date;
				const now = new Date();
				if (date > now) {
					category = 'Upcoming';
				} else {
					category = 'Ongoing';
				}
			}
			acc[category].push(application);
			return acc;
		},
		{
			Upcoming: [],
			Ongoing: [],
			Offer: [],
			Closed: [],
		} as CategorizedApplications,
	);
	categorizedApplications.Upcoming.sort(
		(a, b) =>
			a.mostRecentStatus.date.getTime() - b.mostRecentStatus.date.getTime(),
	);
	return categorizedApplications;
};
export const getCategorizedApplications = cache(_getCategorizedApplications);
