export const getOrigin = (url: string): string => {
	const match = url.match(/^(?:https?:\/\/)?([^/]+)/);
	return match ? match[1] : '';
};

export const getFavicon = (url: string): string => {
	const origin = getOrigin(url);
	return (process.env.NEXT_PUBLIC_FAVICON_API ?? '').replace(
		'{origin}',
		origin,
	);
};
