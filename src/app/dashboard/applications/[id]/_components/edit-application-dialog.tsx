import { valibotResolver } from '@hookform/resolvers/valibot';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Edit } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { pick } from 'radash';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import { Application } from '~/app/dashboard/_data/applications';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from '~/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { COMPANY_TYPES } from '~/constants';
import { updateApplicationSchema } from '~/schemas';

import { updateApplication } from '../../_actions/update-application';

const FIELDS = [
	'company',
	'jobTitle',
	'location',
	'companyType',
	'referred',
	'source',
	'note',
] as const satisfies Array<keyof v.InferInput<typeof updateApplicationSchema>>;
const schema = v.pick(updateApplicationSchema, FIELDS);

export const EditApplicationDialog = ({
	application,
}: {
	application: Application;
}) => {
	const [open, setOpen] = useState(false);

	const form = useForm({
		resolver: valibotResolver(schema),
		defaultValues: pick(application, FIELDS),
	});
	const action = useAction(updateApplication, {
		onSuccess: () => {
			setOpen(false);
		},
	});

	const submit = form.handleSubmit((data) => {
		action.execute({ id: application.id, ...data });
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Edit /> Edit
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<DialogHeader>
						<DialogTitle className="text-lg font-semibold">
							Edit Application
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={submit} className="grid grid-cols-4 gap-x-2 gap-y-2">
						<FormField
							control={form.control}
							name="company"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Company</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="jobTitle"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Job Title</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="companyType"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Company Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{COMPANY_TYPES.map((type) => (
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
							name="source"
							render={({ field }) => (
								<FormItem className="col-span-4">
									<FormLabel>Source</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										Can be a URL (starting with https or http) or the name of an
										application (e.g. LinkedIn, Seek, Indeed, etc.)
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem className="col-span-4">
									<FormLabel>Note</FormLabel>
									<FormControl>
										<Textarea className="h-36 resize-none" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="col-span-4 mt-4 flex justify-between">
							<FormField
								control={form.control}
								name="referred"
								render={({ field }) => (
									<FormItem className="flex items-center gap-2 space-y-0">
										<FormLabel>Referred</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" loading={action.isPending}>
								Save changes
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
