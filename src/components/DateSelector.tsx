// components/DateSelector.tsx
import React from 'react';
import { useBooking } from '../context/BookingContext';
import clsx from 'clsx';

const DateSelector: React.FC = () => {
  const { formData, updateFormData } = useBooking();

  const today = new Date();

  // Generate next 21 days including today
  const dates = Array.from({ length: 21 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  const handleDateSelect = (date: Date) => {
    const isoDate = date.toISOString().split('T')[0];
    updateFormData({ date: isoDate });
  };

  return (
    <div>
      <label className="text-sm text-gray-700 mb-2 block font-medium">Select your date</label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {dates.map((date) => {
          const iso = date.toISOString().split('T')[0];
          const isSelected = formData.date === iso;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => handleDateSelect(date)}
              className={clsx(
                'flex flex-col items-center justify-center min-w-16 h-16 rounded-lg border',
                isSelected
                  ? 'bg-green-600 text-white border-green-700'
                  : 'bg-white text-black border-gray-300 hover:bg-green-50',
                'transition-colors px-2'
              )}
            >
              <span className="text-xs font-medium text-gray-500">
                {date.toLocaleDateString('en-IN', { weekday: 'short' })}
              </span>
              <span className="text-lg font-semibold">{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
