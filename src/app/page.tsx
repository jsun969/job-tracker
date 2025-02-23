import { Button } from '~/components/ui/button';

export default function Home() {
	return (
		<div className="flex h-dvh flex-col items-center justify-center gap-4">
			<div className="text-4xl font-bold sm:text-6xl">💼 Job Tracker 📊</div>
			<div className="flex gap-2">
				<Button>Login with Google</Button>
				<Button variant="outline">GitHub</Button>
			</div>
		</div>
	);
}
