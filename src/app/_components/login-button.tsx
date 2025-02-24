'use client';

import {
	FaDiscord as DiscordIcon,
	FaGoogle as GoogleIcon,
} from 'react-icons/fa6';

import { Button } from '~/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { authClient } from '~/lib/auth-client';

export const LoginButton = () => {
	const login = async (provider: 'google' | 'discord') => {
		await authClient.signIn.social({ provider, callbackURL: '/dashboard' });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Login</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-fit *:cursor-pointer">
				<DropdownMenuItem onClick={() => login('google')} asChild>
					<button>
						<GoogleIcon />
						<div>Google</div>
					</button>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => login('discord')} asChild>
					<button>
						<DiscordIcon />
						<div>Discord</div>
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
