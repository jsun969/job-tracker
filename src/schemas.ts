import { createInsertSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { applicationsTable } from './db/schema';

export const updateApplicationSchema = v.required(
	createUpdateSchema(applicationsTable),
	['id'],
);
export const insertApplicationSchema = createInsertSchema(applicationsTable);
