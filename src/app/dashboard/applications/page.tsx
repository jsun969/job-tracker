import { getUser } from '~/utils/get-user';

import { getApplication } from '../_data/applications';
import { ApplicationCard } from './_components/ApplicationCard';

const ApplicationsPage = async () => {
	const user = await getUser();
	if (!user) return null;
	const applications = await getApplication(user.id);

	return (
		<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
			{applications.map((application) => (
				<ApplicationCard application={application} key={application.id} />
			))}
		</div>
	);
};

export default ApplicationsPage;
