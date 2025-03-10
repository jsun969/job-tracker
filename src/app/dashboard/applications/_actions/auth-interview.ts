import { db } from '~/db';

// TODO: Add user id to application table to avoid 2 queries
export const authInterview = async (interviewId: number, userId: string) => {
	const interview = await db.query.interviewsTable.findFirst({
		where: (interviews, { eq }) => eq(interviews.id, interviewId),
	});
	if (!interview) throw new Error('Interview not found');
	const application = await db.query.applicationsTable.findFirst({
		where: (applications, { eq }) =>
			eq(applications.id, interview.applicationId),
	});
	if (!application) throw new Error('Application not found');
	if (application.userId !== userId) throw new Error('Forbidden');
};
