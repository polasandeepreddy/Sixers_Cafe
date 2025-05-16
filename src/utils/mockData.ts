import { Slot } from '../types';
import { format, addDays } from '../utils/dateUtils';

// Generate slots for a specific date
export const generateSlotsForDate = (date: string): Slot[] => {
  // This would normally come from an API
  const bookedSlotTimes = ['10:00', '14:00', '18:00']; // Example of already booked slots
  
  const slots: Slot[] = [];
  
  // Generate slots from 6 AM to 10 PM
  for (let hour = 6; hour <= 22; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    slots.push({
      id: `${date}-${timeString}`,
      time: timeString,
      isAvailable: !bookedSlotTimes.includes(timeString)
    });
  }
  
  return slots;
};

// Generate available dates (today + next 7 days)
export const generateAvailableDates = (): string[] => {
  const dates: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    dates.push(format(addDays(new Date(), i)));
  }
  
  return dates;
};