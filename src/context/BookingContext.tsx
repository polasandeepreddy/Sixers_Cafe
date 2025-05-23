// BookingContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { BookingFormData, Slot, Booking } from '../types';
import { generateSlotsForDate } from '../utils/mockData';
import { format } from '../utils/dateUtils';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

interface BookingContextType {
  formData: BookingFormData;
  slots: Slot[];
  bookings: Booking[];
  totalAmount: number;
  updateFormData: (data: Partial<BookingFormData>) => void;
  selectSlot: (slot: Slot) => void;
  deselectSlot: (slotId: string) => void;
  resetBooking: () => void;
  addBooking: (booking: Partial<Booking>) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: 'approved' | 'rejected') => Promise<void>;
  removeBooking: (bookingId: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const today = format(new Date()); // always today in YYYY-MM-DD or your format

  // Set formData with fixed today date
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    mobileNumber: '',
    date: today,
    selectedSlots: [],
  });

  // Generate slots only for today
  const [rawSlots, setRawSlots] = useState<Slot[]>(generateSlotsForDate(today));

  const [bookings, setBookings] = useState<Booking[]>([]);

  const totalAmount = formData.selectedSlots.length * 600;

  useEffect(() => {
    try {
      const bookingsCol = collection(db, 'bookings');
      const unsubscribe = onSnapshot(bookingsCol, snapshot => {
        const data = snapshot.docs.map(doc => ({
          ...(doc.data() as Booking),
          id: doc.id,
        }));
        setBookings(data);
      }, error => {
        console.error('Firestore snapshot error:', error);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Failed to subscribe to bookings:', error);
    }
  }, []);

  // updateFormData now ignores any date updates and always forces today's date
  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...data };
      updated.date = today; // force today only
      setRawSlots(generateSlotsForDate(today));
      return { ...updated, selectedSlots: [] };
    });
  };

  // Update slots availability for today only
  const slots = rawSlots.map(slot => {
    const isBooked = bookings.some(
      booking =>
        booking.date === today &&
        booking.slots.some(bookedSlot => bookedSlot.id === slot.id)
    );
    return { ...slot, isAvailable: !isBooked };
  });

  const selectSlot = (slot: Slot) => {
    if (!slot.isAvailable) return;
    setFormData(prev => ({
      ...prev,
      selectedSlots: [...prev.selectedSlots, slot],
    }));
  };

  const deselectSlot = (slotId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSlots: prev.selectedSlots.filter(slot => slot.id !== slotId),
    }));
  };

  const resetBooking = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      date: today,
      selectedSlots: [],
    });
    setRawSlots(generateSlotsForDate(today));
  };

  const addBooking = async (bookingData: Partial<Booking>) => {
    try {
      const newBooking: Omit<Booking, 'id'> = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        date: today,
        slots: formData.selectedSlots,
        createdAt: new Date().toISOString(),
        paymentStatus: 'pending',
        paymentScreenshot: bookingData.paymentScreenshot || null,
        totalAmount,
      };

      const docRef = await addDoc(collection(db, 'bookings'), newBooking);
      setBookings(prev => [...prev, { ...newBooking, id: docRef.id }]);
      resetBooking();
    } catch (error) {
      console.error('Failed to add booking:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'approved' | 'rejected') => {
    try {
      const ref = doc(db, 'bookings', bookingId);
      await updateDoc(ref, { paymentStatus: status });
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId ? { ...booking, paymentStatus: status } : booking
        )
      );
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const removeBooking = async (bookingId: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Failed to remove booking:', error);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        formData,
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
