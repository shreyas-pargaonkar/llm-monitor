import { subDays, format } from 'date-fns';
import { DashboardData, ModelName, TokenUsagePoint, ModelStats, CostBreakdown, DateRangeOption } from './types';

// Model pricing (per 1K tokens)
const MODEL_PRICING = {
  'GPT-4': { input: 0.03, output: 0.06 },
  'GPT-3.5': { input: 0.0015, output: 0.002 },
  'Claude 3 Opus': { input: 0.015, output: 0.075 },
  'Claude 3 Sonnet': { input: 0.003, output: 0.015 },
  'Claude 3 Haiku': { input: 0.00025, output: 0.00125 },
} as const;

// Model colors for charts
export const MODEL_COLORS = {
  'GPT-4': '#10b981',
  'GPT-3.5': '#3b82f6',
  'Claude 3 Opus': '#8b5cf6',
  'Claude 3 Sonnet': '#f59e0b',
  'Claude 3 Haiku': '#ec4899',
} as const;

// Model usage weights (should sum to 1)
const MODEL_WEIGHTS = {
  'GPT-4': 0.30,
  'GPT-3.5': 0.15,
  'Claude 3 Opus': 0.10,
  'Claude 3 Sonnet': 0.35,
  'Claude 3 Haiku': 0.10,
};

const MODELS: ModelName[] = ['GPT-4', 'GPT-3.5', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku'];

function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectModelByWeight(): ModelName {
  const random = Math.random();
  let cumulative = 0;

  for (const model of MODELS) {
    cumulative += MODEL_WEIGHTS[model];
    if (random <= cumulative) {
      return model;
    }
  }

  return 'Claude 3 Sonnet'; // Fallback
}

function generateTokenUsageData(days: number): TokenUsagePoint[] {
  const data: TokenUsagePoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const requestsPerDay = generateRandomInt(10, 50);

    // Add some variation - weekend days have fewer requests
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const actualRequests = isWeekend ? Math.floor(requestsPerDay * 0.6) : requestsPerDay;

    for (let j = 0; j < actualRequests; j++) {
      const model = selectModelByWeight();
      const promptTokens = generateRandomInt(100, 2000);
      const completionTokens = generateRandomInt(200, 3000);

      data.push({
        date: format(date, 'yyyy-MM-dd'),
        timestamp: date.getTime() + (j * 1000 * 60 * 5), // Spread throughout the day
        totalTokens: promptTokens + completionTokens,
        promptTokens,
        completionTokens,
        model,
      });
    }
  }

  return data;
}

function aggregateByDay(data: TokenUsagePoint[]): Record<string, Record<ModelName, TokenUsagePoint>> {
  const aggregated: Record<string, Record<ModelName, TokenUsagePoint>> = {};

  for (const point of data) {
    if (!aggregated[point.date]) {
      aggregated[point.date] = {} as Record<ModelName, TokenUsagePoint>;
    }

    if (!aggregated[point.date][point.model]) {
      aggregated[point.date][point.model] = {
        date: point.date,
        timestamp: new Date(point.date).getTime(),
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        model: point.model,
      };
    }

    const agg = aggregated[point.date][point.model];
    agg.totalTokens += point.totalTokens;
    agg.promptTokens += point.promptTokens;
    agg.completionTokens += point.completionTokens;
  }

  // Flatten to array
  const result: TokenUsagePoint[] = [];
  for (const date of Object.keys(aggregated).sort()) {
    for (const model of MODELS) {
      if (aggregated[date][model]) {
        result.push(aggregated[date][model]);
      }
    }
  }

  return aggregated;
}

function calculateModelStats(data: TokenUsagePoint[]): ModelStats[] {
  const stats: Record<ModelName, ModelStats> = {} as Record<ModelName, ModelStats>;

  for (const model of MODELS) {
    stats[model] = {
      model,
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      requestCount: 0,
      totalCost: 0,
      averageCostPerRequest: 0,
      color: MODEL_COLORS[model],
    };
  }

  for (const point of data) {
    const stat = stats[point.model];
    stat.totalTokens += point.totalTokens;
    stat.promptTokens += point.promptTokens;
    stat.completionTokens += point.completionTokens;
    stat.requestCount += 1;

    // Calculate cost
    const pricing = MODEL_PRICING[point.model];
    const inputCost = (point.promptTokens / 1000) * pricing.input;
    const outputCost = (point.completionTokens / 1000) * pricing.output;
    stat.totalCost += inputCost + outputCost;
  }

  // Calculate averages
  for (const model of MODELS) {
    const stat = stats[model];
    if (stat.requestCount > 0) {
      stat.averageCostPerRequest = stat.totalCost / stat.requestCount;
    }
  }

  return Object.values(stats).filter(s => s.requestCount > 0);
}

function calculateCostBreakdown(modelStats: ModelStats[]): CostBreakdown[] {
  const totalCost = modelStats.reduce((sum, stat) => sum + stat.totalCost, 0);

  return modelStats
    .map(stat => ({
      model: stat.model,
      cost: stat.totalCost,
      percentage: totalCost > 0 ? (stat.totalCost / totalCost) * 100 : 0,
      tokens: stat.totalTokens,
    }))
    .sort((a, b) => b.cost - a.cost);
}

export function generateMockDashboardData(dateRange: DateRangeOption = '30d'): DashboardData {
  // Generate full 90 days of data
  const fullData = generateTokenUsageData(90);

  // Filter based on date range
  const daysMap: Record<DateRangeOption, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    'all': 90,
  };

  const days = daysMap[dateRange];
  const cutoffDate = subDays(new Date(), days);
  const filteredData = fullData.filter(point => new Date(point.date) >= cutoffDate);

  // Aggregate by day for the chart
  const aggregated = aggregateByDay(filteredData);
  const tokenUsageOverTime: TokenUsagePoint[] = [];

  for (const date of Object.keys(aggregated).sort()) {
    for (const model of MODELS) {
      if (aggregated[date][model]) {
        tokenUsageOverTime.push(aggregated[date][model]);
      }
    }
  }

  // Calculate statistics
  const modelStats = calculateModelStats(filteredData);
  const costBreakdown = calculateCostBreakdown(modelStats);

  const totalTokens = filteredData.reduce((sum, point) => sum + point.totalTokens, 0);
  const totalCost = modelStats.reduce((sum, stat) => sum + stat.totalCost, 0);
  const totalRequests = filteredData.length;
  const averageTokensPerRequest = totalRequests > 0 ? totalTokens / totalRequests : 0;

  const dates = filteredData.map(p => p.date).sort();
  const startDate = dates[0] || format(new Date(), 'yyyy-MM-dd');
  const endDate = dates[dates.length - 1] || format(new Date(), 'yyyy-MM-dd');

  return {
    metrics: {
      totalTokens,
      totalCost,
      totalRequests,
      averageTokensPerRequest,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    },
    tokenUsageOverTime,
    modelStats,
    costBreakdown,
  };
}
