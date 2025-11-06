import React from 'react';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';

interface TotalCostCardProps {
  totalCost: number;
}

const TotalCostCard: React.FC<TotalCostCardProps> = ({ totalCost }) => {
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalCost);

  return (
    <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm text-center">
      <div className="flex items-center justify-center gap-1.5">
        <h2 className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider">Total WTC</h2>
        <Tooltip content="WTC (Woopi Total Cost) é a soma ponderada do consumo no período selecionado, baseada nos multiplicadores do seu plano. Este não é um valor financeiro.">
            <InfoIcon />
        </Tooltip>
      </div>
      <p className="text-4xl font-bold text-brand-accent my-2">{formattedTotal}</p>
    </div>
  );
};

export default TotalCostCard;
