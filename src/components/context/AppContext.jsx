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
    density: 'comfortable',
    fontSize: 'medium',
    confirmNodeDeletion: true,
    maxUndoSteps: 20,
  },
  ai: {
    defaultModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    defaultMemoryType: 'chat-history',
    apiLimits: false,
    rateLimit: 100,
    defaultTools: ['web-search', 'code-interpreter']
  },
  integrations: {
    slack: { enabled: false, webhook: '' },
    github: { enabled: false, token: '' },
    jira: { enabled: false, domain: '', apiKey: '' },
    aws: { enabled: false, accessKey: '', secretKey: '' },
    openai: { enabled: true, apiKey: '••••••••••••••••••••••' }
  },
  notifications: {
    channels: {
      slack: false,
      teams: false
    },
    events: {
      workflow_completed: true,
      workflow_error: true,
      agent_created: false,
      system_updates: true
    }
  },
  security: {
    sessionTimeout: 30,
    ipRestrictions: false,
    apiAccessControl: false,
    auditLogging: true
  }
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
    setSettings((prevSettings) => {
      // Make sure that section exists
      const currentSectionValues = prevSettings[category]?.[section] || {};
      
      return {
        ...prevSettings,
        [category]: {
          ...prevSettings[category],
          [section]: {
            ...currentSectionValues,
            [key]: value,
          },
        },
      };
    });
  };

  // Navigate to a specific page
  const navigateTo = (page) => {
    setActivePage(page);
  };

  // Reset all settings to default
  const resetSettings = (category = null) => {
    if (category) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [category]: initialSettings[category],
      }));
    } else {
      setSettings(initialSettings);
    }
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
    resetSettings
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