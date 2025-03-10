import { Input } from '~/components/ui/input';
import { convertDateTimeLocalString } from '~/utils/convert-date-time-local-string';

interface DateTimePickerProps {
	value: Date | null | undefined;
	onChange: (value: Date) => void;
	allowFuture?: boolean;
}
export const DatetimePicker = ({
	value,
	onChange,
	allowFuture,
}: DateTimePickerProps) => {
	return (
		<Input
			type="datetime-local"
			value={convertDateTimeLocalString(value ?? new Date())}
			onChange={(e) => onChange(new Date(e.target.value))}
			max={allowFuture ? undefined : convertDateTimeLocalString(new Date())}
		/>
	);
};
