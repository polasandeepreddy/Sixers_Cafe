import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import BookingConfirmation from '../components/BookingConfirmation';
import PaymentSummary from '../components/PaymentSummary';
import { useBooking } from '../context/BookingContext';

const BookingPage: React.FC = () => {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const { formData, addBooking } = useBooking();
  
  const handleBookingSubmit = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = (screenshot: string) => {
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Create new booking with payment screenshot
    addBooking({
      id: randomId,
      paymentScreenshot: screenshot
    });
    
    setBookingId(randomId);
    setBookingConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {!bookingConfirmed ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-10">Book Your Cricket Slot</h1>
            <div className="max-w-2xl mx-auto">
              {!showPayment ? (
                <BookingForm onSubmit={handleBookingSubmit} />
              ) : (
                <PaymentSummary onPaymentComplete={handlePaymentComplete} />
              )}
            </div>
          </>
        ) : (
          <BookingConfirmation bookingId={bookingId} />
        )}
      </div>
    </div>
  );
};

export default BookingPage;