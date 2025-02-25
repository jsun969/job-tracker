import { redirect } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { GITHUB_LINK } from '~/constants';
import { getUser } from '~/utils/get-user';

import { LoginButton } from './_components/login-button';

const HomePage = async () => {
	const user = await getUser();
	if (user) redirect('/dashboard');

	return (
		<div className="flex h-dvh flex-col items-center justify-center gap-4">
			<div className="text-4xl font-bold sm:text-6xl">💼 Job Tracker 📊</div>
			<div className="flex gap-2">
				<LoginButton />
				<Button variant="outline" asChild className="cursor-pointer">
					<a href={GITHUB_LINK}>GitHub</a>
				</Button>
			</div>
		</div>
	);
};

export default HomePage;
