// components/Header.jsx - Updated with reduced logo gap
import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';

export const Header = ({
  onSave,
  onLoad,
  onExport,
  onReset,
  onOpenMarketplace,
  darkMode,
  toggleDarkMode,
  navigateTo,
  activePage,
  userName = 'User',
  userInitials = '',
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Workflow 'Customer Onboarding' has been completed",
      read: false,
      time: '20m ago',
    },
    {
      id: 2,
      message: "New agent template available: 'Advanced Data Analysis'",
      read: false,
      time: '1h ago',
    },
    {
      id: 3,
      message: 'System update scheduled for tomorrow',
      read: true,
      time: '2d ago',
    },
  ]);

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

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Handle navigation and close menus
  const handleNavigate = (page) => {
    navigateTo(page);
    setShowUserMenu(false);
    setShowSettingsMenu(false);
  };

  return (
    <header
      className={`h-16 px-4 flex items-center justify-between border-b ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm`}
    >
      <div className='flex items-center'>
        <div className='flex items-center mr-8'>
          {/* Reply Sense Logo - Reduced right margin */}
          <div className='h-10 mr-0'>
            <img 
              src="/reply_sense_logo.png" 
              alt="Reply Sense Logo" 
              className="h-full"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
              }}
            />
          </div>
          
          {/* MultiAgent Workflow with icon - Reduced left margin */}
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
            } text-sm font-medium`}
            onClick={() => handleNavigate('workflow')}
          >
            Workflow Builder
          </button>
          <button
            className={`${
              darkMode
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            } text-sm font-medium`}
            onClick={() => handleNavigate('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`${
              darkMode
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            } text-sm font-medium`}
            onClick={() => handleNavigate('simulations')}
          >
            Simulations
          </button>
          <button
            className={`${
              darkMode
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            } text-sm font-medium`}
            onClick={() => handleNavigate('analytics')}
          >
            Analytics
          </button>
          {/* New Marketplace button in navigation */}
          <button
            className={`flex items-center ${
              darkMode
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            } text-sm font-medium`}
            onClick={onOpenMarketplace}
          >
            <Store className='w-4 h-4 mr-1' />
            Marketplace
          </button>
        </nav>
      </div>

      <div className='flex items-center space-x-2'>
        {/* Only show workflow actions on the workflow page */}
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
              onClick={onExport}
              title='Export Workflow'
            >
              <Download className='w-5 h-5' />
            </button>

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
              } border rounded-md shadow-lg z-10`}
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
                    }`}
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                  <button
                    className={`text-xs ${
                      darkMode
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
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
                      } hover:bg-${
                        darkMode ? 'gray-700' : 'gray-50'
                      } border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-100'
                      } last:border-b-0`}
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
              } border rounded-md shadow-lg z-10`}
            >
              <div className='py-1'>
                <button
                  onClick={() => handleNavigate('settings')}
                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                    darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className='w-4 h-4 mr-2' />
                  Settings
                </button>
                <button
                  className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                    darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
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

        <div
          className={`h-8 w-px ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } mx-2`}
        ></div>

        {/* User menu */}
        <div className='relative' ref={userMenuRef}>
          <button
            className={`flex items-center text-sm font-medium ${
              darkMode
                ? 'text-gray-200 hover:text-blue-400'
                : 'text-gray-700 hover:text-blue-600'
            }`}
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
              } border rounded-md shadow-lg z-10`}
            >
              <div className='py-1'>
                <button
                  onClick={() => handleNavigate('profile')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Your Profile
                </button>
                <button
                  onClick={() => handleNavigate('projects')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Your Projects
                </button>
                <button
                  onClick={() => handleNavigate('api-keys')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
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
                  }`}
                >
                  <LogOut className='w-4 h-4 mr-2' />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};