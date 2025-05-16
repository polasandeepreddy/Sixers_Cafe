export interface Slot {
    id: string;
    time: string;
    isAvailable: boolean;
  }
  
  export interface BookingFormData {
    fullName: string;
    mobileNumber: string;
    date: string;
    selectedSlots: Slot[];
  }
  
  export interface Booking {
    id: string;
    fullName: string;
    mobileNumber: string;
    date: string;
    slots: Slot[];
    createdAt: string;
  }