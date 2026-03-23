import { getUser } from '~/utils/get-user';

import { getCategorizedApplications } from '../_data/applications';
import { ApplicationsSections } from './_components/applications-sections';

const ApplicationsPage = async () => {
	const user = await getUser();
	if (!user) return null;

	const categorizedApplications = await getCategorizedApplications(user.id);

	return (
		<ApplicationsSections categorizedApplications={categorizedApplications} />
	);
};

export default ApplicationsPage;
