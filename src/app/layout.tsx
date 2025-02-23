import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';

import './globals.css';

const outfitSans = Outfit({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Job Tracker',
	description: 'Job Tracker is a simple app to track job applications.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${outfitSans.className} antialiased`}>{children}</body>
		</html>
	);
}
