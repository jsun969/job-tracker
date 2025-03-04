'use client';

import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';

interface ShareSwitchProps {
	shared: boolean;
}

export const ShareSwitch = ({ shared }: ShareSwitchProps) => {
	return (
		<div className="flex items-center gap-2">
			<Label htmlFor="share">Share</Label>
			<Switch id="share" checked={shared} />
		</div>
	);
};
