import { Edit, Trash2 } from 'lucide-react';

import { Button } from '~/components/ui/button';

export const ActionButtons = () => {
	return (
		<div className="flex gap-2">
			<Button size="icon" variant="danger">
				<Trash2 />
			</Button>
			<Button variant="outline">
				<Edit /> Edit
			</Button>
		</div>
	);
};
