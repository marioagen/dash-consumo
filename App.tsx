import React, { useState, useMemo } from 'react';
import { subDays, startOfMonth, endOfMonth, endOfDay, format, startOfDay } from 'date-fns';
import { clientData, mockConsumptionData } from './services/mockData';
import type { PeriodOption } from './types';
import Header from './components/Header';
import PeriodFilter from './components/PeriodFilter';
import ExportButton from './components/ExportButton';
import TokenConsumption from './components/TokenConsumption';
import OcrConsumption from './components/OcrConsumption';
import WorkflowConsumption from './components/WorkflowConsumption';
import TotalCostCard from './components/TotalCostCard';
import { filterDataByDateRange } from './utils/dataUtils';

const App: React.FC = () => {
  const [period, setPeriod] = useState<PeriodOption>('this_month');
  const today = useMemo(() => new Date(), []);
  
  const getDateRange = (periodOption: PeriodOption): [Date, Date] => {
    switch (periodOption) {
      case 'last_7_days':
        return [subDays(today, 6), endOfDay(today)];
      case 'last_month':
        const lastMonthStart = startOfMonth(subDays(today, 30));
        const lastMonthEnd = endOfMonth(subDays(today, 30));
        return [lastMonthStart, lastMonthEnd];
      case 'last_90_days':
        return [subDays(today, 89), endOfDay(today)];
      case 'this_month':
      default:
        return [startOfMonth(today), endOfDay(today)];
    }
  };

  const [dateRange, setDateRange] = useState<[Date, Date]>(getDateRange(period));
  const [customDateRange, setCustomDateRange] = useState<[Date, Date]>([startOfMonth(today), endOfDay(today)]);

  const handlePeriodChange = (newPeriod: PeriodOption) => {
    setPeriod(newPeriod);
    if (newPeriod === 'custom') {
      const newRange: [Date, Date] = [startOfDay(customDateRange[0]), endOfDay(customDateRange[1])];
      setDateRange(newRange);
    } else {
      const newRange = getDateRange(newPeriod);
      setDateRange(newRange);
      setCustomDateRange(newRange);
    }
  };
  
  const handleCustomDateChange = ({ startDate, endDate }: { startDate?: Date | null; endDate?: Date | null }) => {
    const newStartDate = startDate ? startOfDay(startDate) : customDateRange[0];
    const newEndDate = endDate ? endOfDay(endDate) : customDateRange[1];

    if (newEndDate < newStartDate) {
      const newRange: [Date, Date] = [newStartDate, newStartDate];
      setCustomDateRange(newRange);
      setDateRange(newRange);
      return;
    }

    const newRange: [Date, Date] = [newStartDate, newEndDate];
    setCustomDateRange(newRange);
    setDateRange(newRange);
  };

  const filteredData = useMemo(() => {
    return filterDataByDateRange(mockConsumptionData, dateRange[0], dateRange[1]);
  }, [dateRange]);

  const totalCost = useMemo(() => {
    return filteredData.reduce((total, day) => {
      const tokensCost = day.tokens.reduce((acc, tokenUsage) => {
        const multiplier = clientData.plan.multipliers[tokenUsage.model] || 0;
        return acc + tokenUsage.tokens * multiplier;
      }, 0);

      const ocrCost = day.ocrPages * clientData.plan.multipliers.ocrPages;
      const n8nCost = day.n8nExecutions * clientData.plan.multipliers.n8nExecutions;
      const woopiAiCost = day.woopiAiExecutions * clientData.plan.multipliers.woopiAiExecutions;
      
      return total + tokensCost + ocrCost + n8nCost + woopiAiCost;
    }, 0);
  }, [filteredData, clientData.plan.multipliers]);

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    const headers = ['Date', 'Model', 'Tokens', 'OCR Pages', 'N8N Executions', 'Woopi AI Executions'];
    
    const rows = filteredData.flatMap(day => {
      if (day.tokens && day.tokens.length > 0) {
        return day.tokens.map(tokenUsage => [
          day.date,
          `"${tokenUsage.model}"`,
          tokenUsage.tokens.toString(),
          day.ocrPages.toString(),
          day.n8nExecutions.toString(),
          day.woopiAiExecutions.toString(),
        ]);
      }
      return [[
        day.date,
        'N/A',
        '0',
        day.ocrPages.toString(),
        day.n8nExecutions.toString(),
        day.woopiAiExecutions.toString(),
      ]];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const startDate = format(dateRange[0], 'yyyy-MM-dd');
    const endDate = format(dateRange[1], 'yyyy-MM-dd');
    link.setAttribute('download', `consumption_data_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-brand-primary p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header client={clientData.client} plan={clientData.plan} />
        <div className="flex flex-wrap items-start sm:items-center gap-4 justify-between">
          <PeriodFilter 
            selectedPeriod={period} 
            onPeriodChange={handlePeriodChange} 
            customStartDate={customDateRange[0]}
            customEndDate={customDateRange[1]}
            onCustomDateChange={handleCustomDateChange}
          />
          <ExportButton onClick={handleExportCSV} disabled={filteredData.length === 0} />
        </div>
        
        <TotalCostCard totalCost={totalCost} />

        <div className="grid grid-cols-1 gap-6">
          <TokenConsumption data={filteredData} plan={clientData.plan} />
          <OcrConsumption data={filteredData} plan={clientData.plan} />
          <WorkflowConsumption data={filteredData} plan={clientData.plan} />
        </div>
      </div>
    </div>
  );
};

export default App;