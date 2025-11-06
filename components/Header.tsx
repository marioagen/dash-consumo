import React from 'react';
import type { Client, Plan } from '../types';

interface HeaderProps {
  client: Client;
  plan: Plan;
}

const Header: React.FC<HeaderProps> = ({ client, plan }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-primary">Dashboard de Consumo e Bilhetagem</h1>
        <p className="text-brand-text-secondary mt-1">{client.name}</p>
      </div>
      <div className="text-right bg-brand-accent-light p-4 rounded-xl border border-gray-300 shadow-sm">
        <span className="text-sm text-brand-accent-hover block">Plano Atual</span>
        <span className="font-semibold text-brand-accent-hover">{plan.name}</span>
      </div>
    </header>
  );
};

export default Header;