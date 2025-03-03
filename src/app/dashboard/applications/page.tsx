import { Separator } from '~/components/ui/separator';
import { APPLICATION_CATEGORY_ICONS, ApplicationCategory } from '~/constants';
import { getUser } from '~/utils/get-user';

import { getCategorizedApplications } from '../_data/applications';
import { Applications } from './_components/applications';

const ApplicationsPage = async () => {
	const user = await getUser();
	if (!user) return null;

	const categorizedApplications = await getCategorizedApplications(user.id);

	return (
		<div className="space-y-4">
			{Object.entries(categorizedApplications).map(
				([category, applications]) => {
					const Icon =
						APPLICATION_CATEGORY_ICONS[category as ApplicationCategory];
					return (
						<div key={category}>
							<h2
								className="flex scroll-mt-16 items-center gap-2 text-2xl font-bold"
								id={category}
							>
								<Icon className="size-6" /> {category}
							</h2>
							<Separator className="my-4" />
							<Applications applications={applications} />
						</div>
					);
				},
			)}
		</div>
	);
};

export default ApplicationsPage;
