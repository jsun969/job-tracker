'use client';

import { ArrowBigUpDash, ExternalLink, IdCard, MapPin } from 'lucide-react';
import Link from 'next/link';

import { Badge, badgeVariants } from '~/components/ui/badge';
import { Card, CardDescription, CardTitle } from '~/components/ui/card';
import {
	APPLICATION_PROCESS_ICONS,
	COMPANY_TYPE_COLORS,
	TIME_FORMAT,
} from '~/constants';
import { time } from '~/lib/time';
import { getFavicon } from '~/utils/get-favicon';
import { isLink } from '~/utils/is-link';
import { cn } from '~/utils/ui';

import { ApplicationWithMostRecentStatus } from '../../_data/applications';

export const ApplicationCard = ({
	application,
}: {
	application: ApplicationWithMostRecentStatus;
}) => {
	const ProcessIcon =
		APPLICATION_PROCESS_ICONS[application.mostRecentStatus.status];
	const href = `/dashboard/applications/${application.id}`;

	return (
		<Card className="row-span-3 grid grid-rows-subgrid p-4 transition-shadow has-[>a:hover]:shadow-lg">
			<div className="flex justify-between">
				<Badge
					style={{
						backgroundColor: COMPANY_TYPE_COLORS[application.companyType],
					}}
				>
					{application.companyType}
				</Badge>
				{/* TODO: Show shared status, this solution is not visually appealing  */}
				{/* {application.shared && <Badge>Shared</Badge>} */}
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
			<Link href={href} className="block">
				<CardTitle className="flex items-center gap-1 text-lg">
					{isLink(application.source) && (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={getFavicon(application.source)}
							alt="Company Logo"
							className="size-5"
						/>
					)}
					{application.company}
				</CardTitle>
				<CardDescription className="grid grid-cols-[auto,_1fr] items-center gap-x-1">
					<IdCard className="size-4" /> <span>{application.jobTitle}</span>
					<MapPin className="size-4" /> <span>{application.location}</span>
					{application.referred && (
						<>
							<ArrowBigUpDash className="size-4" /> <span>Referred</span>
						</>
					)}
				</CardDescription>
			</Link>
			<Link href={href} className="mt-2 flex items-center gap-2 text-sm">
				<div className="h-fit w-fit rounded-full bg-secondary p-2 text-secondary-foreground">
					<ProcessIcon className="size-6" />
				</div>
				<div>
					<div className="font-semibold">
						{application.mostRecentStatus.status}
					</div>
					<div className="text-muted-foreground">
						{time(application.mostRecentStatus.date).format(TIME_FORMAT)} (
						{time(application.mostRecentStatus.date).fromNow()})
					</div>
				</div>
			</Link>
		</Card>
	);
};
