import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  cost?: string;
  totalizerValue?: string;
  children?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, cost, totalizerValue, children }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm flex-1">
      <div>
        <h3 className="text-brand-text-secondary text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className="mt-2">
          <p className="text-3xl font-bold text-brand-text-primary">{value}</p>
          {cost && <p className="text-sm text-brand-text-secondary font-medium mt-1">{cost}</p>}
        </div>
      </div>
      {totalizerValue && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-brand-text-secondary text-sm font-medium uppercase tracking-wider">Totalizador no Período</h4>
          <p className="text-2xl font-bold text-brand-accent mt-1">{totalizerValue}</p>
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default MetricCard;