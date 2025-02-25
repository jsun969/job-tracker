'use client';

import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { SidebarMenu, SidebarMenuItem } from '~/components/ui/sidebar';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '~/components/ui/tooltip';
import { authClient } from '~/lib/auth-client';

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar?: string;
	};
}) {
	const router = useRouter();
	const logout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => router.push('/'),
			},
		});
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="flex items-center gap-2 py-2 group-data-[collapsible=icon]:!p-0 [&>span:last-child]:truncate">
					<Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:hidden">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className="rounded-lg">
							<User className="size-4" />
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
						<span className="truncate font-semibold">{user.name}</span>
						<span className="truncate text-xs">{user.email}</span>
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="icon"
								className="ml-auto"
								variant="outline"
								onClick={logout}
							>
								<LogOut className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right">Logout</TooltipContent>
					</Tooltip>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
