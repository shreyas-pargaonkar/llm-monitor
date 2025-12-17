import { DashboardMetrics } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricsSummaryProps {
  metrics: DashboardMetrics;
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

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
}

function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-zinc-900">{value}</div>
        {description && <p className="mt-1 text-xs text-zinc-500">{description}</p>}
      </CardContent>
    </Card>
  );
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Tokens"
        value={formatNumber(metrics.totalTokens)}
        description="Across all models"
      />
      <MetricCard
        title="Total Cost"
        value={formatCurrency(metrics.totalCost)}
        description="API expenses"
      />
      <MetricCard
        title="Total Requests"
        value={formatNumber(metrics.totalRequests)}
        description="API calls made"
      />
      <MetricCard
        title="Avg Tokens/Request"
        value={formatNumber(metrics.averageTokensPerRequest)}
        description="Per API call"
      />
    </div>
  );
}
