'use client';

import { Info } from 'lucide-react';
import { useOptimisticAction } from 'next-safe-action/hooks';

import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '~/components/ui/tooltip';

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
			<Label htmlFor="share" className="flex items-center gap-1">
				Share
				<Tooltip>
					<TooltipTrigger>
						<Info className="size-4" />
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p className="w-60">
							Copy the current link and share it with others. Note that
							recipients must be logged in to access the shared content.
						</p>
					</TooltipContent>
				</Tooltip>
			</Label>
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
