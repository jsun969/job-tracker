import { headers } from 'next/headers';
import { cache } from 'react';

import { auth } from '~/lib/auth';

const cachedGetSession = cache((headers: Headers) => {
	return auth.api.getSession({ headers });
});

export const getUser = async () => {
	const session = await cachedGetSession(await headers());
	return session?.user;
};
