"use client";

import { useMemo, useState } from 'react';
import { DateRangeOption } from '@/lib/types';
import { generateMockDashboardData } from '@/lib/mock-data';
import { DashboardHeader } from '@/components/dashboard/header';
import { DateRangeSelector } from '@/components/dashboard/date-range-selector';
import { MetricsSummary } from '@/components/dashboard/metrics-summary';
import { TokenUsageChart } from '@/components/dashboard/token-usage-chart';
import { CostBreakdown } from '@/components/dashboard/cost-breakdown';
import { ModelStats } from '@/components/dashboard/model-stats';

export default function DashboardPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>('30d');

  // Generate mock data based on selected date range
  const dashboardData = useMemo(() => {
    return generateMockDashboardData(selectedDateRange);
  }, [selectedDateRange]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader
          title="LLM Token Consumption"
          dateRange={dashboardData.metrics.dateRange}
        >
          <DateRangeSelector
            value={selectedDateRange}
            onChange={setSelectedDateRange}
          />
        </DashboardHeader>

        <div className="mt-8 space-y-6">
          <MetricsSummary metrics={dashboardData.metrics} />

          <TokenUsageChart data={dashboardData.tokenUsageOverTime} />

          <div className="grid gap-6 lg:grid-cols-2">
            <CostBreakdown costBreakdown={dashboardData.costBreakdown} />
            <ModelStats modelStats={dashboardData.modelStats} />
          </div>
        </div>
      </div>
    </div>
  );
}
