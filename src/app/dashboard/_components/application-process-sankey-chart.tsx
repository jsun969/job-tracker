'use client';

import { useMemo } from 'react';
import { Sankey, Tooltip } from 'recharts';
import type { SankeyNodeProps } from 'recharts/types';

import { ChartContainer, type ChartConfig } from '~/components/ui/chart';

type SankeyNode = { name: string };
type SankeyLink = { source: number; target: number; value: number };

const stageColorMap: Record<string, string> = {
	Apply: 'hsl(var(--chart-1))',
	OA: 'hsl(var(--chart-2))',
	Interview: 'hsl(var(--chart-4))',
	Ongoing: 'hsl(var(--chart-3))',
	Offer: 'hsl(142 76% 36%)',
	Rejected: 'hsl(var(--destructive))',
	Ghosted: 'hsl(263 70% 50%)',
};

const chartConfig = Object.fromEntries(
	Object.entries(stageColorMap).map(([stage, color]) => [
		stage,
		{ label: stage, color },
	]),
) satisfies ChartConfig;

type ApplicationProcessSankeyChartProps = {
	nodes: SankeyNode[];
	links: SankeyLink[];
};

type SankeyNodeWithCount = SankeyNode & { count: number };

const CustomSankeyNode = (props: SankeyNodeProps) => {
	const { x, y, width, height, payload } = props;
	const name = String(payload.name ?? '');
	const nodeCount = Number(payload.value ?? 0);
	const fill =
		stageColorMap[name] ??
		(name.startsWith('Interview #')
			? stageColorMap.Interview
			: 'hsl(var(--primary))');
	const label = `${name} (${nodeCount})`;

	const showLabelOnRight = Number(x) < 500;
	const labelX = showLabelOnRight ? x + width + 8 : x - 8;
	const textAnchor = showLabelOnRight ? 'start' : 'end';

	return (
		<g>
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				fill={fill}
				fillOpacity={0.9}
				stroke="hsl(var(--border))"
				strokeWidth={1}
			/>
			<text
				x={labelX}
				y={y + height / 2}
				dy="0.35em"
				textAnchor={textAnchor}
				fontSize={12}
				fill="hsl(var(--foreground))"
			>
				{label}
			</text>
		</g>
	);
};

export const ApplicationProcessSankeyChart = ({
	nodes,
	links,
}: ApplicationProcessSankeyChartProps) => {
	const nodesWithCount = useMemo<SankeyNodeWithCount[]>(() => {
		const incoming = Array.from({ length: nodes.length }, () => 0);
		const outgoing = Array.from({ length: nodes.length }, () => 0);

		for (const link of links) {
			outgoing[link.source] += link.value;
			incoming[link.target] += link.value;
		}

		return nodes.map((node, index) => ({
			...node,
			count: Math.max(incoming[index], outgoing[index]),
		}));
	}, [links, nodes]);

	if (links.length === 0) {
		return (
			<div className="flex h-full items-center justify-center text-muted-foreground">
				No process transitions yet.
			</div>
		);
	}

	return (
		<ChartContainer config={chartConfig} className="h-full w-full">
			<Sankey
				data={{ nodes: nodesWithCount, links }}
				margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
				nodePadding={24}
				nodeWidth={16}
				linkCurvature={0.5}
				iterations={64}
				node={CustomSankeyNode}
				link={{
					stroke: 'hsl(var(--muted-foreground))',
					strokeOpacity: 0.35,
				}}
			>
				<Tooltip />
			</Sankey>
		</ChartContainer>
	);
};
