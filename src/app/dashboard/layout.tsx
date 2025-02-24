import { redirect } from 'next/navigation';

import { AppSidebar } from '~/app/dashboard/_components/app-sidebar';
import { Separator } from '~/components/ui/separator';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '~/components/ui/sidebar';
import { getUser } from '~/utils/get-user';

const DashboardLayout = async ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	const user = await getUser();
	if (!user) return redirect('/');

	return (
		<SidebarProvider>
			<AppSidebar
				user={{
					email: user.email,
					name: user.name,
					avatar: user.image ?? undefined,
				}}
			/>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<div className="text-sm text-secondary-foreground">
							{/* TODO: Inspiration quote */}
							Placeholder here
						</div>
					</div>
				</header>
				<div className="p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DashboardLayout;
