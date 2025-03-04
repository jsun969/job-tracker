import { Check, Clock, X } from 'lucide-react';

import { Button } from '~/components/ui/button';

export const TimelineActions = () => {
	return (
		<div className="flex flex-col items-center justify-between gap-2 md:flex-row">
			<Button variant="outline" size="lg">
				<Clock />
				Add Event
			</Button>
			<div className="flex gap-2">
				<Button variant="danger">
					<X />
					Mark as Closed
				</Button>
				<Button variant="success">
					<Check />
					Mark as Offer
				</Button>
			</div>
		</div>
	);
};
