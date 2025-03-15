import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isScrolled: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isScrolled }) => {
  const location = useLocation();
  
  return (
    <div className={`md:hidden ${isScrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link 
          to="/" 
          className={`block px-3 py-2 text-base font-medium text-white hover:text-red-500 transition-colors duration-200 nav-text-shadow ${location.pathname === '/' ? 'text-red-500' : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/movies" 
          className={`block px-3 py-2 text-base font-medium text-white hover:text-red-500 transition-colors duration-200 nav-text-shadow ${location.pathname === '/movies' ? 'text-red-500' : ''}`}
        >
          Movies
        </Link>
        <Link 
          to="/tv-shows" 
          className={`block px-3 py-2 text-base font-medium text-white hover:text-red-500 transition-colors duration-200 nav-text-shadow ${location.pathname === '/tv-shows' ? 'text-red-500' : ''}`}
        >
          TV Shows
        </Link>
        <Link 
          to="/web-series" 
          className={`block px-3 py-2 text-base font-medium text-white hover:text-red-500 transition-colors duration-200 nav-text-shadow ${location.pathname === '/web-series' ? 'text-red-500' : ''}`}
        >
          Web Series
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu; 