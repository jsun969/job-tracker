import { Separator } from '~/components/ui/separator';
import { APPLICATION_CATEGORY_ICONS, ApplicationCategory } from '~/constants';
import { getUser } from '~/utils/get-user';

import { Application, getApplication } from '../_data/applications';
import { ApplicationCard } from './_components/ApplicationCard';

type CategorizedApplications = Record<ApplicationCategory, Array<Application>>;

const ApplicationsPage = async () => {
	const user = await getUser();
	if (!user) return null;
	const applications = await getApplication(user.id);

	const categorizedApplications: CategorizedApplications = applications.reduce(
		(acc, application) => {
			let category: ApplicationCategory = 'Closed';
			if (
				application.status === 'Rejected' ||
				application.status === 'Ghosted'
			) {
				category = 'Closed';
			} else if (application.status === 'Offer') {
				category = 'Offer';
			} else {
				const date = application.mostRecentStatus.date;
				const now = new Date();
				if (date > now) {
					category = 'Upcoming';
				} else {
					category = 'Ongoing';
				}
			}
			acc[category].push(application);
			return acc;
		},
		{
			Upcoming: [],
			Ongoing: [],
			Offer: [],
			Closed: [],
		} as CategorizedApplications,
	);

	return (
		<div className="space-y-8">
			{Object.entries(categorizedApplications).map(
				([category, applications]) => {
					const Icon =
						APPLICATION_CATEGORY_ICONS[category as ApplicationCategory];
					return (
						<div key={category}>
							<h2
								className="flex items-center gap-2 text-2xl font-bold"
								id={category}
							>
								<Icon className="size-6" /> {category}
							</h2>
							<Separator className="my-4" />
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
								{applications.map((application) => (
									<ApplicationCard
										application={application}
										key={application.id}
									/>
								))}
							</div>
						</div>
					);
				},
			)}
		</div>
	);
};

export default ApplicationsPage;
