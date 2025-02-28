export const isLink = (url: string): boolean => {
	return url.startsWith('http://') || url.startsWith('https://');
};
