import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
<header className="bg-white shadow-md z-20 relative">
  <div className="container mx-auto px-4 py-3 flex justify-between items-center">
    {/* Logo Section */}
    <Link to="/" className="flex items-center space-x-3">
      <img
        src="/cricket-logo.png"
        alt="Sixers Cafe"
        className="h-10 w-10 object-contain"
      />
      <span className="text-xl font-bold text-gray-800">Sixers Cafe</span>
    </Link>

    {/* Mobile Menu Toggle Button */}
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="lg:hidden focus:outline-none"
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
    >
      {isMenuOpen ? (
        <X className="h-8 w-8 text-gray-600" />
      ) : (
        <Menu className="h-8 w-8 text-gray-600" />
      )}
    </button>

    {/* Desktop Navigation */}
    <nav className="hidden lg:flex items-center space-x-10">
      <Link to="/" className="text-lg text-gray-600 hover:text-green-600 transition-colors">Home</Link>
      <Link to="/booking" className="text-lg text-gray-600 hover:text-green-600 transition-colors">Book Slot</Link>
      <Link to="/admin" className="text-lg text-gray-600 hover:text-green-600 transition-colors">Admin</Link>
    </nav>
  </div>

  {/* Mobile Navigation */}
  {isMenuOpen && (
    <div className="lg:hidden bg-white py-4 px-4 shadow-lg absolute top-[56px] left-0 right-0">
      <nav className="flex flex-col space-y-4">
        <Link
          to="/"
          className="text-lg text-gray-600 hover:text-green-600 py-2"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/booking"
          className="text-lg text-gray-600 hover:text-green-600 py-2"
          onClick={() => setIsMenuOpen(false)}
        >
          Book Slot
        </Link>
        <Link
          to="/admin"
          className="text-lg text-gray-600 hover:text-green-600 py-2"
          onClick={() => setIsMenuOpen(false)}
        >
          Admin
        </Link>
      </nav>
    </div>
  )}
</header>

  );
};

export default Header;
