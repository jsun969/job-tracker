import { headers } from 'next/headers';

import { auth } from '~/lib/auth';

const DashboardPage = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	console.log(session);

	return <div>Dashboard here!</div>;
};

export default DashboardPage;
