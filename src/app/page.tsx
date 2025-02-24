import { Button } from '~/components/ui/button';

import { LoginButton } from './_components/login-button';

const HomePage = () => {
	return (
		<div className="flex h-dvh flex-col items-center justify-center gap-4">
			<div className="text-4xl font-bold sm:text-6xl">💼 Job Tracker 📊</div>
			<div className="flex gap-2">
				<LoginButton />
				<Button variant="outline">GitHub</Button>
			</div>
		</div>
	);
};

export default HomePage;
