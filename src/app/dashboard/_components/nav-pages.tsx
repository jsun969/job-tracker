import {
	Binoculars,
	FileStack,
	LayoutDashboard,
	Settings,
	Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '~/components/ui/sidebar';
import {
	APPLICATION_CATEGORIES,
	APPLICATION_CATEGORY_ICONS,
} from '~/constants';

export const NAV_ITEMS = [
	{ name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
	{
		name: 'Applications',
		url: '/dashboard/applications',
		icon: FileStack,
		items: APPLICATION_CATEGORIES.map((category) => ({
			name: category,
			url: `/dashboard/applications#${category}`,
			icon: APPLICATION_CATEGORY_ICONS[category],
		})),
	},
	{ name: 'Cohorts', url: '/dashboard/cohorts', icon: Users },
	{ name: 'Job Board', url: '/dashboard/job-board', icon: Binoculars },
	{ name: 'Settings', url: '/dashboard/settings', icon: Settings },
];
export const NavPages = () => {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarMenu>
				{NAV_ITEMS.map(({ name, icon: Icon, url, items }) => (
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
						{items?.length && (
							<SidebarMenuSub>
								{items?.map(({ name, url, icon: Icon }) => (
									<SidebarMenuSubItem key={name}>
										<SidebarMenuSubButton asChild>
											<Link href={url}>
												<Icon />
												<span>{name}</span>
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								))}
							</SidebarMenuSub>
						)}
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
};
