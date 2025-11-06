import type { DailyConsumption, Plan } from '../types';
import { subDays, format } from 'date-fns';

const AI_MODELS = ['gpt-4o', 'embeddings-text-large-3', 'gpt-4o-mini', 'gemini-1.5-pro'];

const generateDailyData = (date: Date): DailyConsumption => {
  return {
    date: format(date, 'yyyy-MM-dd'),
    tokens: AI_MODELS.map(model => ({
      model,
      tokens: Math.floor(Math.random() * 50000) + 1000,
    })),
    ocrPages: Math.floor(Math.random() * 200) + 10,
    n8nExecutions: Math.floor(Math.random() * 500) + 50,
    woopiAiExecutions: Math.floor(Math.random() * 300) + 30,
  };
};

export const mockConsumptionData: DailyConsumption[] = Array.from({ length: 120 }, (_, i) => {
  const date = subDays(new Date(), i);
  return generateDailyData(date);
}).reverse();

export const enterprisePlan: Plan = {
  name: 'Plano Enterprise',
  multipliers: {
    'gpt-4o': 0.000015,
    'embeddings-text-large-3': 0.0000001,
    'gpt-4o-mini': 0.000005,
    'gemini-1.5-pro': 0.000012,
    ocrPages: 0.08,
    n8nExecutions: 0.04,
    woopiAiExecutions: 0.06,
  },
};

export const clientData = {
  client: { name: 'Woopi AI' },
  plan: enterprisePlan,
};