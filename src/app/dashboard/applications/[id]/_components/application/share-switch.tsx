'use client';

import { useOptimisticAction } from 'next-safe-action/hooks';

import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';

import { updateApplication } from '../../../_actions/update-application';

interface ShareSwitchProps {
	shared: boolean;
	id: string;
}

export const ShareSwitch = ({ shared, id }: ShareSwitchProps) => {
	const action = useOptimisticAction(updateApplication, {
		currentState: shared,
		updateFn: (_, newShared) => newShared.shared ?? shared,
	});

	return (
		<div className="flex items-center gap-2">
			<Label htmlFor="share">Share</Label>
			<Switch
				id="share"
				checked={action.optimisticState}
				onCheckedChange={(checked) => {
					action.execute({ id, shared: checked });
				}}
			/>
		</div>
	);
};
