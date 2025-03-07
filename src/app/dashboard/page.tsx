import { FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { APPLICATION_CATEGORY_ICONS, ApplicationCategory } from '~/constants';
import { getUser } from '~/utils/get-user';

import { getCategorizedApplications } from './_data/applications';

const DashboardPage = async () => {
	const user = await getUser();
	if (!user) return null;

	// TODO: Use database count query instead of querying all the applications
	const categorizedApplications = await getCategorizedApplications(user.id);
	const categorizedApplicationsCounts = Object.entries(
		categorizedApplications,
	).map(([category, applications]) => {
		return {
			category,
			count: applications.length,
		};
	});
	const totalApplicationCount = categorizedApplicationsCounts.reduce(
		(acc, { count }) => acc + count,
		0,
	);

	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
				{[
					{ category: 'Total', count: totalApplicationCount },
					...categorizedApplicationsCounts,
				].map(({ category, count }) => {
					const Icon =
						category === 'Total'
							? FileText
							: APPLICATION_CATEGORY_ICONS[category as ApplicationCategory];
					return (
						<Card key={category}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{category}
								</CardTitle>
								<Icon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{count}</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
			<Card className="col-span-4">
				<CardHeader>
					<CardTitle>Application Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-96 w-full">
						{/* TODO: Add sankey diagram */}
						<div className="flex h-full items-center justify-center text-muted-foreground">
							A sankey diagram will be displayed here
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default DashboardPage;
