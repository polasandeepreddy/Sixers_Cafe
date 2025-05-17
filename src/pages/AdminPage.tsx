import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { formatDisplayDate } from '../utils/dateUtils';

const ADMIN_PASSWORD = 'admin123'; // <-- Set your password here

const AdminPage: React.FC = () => {
  const { bookings, removeBooking } = useBooking();
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'all'>('today');
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  // Calculate tomorrow's date string (ISO yyyy-mm-dd)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().split('T')[0];

  // Password state
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
    setPasswordInput('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            autoFocus
            aria-label="Admin password input"
          />
          {error && (
            <p className="text-red-600 mb-4 text-center" role="alert">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // Filter bookings by date
  const todayBookings = bookings.filter(booking => booking.date === todayISO);
  const tomorrowBookings = bookings.filter(booking => booking.date === tomorrowISO);

  const sortBookingsByTime = (list: typeof bookings) => {
    return [...list].sort((a, b) => {
      const timeA = a.slots[0]?.time || '';
      const timeB = b.slots[0]?.time || '';
      return timeA.localeCompare(timeB);
    });
  };

  const sortedTodayBookings = sortBookingsByTime(todayBookings);
  const sortedTomorrowBookings = sortBookingsByTime(tomorrowBookings);
  const sortedAllBookings = sortBookingsByTime(bookings);

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to permanently remove this booking?')) {
      removeBooking(id);
    }
  };

  const ScreenshotModal = ({ screenshot, onClose }: { screenshot: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <img src={screenshot} alt="Payment screenshot" className="max-w-full h-auto" />
      </div>
    </div>
  );

  const BookingTable = ({ bookings, title }: { bookings: typeof sortedTodayBookings; title: string }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
      <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b border-gray-200 flex-shrink-0">{title}</h2>
      <div className="overflow-auto flex-grow min-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slots</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Proof</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.mobileNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDisplayDate(booking.date)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-2">
                    {booking.slots.map(slot => (
                      <span
                        key={slot.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {slot.time}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{booking.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.paymentScreenshot && (
                    <button
                      onClick={() => setSelectedScreenshot(booking.paymentScreenshot)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition text-sm font-semibold"
                      aria-label="View Payment Screenshot"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleRemove(booking.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
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
    <div className="min-h-screen bg-gray-100 py-4 flex flex-col" style={{ height: '100vh' }}>
      <div className="container mx-auto px-4 bg-white rounded-lg shadow-md py-6 flex flex-col flex-grow overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 flex-shrink-0">Booking Management</h1>

        {/* Tabs side by side horizontally */}
        <div className="flex space-x-3 mb-4">
          <button
            onClick={() => setActiveTab('today')}
            className={`py-1.5 px-4 text-sm font-semibold rounded-md transition ${
              activeTab === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Today
            <br />
            <span className="text-xs font-normal text-gray-400">{formatDisplayDate(todayISO)}</span>
          </button>

          <button
            onClick={() => setActiveTab('tomorrow')}
            className={`py-1.5 px-4 text-sm font-semibold rounded-md transition ${
              activeTab === 'tomorrow'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tomorrow
            <br />
            <span className="text-xs font-normal text-gray-400">{formatDisplayDate(tomorrowISO)}</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`py-1.5 px-4 text-sm font-semibold rounded-md transition ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Slots
          </button>
        </div>

        {/* Tab content area */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {activeTab === 'today' && (
            <BookingTable bookings={sortedTodayBookings} title={`Today's Booked Slots (${formatDisplayDate(todayISO)})`} />
          )}
          {activeTab === 'tomorrow' && (
            <BookingTable bookings={sortedTomorrowBookings} title={`Tomorrow's Booked Slots (${formatDisplayDate(tomorrowISO)})`} />
          )}
          {activeTab === 'all' && (
            <BookingTable bookings={sortedAllBookings} title="All Booked Slots" />
          )}
        </div>
      </div>

      {selectedScreenshot && (
        <ScreenshotModal screenshot={selectedScreenshot} onClose={() => setSelectedScreenshot(null)} />
      )}
    </div>
  );
};

export default AdminPage;
