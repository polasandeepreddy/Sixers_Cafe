import React from 'react';
import { useBooking } from '../context/BookingContext';
import SlotSelector from './SlotSelector';

interface BookingFormProps {
  className?: string;
  onSubmit: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ className = '', onSubmit }) => {
  const { formData, updateFormData, availableDates } = useBooking();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'date') {
      // Clear selected slots when date changes
      updateFormData({ date: value, selectedSlots: [] });
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.selectedSlots.length === 0) {
      alert('Please select at least one slot');
      return;
    }
    onSubmit();
    updateFormData({ selectedSlots: [] }); // clear selected slots after booking
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-lg shadow p-5 ${className}`}>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Book Your Cricket Slot</h2>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your full name"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
            pattern="[0-9]{10}"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your 10-digit mobile number"
          />
        </div>

        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <select
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            {availableDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Slot Selector */}
        <SlotSelector className="mt-6" />

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg"
        >
          Book Slots
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
