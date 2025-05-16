import React from 'react';
import { useBooking } from '../context/BookingContext';
import { initiatePayment } from '../utils/paymentUtils';
import { formatDisplayDate } from '../utils/dateUtils';

interface PaymentSummaryProps {
  className?: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ className = '' }) => {
  const { formData, totalAmount } = useBooking();
  const { selectedSlots, date, fullName } = formData;

  const handlePayment = () => {
    if (selectedSlots.length === 0) {
      alert('Please select at least one slot to book.');
      return;
    }
    
    // Create payment details
    const slotTimes = selectedSlots.map(slot => slot.time).join(', ');
    const description = `Cricket Box booking - ${formatDisplayDate(date)} - ${slotTimes}`;
    
    initiatePayment({
      amount: totalAmount,
      currency: 'INR',
      description
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow p-5 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
      
      {selectedSlots.length > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Date</p>
            <p className="font-medium">{formatDisplayDate(date)}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Selected Slots</p>
            <div className="flex flex-wrap gap-2">
              {selectedSlots.map(slot => (
                <span key={slot.id} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {slot.time}
                </span>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-4 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Number of slots</span>
              <span>{selectedSlots.length}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Price per slot</span>
              <span>₹600</span>
            </div>
            <div className="flex justify-between font-medium text-lg mt-3">
              <span>Total Amount</span>
              <span className="text-green-700">₹{totalAmount}</span>
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            Make Payment
          </button>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            On mobile devices, you will be redirected to your UPI payment app.
            After successful payment, your booking will be confirmed.
          </p>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">Please select at least one slot to see booking summary.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;