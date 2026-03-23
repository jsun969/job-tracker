'use client';

import { useAction } from 'next-safe-action/hooks';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { DatetimePicker } from '~/components/datetime-picker';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Separator } from '~/components/ui/separator';
import { APPLICATION_CATEGORY_ICONS, ApplicationCategory } from '~/constants';

import { CategorizedApplications } from '../../_data/applications';
import { bulkCloseApplications } from '../_actions/bulk-close-applications';
import { bulkReopenApplications } from '../_actions/bulk-reopen-applications';
import { ApplicationCard } from './applicaiton-card';

export const ApplicationsSections = ({
	categorizedApplications,
}: {
	categorizedApplications: CategorizedApplications;
}) => {
	const [selectedCategory, setSelectedCategory] =
		useState<ApplicationCategory | null>(null);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [closedDate, setClosedDate] = useState<Date>(new Date());

	const ongoingIds = useMemo(
		() => categorizedApplications.Ongoing.map((application) => application.id),
		[categorizedApplications.Ongoing],
	);
	const closedIds = useMemo(
		() => categorizedApplications.Closed.map((application) => application.id),
		[categorizedApplications.Closed],
	);
	const allOngoingSelected =
		selectedCategory === 'Ongoing' &&
		ongoingIds.length > 0 &&
		ongoingIds.every((id) => selectedIds.has(id));
	const allClosedSelected =
		selectedCategory === 'Closed' &&
		closedIds.length > 0 &&
		closedIds.every((id) => selectedIds.has(id));
	const selectedCount = selectedIds.size;

	const bulkAction = useAction(bulkCloseApplications, {
		onSuccess: ({ data }) => {
			toast.success(
				`${data?.count ?? selectedCount} applications updated successfully.`,
			);
			setSelectedCategory(null);
			setSelectedIds(new Set());
		},
		onError: ({ error }) => {
			toast.error(error.serverError ?? 'Failed to update applications');
		},
	});
	const reopenAction = useAction(bulkReopenApplications, {
		onSuccess: ({ data }) => {
			toast.success(
				`${data?.count ?? selectedCount} applications updated successfully.`,
			);
			setSelectedCategory(null);
			setSelectedIds(new Set());
		},
		onError: ({ error }) => {
			toast.error(error.serverError ?? 'Failed to update applications');
		},
	});

	const toggleOne = (
		category: ApplicationCategory,
		id: string,
		checked: boolean,
	) => {
		setSelectedIds((prev) => {
			if (selectedCategory && selectedCategory !== category) {
				return checked ? new Set([id]) : new Set();
			}
			const next = new Set(prev);
			if (checked) {
				next.add(id);
			} else {
				next.delete(id);
			}
			return next;
		});
		setSelectedCategory((prev) => {
			if (checked) return category;
			if (prev !== category) return prev;
			if (selectedIds.size <= 1) return null;
			return prev;
		});
	};

	const toggleAllByCategory = (
		category: ApplicationCategory,
		ids: Array<string>,
		checked: boolean,
	) => {
		if (!checked) {
			setSelectedCategory(null);
			setSelectedIds(new Set());
			return;
		}
		setSelectedCategory(category);
		setSelectedIds(new Set(ids));
	};

	const applyBulkStatus = (status: 'Rejected' | 'Ghosted' | 'Ongoing') => {
		if (selectedIds.size === 0) return;
		if (status === 'Ongoing') {
			reopenAction.execute({
				ids: Array.from(selectedIds),
			});
			return;
		}
		bulkAction.execute({
			ids: Array.from(selectedIds),
			status,
			closedDate,
		});
	};

	return (
		<div className="space-y-4">
			{Object.entries(categorizedApplications).map(
				([category, applications]) => {
					const typedCategory = category as ApplicationCategory;
					const Icon = APPLICATION_CATEGORY_ICONS[typedCategory];
					const isOngoing = typedCategory === 'Ongoing';
					const isClosed = typedCategory === 'Closed';
					const isSelectableCategory = isOngoing || isClosed;
					const currentCategorySelected = selectedCategory === typedCategory;
					const showBulkPanel =
						currentCategorySelected &&
						selectedCount > 0 &&
						isSelectableCategory;

					return (
						<div key={category}>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<h2
									className="flex scroll-mt-16 items-center gap-2 text-2xl font-bold"
									id={category}
								>
									<Icon className="size-6" /> {category}
								</h2>
								{isSelectableCategory && applications.length > 0 ? (
									<div className="flex items-center gap-2">
										<div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
											<Checkbox
												checked={
													isOngoing ? allOngoingSelected : allClosedSelected
												}
												onCheckedChange={(checked) =>
													toggleAllByCategory(
														typedCategory,
														isOngoing ? ongoingIds : closedIds,
														Boolean(checked),
													)
												}
											/>
											<span>
												{isOngoing ? 'Select All Ongoing' : 'Select All Closed'}
											</span>
										</div>
									</div>
								) : null}
							</div>
							<Separator className="my-4" />
							{showBulkPanel ? (
								<div className="mb-4 space-y-2 rounded-md border bg-muted/20 p-3">
									<div className="text-sm font-medium">
										{selectedCount} {typedCategory} Applications Selected
									</div>
									<div className="flex flex-wrap items-center gap-2">
										{isOngoing ? (
											<>
												<div className="w-full max-w-xs">
													<DatetimePicker
														value={closedDate}
														onChange={setClosedDate}
													/>
												</div>
												<Button
													variant="danger"
													loading={bulkAction.isPending}
													onClick={() => applyBulkStatus('Rejected')}
												>
													Set Selected to Rejected
												</Button>
												<Button
													variant="outline"
													loading={bulkAction.isPending}
													onClick={() => applyBulkStatus('Ghosted')}
												>
													Set Selected to Ghosted
												</Button>
											</>
										) : (
											<Button
												variant="success"
												loading={reopenAction.isPending}
												onClick={() => applyBulkStatus('Ongoing')}
											>
												Set Selected to Ongoing
											</Button>
										)}
									</div>
								</div>
							) : null}
							{applications.length === 0 ? (
								<p className="select-none text-center text-4xl font-bold opacity-20">
									Nothing Here 🧐
								</p>
							) : (
								<div className="grid grid-cols-[repeat(auto-fill,_minmax(20rem,_1fr))] gap-2">
									{applications.map((application) => (
										<ApplicationCard
											application={application}
											key={application.id}
											selectable={isSelectableCategory}
											selected={
												currentCategorySelected &&
												selectedIds.has(application.id)
											}
											onSelectedChange={(checked) =>
												toggleOne(typedCategory, application.id, checked)
											}
										/>
									))}
								</div>
							)}
						</div>
					);
				},
			)}
		</div>
	);
};
