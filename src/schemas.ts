import { createInsertSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { applicationsTable, interviewsTable } from './db/schema';

export const updateApplicationSchema = v.required(
	createUpdateSchema(applicationsTable),
	['id'],
);
export const insertApplicationSchema = v.omit(
	createInsertSchema(applicationsTable),
	['id'],
);

export const updateInterviewSchema = v.required(
	createUpdateSchema(interviewsTable),
	['id'],
);
export const insertInterviewSchema = v.omit(
	createInsertSchema(interviewsTable),
	['id'],
);
