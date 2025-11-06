
export interface TokenUsage {
  model: string;
  tokens: number;
}

export interface DailyConsumption {
  date: string;
  tokens: TokenUsage[];
  ocrPages: number;
  n8nExecutions: number;
  woopiAiExecutions: number;
}

export interface PlanMultipliers {
  [key: string]: number; // e.g., 'gpt-4o': 0.00001, 'ocrPage': 0.1
  ocrPages: number;
  n8nExecutions: number;
  woopiAiExecutions: number;
}

export interface Plan {
  name: string;
  multipliers: PlanMultipliers;
}

export interface Client {
  name: string;
}

export type PeriodOption = 'this_month' | 'last_month' | 'last_7_days' | 'last_90_days' | 'custom';
