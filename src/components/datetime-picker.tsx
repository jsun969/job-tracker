import { SelectGroup } from '@radix-ui/react-select';
import { group } from 'radash';
import { useEffect, useState } from 'react';

import { Input } from '~/components/ui/input';
import { TIME_FORMAT } from '~/constants';
import { time } from '~/lib/time';
import { convertDateTimeLocalString } from '~/utils/convert-date-time-local-string';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from './ui/select';

interface DatetimePickerProps {
	value: Date | null | undefined;
	onChange: (value: Date) => void;
	allowFuture?: boolean;
}
export const DatetimePicker = ({
	value,
	onChange,
	allowFuture,
}: DatetimePickerProps) => {
	return (
		<Input
			type="datetime-local"
			value={convertDateTimeLocalString(value ?? new Date())}
			onChange={(e) => onChange(new Date(e.target.value))}
			max={allowFuture ? undefined : convertDateTimeLocalString(new Date())}
		/>
	);
};

const getISOString = (date: time.Dayjs) => {
	try {
		return date.toISOString();
	} catch {
		return 'INVALID';
	}
};
const TIMEZONES = Intl.supportedValuesOf('timeZone');
const TIMEZONES_BY_CONTINENT = group(TIMEZONES, (tz) => tz.split('/')[0]);
const CURRENT_TIMEZONE = time.tz.guess();
export const AdvancedDatetimePicker = ({
	value,
	onChange,
}: DatetimePickerProps) => {
	const [timezone, setTimezone] = useState<string>(CURRENT_TIMEZONE);
	const [extraDays, setExtraDays] = useState<number>(0);
	const [inputDate, setInputDate] = useState<Date>(value ?? new Date());
	const finalDate = time(inputDate).add(extraDays, 'day').tz(timezone, true);

	useEffect(() => {
		onChange(finalDate.toDate());
	}, [getISOString(finalDate)]);

	return (
		<div className="grid grid-cols-8 items-center gap-2">
			<div className="col-span-5">
				<DatetimePicker value={inputDate} onChange={setInputDate} allowFuture />
			</div>
			<div className="col-span-3 flex items-baseline gap-2 text-sm">
				+
				<Input
					type="number"
					value={extraDays}
					onChange={(e) => setExtraDays(Number(e.target.value))}
				/>
				days
			</div>
			<Select value={timezone} onValueChange={setTimezone}>
				<SelectTrigger className="col-span-3">
					<SelectValue placeholder="Timezone" asChild>
						<span>{timezone}</span>
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{Object.entries(TIMEZONES_BY_CONTINENT).map(
						([continent, timezones]) => (
							<SelectGroup key={continent}>
								<SelectLabel>{continent}</SelectLabel>
								{timezones?.map((tz) => (
									<SelectItem value={tz} key={tz} className="pl-4">
										{tz.slice(continent.length + 1)}
									</SelectItem>
								))}
							</SelectGroup>
						),
					)}
				</SelectContent>
			</Select>
			<div className="col-span-5 text-center text-sm text-secondary-foreground">
				{finalDate.tz(CURRENT_TIMEZONE).format(TIME_FORMAT)} ({CURRENT_TIMEZONE}
				)
			</div>
		</div>
	);
};
