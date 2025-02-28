'use client';

import { ExternalLink, IdCard, MapPin } from 'lucide-react';

import { Badge, badgeVariants } from '~/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import { APPLICATION_PROCESS_ICONS, COMPANY_TYPE_COLORS } from '~/constants';
import { time } from '~/lib/time';
import { humanizeDurationFromNow } from '~/utils/humanize-duration-from-now';
import { isLink } from '~/utils/is-link';
import { cn } from '~/utils/ui';

import { Application } from '../../_data/applications';

export const ApplicationCard = ({
	application,
}: {
	application: Application;
}) => {
	const ProcessIcon =
		APPLICATION_PROCESS_ICONS[application.mostRecentStatus.status];

	return (
		<Card className="cursor-pointer transition-shadow hover:shadow-lg">
			<CardHeader>
				<div className="flex justify-between">
					<Badge
						style={{
							backgroundColor: COMPANY_TYPE_COLORS[application.companyType],
						}}
					>
						{application.companyType}
					</Badge>
					{isLink(application.source) ? (
						<a
							className={cn(
								badgeVariants({ variant: 'secondary' }),
								'gap-1 hover:underline',
							)}
							href={application.source}
							target="_blank"
						>
							Source
							<ExternalLink className="size-4" />
						</a>
					) : (
						<Badge variant="secondary">{application.source}</Badge>
					)}
				</div>
				<CardTitle>{application.company}</CardTitle>
				<CardDescription className="grid grid-cols-[auto,_1fr] items-center gap-x-1">
					<IdCard className="size-4" /> {application.jobTitle}
					<MapPin className="size-4" /> {application.location}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center gap-2 text-sm">
				<div className="h-fit w-fit rounded-full bg-secondary p-2 text-secondary-foreground">
					<ProcessIcon className="size-6" />
				</div>
				<div>
					<div className="font-semibold">
						{application.mostRecentStatus.status}
					</div>
					<div className="text-muted-foreground">
						{time(application.mostRecentStatus.date).format('YYYY-MM-DD HH:mm')}{' '}
						({humanizeDurationFromNow(application.mostRecentStatus.date)})
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
