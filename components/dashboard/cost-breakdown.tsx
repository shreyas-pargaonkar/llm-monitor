import { CostBreakdown } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MODEL_COLORS } from '@/lib/mock-data';

interface CostBreakdownProps {
  costBreakdown: CostBreakdown[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatTokens(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(0);
}

export function CostBreakdown({ costBreakdown }: CostBreakdownProps) {
  const totalCost = costBreakdown.reduce((sum, item) => sum + item.cost, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown by Model</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-zinc-600">Total Cost</p>
          <p className="text-4xl font-bold text-zinc-900">{formatCurrency(totalCost)}</p>
        </div>

        <Separator className="mb-4" />

        <div className="space-y-4">
          {costBreakdown.map((item) => (
            <div key={item.model} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: MODEL_COLORS[item.model as keyof typeof MODEL_COLORS] }}
                />
                <div>
                  <p className="font-medium text-zinc-900">{item.model}</p>
                  <p className="text-xs text-zinc-500">{formatTokens(item.tokens)} tokens</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-zinc-900">{formatCurrency(item.cost)}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {item.percentage.toFixed(1)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
