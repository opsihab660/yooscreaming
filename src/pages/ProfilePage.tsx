import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserData, canChangeDisplayName } from '../services/userService';
import { IUser } from '../models/User';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [nameChangeStatus, setNameChangeStatus] = useState<{ canChange: boolean; daysRemaining: number }>({ 
    canChange: false, 
    daysRemaining: 0 
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
          
          // Check if user can change display name
          const status = canChangeDisplayName(data.lastDisplayNameChange);
          setNameChangeStatus(status);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-700 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
      </div>
      
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">My Profile</h1>
      
      <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        <div className="relative h-40 bg-gradient-to-r from-red-600/30 to-purple-600/30">
          <div className="absolute inset-0 bg-[url('/images/profile-banner.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        </div>
        
        <div className="p-6 md:p-8 md:flex gap-8 relative">
          {/* Profile image - positioned to overlap the banner */}
          <div className="md:w-1/4 mb-6 md:mb-0 -mt-20 md:-mt-24">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <img 
                    src={currentUser?.photoURL || 'https://via.placeholder.com/150'} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-[#1E1E1E] object-cover"
                  />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center mt-4">{userData?.displayName || currentUser?.displayName}</h2>
              <p className="text-gray-400 text-sm mt-1">{currentUser?.email}</p>
              
              {!nameChangeStatus.canChange ? (
                <div className="mt-3 text-center">
                  <p className="text-amber-500 text-xs">
                    You can change your display name in {nameChangeStatus.daysRemaining} days
                  </p>
                </div>
              ) : (
                <div className="mt-3 text-center">
                  <Link 
                    to="/settings" 
                    className="text-red-500 hover:text-red-400 text-sm font-medium hover:underline transition-all duration-300"
                  >
                    Change display name
                  </Link>
                </div>
              )}
              
              <div className="mt-6 w-full">
                <button
                  onClick={signOut}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          
          <div className="md:w-3/4 md:pt-8">
            <div className="bg-[#252525]/80 backdrop-blur-sm p-6 rounded-xl mb-6 shadow-lg border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">User ID</p>
                    <p className="text-white font-mono text-sm mt-1 truncate">{userData?.uid || currentUser?.uid}</p>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Email</p>
                    <p className="text-white text-sm mt-1 truncate">{userData?.email || currentUser?.email}</p>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Account Created</p>
                    <p className="text-white text-sm mt-1">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Last Login</p>
                    <p className="text-white text-sm mt-1">{userData?.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  
                  {userData?.lastDisplayNameChange && (
                    <div className="bg-[#1A1A1A] p-4 rounded-lg">
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Last Display Name Change</p>
                      <p className="text-white text-sm mt-1">{new Date(userData.lastDisplayNameChange).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData?.displayNameHistory && userData.displayNameHistory.length > 0 && (
                <div className="bg-[#252525]/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Display Name History
                  </h3>
                  <ul className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                    {userData.displayNameHistory.map((item, index) => (
                      <li key={index} className="border-b border-gray-700 pb-3 last:border-0">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                          <div>
                            <p className="text-white">
                              <span className="text-gray-400">Changed from </span>
                              <span className="font-medium">{item.previousName}</span>
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(item.changedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-[#252525]/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Viewing Activity
                </h3>
                <p className="text-gray-300 mb-4">Your recent viewing history will appear here.</p>
                
                <div className="text-center py-8 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No recent activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 