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
