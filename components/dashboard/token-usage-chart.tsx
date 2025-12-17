"use client";

import { TokenUsagePoint } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MODEL_COLORS } from '@/lib/mock-data';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';

interface TokenUsageChartProps {
  data: TokenUsagePoint[];
}

function formatTokens(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

export function TokenUsageChart({ data }: TokenUsageChartProps) {
  // Group data by date and create chart data structure
  const chartData = data.reduce((acc, point) => {
    const existing = acc.find((item) => item.date === point.date);
    if (existing) {
      existing[point.model] = (existing[point.model] || 0) + point.totalTokens;
    } else {
      acc.push({
        date: point.date,
        [point.model]: point.totalTokens,
      });
    }
    return acc;
  }, [] as Array<Record<string, string | number>>);

  // Sort by date
  chartData.sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime());

  const models = Object.keys(MODEL_COLORS);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Usage Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              {models.map((model) => (
                <linearGradient key={model} id={`color${model}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={MODEL_COLORS[model as keyof typeof MODEL_COLORS]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={MODEL_COLORS[model as keyof typeof MODEL_COLORS]} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" opacity={0.5} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM dd')}
              className="text-xs text-zinc-600"
              tick={{ fill: '#52525b' }}
            />
            <YAxis
              tickFormatter={formatTokens}
              className="text-xs text-zinc-600"
              tick={{ fill: '#52525b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e4e4e7',
                borderRadius: '6px',
                padding: '8px 12px',
              }}
              labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
              formatter={(value: number, name: string) => [formatTokens(value), name]}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            {models.map((model) => (
              <Area
                key={model}
                type="monotone"
                dataKey={model}
                stackId="1"
                stroke={MODEL_COLORS[model as keyof typeof MODEL_COLORS]}
                fill={`url(#color${model})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
