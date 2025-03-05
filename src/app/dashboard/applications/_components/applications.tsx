import { ApplicationWithMostRecentStatus } from '../../_data/applications';
import { ApplicationCard } from './applicaiton-card';

interface ApplicationsProps {
	applications: Array<ApplicationWithMostRecentStatus>;
}

export const Applications = ({ applications }: ApplicationsProps) => {
	return (
		<div className="grid grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] gap-2">
			{applications.map((application) => (
				<ApplicationCard application={application} key={application.id} />
			))}
		</div>
	);
};
