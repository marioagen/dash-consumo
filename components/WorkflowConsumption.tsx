import React, { useMemo } from 'react';
import type { DailyConsumption, Plan } from '../types';
import MetricCard from './MetricCard';
import ConsumptionChart from './ConsumptionChart';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';

interface WorkflowConsumptionProps {
  data: DailyConsumption[];
  plan: Plan;
}

const WorkflowConsumption: React.FC<WorkflowConsumptionProps> = ({ data, plan }) => {
  const { aiAutomationTotal, woopiTotal, aiAutomationChartData, woopiChartData } = useMemo(() => {
    let aiAutomationSum = 0;
    let woopiSum = 0;
    const aiAutomationDaily = data.map(day => {
      aiAutomationSum += day.aiAutomationExecutions;
      return { date: day.date, executions: day.aiAutomationExecutions };
    });
    const woopiDaily = data.map(day => {
      woopiSum += day.woopiAiExecutions;
      return { date: day.date, executions: day.woopiAiExecutions };
    });
    return { aiAutomationTotal: aiAutomationSum, woopiTotal: woopiSum, aiAutomationChartData: aiAutomationDaily, woopiChartData: woopiDaily };
  }, [data]);

  const aiAutomationUnitValue = plan.multipliers.aiAutomationExecutions;
  const aiAutomationTotalizerValue = useMemo(() => aiAutomationTotal * aiAutomationUnitValue, [aiAutomationTotal, aiAutomationUnitValue]);

  const woopiUnitValue = plan.multipliers.woopiAiExecutions;
  const woopiTotalizerValue = useMemo(() => woopiTotal * woopiUnitValue, [woopiTotal, woopiUnitValue]);

  return (
    <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
      <div>
        <div className="flex items-center gap-1.5 mb-4">
            <h2 className="text-xl font-semibold">Execuções de Workflows de Automação de IA</h2>
            <Tooltip content="Número de vezes que os fluxos de automação de IA foram executados.">
                <InfoIcon />
            </Tooltip>
        </div>
        <MetricCard
          title="Total de Execuções de Automação de IA"
          value={aiAutomationTotal.toLocaleString('pt-BR')}
          cost={`Valor unitário no plano atual: ${aiAutomationUnitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`}
          totalizerValue={aiAutomationTotalizerValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        />
        <div className="mt-4">
          <ConsumptionChart 
            data={aiAutomationChartData} 
            dataKey="executions" 
            dataName="Execuções de Automação de IA"
            color="#00438f"
          />
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center gap-1.5 mb-4">
            <h2 className="text-xl font-semibold">Execuções de Workflows Woopi AI</h2>
            <Tooltip content="Número de vezes que os fluxos de automação criados na plataforma Woopi AI foram executados.">
                <InfoIcon />
            </Tooltip>
        </div>
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
