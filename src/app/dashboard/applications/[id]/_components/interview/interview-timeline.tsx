'use client';

import { InferSelectModel } from 'drizzle-orm';
import { Edit, Trash2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';

import { Application } from '~/app/dashboard/_data/applications';
import { Button } from '~/components/ui/button';
import {
	APPLICATION_PROCESS_ICONS,
	ApplicationProcess,
	TIME_FORMAT,
} from '~/constants';
import { interviewsTable } from '~/db/schema';
import { time } from '~/lib/time';
import { cn } from '~/utils/ui';

import { deleteInterview } from '../../../_actions/delete-interview';
import { updateApplication } from '../../../_actions/update-application';
import { EditApplyDialog, EditInterviewDialog } from './dialogs';

export type Interview = InferSelectModel<typeof interviewsTable>;
type TimelineInterview = Omit<Interview, 'type'> & { type: ApplicationProcess };

interface TimelineItemProps {
	interview: TimelineInterview;
	start?: boolean;
	showEdit?: boolean;
	showDelete?: boolean;
	onDelete?: () => void;
	onEdit?: () => void;
	deleteLoading?: boolean;
}
export const InterviewTimelineItem = ({
	start,
	interview,
	showEdit,
	showDelete,
	onDelete,
	onEdit,
	deleteLoading,
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
				<div>({time(interview.date).fromNow()})</div>
				{showActions && (
					<div className="mt-2 flex gap-1">
						{showDelete && (
							<Button
								size="smIcon"
								variant="danger"
								onClick={onDelete}
								loading={deleteLoading}
							>
								<Trash2 />
							</Button>
						)}
						{showEdit && (
							<Button size="smIcon" variant="outline" onClick={onEdit}>
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
				<p className="whitespace-pre-wrap text-sm text-secondary-foreground">
					{interview.note}
				</p>
			</div>
		</li>
	);
};

interface TimelineProps {
	interviews: Array<Interview>;
	application: Application;
	isApplicant: boolean;
}
export const InterviewTimeline = ({
	interviews,
	application,
	isApplicant,
}: TimelineProps) => {
	const applyData: TimelineInterview = {
		date: application.appliedDate,
		type: 'Apply',
		id: -1,
		applicationId: 'N/A',
		note: '',
	};
	const closeData: TimelineInterview = {
		date: application.closedDate ?? new Date(),
		type: application.status,
		id: -2,
		applicationId: 'N/A',
		note: '',
	};

	const deleteCloseAction = useAction(updateApplication, {
		onSuccess: () => {
			toast.info('Close status removed');
		},
	});

	const [deletingInterviewIds, setDeletingInterviewIds] = useState<Set<number>>(
		new Set(),
	);
	const deleteInterviewAction = useAction(deleteInterview, {
		onExecute: ({ input }) => {
			setDeletingInterviewIds((prev) => new Set(prev).add(input.id));
		},
		onSettled: ({ input }) => {
			setDeletingInterviewIds((prev) => {
				const newSet = new Set(prev);
				newSet.delete(input.id);
				return newSet;
			});
		},
		onSuccess: () => {
			toast.info('Interview deleted');
		},
	});

	const [editingInterview, setEditingInterview] = useState<Interview>({
		id: -1,
		date: new Date(),
		type: 'Other',
		note: '',
		applicationId: 'N/A',
	});
	const [isEditInterviewDialogOpen, setIsEditInterviewDialogOpen] =
		useState(false);

	const [isEditApplyDialogOpen, setIsEditApplyDialogOpen] = useState(false);

	return (
		<>
			<EditApplyDialog
				id={application.id}
				open={isEditApplyDialogOpen}
				onOpenChange={setIsEditApplyDialogOpen}
				appliedDate={application.appliedDate}
			/>
			<EditInterviewDialog
				open={isEditInterviewDialogOpen}
				onOpenChange={setIsEditInterviewDialogOpen}
				interview={editingInterview}
			/>
			<ol className="space-y-4">
				{application.status !== 'Ongoing' && (
					<InterviewTimelineItem
						interview={closeData}
						showDelete={isApplicant}
						onDelete={() => {
							deleteCloseAction.execute({
								id: application.id,
								closedDate: null,
								status: 'Ongoing',
							});
						}}
						deleteLoading={deleteCloseAction.isPending}
					/>
				)}
				{interviews.map((interview) => (
					<InterviewTimelineItem
						key={interview.id}
						interview={interview}
						showEdit={isApplicant}
						showDelete={isApplicant}
						onDelete={() => {
							deleteInterviewAction.execute({ id: interview.id });
						}}
						deleteLoading={
							deleteInterviewAction.isPending &&
							deletingInterviewIds.has(interview.id)
						}
						onEdit={() => {
							setEditingInterview(interview);
							setIsEditInterviewDialogOpen(true);
						}}
					/>
				))}
				<InterviewTimelineItem
					start
					interview={applyData}
					showEdit={isApplicant}
					onEdit={() => setIsEditApplyDialogOpen(true)}
				/>
			</ol>
		</>
	);
};
