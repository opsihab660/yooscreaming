import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { MobileMenu } from '.';
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

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
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0D0D0D]/90 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-[#0D0D0D] to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                  <div className="relative">
                    <img 
                      src="/images/yoo-logo.svg" 
                      alt="YOO!!!" 
                      className="h-10 w-auto hover:scale-105 transition-transform duration-300"
                    />
                  </div>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                <NavLink to="/" current={location.pathname === '/'}>
                  Home
                </NavLink>
                <NavLink to="/movies" current={location.pathname === '/movies'}>
                  Movies
                </NavLink>
                <NavLink to="/tv-shows" current={location.pathname === '/tv-shows'}>
                  TV Shows
                </NavLink>
                <NavLink to="/web-series" current={location.pathname === '/web-series'}>
                  Web Series
                </NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <SearchBar />
            </div>
            <div className="relative group">
              <Bell className="w-5 h-5 cursor-pointer text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse"></span>
            </div>
            {currentUser ? (
              <UserProfile />
            ) : (
              <Link 
                to="/login" 
                className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-red-500 rounded-full shadow-md group"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-600 group-hover:translate-x-0 ease">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">Sign In</span>
                <span className="relative invisible">Sign In</span>
              </Link>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-200" />
              ) : (
                <Menu className="w-5 h-5 text-gray-200" />
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

// NavLink component for consistent styling
interface NavLinkProps {
  to: string;
  current: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, current, children }) => {
  return (
    <Link 
      to={to} 
      className={`relative px-2 py-1 group ${
        current 
          ? 'text-white' 
          : 'text-gray-300 hover:text-white'
      }`}
    >
      <span className="relative z-10">{children}</span>
      {current && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-full"></span>
      )}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-full transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

export default Navbar; 