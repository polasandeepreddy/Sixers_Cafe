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

// Parse 12-hour time string (e.g. "6:00 PM") to a Date object on selected date
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

// Slot is past if current time is >= slot start time + 1 hour
function isPastSlot(slotTime12h: string, selectedDate: string) {
  const now = new Date();
  const selectedDateObj = new Date(selectedDate);

  // Only consider if selected date is today
  if (selectedDateObj.toDateString() !== now.toDateString()) return false;

  const slotStart = parseSlotTime(slotTime12h, selectedDate);
  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotEnd.getHours() + 1); // slot duration 1 hour

  return now >= slotEnd;
}

const SlotSelector: React.FC<SlotSelectorProps> = ({ className = '' }) => {
  const { slots, formData, selectSlot, deselectSlot } = useBooking();

  const isSlotSelected = (slotId: string): boolean =>
    formData.selectedSlots.some(slot => slot.id === slotId);

  // Filter slots that are available and not past
  const visibleSlots = slots.filter(
    slot => slot.isAvailable && !isPastSlot(formatTimeTo12Hour(slot.time), formData.date)
  );

  if (visibleSlots.length === 0) {
    return (
      <div className={className}>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Select Time Slot(s)</h3>
        <p className="text-red-600">No available slots for the selected date.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Select Time Slot(s)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {visibleSlots.map(slot => {
          const selected = isSlotSelected(slot.id);

          const baseStyles = [
            'flex flex-col items-center justify-center py-3 px-4 rounded-lg border transition-all duration-200 relative text-center',
            selected
              ? 'bg-green-100 border-green-500 text-green-700 shadow-md'
              : 'bg-green-50 border-green-200 text-green-600 hover:border-green-400 hover:shadow-sm cursor-pointer',
          ].join(' ');

          return (
            <div
              key={slot.id}
              className={baseStyles}
              onClick={() => {
                selected ? deselectSlot(slot.id) : selectSlot(slot);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selected ? deselectSlot(slot.id) : selectSlot(slot);
                }
              }}
            >
              {selected && (
                <div className="absolute top-1 right-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              )}
              <span className="font-medium">{formatTimeTo12Hour(slot.time)}</span>
              <span className="text-sm mt-1">{selected ? 'Selected' : 'Available'}</span>
              <span className="text-xs mt-1 text-gray-600">₹{slot.price}</span>
            </div>
          );
        })}
      </div>

      {formData.selectedSlots.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Selected Slots</h4>
          <div className="flex flex-wrap gap-2">
            {formData.selectedSlots.map(slot => (
              <div
                key={slot.id}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center"
              >
                <span>{formatTimeTo12Hour(slot.time)}</span>
                <button
                  onClick={() => deselectSlot(slot.id)}
                  className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                  aria-label="Remove slot"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotSelector;
