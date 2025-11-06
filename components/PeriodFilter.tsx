import React, { useState, useRef, useEffect } from 'react';
import type { PeriodOption } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PeriodFilterProps {
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  customStartDate: Date;
  customEndDate: Date;
  onCustomDateChange: (dates: { startDate?: Date | null; endDate?: Date | null }) => void;
}

const periods: { value: PeriodOption; label: string }[] = [
  { value: 'this_month', label: 'Este mês' },
  { value: 'last_month', label: 'Mês passado' },
  { value: 'last_7_days', label: 'Últimos 7 dias' },
  { value: 'last_90_days', label: 'Últimos 90 dias' },
];

const dateInputStyles = "bg-brand-secondary border border-gray-300 text-brand-text-primary text-sm rounded-lg focus:ring-brand-accent focus:border-brand-accent block w-full p-2.5";

const CalendarIcon = () => (
    <svg className="w-5 h-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
    </svg>
);


const PeriodFilter: React.FC<PeriodFilterProps> = ({ 
  selectedPeriod, 
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomDateChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(customStartDate);
  const [tempEndDate, setTempEndDate] = useState(customEndDate);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempStartDate(customStartDate);
    setTempEndDate(customEndDate);
  }, [customStartDate, customEndDate, isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const getDisplayLabel = () => {
    const period = periods.find(p => p.value === selectedPeriod);
    if (selectedPeriod !== 'custom' && period) {
      return period.label;
    }
    
    if (customStartDate && customEndDate) {
        const start = format(customStartDate, 'd MMM', { locale: ptBR });
        const end = format(customEndDate, 'd MMM yyyy', { locale: ptBR });
        if (format(customStartDate, 'yyyy') !== format(customEndDate, 'yyyy')) {
             return `${format(customStartDate, 'd MMM yyyy', { locale: ptBR })} - ${end}`;
        }
        return `${start} - ${end}`;
    }
    return "Selecione um período";
  };

  const handleApply = () => {
    onCustomDateChange({ startDate: tempStartDate, endDate: tempEndDate });
    onPeriodChange('custom');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handlePresetClick = (period: PeriodOption) => {
    onPeriodChange(period);
    setIsOpen(false);
  }

  return (
    <div className="relative w-full sm:w-auto" ref={wrapperRef}>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full sm:w-64 text-left px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-brand-secondary text-brand-text-primary border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
            aria-haspopup="true"
            aria-expanded={isOpen}
        >
            <span className="truncate">{getDisplayLabel()}</span>
            <svg className="w-5 h-5 ml-2 -mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full sm:w-[560px] rounded-md bg-white shadow-lg border border-gray-200 origin-top-left left-0">
            <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/3 p-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                    <ul className="space-y-1">
                        {periods.map(period => (
                            <li key={period.value}>
                                <button
                                    onClick={() => handlePresetClick(period.value)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                                        selectedPeriod === period.value && selectedPeriod !== 'custom'
                                        ? 'bg-blue-50 text-brand-accent font-semibold'
                                        : 'hover:bg-gray-100 text-brand-text-secondary'
                                    }`}
                                >
                                    {period.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full sm:w-2/3 p-4">
                     <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                        <div className="flex-1 w-full min-w-[150px]">
                            <label htmlFor="start-date" className="block mb-1 text-sm font-medium text-brand-text-secondary">Data de Início</label>
                            <div className="relative">
                                <input
                                    id="start-date"
                                    type="date"
                                    value={format(tempStartDate, 'yyyy-MM-dd')}
                                    onChange={(e) => setTempStartDate(e.target.valueAsDate || tempStartDate)}
                                    className={`${dateInputStyles} pr-10`}
                                    max={format(new Date(), 'yyyy-MM-dd')}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <CalendarIcon />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-w-[150px]">
                            <label htmlFor="end-date" className="block mb-1 text-sm font-medium text-brand-text-secondary">Data Final</label>
                            <div className="relative">
                                <input
                                id="end-date"
                                type="date"
                                value={format(tempEndDate, 'yyyy-MM-dd')}
                                onChange={(e) => setTempEndDate(e.target.valueAsDate || tempEndDate)}
                                className={`${dateInputStyles} pr-10`}
                                min={format(tempStartDate, 'yyyy-MM-dd')}
                                max={format(new Date(), 'yyyy-MM-dd')}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <CalendarIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-brand-secondary text-brand-text-secondary border border-gray-200 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-brand-accent text-white shadow-sm hover:bg-brand-accent-hover"
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PeriodFilter;