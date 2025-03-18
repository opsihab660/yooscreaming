import { User as FirebaseUser } from 'firebase/auth';
import axios from 'axios';
import { collectDeviceInfo } from './deviceInfoService';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.DEV 
    ? '/api' // In development, this will use the proxy in vite.config.ts
    : 'https://yooscreaming-server.vercel.app/api' // In production, use absolute URL
});

// Function to save user to MongoDB
export const saveUserToDatabase = async (user: FirebaseUser) => {
  try {
    // Collect device information and IP address
    const { deviceInfo, ipAddress } = await collectDeviceInfo();
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL,
      lastLogin: new Date(),
      deviceInfo,
      ipAddress,
      loginHistory: [{
        timestamp: new Date(),
        ipAddress,
        deviceInfo
      }]
    };

    // Make API call to save user data
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  }
};

// Function to update login information
export const updateLoginInfo = async (uid: string) => {
  try {
    // Collect device information and IP address
    const { deviceInfo, ipAddress } = await collectDeviceInfo();
    
    const loginData = {
      lastLogin: new Date(),
      deviceInfo,
      ipAddress,
      $push: {
        loginHistory: {
          timestamp: new Date(),
          ipAddress,
          deviceInfo
        }
      }
    };

    const response = await api.put(`/users/${uid}/login-info`, loginData);
    return response.data;
  } catch (error) {
    console.error('Error updating login information:', error);
    throw error;
  }
};

// Function to get user data from MongoDB
export const getUserData = async (uid: string) => {
  try {
    const response = await api.get(`/users/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Function to update user data in MongoDB
export const updateUserData = async (uid: string, data: any) => {
  try {
    const response = await api.put(`/users/${uid}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

// Function to change display name
export const changeDisplayName = async (uid: string, newDisplayName: string) => {
  try {
    const response = await api.put(`/users/${uid}/display-name`, { 
      displayName: newDisplayName 
    });
    return response.data;
  } catch (error) {
    console.error('Error changing display name:', error);
    throw error;
  }
};

// Function to check if user can change display name
export const canChangeDisplayName = (lastChangeDate: Date | null | undefined): { canChange: boolean; daysRemaining: number } => {
  if (!lastChangeDate) {
    return { canChange: true, daysRemaining: 0 };
  }

  const now = new Date();
  const lastChange = new Date(lastChangeDate);
  const diffTime = now.getTime() - lastChange.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays >= 60) {
    return { canChange: true, daysRemaining: 0 };
  } else {
    return { canChange: false, daysRemaining: 60 - diffDays };
  }
}; 