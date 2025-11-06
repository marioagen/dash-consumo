import React from 'react';

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
      <h2 className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider">Total WTC</h2>
      <p className="text-4xl font-bold text-brand-accent my-2">{formattedTotal}</p>
      <p className="text-xs text-brand-text-secondary">
        Soma ponderada do consumo no período selecionado. Este não é um valor financeiro.
      </p>
    </div>
  );
};

export default TotalCostCard;