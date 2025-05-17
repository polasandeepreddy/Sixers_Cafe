import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Check } from 'lucide-react';

interface SlotSelectorProps {
  className?: string;
}

function formatTimeTo12Hour(time24: string): string {
  const [hourStr, minStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const minutes = minStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
}

function parseSlotTime(time12h: string, dateStr: string): Date {
  const [time, meridiem] = time12h.split(' ');
  let [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr || '0', 10);

  if (meridiem === 'PM' && hour !== 12) {
    hour += 12;
  } else if (meridiem === 'AM' && hour === 12) {
    hour = 0;
  }

  const date = new Date(dateStr);
  date.setHours(hour, minutes, 0, 0);
  return date;
}

function isPastSlot(slotTime12h: string, selectedDate: string): boolean {
  const now = new Date();
  const selectedDateObj = new Date(selectedDate);
  if (selectedDateObj.toDateString() !== now.toDateString()) return false;

  const slotStart = parseSlotTime(slotTime12h, selectedDate);
  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotEnd.getHours() + 1);
  return now >= slotEnd;
}

const SlotSelector: React.FC<SlotSelectorProps> = ({ className = '' }) => {
  const { slots, formData, selectSlot, deselectSlot } = useBooking();

  const isSlotSelected = (slotId: string): boolean =>
    formData.selectedSlots.some(slot => slot.id === slotId);

  const visibleSlots = slots.filter(slot => {
    const slotTime12h = formatTimeTo12Hour(slot.time);
    return !isPastSlot(slotTime12h, formData.date);
  });

  return (
    <div className={className}>
      <h3 className="text-base font-medium mb-2 text-gray-700">Select Time Slot(s)</h3>

      {visibleSlots.length === 0 ? (
        <p className="text-sm text-gray-500">No available slots for the selected date.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {visibleSlots.map(slot => {
            const selected = isSlotSelected(slot.id);
            const isAvailable = slot.isAvailable;

            const baseStyles = [
              'flex flex-col items-center justify-center px-3 py-2 rounded-md border text-sm font-medium text-center transition-all',
              selected
                ? 'bg-green-100 border-green-400 text-green-700 shadow'
                : isAvailable
                ? 'bg-white border-green-200 text-green-600 hover:border-green-400 hover:shadow-sm cursor-pointer'
                : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed',
            ].join(' ');

            return (
              <div
                key={slot.id}
                className={baseStyles}
                onClick={() => {
                  if (!isAvailable) return;
                  selected ? deselectSlot(slot.id) : selectSlot(slot);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ' ') && isAvailable) {
                    selected ? deselectSlot(slot.id) : selectSlot(slot);
                  }
                }}
              >
                {selected && (
                  <Check className="absolute top-1 right-1 h-4 w-4 text-green-600" />
                )}
                <span>{formatTimeTo12Hour(slot.time)}</span>
                <span className="text-xs mt-0.5">
                  {selected ? 'Selected' : 'Available'}
                </span>
                <span className="text-xs mt-0.5 text-gray-500">₹{slot.price}</span>
              </div>
            );
          })}
        </div>
      )}

      {formData.selectedSlots.length > 0 && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Selected Slots</h4>
          <div className="flex flex-wrap gap-2">
            {formData.selectedSlots.map(slot => (
              <div
                key={slot.id}
                className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm cursor-pointer border border-green-200"
                onClick={() => deselectSlot(slot.id)}
                title="Click to remove"
              >
                {formatTimeTo12Hour(slot.time)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotSelector;
