import { valibotResolver } from '@hookform/resolvers/valibot';
import { useAction } from 'next-safe-action/hooks';
import { pick } from 'radash';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import {
	AdvancedDatetimePicker,
	DatetimePicker,
} from '~/components/datetime-picker';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { INTERVIEW_TYPES } from '~/constants';
import {
	insertInterviewSchema,
	updateApplicationSchema,
	updateInterviewSchema,
} from '~/schemas';

import { createInterview } from '../../../_actions/create-interview';
import { updateApplication } from '../../../_actions/update-application';
import { updateInterview } from '../../../_actions/update-interview';
import { Interview } from './interview-timeline';
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
										<DatetimePicker {...field} />
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
										<DatetimePicker {...field} />
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

const EDIT_INTERVIEW_FIELDS = ['type', 'date', 'note'] as const satisfies Array<
	keyof v.InferInput<typeof updateInterviewSchema>
>;
const editInterviewSchema = v.pick(
	updateInterviewSchema,
	EDIT_INTERVIEW_FIELDS,
);
interface EditInterviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	interview: Interview;
}
export const EditInterviewDialog = ({
	open,
	onOpenChange,
	interview,
}: EditInterviewDialogProps) => {
	const form = useForm({
		resolver: valibotResolver(editInterviewSchema),
		defaultValues: pick(interview, EDIT_INTERVIEW_FIELDS),
	});
	useEffect(() => {
		form.reset(pick(interview, EDIT_INTERVIEW_FIELDS));
	}, [interview, form]);

	const action = useAction(updateInterview, {
		onSuccess: () => {
			onOpenChange(false);
		},
	});

	const submit = form.handleSubmit((data) => {
		action.execute({ id: interview.id, ...data });
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						Edit Interview
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={submit} className="space-y-3">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{INTERVIEW_TYPES.map((type) => (
												<SelectItem value={type} key={type}>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<AdvancedDatetimePicker {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Note</FormLabel>
									<FormControl>
										<Textarea
											className="h-36"
											value={field.value ?? ''}
											onChange={field.onChange}
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

const CREATE_INTERVIEW_FIELDS = [
	'type',
	'date',
	'note',
] as const satisfies Array<keyof v.InferInput<typeof insertInterviewSchema>>;
const createInterviewSchema = v.pick(
	insertInterviewSchema,
	CREATE_INTERVIEW_FIELDS,
);
interface CreateInterviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	applicationId: string;
}
export const CreateInterviewDialog = ({
	open,
	onOpenChange,
	applicationId,
}: CreateInterviewDialogProps) => {
	const form = useForm({
		resolver: valibotResolver(createInterviewSchema),
		defaultValues: {
			date: new Date(),
			note: '',
			type: 'OA',
		},
	});

	const action = useAction(createInterview, {
		onSuccess: () => {
			onOpenChange(false);
			form.reset();
		},
	});

	const submit = form.handleSubmit((data) => {
		action.execute({ applicationId, ...data });
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						Add Interview
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={submit} className="space-y-3">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{INTERVIEW_TYPES.map((type) => (
												<SelectItem value={type} key={type}>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<AdvancedDatetimePicker {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Note</FormLabel>
									<FormControl>
										<Textarea
											className="h-36"
											value={field.value ?? ''}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="mt-2">
							<Button type="submit" loading={action.isPending}>
								Add
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
