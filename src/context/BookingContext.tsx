import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { BookingFormData, Slot, Booking } from '../types';
import { generateSlotsForDate, generateAvailableDates } from '../utils/mockData';

interface BookingContextType {
  formData: BookingFormData;
  availableDates: string[];
  slots: Slot[];
  bookings: Booking[];
  updateFormData: (data: Partial<BookingFormData>) => void;
  selectSlot: (slot: Slot) => void;
  deselectSlot: (slotId: string) => void;
  resetBooking: () => void;
  addBooking: (booking: Booking) => void;
  removeSlot: (bookingId: string, slotId: string) => void;
  removeBooking: (bookingId: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableDates] = useState<string[]>(generateAvailableDates());
  const initialDate = availableDates[0];

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    mobileNumber: '',
    date: initialDate,
    selectedSlots: [],
  });

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...data };
      if (data.date && data.date !== prev.date) {
        return { ...updated, selectedSlots: [] }; // Reset slots when date changes
      }
      return updated;
    });
  };

  const slots = useMemo(() => {
    const baseSlots = generateSlotsForDate(formData.date);
    const bookedTimes = bookings
      .filter((b) => b.date === formData.date)
      .flatMap((b) => b.slots.map((s) => s.time));

    return baseSlots.map((slot) => ({
      ...slot,
      isAvailable: !bookedTimes.includes(slot.time),
    }));
  }, [formData.date, bookings]);

  const selectSlot = (slot: Slot) => {
    if (!slot.isAvailable) return;
    setFormData((prev) => ({
      ...prev,
      selectedSlots: [...prev.selectedSlots, slot],
    }));
  };

  const deselectSlot = (slotId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSlots: prev.selectedSlots.filter((slot) => slot.id !== slotId),
    }));
  };

  const resetBooking = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      date: initialDate,
      selectedSlots: [],
    });
  };

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  // Remove a slot from a specific booking by bookingId and slotId
  const removeSlot = (bookingId: string, slotId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              slots: booking.slots.filter((slot) => slot.id !== slotId),
            }
          : booking
      )
    );
  };

  // Remove entire booking by bookingId
  const removeBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  };

  return (
    <BookingContext.Provider
      value={{
        formData,
        availableDates,
        slots,
        bookings,
        updateFormData,
        selectSlot,
        deselectSlot,
        resetBooking,
        addBooking,
        removeSlot,
        removeBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
