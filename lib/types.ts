export type ModelName = 'GPT-4' | 'GPT-3.5' | 'Claude 3 Opus' | 'Claude 3 Sonnet' | 'Claude 3 Haiku';

export interface TokenUsagePoint {
  date: string; // ISO date string
  timestamp: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  model: ModelName;
}

export interface ModelStats {
  model: ModelName;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  requestCount: number;
  totalCost: number;
  averageCostPerRequest: number;
  color: string; // For charts
}

export interface CostBreakdown {
  model: ModelName;
  cost: number;
  percentage: number;
  tokens: number;
}

export interface DashboardMetrics {
  totalTokens: number;
  totalCost: number;
  totalRequests: number;
  averageTokensPerRequest: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface DashboardData {
  metrics: DashboardMetrics;
  tokenUsageOverTime: TokenUsagePoint[];
  modelStats: ModelStats[];
  costBreakdown: CostBreakdown[];
}

export type DateRangeOption = '7d' | '30d' | '90d' | 'all';
