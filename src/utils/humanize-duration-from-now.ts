import { time } from '~/lib/time';

export const humanizeDurationFromNow = (date: Date): string => {
	const now = time();
	const isBefore = time(date).isBefore(now);
	const diff = time.duration(now.diff(date)).humanize();
	return isBefore ? `${diff} ago` : `In ${diff}`;
};
