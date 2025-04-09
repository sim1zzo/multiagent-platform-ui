// context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AppContext = createContext();

// Initial user profile
const initialUserProfile = {
  name: 'Simone Izzo',
  email: 'si.izzo@reply.it',
  role: 'Administrator',
  avatar: null, // Will be managed as URL or null
  joinDate: '2023-01-15',
  lastActive: 'Today',
  projects: [
    { id: 'proj-1', name: 'Customer Service Bot', status: 'Active' },
    { id: 'proj-2', name: 'Data Analysis Pipeline', status: 'Draft' },
    { id: 'proj-3', name: 'Content Moderation System', status: 'Archived' },
  ],
  apiKeys: [
    {
      id: 'key-1',
      name: 'Development Key',
      created: '2023-02-10',
      lastUsed: '2023-10-25',
    },
    {
      id: 'key-2',
      name: 'Production Key',
      created: '2023-05-20',
      lastUsed: '2023-10-30',
    },
  ],
};

// Initial settings
const initialSettings = {
  account: {
    notifications: {
      email: true,
      browser: true,
      mobile: false,
    },
    twoFactorAuth: false,
    language: 'English',
  },
  preferences: {
    theme: 'light',
    defaultView: 'workflow',
    autoSave: true,
    saveInterval: 5, // minutes
    gridSize: 20,
    snapToGrid: true,
    showMinimap: true,
  },
};

export const AppProvider = ({ children }) => {
  // Active page state
  const [activePage, setActivePage] = useState('workflow');

  // User profile state
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('user-profile');
    return savedProfile ? JSON.parse(savedProfile) : initialUserProfile;
  });

  // Settings state
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings ? JSON.parse(savedSettings) : initialSettings;
  });

  // Persist user profile changes
  useEffect(() => {
    localStorage.setItem('user-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Persist settings changes
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  // Update user profile
  const updateUserProfile = (updates) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      ...updates,
    }));
  };

  // Update settings
  const updateSettings = (category, updates) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        ...updates,
      },
    }));
  };

  // Update specific nested setting
  const updateNestedSetting = (category, section, key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [section]: {
          ...prevSettings[category][section],
          [key]: value,
        },
      },
    }));
  };

  // Navigate to a specific page
  const navigateTo = (page) => {
    setActivePage(page);
  };

  // Context value
  const value = {
    activePage,
    userProfile,
    settings,
    navigateTo,
    updateUserProfile,
    updateSettings,
    updateNestedSetting,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook for using the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
