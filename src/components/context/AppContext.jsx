// context/AppContext.jsx - Updated with Tools support
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

// Initial settings - with Tools support and backwards compatibility
const initialSettings = {
  // Backwards compatibility: add appearance section that maps to preferences
  appearance: {
    get darkMode() {
      return this._theme === 'dark';
    },
    set darkMode(value) {
      this._theme = value ? 'dark' : 'light';
    },
    _theme: 'light'
  },
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
  // New tools settings
  tools: {
    autoValidate: true,
    showCodeHints: true,
    defaultTimeout: 30000,
    maxRetries: 3,
    enableTesting: true,
    autoSaveCode: true
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
      system_updates: true,
      tool_created: true, // New tool events
      tool_updated: false,
      tool_deleted: false
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

  // Settings state with proper initialization
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('app-settings');
    const loadedSettings = savedSettings ? JSON.parse(savedSettings) : initialSettings;
    
    // Ensure backwards compatibility - sync theme with darkMode
    if (loadedSettings.preferences?.theme) {
      loadedSettings.appearance = {
        ...loadedSettings.appearance,
        darkMode: loadedSettings.preferences.theme === 'dark'
      };
    }
    
    return loadedSettings;
  });

  // Tools state
  const [tools, setTools] = useState(() => {
    const savedTools = localStorage.getItem('multiagent-tools');
    return savedTools ? JSON.parse(savedTools) : [];
  });

  // Persist user profile changes
  useEffect(() => {
    localStorage.setItem('user-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Persist settings changes with theme sync
  useEffect(() => {
    // Sync appearance.darkMode with preferences.theme for backwards compatibility
    const syncedSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        theme: settings.appearance?.darkMode ? 'dark' : 'light'
      }
    };
    localStorage.setItem('app-settings', JSON.stringify(syncedSettings));
  }, [settings]);

  // Persist tools changes
  useEffect(() => {
    localStorage.setItem('multiagent-tools', JSON.stringify(tools));
  }, [tools]);

  // Update user profile
  const updateUserProfile = (updates) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      ...updates,
    }));
  };

  // Update settings with theme sync
  const updateSettings = (category, updates) => {
    setSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
        [category]: {
          ...prevSettings[category],
          ...updates,
        },
      };

      // Special handling for appearance category to sync with preferences.theme
      if (category === 'appearance' && updates.darkMode !== undefined) {
        newSettings.preferences = {
          ...newSettings.preferences,
          theme: updates.darkMode ? 'dark' : 'light'
        };
      }

      return newSettings;
    });
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

  // Tool management functions
  const addTool = (tool) => {
    const newTool = {
      ...tool,
      id: tool.id || `tool-${Date.now()}`,
      created: tool.created || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      usageCount: 0,
      isActive: tool.isActive !== undefined ? tool.isActive : true,
      isFavorite: tool.isFavorite || false
    };
    setTools(prevTools => [...prevTools, newTool]);
    return newTool;
  };

  const updateTool = (toolId, updates) => {
    setTools(prevTools => 
      prevTools.map(tool => 
        tool.id === toolId 
          ? { 
              ...tool, 
              ...updates, 
              lastModified: new Date().toISOString() 
            }
          : tool
      )
    );
  };

  const deleteTool = (toolId) => {
    setTools(prevTools => prevTools.filter(tool => tool.id !== toolId));
  };

  const duplicateTool = (toolId) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      const duplicatedTool = {
        ...tool,
        id: `tool-${Date.now()}`,
        name: `${tool.name} (Copy)`,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        usageCount: 0
      };
      setTools(prevTools => [...prevTools, duplicatedTool]);
      return duplicatedTool;
    }
    return null;
  };

  const toggleToolFavorite = (toolId) => {
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.id === toolId
          ? { ...tool, isFavorite: !tool.isFavorite }
          : tool
      )
    );
  };

  const toggleToolActive = (toolId) => {
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.id === toolId
          ? { ...tool, isActive: !tool.isActive }
          : tool
      )
    );
  };

  // Context value - extended with tools support
  const value = {
    // Existing functionality
    activePage,
    userProfile,
    settings,
    navigateTo,
    updateUserProfile,
    updateSettings,
    updateNestedSetting,
    resetSettings,
    
    // New tools functionality
    tools,
    addTool,
    updateTool,
    deleteTool,
    duplicateTool,
    toggleToolFavorite,
    toggleToolActive,
    
    // Utility functions
    formatDate: (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
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