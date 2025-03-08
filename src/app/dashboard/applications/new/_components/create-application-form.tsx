'use client';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
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
import { insertApplicationSchema } from '~/schemas';
import { convertDateTimeLocalString } from '~/utils/convert-date-time-local-string';

import { createApplication } from '../../_actions/create-application';

const FIELDS = [
	'company',
	'jobTitle',
	'location',
	'companyType',
	'referred',
	'source',
	'note',
	'appliedDate',
] as const satisfies Array<keyof v.InferInput<typeof insertApplicationSchema>>;
const schema = v.pick(insertApplicationSchema, FIELDS);

export const CreateApplicationForm = () => {
	const router = useRouter();
	const form = useForm({
		resolver: valibotResolver(schema),
		defaultValues: {
			company: '',
			companyType: 'Other',
			location: '',
			jobTitle: '',
			source: '',
			note: '',
			referred: false,
			appliedDate: new Date(),
		},
	});
	const action = useAction(createApplication, {
		onSuccess: () => {
			router.push('/dashboard/applications');
			toast.success('Application created successfully');
		},
	});
	const submit = form.handleSubmit((data) => {
		action.execute(data);
	});

	return (
		<Form {...form}>
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
					name="companyType"
					render={({ field }) => (
						<FormItem className="col-span-1">
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
					name="location"
					render={({ field }) => (
						<FormItem className="col-span-1">
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
					name="appliedDate"
					render={({ field }) => (
						<FormItem className="col-span-2">
							<FormLabel>Applied Date</FormLabel>
							<FormControl>
								<Input
									type="datetime-local"
									value={convertDateTimeLocalString(field.value)}
									onChange={(e) => field.onChange(new Date(e.target.value))}
									max={convertDateTimeLocalString(new Date())}
								/>
							</FormControl>
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
								<Textarea className="h-36" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="col-span-4 flex justify-between">
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
						Create
					</Button>
				</div>
			</form>
		</Form>
	);
};
