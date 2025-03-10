import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';

const outfitSans = Outfit({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Job Tracker',
	description: 'Job Tracker is a simple app to track job applications.',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<html lang="en">
			<Analytics />
			<body className={`${outfitSans.className} antialiased`}>
				<Toaster
					position="top-center"
					richColors
					toastOptions={{
						classNames: {
							toast: outfitSans.className,
						},
					}}
				/>
				{children}
			</body>
		</html>
	);
};

export default RootLayout;
