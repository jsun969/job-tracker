import { FileStack, LayoutDashboard, Rss, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '~/components/ui/sidebar';

export const NAV_ITEMS = [
	{ name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
	{ name: 'Applications', url: '/dashboard/applications', icon: FileStack },
	{ name: 'Job Board', url: '/dashboard/job-board', icon: Rss },
	{ name: 'Settings', url: '/dashboard/settings', icon: Settings },
];
export const NavPages = () => {
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
