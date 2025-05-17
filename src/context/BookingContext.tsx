import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { BookingFormData, Slot, Booking } from '../types';
import { generateSlotsForDate, generateAvailableDates } from '../utils/mockData';
import { format } from '../utils/dateUtils';

interface BookingContextType {
  formData: BookingFormData;
  availableDates: string[];
  slots: Slot[];
  bookings: Booking[];
  totalAmount: number;
  updateFormData: (data: Partial<BookingFormData>) => void;
  selectSlot: (slot: Slot) => void;
  deselectSlot: (slotId: string) => void;
  resetBooking: () => void;
  addBooking: (booking: Partial<Booking>) => void;
  updateBookingStatus: (bookingId: string, status: 'approved' | 'rejected') => void;
  removeBooking: (bookingId: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableDates] = useState<string[]>(generateAvailableDates());
  const initialDate = availableDates[0];
  const [rawSlots, setRawSlots] = useState<Slot[]>(generateSlotsForDate(initialDate));

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem('bookings');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    mobileNumber: '',
    date: initialDate,
    selectedSlots: [],
  });

  const totalAmount = formData.selectedSlots.length * 600;

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...data };
      if (data.date && data.date !== prev.date) {
        setRawSlots(generateSlotsForDate(data.date));
        return { ...updated, selectedSlots: [] };
      }
      return updated;
    });
  };

  // ✅ Dynamic slots based on current bookings
  const slots = rawSlots.map(slot => {
    const isBooked = bookings.some(
      booking =>
        booking.date === formData.date &&
        booking.slots.some(bookedSlot => bookedSlot.id === slot.id)
    );
    return { ...slot, isAvailable: !isBooked };
  });

  const selectSlot = (slot: Slot) => {
    if (!slot.isAvailable) return;
    setFormData(prev => ({
      ...prev,
      selectedSlots: [...prev.selectedSlots, slot]
    }));
  };

  const deselectSlot = (slotId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSlots: prev.selectedSlots.filter(slot => slot.id !== slotId)
    }));
  };

  const resetBooking = () => {
    const today = format(new Date());
    setFormData({ fullName: '', mobileNumber: '', date: today, selectedSlots: [] });
    setRawSlots(generateSlotsForDate(today));
  };

  const addBooking = (bookingData: Partial<Booking>) => {
    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      date: formData.date,
      slots: formData.selectedSlots,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending',
      paymentScreenshot: bookingData.paymentScreenshot || null,
      totalAmount,
    };
    setBookings(prev => [...prev, newBooking]);
    resetBooking();
  };

  const updateBookingStatus = (bookingId: string, status: 'approved' | 'rejected') => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, paymentStatus: status } : booking
      )
    );
  };

  const removeBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  return (
    <BookingContext.Provider
      value={{
        formData,
        availableDates,
        slots,
        bookings,
        totalAmount,
        updateFormData,
        selectSlot,
        deselectSlot,
        resetBooking,
        addBooking,
        updateBookingStatus,
        removeBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
