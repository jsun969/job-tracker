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

import { CloseApplicationDialog } from './dialogs';

export type CloseStatus = Exclude<ApplicationStatus, 'Ongoing'>;

export const TimelineActions = ({ id }: { id: string }) => {
	const RejectedIcon = APPLICATION_PROCESS_ICONS.Rejected;
	const GhostedIcon = APPLICATION_PROCESS_ICONS.Ghosted;

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [finalizingStatus, setFinalizingStatus] =
		useState<CloseStatus>('Offer');
	const openDialog = (type: CloseStatus) => {
		setFinalizingStatus(type);
		setIsDialogOpen(true);
	};

	return (
		<>
			<CloseApplicationDialog
				status={finalizingStatus}
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				id={id}
			/>
			<div className="flex flex-col items-center justify-between gap-2 md:flex-row">
				<Button variant="outline" size="lg">
					<Clock />
					Add Event
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
