'use client';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { Check, Clock, X } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import { Button } from '~/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { APPLICATION_PROCESS_ICONS, ApplicationStatus } from '~/constants';
import { updateApplicationSchema } from '~/schemas';
import { convertDateTimeLocalString } from '~/utils/convert-date-time-local-string';

import { updateApplication } from '../../../_actions/update-application';

type CloseStatus = Exclude<ApplicationStatus, 'Ongoing'>;

const FIELDS = ['closedDate'] as const satisfies Array<
	keyof v.InferInput<typeof updateApplicationSchema>
>;
const schema = v.pick(updateApplicationSchema, FIELDS);
interface ConfirmingDialogProps {
	status: CloseStatus;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	id: string;
}
const CloseDialog = ({
	id,
	status,
	open,
	onOpenChange,
}: ConfirmingDialogProps) => {
	const form = useForm({
		resolver: valibotResolver(schema),
		defaultValues: {
			closedDate: new Date(),
		},
	});
	const action = useAction(updateApplication, {
		onSuccess: () => {
			onOpenChange(false);
		},
	});

	const submit = form.handleSubmit((data) => {
		action.execute({ id, status, ...data });
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						Update Application Status - {status}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={submit}>
						<FormField
							control={form.control}
							name="closedDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<Input
											type="datetime-local"
											value={convertDateTimeLocalString(
												field.value ?? new Date(),
											)}
											onChange={(e) => field.onChange(new Date(e.target.value))}
											max={convertDateTimeLocalString(new Date())}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="mt-2">
							<Button type="submit" loading={action.isPending}>
								Save changes
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

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
			<CloseDialog
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
