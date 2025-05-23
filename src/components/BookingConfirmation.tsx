import React from 'react';
import { useBooking } from '../context/BookingContext';
import { formatDisplayDate } from '../utils/dateUtils';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookingConfirmationProps {
  bookingId: string;
  className?: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  bookingId, 
  className = '' 
}) => {
  const { formData } = useBooking();
  const { selectedSlots, date, fullName } = formData;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className} max-w-lg mx-auto`}>
      <div className="text-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
        <p className="text-gray-600 mt-2">
          Your cricket slot has been successfully booked.
        </p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Booking Details</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID</span>
            <span className="font-medium">{bookingId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Name</span>
            <span className="font-medium">{fullName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">{formatDisplayDate(date)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Time Slots</span>
            <div className="text-right">
              {selectedSlots.map(slot => (
                <div key={slot.id} className="font-medium">
                  {slot.time}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 text-sm mb-4">
          A confirmation has been sent to your mobile number.
          Please arrive 15 minutes before your slot time.
        </p>
        
        <Link
          to="/"
          className="inline-block bg-green-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation