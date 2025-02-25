import { seed } from 'drizzle-seed';

import { INTERVIEW_TYPES } from '~/constants';

import { db } from '.';
import {
	applicationsRelations,
	applicationsTable,
	interviewsTable,
} from './schema';

const SEED_USER_ID = process.env.SEED_USER_ID ?? 'seed-user-id';
const APPLICATION_ORIGINS = [
	'LinkedIn',
	'Seek',
	'Indeed',
	'Glassdoor',
	'https://facebook.com',
	'https://amazon.com',
	'https://apple.com',
	'https://netflix.com',
	'https://google.com',
	'https://microsoft.com',
	'https://x.com',
	'https://uber.com',
	'https://coinbase.com',
	'https://discord.com',
	'https://tiktok.com',
	'https://snapchat.com',
	'https://reddit.com',
	'https://canva.com',
	'https://atlassian.com',
	'https://palantir.com',
	'https://oracle.com',
	'https://janestreet.com',
	'https://citadel.com',
	'https://sig.com',
	'https://optiver.com',
	'https://imc.com',
];

const appSeed = async () => {
	await seed(db, {
		applicationsTable,
		interviewsTable,
		applicationsRelations,
	}).refine((f) => ({
		applicationsTable: {
			columns: {
				company: f.companyName(),
				jobTitle: f.jobTitle(),
				location: f.city(),
				status: f.default({ defaultValue: 'ongoing' }),
				userId: f.default({ defaultValue: SEED_USER_ID }),
				closedDate: f.default({ defaultValue: null }),
				appliedDate: f.date({
					minDate: new Date(2025, 1, 1),
					maxDate: new Date(2025, 2, 1),
				}),
				origin: f.valuesFromArray({
					values: APPLICATION_ORIGINS,
				}),
			},
			with: { interviewsTable: 3 },
			count: 66,
		},
		interviewsTable: {
			columns: {
				// Somehow this enum needs to specify values
				type: f.valuesFromArray({
					values: INTERVIEW_TYPES as unknown as string[],
				}),
				date: f.date({
					minDate: new Date(2025, 2, 2),
					maxDate: new Date(2025, 3, 12),
				}),
				note: f.loremIpsum({ sentencesCount: 2 }),
			},
		},
	}));
	console.log('🌱 Seeding complete!');
};

appSeed();
