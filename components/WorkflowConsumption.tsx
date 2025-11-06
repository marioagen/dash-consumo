import React, { useMemo } from 'react';
import type { DailyConsumption, Plan } from '../types';
import MetricCard from './MetricCard';
import ConsumptionChart from './ConsumptionChart';

interface WorkflowConsumptionProps {
  data: DailyConsumption[];
  plan: Plan;
}

const WorkflowConsumption: React.FC<WorkflowConsumptionProps> = ({ data, plan }) => {
  const { n8nTotal, woopiTotal, n8nChartData, woopiChartData } = useMemo(() => {
    let n8nSum = 0;
    let woopiSum = 0;
    const n8nDaily = data.map(day => {
      n8nSum += day.n8nExecutions;
      return { date: day.date, executions: day.n8nExecutions };
    });
    const woopiDaily = data.map(day => {
      woopiSum += day.woopiAiExecutions;
      return { date: day.date, executions: day.woopiAiExecutions };
    });
    return { n8nTotal: n8nSum, woopiTotal: woopiSum, n8nChartData: n8nDaily, woopiChartData: woopiDaily };
  }, [data]);

  const n8nUnitValue = plan.multipliers.n8nExecutions;
  const n8nTotalizerValue = useMemo(() => n8nTotal * n8nUnitValue, [n8nTotal, n8nUnitValue]);

  const woopiUnitValue = plan.multipliers.woopiAiExecutions;
  const woopiTotalizerValue = useMemo(() => woopiTotal * woopiUnitValue, [woopiTotal, woopiUnitValue]);

  return (
    <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Execuções de Workflows N8N</h2>
        <MetricCard
          title="Total de Execuções N8N"
          value={n8nTotal.toLocaleString('pt-BR')}
          cost={`Valor unitário no plano atual: ${n8nUnitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`}
          totalizerValue={n8nTotalizerValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        />
        <div className="mt-4">
          <ConsumptionChart 
            data={n8nChartData} 
            dataKey="executions" 
            dataName="Execuções N8N"
            color="#00438f"
          />
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold mb-4">Execuções de Workflows Woopi AI</h2>
        <MetricCard
          title="Total de Execuções Woopi AI"
          value={woopiTotal.toLocaleString('pt-BR')}
          cost={`Valor unitário no plano atual: ${woopiUnitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`}
          totalizerValue={woopiTotalizerValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        />
         <div className="mt-4">
          <ConsumptionChart 
            data={woopiChartData} 
            dataKey="executions" 
            dataName="Execuções Woopi AI"
            color="#003575"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowConsumption;