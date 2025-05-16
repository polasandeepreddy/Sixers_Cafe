import { PaymentDetails } from '../types';

export const generatePaymentLink = (details: PaymentDetails): string => {
  // In a real implementation, this would generate a UPI deep link
  // Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=CURRENCY&tn=DESCRIPTION
  
  // This is a simplified example that would redirect to a payment app
  // In production, you would use a proper payment gateway API
  
  const upiLink = `upi://pay?pa=example@upi&pn=SixersCricket&am=${details.amount}&cu=${details.currency}&tn=${encodeURIComponent(details.description)}`;
  
  return upiLink;
};

export const initiatePayment = (details: PaymentDetails): void => {
  const paymentLink = generatePaymentLink(details);
  
  // Check if on mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // On mobile, redirect to the UPI app
    window.location.href = paymentLink;
  } else {
    // On desktop, show QR code or other payment options
    // This would be implemented with a QR code library in a real app
    alert('Please scan the QR code on the screen using your UPI app');
  }
};