'use client';

import { Check, Clock, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { APPLICATION_PROCESS_ICONS, ApplicationStatus } from '~/constants';

import { CloseApplicationDialog, CreateInterviewDialog } from './dialogs';

export type CloseStatus = Exclude<ApplicationStatus, 'Ongoing'>;

export const TimelineActions = ({ id }: { id: string }) => {
	const RejectedIcon = APPLICATION_PROCESS_ICONS.Rejected;
	const GhostedIcon = APPLICATION_PROCESS_ICONS.Ghosted;

	const [isCloseApplicationDialogOpen, setIsCloseApplicationDialogOpen] =
		useState(false);
	const [finalizingStatus, setFinalizingStatus] =
		useState<CloseStatus>('Offer');
	const openDialog = (type: CloseStatus) => {
		setFinalizingStatus(type);
		setIsCloseApplicationDialogOpen(true);
	};

	const [isCreateInterviewDialogOpen, setIsCreateInterviewDialogOpen] =
		useState(false);

	return (
		<>
			<CloseApplicationDialog
				status={finalizingStatus}
				open={isCloseApplicationDialogOpen}
				onOpenChange={setIsCloseApplicationDialogOpen}
				id={id}
			/>
			<CreateInterviewDialog
				open={isCreateInterviewDialogOpen}
				onOpenChange={setIsCreateInterviewDialogOpen}
				applicationId={id}
			/>
			<div className="flex flex-col items-center justify-between gap-2 md:flex-row">
				<Button
					variant="outline"
					size="lg"
					onClick={() => setIsCreateInterviewDialogOpen(true)}
				>
					<Clock />
					Add Interview
				</Button>
				<div className="flex gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="danger">
								<X />
								Mark as Closed
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="min-w-fit *:cursor-pointer"
							side="top"
						>
							<DropdownMenuItem onClick={() => openDialog('Rejected')} asChild>
								<button>
									<RejectedIcon />
									<div>Rejected</div>
								</button>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => openDialog('Ghosted')} asChild>
								<button>
									<GhostedIcon />
									<div>Ghosted</div>
								</button>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button variant="success" onClick={() => openDialog('Offer')}>
						<Check />
						Mark as Offer
					</Button>
				</div>
			</div>
		</>
	);
};
