'use client';

import { Application } from '~/app/dashboard/_data/applications';

import { DeleteApplicationDialog } from './delete-application-dialog';
import { EditApplicationDialog } from './edit-application-dialog';

export const ActionButtons = ({
	application,
}: {
	application: Application;
}) => {
	return (
		<div className="flex gap-2">
			<DeleteApplicationDialog id={application.id} />
			<EditApplicationDialog application={application} />
		</div>
	);
};
