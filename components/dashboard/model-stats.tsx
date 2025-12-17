import { ModelStats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ModelStatsProps {
  modelStats: ModelStats[];
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(0);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface ModelStatCardProps {
  stat: ModelStats;
}

function ModelStatCard({ stat }: ModelStatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{stat.model}</CardTitle>
          <Badge style={{ backgroundColor: stat.color, color: 'white' }} className="border-0">
            {formatNumber(stat.requestCount)} calls
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-600">Total Tokens</p>
            <p className="text-lg font-semibold text-zinc-900">{formatNumber(stat.totalTokens)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600">Total Cost</p>
            <p className="text-lg font-semibold text-zinc-900">{formatCurrency(stat.totalCost)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600">Avg Tokens</p>
            <p className="text-lg font-semibold text-zinc-900">
              {formatNumber(stat.totalTokens / stat.requestCount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-600">Avg Cost</p>
            <p className="text-lg font-semibold text-zinc-900">
              {formatCurrency(stat.averageCostPerRequest)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ModelStats({ modelStats }: ModelStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {modelStats.map((stat) => (
            <ModelStatCard key={stat.model} stat={stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
