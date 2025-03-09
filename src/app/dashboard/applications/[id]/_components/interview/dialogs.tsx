import { valibotResolver } from '@hookform/resolvers/valibot';
import { useAction } from 'next-safe-action/hooks';
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { updateApplicationSchema } from '~/schemas';
import { convertDateTimeLocalString } from '~/utils/convert-date-time-local-string';

import { updateApplication } from '../../../_actions/update-application';
import { CloseStatus } from './timeline-actions';

const CLOSE_FORM_FIELDS = ['closedDate'] as const satisfies Array<
	keyof v.InferInput<typeof updateApplicationSchema>
>;
const closeApplicationSchema = v.pick(
	updateApplicationSchema,
	CLOSE_FORM_FIELDS,
);
interface CloseApplicationDialogProps {
	status: CloseStatus;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	id: string;
}
export const CloseApplicationDialog = ({
	id,
	status,
	open,
	onOpenChange,
}: CloseApplicationDialogProps) => {
	const form = useForm({
		resolver: valibotResolver(closeApplicationSchema),
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

const EDIT_APPLY_FIELDS = ['appliedDate'] as const satisfies Array<
	keyof v.InferInput<typeof updateApplicationSchema>
>;
const editApplySchema = v.pick(updateApplicationSchema, EDIT_APPLY_FIELDS);
interface EditApplyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	id: string;
	appliedDate: Date;
}
export const EditApplyDialog = ({
	id,
	open,
	onOpenChange,
	appliedDate,
}: EditApplyDialogProps) => {
	const form = useForm({
		resolver: valibotResolver(editApplySchema),
		defaultValues: {
			appliedDate,
		},
	});
	const action = useAction(updateApplication, {
		onSuccess: () => {
			onOpenChange(false);
		},
	});

	const submit = form.handleSubmit((data) => {
		action.execute({ id, ...data });
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						Edit Apply Info
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={submit}>
						<FormField
							control={form.control}
							name="appliedDate"
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
