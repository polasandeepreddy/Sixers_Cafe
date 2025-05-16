import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { formatDisplayDate } from '../utils/dateUtils';

// Converts "HH:mm" (24-hour) to "hh:mm AM/PM" (12-hour)
function formatTo12Hour(time24: string): string {
  const [hourStr, minute] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${ampm}`;
}

const AdminPage: React.FC = () => {
  // Password state & visibility control
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const { bookings, removeSlot, removeBooking } = useBooking();

  // Hardcoded password (Change this to your desired password)
  const ADMIN_PASSWORD = 'admin123';

  // Handle password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password, please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            autoFocus
          />
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // Existing admin page code below (visible only if authenticated)

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Filter today's bookings
  const todayBookings = bookings.filter((booking) => booking.date === today);

  // Sort today's bookings by time slot
  const sortedTodayBookings = [...todayBookings].sort((a, b) => {
    const timeA = a.slots[0]?.time || '';
    const timeB = b.slots[0]?.time || '';
    return timeA.localeCompare(timeB);
  });

  // Sort overall bookings by creation date (newest first)
  const sortedOverallBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const BookingTable = ({
    bookings,
    title,
  }: {
    bookings: typeof sortedOverallBookings;
    title: string;
  }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b border-gray-200">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Slots
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booked On
              </th>
              <th className="w-12 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.mobileNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDisplayDate(booking.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-2">
                    {booking.slots.map((slot) => (
                      <span
                        key={slot.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {formatTo12Hour(slot.time)}
                        <button
                          onClick={() => removeSlot(booking.id, slot.id)}
                          className="ml-2 text-red-600 hover:text-red-800 font-bold"
                          title="Remove slot"
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.createdAt).toLocaleString()}
                </td>
                <td className="w-12 px-2 py-4 whitespace-nowrap text-center text-sm">
                  <button
                    onClick={() => removeBooking(booking.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-lg leading-none"
                    title="Remove entire booking"
                    type="button"
                    style={{ lineHeight: 1 }}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Booking Management</h1>

        {/* Today's Bookings */}
        <BookingTable
          bookings={sortedTodayBookings}
          title={`Today's Bookings (${formatDisplayDate(today)})`}
        />

        {/* Overall Bookings */}
        <BookingTable bookings={sortedOverallBookings} title="All Bookings" />
      </div>
    </div>
  );
};

export default AdminPage;
