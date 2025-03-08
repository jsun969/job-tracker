import { time } from '~/lib/time';

export const convertDateTimeLocalString = (date: Date) =>
	time(date).format('YYYY-MM-DDTHH:mm');
