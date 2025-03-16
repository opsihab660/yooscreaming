import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserData, changeDisplayName, canChangeDisplayName } from '../services/userService';
import { IUser } from '../models/User';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { currentUser, signOut, updateUserDisplayName } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isChangingName, setIsChangingName] = useState(false);
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
          setNewDisplayName(data.displayName || currentUser.displayName || '');
          
          // Check if user can change display name
          const status = canChangeDisplayName(data.lastDisplayNameChange);
          setNameChangeStatus(status);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleDisplayNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDisplayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }
    
    if (newDisplayName === userData?.displayName) {
      toast.error('New display name must be different from current name');
      return;
    }
    
    if (!nameChangeStatus.canChange) {
      toast.error(`You can change your display name in ${nameChangeStatus.daysRemaining} days`);
      return;
    }
    
    setIsChangingName(true);
    
    try {
      // Update display name in MongoDB
      const updatedUser = await changeDisplayName(currentUser!.uid, newDisplayName);
      setUserData(updatedUser);
      
      // Update display name in Firebase
      await updateUserDisplayName(newDisplayName);
      
      // Update name change status
      const status = canChangeDisplayName(updatedUser.lastDisplayNameChange);
      setNameChangeStatus(status);
      
      toast.success('Display name updated successfully');
    } catch (error: any) {
      console.error('Error changing display name:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update display name');
      }
    } finally {
      setIsChangingName(false);
    }
  };

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">Settings</h1>
      
      <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden border border-gray-800 backdrop-blur-sm">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-1/4 bg-[#252525] p-6 border-r border-gray-800">
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6 p-3 bg-[#1A1A1A] rounded-xl">
                <img 
                  src={currentUser?.photoURL || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full ring-2 ring-red-500"
                />
                <div>
                  <p className="text-white font-medium">{userData?.displayName || currentUser?.displayName}</p>
                  <p className="text-gray-400 text-sm">{currentUser?.email}</p>
                </div>
              </div>
              
              <button
                onClick={signOut}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Sign Out
              </button>
            </div>
            
            <nav className="space-y-2">
              <button 
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'account' ? 'bg-gradient-to-r from-red-500/20 to-purple-600/20 text-white font-medium' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}
                onClick={() => setActiveTab('account')}
              >
                Account
              </button>
              <button 
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'appearance' ? 'bg-gradient-to-r from-red-500/20 to-purple-600/20 text-white font-medium' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}
                onClick={() => setActiveTab('appearance')}
              >
                Appearance
              </button>
              <button 
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'notifications' ? 'bg-gradient-to-r from-red-500/20 to-purple-600/20 text-white font-medium' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
              <button 
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'privacy' ? 'bg-gradient-to-r from-red-500/20 to-purple-600/20 text-white font-medium' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}
                onClick={() => setActiveTab('privacy')}
              >
                Privacy
              </button>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4 p-8">
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-semibold mb-8 text-white">Account Settings</h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-gray-300 text-sm mb-3">Display Name</label>
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-grow">
                        <input 
                          type="text" 
                          className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-red-500 focus:outline-none transition-all duration-200"
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          disabled={!nameChangeStatus.canChange || isChangingName}
                        />
                        {!nameChangeStatus.canChange && (
                          <p className="text-amber-500 text-sm mt-2">
                            You can change your display name in {nameChangeStatus.daysRemaining} days
                          </p>
                        )}
                        {userData?.lastDisplayNameChange && (
                          <p className="text-sm text-gray-500 mt-2">
                            Last changed: {new Date(userData.lastDisplayNameChange).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleDisplayNameChange}
                        disabled={!nameChangeStatus.canChange || isChangingName}
                        className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                          nameChangeStatus.canChange && !isChangingName
                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isChangingName ? 'Updating...' : 'Update Name'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Display name can be changed once every 60 days</p>
                  </div>
                  
                  {userData?.displayNameHistory && userData.displayNameHistory.length > 0 && (
                    <div>
                      <label className="block text-gray-300 text-sm mb-3">Name Change History</label>
                      <div className="bg-[#2A2A2A] rounded-xl border border-gray-700 p-4">
                        <ul className="space-y-3">
                          {userData.displayNameHistory.map((item, index) => (
                            <li key={index} className="text-sm">
                              <span className="text-gray-400">Changed from </span>
                              <span className="text-white font-medium">{item.previousName}</span>
                              <span className="text-gray-400"> on </span>
                              <span className="text-white">{new Date(item.changedAt).toLocaleDateString()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-3">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-red-500 focus:outline-none"
                      value={currentUser?.email || ''}
                      readOnly
                    />
                    <p className="text-sm text-gray-500 mt-2">Email is managed by your Google account</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-3">Account ID</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-xl border border-gray-700"
                      value={currentUser?.uid || ''}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-2xl font-semibold mb-8 text-white">Appearance Settings</h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-gray-300 text-sm mb-3">Theme</label>
                    <div className="flex space-x-4">
                      <button className="bg-[#2A2A2A] text-white px-6 py-3 rounded-xl border-2 border-red-500 transition-all duration-300">
                        Dark (Default)
                      </button>
                      <button className="bg-[#2A2A2A] text-white px-6 py-3 rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all duration-300">
                        Light
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-semibold mb-8 text-white">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-xl border border-gray-700">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-400 mt-1">Receive emails about new releases</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-xl border border-gray-700">
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-400 mt-1">Receive push notifications in browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-2xl font-semibold mb-8 text-white">Privacy Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-xl border border-gray-700">
                    <div>
                      <p className="text-white font-medium">Share Viewing History</p>
                      <p className="text-sm text-gray-400 mt-1">Allow friends to see what you've watched</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-xl border border-gray-700">
                    <div>
                      <p className="text-white font-medium">Data Collection</p>
                      <p className="text-sm text-gray-400 mt-1">Allow us to collect usage data to improve service</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 