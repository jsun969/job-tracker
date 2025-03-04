import { ArrowBigUpDash, Building2, Earth, MapPin } from 'lucide-react';
import { forbidden, notFound } from 'next/navigation';

import { db } from '~/db';
import { getFavicon } from '~/utils/get-favicon';
import { getUser } from '~/utils/get-user';
import { isLink } from '~/utils/is-link';

import { ActionButtons } from './_components/action-buttons';
import { InterviewTimeline } from './_components/interview-timeline';
import { ShareSwitch } from './_components/share-switch';
import { TimelineActions } from './_components/timeline-actions';

const ApplicationDetailPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	const user = await getUser();
	if (!user) return forbidden();

	const application = await db.query.applicationsTable.findFirst({
		where: (application, { eq }) => eq(application.id, id),
	});
	if (!application) return notFound();

	const isApplicant = application.userId === user.id;
	if (!isApplicant && !application.shared) return forbidden();

	const interviews = await db.query.interviewsTable.findMany({
		where: (interview, { eq }) => eq(interview.applicationId, application.id),
		orderBy: (interview, { desc }) => desc(interview.date),
	});
	const isSourceLink = isLink(application.source);

	return (
		<div className="mx-auto max-w-4xl space-y-4 md:space-y-8">
			<div className="flex flex-col gap-4 rounded-xl bg-secondary p-4 md:flex-row md:p-8">
				<div className="grow">
					<div className="flex items-center gap-2">
						{isSourceLink && (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={getFavicon(application.source)}
								alt="Company Logo"
								className="size-6"
							/>
						)}
						<h1 className="text-2xl font-bold">{application.company}</h1>
					</div>
					<h2 className="text-xl font-medium text-muted-foreground">
						{application.jobTitle}
					</h2>
					<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-secondary-foreground *:flex *:items-center *:gap-1">
						<div title="Location">
							<MapPin className="size-4" />
							<span>{application.location}</span>
						</div>
						<div title="Company Type">
							<Building2 className="size-4" />
							<span>{application.companyType}</span>
						</div>
						{application.referred && (
							<div>
								<ArrowBigUpDash className="size-4" />
								<span>Referred</span>
							</div>
						)}
						<div>
							<Earth className="size-4" />
							{isSourceLink ? (
								<a
									className="max-w-64 truncate hover:underline"
									href={application.source}
									target="_blank"
								>
									{application.source}
								</a>
							) : (
								<span className="max-w-64 truncate">{application.source}</span>
							)}
						</div>
					</div>
				</div>
				{isApplicant && (
					<div className="flex justify-between md:flex-col md:items-end">
						<ActionButtons />
						<ShareSwitch shared={application.shared} />
					</div>
				)}
			</div>
			{application.note.length > 0 && (
				<div>
					<h2 className="mb-2 text-xl font-bold">Note</h2>
					<p className="whitespace-pre-wrap text-secondary-foreground">
						{application.note}
					</p>
				</div>
			)}
			<div className="space-y-2">
				<h2 className="text-xl font-bold">Timeline</h2>
				<InterviewTimeline
					interviews={interviews}
					application={application}
					isApplicant={isApplicant}
				/>
				{isApplicant && <TimelineActions />}
			</div>
		</div>
	);
};

export default ApplicationDetailPage;
