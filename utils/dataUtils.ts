
import type { DailyConsumption } from '../types';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export const filterDataByDateRange = (
  data: DailyConsumption[],
  startDate: Date,
  endDate: Date
): DailyConsumption[] => {
  const interval = { start: startOfDay(startDate), end: endOfDay(endDate) };
  return data.filter(item => isWithinInterval(parseISO(item.date), interval));
};
