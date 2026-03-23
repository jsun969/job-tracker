'use client';

import { useState } from 'react';
import {
	FaDiscord as DiscordIcon,
	FaEnvelope as EmailIcon,
	FaGoogle as GoogleIcon,
} from 'react-icons/fa6';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { authClient } from '~/lib/auth-client';

export const LoginButton = () => {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const login = async (provider: 'google' | 'discord') => {
		await authClient.signIn.social({ provider, callbackURL: '/dashboard' });
	};

	const submitEmailAuth = async () => {
		setIsSubmitting(true);

		try {
			await authClient.signIn.email({
				email: email.trim(),
				password,
				callbackURL: '/dashboard',
			});
			toast.success('Logged in successfully.');
			setOpen(false);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Authentication failed';
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
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
						<DialogHeader>
							<DialogTitle>
								{isSignUp ? 'Create account' : 'Sign in with email'}
							</DialogTitle>
							{isSignUp ? (
								<p className="text-sm text-amber-600">
									Email Sign Up is WIP. Please use social media accounts to
									login.
								</p>
							) : null}
						</DialogHeader>
						<div className="space-y-4">
							{isSignUp ? (
								<div className="space-y-2">
									<Label htmlFor="email-auth-name">Name</Label>
									<Input
										id="email-auth-name"
										value={name}
										onChange={(event) => setName(event.target.value)}
										placeholder="Your name"
										disabled
									/>
								</div>
							) : null}
							<div className="space-y-2">
								<Label htmlFor="email-auth-email">Email</Label>
								<Input
									id="email-auth-email"
									type="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									placeholder="you@example.com"
									disabled={isSignUp}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email-auth-password">Password</Label>
								<Input
									id="email-auth-password"
									type="password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									placeholder="••••••••"
									disabled={isSignUp}
								/>
							</div>
							<div className="flex flex-col gap-2 pt-1">
								<Button
									onClick={submitEmailAuth}
									disabled={
										isSignUp ||
										isSubmitting ||
										!email.trim() ||
										!password ||
										(isSignUp && !name.trim())
									}
								>
									{isSubmitting
										? 'Please wait...'
										: isSignUp
											? 'Create account'
											: 'Sign in'}
								</Button>
								<Button
									variant="ghost"
									onClick={() => setIsSignUp((prev) => !prev)}
									disabled={isSubmitting}
								>
									{isSignUp
										? 'Already have an account? Sign in'
										: "Don't have an account? Create one"}
								</Button>
							</div>
						</div>
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
