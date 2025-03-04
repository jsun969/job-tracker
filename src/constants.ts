import {
	CalendarArrowUp,
	CircleSlash,
	FileCode,
	FilePen,
	Ghost,
	MessageCircleMore,
	MessageCircleQuestion,
	PencilLine,
	RefreshCw,
	Search,
	Speech,
	Sticker,
	X,
} from 'lucide-react';

export const GITHUB_LINK = 'https://github.com/jsun969/job-tracker';

export const APPLICATION_STATUSES = [
	'Ongoing',
	'Ghosted',
	'Rejected',
	'Offer',
] as const;

export const INTERVIEW_TYPES = [
	'OA',
	'HR',
	'Behavioral',
	'Technical',
	'Other',
] as const;

export const COMPANY_TYPES = [
	'FAANG',
	'Big Tech',
	'HFT',
	'Startup',
	'Other',
] as const;

export const COMPANY_TYPE_COLORS = {
	FAANG: '#FC0B21',
	'Big Tech': '#FC7608',
	HFT: '#ECBA10',
	Startup: '#3B74FF',
	Other: '#FD99B3',
} as const satisfies Record<(typeof COMPANY_TYPES)[number], string>;

export type ApplicationProcess =
	| 'Apply'
	| (typeof APPLICATION_STATUSES)[number]
	| (typeof INTERVIEW_TYPES)[number];

export const APPLICATION_PROCESS_ICONS = {
	Apply: FilePen,
	Ongoing: Search,
	Ghosted: Ghost,
	Rejected: X,
	Offer: Sticker,
	OA: PencilLine,
	HR: Speech,
	Behavioral: MessageCircleMore,
	Technical: FileCode,
	Other: MessageCircleQuestion,
} as const satisfies Record<ApplicationProcess, unknown>;

export const APPLICATION_CATEGORIES = [
	'Upcoming',
	'Ongoing',
	'Offer',
	'Closed',
] as const;
export type ApplicationCategory = (typeof APPLICATION_CATEGORIES)[number];
export const APPLICATION_CATEGORY_ICONS = {
	Upcoming: CalendarArrowUp,
	Ongoing: RefreshCw,
	Offer: Sticker,
	Closed: CircleSlash,
} as const satisfies Record<ApplicationCategory, unknown>;

export const TIME_FORMAT = 'YYYY-MM-DD HH:mm';
