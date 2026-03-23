'use client';

import { useState } from 'react';
import {
	FaDiscord as DiscordIcon,
	FaEnvelope as EmailIcon,
	FaGoogle as GoogleIcon,
} from 'react-icons/fa6';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { authClient } from '~/lib/auth-client';

import { EmailLoginForm } from './email-login-form';

export const LoginButton = () => {
	const [open, setOpen] = useState(false);

	const login = async (provider: 'google' | 'discord') => {
		await authClient.signIn.social({ provider, callbackURL: '/dashboard' });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Login</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-fit *:cursor-pointer">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<DropdownMenuItem onSelect={(event) => event.preventDefault()}>
							<EmailIcon />
							<div>Email</div>
						</DropdownMenuItem>
					</DialogTrigger>
					<DialogContent>
						<EmailLoginForm onSuccess={() => setOpen(false)} />
					</DialogContent>
				</Dialog>
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
