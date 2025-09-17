// src/components/Header.jsx - Integrated version with Tools tab and all existing features
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from './context/AppContext';
import {
  Save,
  Upload,
  Settings,
  HelpCircle,
  User,
  Brain,
  LogOut,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  Trash,
  Download,
  Store,
  Wrench, // New icon for Tools
} from 'lucide-react';

export const Header = ({
  onSave,
  onLoad,
  onExport,
  onReset,
  onClear,
  onOpenMarketplace,
  user,
  onLogout,
}) => {
  const { activePage, navigateTo, settings, updateSettings } = useApp();
  const darkMode = settings?.preferences?.theme === 'dark' || false;

  // State for dropdowns and menus
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New tool 'Web Scraper' has been created successfully",
      read: false,
      time: '15m ago',
    },
    {
      id: 2,
      message: "Workflow 'Customer Onboarding' has been completed",
      read: false,
      time: '20m ago',
    },
    {
      id: 3,
      message: "New agent template available: 'Advanced Data Analysis'",
      read: false,
      time: '1h ago',
    },
    {
      id: 4,
      message: 'System update scheduled for tomorrow',
      read: true,
      time: '2d ago',
    },
  ]);

  // Refs for handling outside clicks
  const userMenuRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Handle clicks outside of menus to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target)
      ) {
        setShowSettingsMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigation handler
  const handleNavigate = (page) => {
    if (navigateTo) {
      navigateTo(page);
    }
    setShowUserMenu(false);
    setShowSettingsMenu(false);
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    if (updateSettings && settings?.preferences) {
      const newTheme = darkMode ? 'light' : 'dark';
      updateSettings('preferences', {
        ...settings.preferences,
        theme: newTheme,
      });
    }
  };

  // Notification functions
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // User info
  const userName = user?.name || user?.email || 'User';
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header
      className={`h-16 px-4 flex items-center justify-between border-b ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm`}
    >
      {/* Left Side - Logo and Navigation */}
      <div className='flex items-center'>
        <div className='flex items-center mr-8'>
          {/* Reply Sense Logo */}
          <div className='h-10 mr-0'>
            <img
              src='/reply_sense_logo.png'
              alt='Reply Sense Logo'
              className='h-full'
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* MultiAgent Workflow with icon */}
          <div className='flex items-center ml-0'>
            <div className='w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white mr-2'>
              <Brain className='w-5 h-5' />
            </div>
            <h1
              className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              } cursor-pointer`}
              onClick={() => handleNavigate('workflow')}
            >
              MultiAgent Workflow
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className='hidden md:flex items-center space-x-6'>
          <button
            className={`${
              activePage === 'workflow'
                ? `${
                    darkMode
                      ? 'text-blue-400 border-blue-400'
                      : 'text-blue-600 border-blue-600'
                  } border-b-2 pb-1`
                : `${
                    darkMode
                      ? 'text-gray-300 hover:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600'
                  }`
            } text-sm font-medium transition-colors`}
            onClick={() => handleNavigate('workflow')}
          >
            Workflow Builder
          </button>

          {/* NEW TOOLS TAB */}
          <button
            className={`${
              activePage === 'tools'
                ? `${
                    darkMode
                      ? 'text-blue-400 border-blue-400'
                      : 'text-blue-600 border-blue-600'
                  } border-b-2 pb-1`
                : `${
                    darkMode
                      ? 'text-gray-300 hover:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600'
                  }`
            } text-sm font-medium flex items-center transition-colors`}
            onClick={() => handleNavigate('tools')}
          >
            <Wrench className='w-4 h-4 mr-1' />
            Tools
          </button>

          <button
            className={`${
              activePage === 'dashboard'
                ? `${
                    darkMode
                      ? 'text-blue-400 border-blue-400'
                      : 'text-blue-600 border-blue-600'
                  } border-b-2 pb-1`
                : `${
                    darkMode
                      ? 'text-gray-300 hover:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600'
                  }`
            } text-sm font-medium transition-colors`}
            onClick={() => handleNavigate('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={`${
              activePage === 'simulations'
                ? `${
                    darkMode
                      ? 'text-blue-400 border-blue-400'
                      : 'text-blue-600 border-blue-600'
                  } border-b-2 pb-1`
                : `${
                    darkMode
                      ? 'text-gray-300 hover:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600'
                  }`
            } text-sm font-medium transition-colors`}
            onClick={() => handleNavigate('simulations')}
          >
            Simulations
          </button>

          <button
            className={`${
              activePage === 'analytics'
                ? `${
                    darkMode
                      ? 'text-blue-400 border-blue-400'
                      : 'text-blue-600 border-blue-600'
                  } border-b-2 pb-1`
                : `${
                    darkMode
                      ? 'text-gray-300 hover:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600'
                  }`
            } text-sm font-medium transition-colors`}
            onClick={() => handleNavigate('analytics')}
          >
            Analytics
          </button>

          {/* Marketplace button in navigation */}
          <button
            className={`flex items-center ${
              darkMode
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            } text-sm font-medium transition-colors`}
            onClick={onOpenMarketplace}
          >
            <Store className='w-4 h-4 mr-1' />
            Marketplace
          </button>
        </nav>
      </div>

      {/* Right Side - Actions and User Controls */}
      <div className='flex items-center space-x-2'>
        {/* Workflow-specific actions */}
        {activePage === 'workflow' && (
          <div
            className={`flex items-center border-r ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } pr-2 mr-2`}
          >
            {/* Marketplace button (icon only in this section) */}
            <button
              className={`p-2 ${
                darkMode
                  ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              } rounded-md transition-colors`}
              onClick={onOpenMarketplace}
              title='Workflow Marketplace'
            >
              <Store className='w-5 h-5' />
            </button>

            <button
              className={`p-2 ${
                darkMode
                  ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              } rounded-md transition-colors`}
              onClick={onSave}
              title='Save Workflow'
            >
              <Save className='w-5 h-5' />
            </button>

            <button
              className={`p-2 ${
                darkMode
                  ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              } rounded-md transition-colors`}
              onClick={onLoad}
              title='Load Workflow'
            >
              <Upload className='w-5 h-5' />
            </button>

            <button
              className={`p-2 ${
                darkMode
                  ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              } rounded-md transition-colors`}
              onClick={onExport || onClear}
              title={onExport ? 'Export Workflow' : 'Clear Workspace'}
            >
              <Download className='w-5 h-5' />
            </button>

            {onReset && (
              <button
                className={`p-2 ${
                  darkMode
                    ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                } rounded-md transition-colors`}
                onClick={onReset}
                title='Reset Workflow'
              >
                <Trash className='w-5 h-5' />
              </button>
            )}
          </div>
        )}

        {/* Notifications */}
        <div className='relative' ref={notificationsRef}>
          <button
            className={`p-2 ${
              darkMode
                ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            } rounded-md transition-colors relative`}
            onClick={() => setShowNotifications(!showNotifications)}
            title='Notifications'
          >
            <Bell className='w-5 h-5' />
            {unreadCount > 0 && (
              <span className='absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center'>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              } border rounded-md shadow-lg z-50`}
            >
              <div
                className={`flex items-center justify-between border-b ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                } p-3`}
              >
                <h3
                  className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Notifications
                </h3>
                <div className='flex space-x-2'>
                  <button
                    className={`text-xs ${
                      darkMode
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-800'
                    } transition-colors`}
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                  <button
                    className={`text-xs ${
                      darkMode
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-600 hover:text-gray-800'
                    } transition-colors`}
                    onClick={clearAllNotifications}
                  >
                    Clear all
                  </button>
                </div>
              </div>

              <div className='max-h-72 overflow-y-auto py-1'>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 ${
                        notification.read
                          ? darkMode
                            ? 'bg-gray-800'
                            : 'bg-white'
                          : darkMode
                          ? 'bg-gray-700'
                          : 'bg-blue-50'
                      } hover:${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-100'
                      } last:border-b-0 transition-colors`}
                    >
                      <div
                        className={`text-sm ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}
                      >
                        {notification.message}
                      </div>
                      <div
                        className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        } mt-1`}
                      >
                        {notification.time}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className={`p-3 text-center ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    } text-sm`}
                  >
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings menu */}
        <div className='relative' ref={settingsMenuRef}>
          <button
            className={`p-2 ${
              darkMode
                ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            } rounded-md transition-colors`}
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            title='Settings'
          >
            <Settings className='w-5 h-5' />
          </button>

          {showSettingsMenu && (
            <div
              className={`absolute right-0 mt-2 w-48 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              } border rounded-md shadow-lg z-50`}
            >
              <div className='py-1'>
                <button
                  onClick={() => handleNavigate('settings')}
                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                    darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <Settings className='w-4 h-4 mr-2' />
                  Settings
                </button>
                <button
                  className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                    darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                  onClick={toggleDarkMode}
                >
                  {darkMode ? (
                    <>
                      <Sun className='w-4 h-4 mr-2' />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className='w-4 h-4 mr-2' />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          className={`p-2 ${
            darkMode
              ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          } rounded-md transition-colors`}
          title='Help'
        >
          <HelpCircle className='w-5 h-5' />
        </button>

        {/* Divider */}
        <div
          className={`h-8 w-px ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } mx-2`}
        />

        {/* User menu */}
        {user && (
          <div className='relative' ref={userMenuRef}>
            <button
              className={`flex items-center text-sm font-medium ${
                darkMode
                  ? 'text-gray-200 hover:text-blue-400'
                  : 'text-gray-700 hover:text-blue-600'
              } transition-colors`}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-white font-medium'>
                {userInitials || <User className='w-4 h-4' />}
              </div>
              <span className='hidden md:inline'>{userName}</span>
              <ChevronDown className='w-4 h-4 ml-1' />
            </button>

            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-48 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                } border rounded-md shadow-lg z-50`}
              >
                <div className='py-1'>
                  <button
                    onClick={() => handleNavigate('profile')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode
                        ? 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={() => handleNavigate('projects')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode
                        ? 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    Your Projects
                  </button>
                  <button
                    onClick={() => handleNavigate('api-keys')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode
                        ? 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    API Keys
                  </button>
                  <hr
                    className={`my-1 ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  />
                  <button
                    onClick={onLogout}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                      darkMode
                        ? 'text-red-400 hover:bg-gray-700'
                        : 'text-red-600 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    <LogOut className='w-4 h-4 mr-2' />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
