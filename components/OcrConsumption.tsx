import React, { useMemo } from 'react';
import type { DailyConsumption, Plan } from '../types';
import MetricCard from './MetricCard';
import ConsumptionChart from './ConsumptionChart';

interface OcrConsumptionProps {
  data: DailyConsumption[];
  plan: Plan;
}

const OcrConsumption: React.FC<OcrConsumptionProps> = ({ data, plan }) => {
  const { total, chartData } = useMemo(() => {
    let totalPages = 0;
    const dailyData = data.map(day => {
      totalPages += day.ocrPages;
      return {
        date: day.date,
        pages: day.ocrPages,
      };
    });
    return { total: totalPages, chartData: dailyData };
  }, [data]);

  const unitValue = plan.multipliers.ocrPages;
  const totalizerValue = useMemo(() => total * unitValue, [total, unitValue]);

  return (
    <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Páginas de Documento Processadas (OCR)</h2>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <MetricCard
          title="Total de Páginas Processadas"
          value={total.toLocaleString('pt-BR')}
          cost={`Valor unitário no plano atual: ${unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`}
          totalizerValue={totalizerValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        />
      </div>
      <h3 className="text-lg font-semibold mb-4">Consumo Diário</h3>
      <ConsumptionChart 
        data={chartData} 
        dataKey="pages" 
        dataName="Páginas"
        color="#0052ac" 
      />
    </div>
  );
};

export default OcrConsumption;