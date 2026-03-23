import { db } from '~/db';

type SankeyStage =
	| 'Apply'
	| 'OA'
	| `Interview #${number}`
	| 'Ongoing'
	| 'Offer'
	| 'Rejected'
	| 'Ghosted';

export type SankeyNode = { name: SankeyStage };
export type SankeyLink = { source: number; target: number; value: number };
export type SankeyData = { nodes: SankeyNode[]; links: SankeyLink[] };

const stageRank = (stage: SankeyStage): number => {
	if (stage === 'Apply') return 0;
	if (stage === 'OA') return 1;
	if (stage.startsWith('Interview #')) {
		const interviewNumber = Number(stage.replace('Interview #', ''));
		return 2 + interviewNumber;
	}
	if (stage === 'Offer') return 100;
	if (stage === 'Ghosted') return 101;
	if (stage === 'Rejected') return 102;
	if (stage === 'Ongoing') return 103;
	return Number.MAX_SAFE_INTEGER;
};

const buildApplicationPath = (
	interviewTypes: string[],
	finalStatus: string,
): SankeyStage[] => {
	const orderedInterviews = interviewTypes;

	const stages: SankeyStage[] = ['Apply'];
	let hasOA = false;
	let interviewRound = 0;

	for (const interviewType of orderedInterviews) {
		if (interviewType === 'OA' && !hasOA) {
			stages.push('OA');
			hasOA = true;
			continue;
		}
		interviewRound += 1;
		stages.push(`Interview #${interviewRound}`);
	}

	if (
		(finalStatus === 'Offer' ||
			finalStatus === 'Rejected' ||
			finalStatus === 'Ghosted') &&
		stages[stages.length - 1] !== finalStatus
	) {
		stages.push(finalStatus);
	} else if (finalStatus === 'Ongoing' && stages[stages.length - 1] !== 'Ongoing') {
		stages.push('Ongoing');
	}

	return stages;
};

export const getApplicationProcessSankeyData = async (
	userId: string,
): Promise<SankeyData> => {
	const applications = await db.query.applicationsTable.findMany({
		where: (applications, { eq }) => eq(applications.userId, userId),
		with: {
			interviews: {
				orderBy: (interviews, { asc }) => asc(interviews.date),
			},
		},
	});
	const edgeWeights = new Map<string, number>();

	for (const application of applications) {
		const interviews = application.interviews.map((interview) =>
			String(interview.type),
		);
		const path = buildApplicationPath(interviews, application.status);

		for (let index = 0; index < path.length - 1; index += 1) {
			const source = path[index];
			const target = path[index + 1];
			const edgeKey = `${source}->${target}`;
			edgeWeights.set(edgeKey, (edgeWeights.get(edgeKey) ?? 0) + 1);
		}
	}

	const nodeNames = new Set<SankeyStage>();
	for (const edgeKey of edgeWeights.keys()) {
		const [source, target] = edgeKey.split('->') as [SankeyStage, SankeyStage];
		nodeNames.add(source);
		nodeNames.add(target);
	}

	if (nodeNames.size === 0) {
		return { nodes: [], links: [] };
	}

	const sortedNodeNames = [...nodeNames].toSorted(
		(a, b) => stageRank(a) - stageRank(b),
	);
	const nodeIndex = new Map(
		sortedNodeNames.map((name, index) => [name, index]),
	);

	const links: SankeyLink[] = [...edgeWeights.entries()].map(
		([edgeKey, value]) => {
			const [sourceName, targetName] = edgeKey.split('->') as [
				SankeyStage,
				SankeyStage,
			];
			return {
				source: nodeIndex.get(sourceName) ?? 0,
				target: nodeIndex.get(targetName) ?? 0,
				value,
			};
		},
	);

	return {
		nodes: sortedNodeNames.map((name) => ({ name })),
		links,
	};
};
