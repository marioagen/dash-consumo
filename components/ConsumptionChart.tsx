import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChartData {
  date: string;
  [key: string]: number | string;
}

interface ConsumptionChartProps {
  data: ChartData[];
  dataKey: string;
  dataName: string;
  color: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formattedDate = format(parseISO(label), 'dd MMM, yyyy', { locale: ptBR });
    return (
      <div className="bg-brand-secondary p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-brand-text-primary">{formattedDate}</p>
        <p style={{ color: payload[0].color }}>
          {`${payload[0].name}: ${payload[0].value.toLocaleString('pt-BR')}`}
        </p>
      </div>
    );
  }
  return null;
};

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data, dataKey, dataName, color }) => {
  return (
    <div className="h-64 w-full">
       <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7281"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(str) => format(parseISO(str), 'dd/MM')}
          />
          <YAxis 
            stroke="#6B7281"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(209, 213, 219, 0.4)' }} />
          <Bar dataKey={dataKey} name={dataName} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionChart;