import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Menu, X } from 'lucide-react';
import { MobileMenu } from '.';
import SearchBar from './SearchBar';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'nav-scrolled' : 'glass-effect'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img 
                  src="/images/yoo-logo.svg" 
                  alt="YOO!!!" 
                  className="h-12 w-auto hover-scale transition-transform duration-300"
                />
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                <Link 
                  to="/" 
                  className={`text-white hover:text-red-500 transition-colors duration-200 text-sm font-medium nav-text-shadow ${location.pathname === '/' ? 'text-red-500' : ''}`}
                >
                  Home
                </Link>
                <Link 
                  to="/movies" 
                  className={`text-white hover:text-red-500 transition-colors duration-200 text-sm font-medium nav-text-shadow ${location.pathname === '/movies' ? 'text-red-500' : ''}`}
                >
                  Movies
                </Link>
                <Link 
                  to="/tv-shows" 
                  className={`text-white hover:text-red-500 transition-colors duration-200 text-sm font-medium nav-text-shadow ${location.pathname === '/tv-shows' ? 'text-red-500' : ''}`}
                >
                  TV Shows
                </Link>
                <Link 
                  to="/web-series" 
                  className={`text-white hover:text-red-500 transition-colors duration-200 text-sm font-medium nav-text-shadow ${location.pathname === '/web-series' ? 'text-red-500' : ''}`}
                >
                  Web Series
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative group nav-text-shadow">
              <SearchBar />
            </div>
            <div className="relative group nav-text-shadow">
              <Bell className="w-5 h-5 cursor-pointer text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </div>
            <div className="relative group nav-text-shadow">
              <User className="w-5 h-5 cursor-pointer text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
            </div>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors duration-200" />
              ) : (
                <Menu className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <MobileMenu isScrolled={isScrolled} />}
    </nav>
  );
};

export default Navbar; 