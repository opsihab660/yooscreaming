import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserData } from '../services/userService';
import { IUser } from '../models/User';

const UserProfile: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-2 focus:outline-none group"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="relative">
          <div className={`absolute inset-0 rounded-full ${isDropdownOpen ? 'bg-gradient-to-r from-red-500 to-purple-600 animate-pulse' : 'bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-purple-600'} blur-sm opacity-70 transition-all duration-300`}></div>
          <img
            src={currentUser.photoURL || 'https://via.placeholder.com/40'}
            alt="Profile"
            className="w-9 h-9 rounded-full relative border-2 border-transparent group-hover:border-white transition-all duration-300 object-cover"
          />
        </div>
        <span className="text-white text-sm hidden md:block group-hover:text-red-400 transition-colors duration-300">
          {userData?.displayName || currentUser.displayName || 'User'}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 group-hover:text-red-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-[#1A1A1A] rounded-xl shadow-2xl py-1 z-10 border border-gray-800 overflow-hidden transform transition-all duration-300 ease-out">
          <div className="relative">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-purple-600"></div>
            
            <div className="px-4 py-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.photoURL || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-red-500"
                />
                <div>
                  <p className="text-sm text-white font-medium">{userData?.displayName || currentUser.displayName}</p>
                  <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                onClick={() => setIsDropdownOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="font-medium">My Profile</p>
                  <p className="text-xs text-gray-500">View your profile details</p>
                </div>
              </Link>
              
              <Link
                to="/settings"
                className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                onClick={() => setIsDropdownOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-medium">Settings</p>
                  <p className="text-xs text-gray-500">Manage your preferences</p>
                </div>
              </Link>
              
              <div className="border-t border-gray-800 my-1"></div>
              
              <button
                onClick={() => {
                  signOut();
                  setIsDropdownOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <div>
                  <p className="font-medium">Sign out</p>
                  <p className="text-xs text-gray-500">Log out of your account</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 