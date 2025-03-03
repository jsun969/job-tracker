import { Separator } from '~/components/ui/separator';
import { APPLICATION_CATEGORY_ICONS, ApplicationCategory } from '~/constants';
import { getUser } from '~/utils/get-user';

import { getCategorizedApplications } from '../_data/applications';
import { ApplicationCard } from './_components/applicaiton-card';

const ApplicationsPage = async () => {
	const user = await getUser();
	if (!user) return null;

	const categorizedApplications = await getCategorizedApplications(user.id);

	return (
		<div>
			{Object.entries(categorizedApplications).map(
				([category, applications]) => {
					const Icon =
						APPLICATION_CATEGORY_ICONS[category as ApplicationCategory];
					return (
						<div key={category}>
							<h2
								className="flex scroll-mt-16 items-center gap-2 pt-4 text-2xl font-bold"
								id={category}
							>
								<Icon className="size-6" /> {category}
							</h2>
							<Separator className="my-4" />
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
