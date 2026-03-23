"use client";

import * as React from 'react';
import { ResponsiveContainer } from 'recharts';

import { cn } from '~/utils/ui';

export type ChartConfig = Record<
	string,
	{
		label?: string;
		color?: string;
	}
>;

type ChartContainerProps = React.ComponentProps<'div'> & {
	config: ChartConfig;
	children: React.ComponentProps<
		typeof import('recharts').ResponsiveContainer
	>['children'];
};

export function ChartContainer({
	id,
	className,
	children,
	config,
	...props
}: ChartContainerProps) {
	const uniqueId = React.useId().replace(/:/g, '');
	const chartId = `chart-${id ?? uniqueId}`;

	const style = React.useMemo(() => {
		return Object.entries(config).reduce<Record<string, string>>((acc, [key, item]) => {
			if (!item.color) return acc;
			acc[`--color-${key}`] = item.color;
			return acc;
		}, {});
	}, [config]);

	return (
		<div
			data-chart={chartId}
			className={cn(
				'flex h-full w-full min-h-0 justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-none',
				className,
			)}
			style={style}
			{...props}
		>
			<ResponsiveContainer width="100%" height="100%">
				{children}
			</ResponsiveContainer>
		</div>
	);
}
