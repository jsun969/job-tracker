'use client';

import { InferSelectModel } from 'drizzle-orm';
import { Edit, Trash2 } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
	APPLICATION_PROCESS_ICONS,
	ApplicationProcess,
	TIME_FORMAT,
} from '~/constants';
import { applicationsTable, interviewsTable } from '~/db/schema';
import { time } from '~/lib/time';
import { humanizeDurationFromNow } from '~/utils/humanize-duration-from-now';
import { cn } from '~/utils/ui';

type Interview = InferSelectModel<typeof interviewsTable>;

interface TimelineItemProps {
	interview: Omit<Interview, 'type'> & { type: ApplicationProcess };
	start?: boolean;
	showEdit?: boolean;
	showDelete?: boolean;
}
export const InterviewTimelineItem = ({
	start,
	interview,
	showEdit,
	showDelete,
}: TimelineItemProps) => {
	const ProcessIcon = APPLICATION_PROCESS_ICONS[interview.type];
	const showActions = showEdit || showDelete;

	return (
		<li
			key={interview.id}
			className={cn(
				'grid grid-cols-[1fr_auto_1fr] items-start gap-4',
				!start && 'min-h-24',
			)}
		>
			<div className="flex flex-col items-end text-end text-sm font-medium text-secondary-foreground">
				<div>{time(interview.date).format(TIME_FORMAT)}</div>
				<div>({humanizeDurationFromNow(interview.date)})</div>
				{showActions && (
					<div className="mt-2 flex gap-1">
						{showDelete && (
							<Button size="smIcon" variant="danger">
								<Trash2 />
							</Button>
						)}
						{showEdit && (
							<Button size="smIcon" variant="outline">
								<Edit />
							</Button>
						)}
					</div>
				)}
			</div>
			<div className="flex h-full flex-col items-center">
				<div className="h-fit w-fit rounded-full bg-primary p-2 text-primary-foreground">
					<ProcessIcon className="size-5" />
				</div>
				{!start && <div className="mt-2 h-full w-0.5 bg-border" />}
			</div>
			<div>
				<h3 className="font-semibold">{interview.type}</h3>
				<p className="text-sm text-secondary-foreground">{interview.note}</p>
			</div>
		</li>
	);
};

interface TimelineProps {
	interviews: Array<Interview>;
	application: InferSelectModel<typeof applicationsTable>;
	isApplicant: boolean;
}
export const InterviewTimeline = ({
	interviews,
	application,
	isApplicant,
}: TimelineProps) => {
	return (
		<ol className="space-y-4">
			{application.status !== 'Ongoing' && (
				<InterviewTimelineItem
					interview={{
						date: application.closedDate ?? new Date(),
						type: application.status,
						id: -2,
						applicationId: 'N/A',
						note: '',
					}}
				/>
			)}
			{interviews.map((interview) => (
				<InterviewTimelineItem
					key={interview.id}
					interview={interview}
					showEdit={isApplicant}
					showDelete={isApplicant}
				/>
			))}
			<InterviewTimelineItem
				start
				interview={{
					date: application.appliedDate,
					type: 'Apply',
					id: -1,
					applicationId: 'N/A',
					note: '',
				}}
				showEdit={isApplicant}
			/>
		</ol>
	);
};
