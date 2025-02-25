'use client';

import {
	BriefcaseBusiness,
	FileStack,
	Frame,
	LayoutDashboard,
	Map,
	PieChart,
	Rss,
	Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { FaGithub as GitHubIcon } from 'react-icons/fa6';

import { NavProjects } from '~/app/dashboard/_components/nav-projects';
import { NavUser } from '~/app/dashboard/_components/nav-user';
import { Button } from '~/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '~/components/ui/sidebar';
import { GITHUB_LINK } from '~/constants';

// This is sample data.
const data = {
	projects: [
		{ name: 'Design Engineering', url: '#', icon: Frame },
		{ name: 'Sales & Marketing', url: '#', icon: PieChart },
		{ name: 'Travel', url: '#', icon: Map },
	],
};
export const NAV_ITEMS = [
	{ name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
	{ name: 'Applications', url: '/dashboard/applications', icon: FileStack },
	{ name: 'Job Board', url: '/dashboard/job-board', icon: Rss },
	{ name: 'Settings', url: '/dashboard/settings', icon: Settings },
];
const NavPages = () => {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarMenu>
				{NAV_ITEMS.map(({ name, icon: Icon, url }) => (
					<SidebarMenuItem key={name}>
						<SidebarMenuButton
							tooltip={name}
							asChild
							isActive={pathname === url}
						>
							<Link href={url}>
								<Icon />
								<span>{name}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
};

const AppSidebarHeader = () => {
	return (
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" asChild>
						<div>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<BriefcaseBusiness className="size-4" />
							</div>
							<div className="flex flex-col gap-0.5 leading-none">
								<span className="font-bold">Job Tracker</span>
							</div>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
};

type User = {
	name: string;
	email: string;
	avatar?: string;
};
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	user: User;
};
export function AppSidebar({ user, ...props }: AppSidebarProps) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<AppSidebarHeader />
			<SidebarContent>
				<NavPages />
				{/* TODO: Upcoming interviews */}
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<Button asChild variant="outline">
					<a href={GITHUB_LINK}>
						<GitHubIcon />
						<span className="group-data-[collapsible=icon]:hidden">GitHub</span>
					</a>
				</Button>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
