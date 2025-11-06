import React, { useState, useMemo, useEffect } from 'react';
import type { DailyConsumption, Plan } from '../types';
import MetricCard from './MetricCard';
import ConsumptionChart from './ConsumptionChart';

interface TokenConsumptionProps {
  data: DailyConsumption[];
  plan: Plan;
}

const TokenConsumption: React.FC<TokenConsumptionProps> = ({ data, plan }) => {
  const aiModels = useMemo(() => {
    const models = new Set<string>();
    data.forEach(d => d.tokens.forEach(t => models.add(t.model)));
    return Array.from(models).sort();
  }, [data]);

  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    if (aiModels.length > 0 && !aiModels.includes(selectedModel)) {
      setSelectedModel(aiModels[0]);
    } else if (aiModels.length === 0) {
      setSelectedModel('');
    }
  }, [aiModels, selectedModel]);

  const handleModelChange = (direction: 'next' | 'prev') => {
    const currentIndex = aiModels.indexOf(selectedModel);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % aiModels.length;
    } else {
      nextIndex = (currentIndex - 1 + aiModels.length) % aiModels.length;
    }
    setSelectedModel(aiModels[nextIndex]);
  };

  const { totalTokens, chartData } = useMemo(() => {
    if (!selectedModel) return { totalTokens: 0, chartData: [] };
    
    let total = 0;
    const dailyData = data.map(day => {
      const modelUsage = day.tokens.find(t => t.model === selectedModel);
      const tokensToday = modelUsage ? modelUsage.tokens : 0;
      total += tokensToday;
      return {
        date: day.date,
        tokens: tokensToday,
      };
    });
    return { totalTokens: total, chartData: dailyData };
  }, [data, selectedModel]);

  const unitValue = useMemo(() => {
    if (!selectedModel) return 0;
    return plan.multipliers[selectedModel] || 0;
  }, [selectedModel, plan]);

  const totalizerValue = useMemo(() => totalTokens * unitValue, [totalTokens, unitValue]);

  if (aiModels.length === 0 && data.length > 0) {
    return <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm">Carregando modelos de IA...</div>;
  }
  
  if (aiModels.length === 0) {
      return (
        <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <h2 className="text-xl font-semibold mb-2">Consumo de Tokens de IA</h2>
            <p className="text-brand-text-secondary">Nenhum dado de consumo de token encontrado para o período selecionado.</p>
        </div>
      );
  }

  return (
    <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">Consumo de Tokens de IA</h2>
        <div className="w-full sm:w-auto flex items-center justify-center gap-3 sm:gap-4" aria-label="Navegação de modelos de IA">
           <button
             onClick={() => handleModelChange('prev')}
             disabled={aiModels.length <= 1}
             className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             aria-label="Modelo anterior"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
             </svg>
           </button>
           <span className="font-semibold text-brand-text-primary text-center w-48 sm:w-56" aria-live="polite">
            {selectedModel}
           </span>
           <button
             onClick={() => handleModelChange('next')}
             disabled={aiModels.length <= 1}
             className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             aria-label="Próximo modelo"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <MetricCard
          title="Total de Tokens Consumidos"
          value={totalTokens.toLocaleString('pt-BR')}
          cost={`Valor unitário no plano atual: ${unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`}
          totalizerValue={totalizerValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        />
      </div>
      
      <h3 className="text-lg font-semibold mb-4">Consumo Diário de Tokens</h3>
      <ConsumptionChart 
        data={chartData} 
        dataKey="tokens" 
        dataName="Tokens"
        color="#0060c7" 
      />
    </div>
  );
};

export default TokenConsumption;