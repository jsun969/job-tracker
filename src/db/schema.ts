import { relations } from 'drizzle-orm';
import {
	boolean,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

import {
	APPLICATION_STATUSES,
	COMPANY_TYPES,
	INTERVIEW_TYPES,
} from '~/constants';

export const applicationStatusEnum = pgEnum(
	'application_status',
	APPLICATION_STATUSES,
);
export const companyTypeEnum = pgEnum('company_type', COMPANY_TYPES);
export const applicationsTable = pgTable('applications', {
	id: uuid().defaultRandom().primaryKey(),
	company: text().notNull(),
	companyType: companyTypeEnum().notNull(),
	jobTitle: text().notNull(),
	source: text().notNull(),
	location: text().notNull(),
	referred: boolean().notNull(),
	appliedDate: timestamp().notNull(),
	closedDate: timestamp(),
	status: applicationStatusEnum().default('Ongoing').notNull(),
	note: text().default('').notNull(),
	shared: boolean().default(false).notNull(),
	userId: text().notNull(),
});
export const applicationsRelations = relations(
	applicationsTable,
	({ many, one }) => ({
		interviews: many(interviewsTable),
		user: one(usersTable, {
			fields: [applicationsTable.userId],
			references: [usersTable.id],
		}),
	}),
);

export const interviewTypeEnum = pgEnum('interview_type', INTERVIEW_TYPES);
export const interviewsTable = pgTable('interviews', {
	id: serial().primaryKey(),
	date: timestamp().notNull(),
	type: interviewTypeEnum().notNull(),
	note: text(),
	applicationId: uuid()
		.notNull()
		.references(() => applicationsTable.id, { onDelete: 'cascade' }),
});
export const interviewsRelations = relations(interviewsTable, ({ one }) => ({
	application: one(applicationsTable, {
		fields: [interviewsTable.applicationId],
		references: [applicationsTable.id],
	}),
}));

// Better Auth

export const usersTable = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});
export const usersRelations = relations(usersTable, ({ many }) => ({
	applications: many(applicationsTable),
}));

export const sessionsTable = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
});

export const accountsTable = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});

export const verificationTable = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
});
