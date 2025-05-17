
// src/utils/mockData.ts
import { Slot } from '../types';
import { format, addDays } from './dateUtils';

export const generateSlotsForDate = (date: string): Slot[] => {
  const slots: Slot[] = [];
  for (let hour = 0; hour <= 23; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    slots.push({
      id: `${date}-${timeString}`,
      time: timeString,
      isAvailable: true,
      price: 600,
    });
  }
  return slots;
};

export const generateAvailableDates = (): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(format(addDays(new Date(), i)));
  }
  return dates;
};
