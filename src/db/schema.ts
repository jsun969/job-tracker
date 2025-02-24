import { relations } from 'drizzle-orm';
import {
	boolean,
	date,
	pgEnum,
	pgTable,
	smallserial,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

import { APPLICATION_STATUSES, INTERVIEW_TYPES } from '~/constants';

export const applicationStatusEnum = pgEnum('status', APPLICATION_STATUSES);
export const applicationsTable = pgTable('applications', {
	id: uuid().defaultRandom().primaryKey(),
	company: text().notNull(),
	jobTitle: text().notNull(),
	origin: text().notNull(),
	location: text().notNull(),
	referred: boolean().notNull(),
	appliedDate: date().notNull(),
	closedDate: date(),
	status: applicationStatusEnum().default('ongoing'),
});
export const applicationsRelations = relations(
	applicationsTable,
	({ many }) => ({ interviews: many(interviewsTable) }),
);

export const interviewTypeEnum = pgEnum('type', INTERVIEW_TYPES);
export const interviewsTable = pgTable('interviews', {
	id: smallserial().primaryKey(),
	date: timestamp().notNull(),
	type: interviewTypeEnum().notNull(),
	note: text(),
	applicationId: uuid().notNull(),
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
