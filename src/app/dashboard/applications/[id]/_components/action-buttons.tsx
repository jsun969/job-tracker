'use client';

import { Trash2 } from 'lucide-react';

import { Application } from '~/app/dashboard/_data/applications';
import { Button } from '~/components/ui/button';

import { EditApplicationDialog } from './edit-application-dialog';

export const ActionButtons = ({
	application,
}: {
	application: Application;
}) => {
	return (
		<div className="flex gap-2">
			<Button size="icon" variant="danger">
				<Trash2 />
			</Button>
			<EditApplicationDialog application={application} />
		</div>
	);
};
