'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { DialogHeader, DialogTitle } from '~/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { authClient } from '~/lib/auth-client';

type EmailFormValues = {
	name: string;
	email: string;
	password: string;
};

type EmailLoginFormProps = {
	onSuccess: () => void;
};

export const EmailLoginForm = ({ onSuccess }: EmailLoginFormProps) => {
	const [isSignUp, setIsSignUp] = useState(false);
	const form = useForm<EmailFormValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});
	const emailValue = useWatch({ control: form.control, name: 'email' });
	const passwordValue = useWatch({ control: form.control, name: 'password' });

	const submitEmailAuth = form.handleSubmit(async (values) => {
		try {
			await authClient.signIn.email({
				email: values.email.trim(),
				password: values.password,
				callbackURL: '/dashboard',
			});
			toast.success('Logged in successfully.');
			onSuccess();
			form.reset();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Authentication failed';
			toast.error(message);
		}
	});

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{isSignUp ? 'Create account' : 'Sign in with email'}
				</DialogTitle>
				{isSignUp ? (
					<p className="text-sm text-amber-600">
						Email Sign Up is WIP. Please use social media accounts to login.
					</p>
				) : null}
			</DialogHeader>
			<Form {...form}>
				<form onSubmit={submitEmailAuth} className="space-y-4">
					{isSignUp ? (
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Your name" disabled {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					) : null}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="you@example.com"
										disabled={isSignUp}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="••••••••"
										disabled={isSignUp}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-col gap-2 pt-1">
						<Button
							type="submit"
							disabled={
								isSignUp ||
								form.formState.isSubmitting ||
								!(emailValue ?? '').trim() ||
								!(passwordValue ?? '')
							}
						>
							{form.formState.isSubmitting
								? 'Please wait...'
								: isSignUp
									? 'Create account'
									: 'Sign in'}
						</Button>
						<Button
							variant="ghost"
							onClick={() => setIsSignUp((prev) => !prev)}
							disabled={form.formState.isSubmitting}
							type="button"
						>
							{isSignUp
								? 'Already have an account? Sign in'
								: "Don't have an account? Create one"}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};
