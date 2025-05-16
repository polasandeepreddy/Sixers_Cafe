import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';   // import HelmetProvider
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <BookingProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </BookingProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
