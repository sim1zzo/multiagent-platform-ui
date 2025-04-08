// pages/Settings.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Shield,
  Globe,
  Save,
  Grid,
  Eye,
} from 'lucide-react';

export const Settings = () => {
  const { settings, updateSettings, updateNestedSetting, navigateTo } =
    useApp();
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className='flex-1 flex flex-col bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4'>
        <div className='flex items-center'>
          <button
            onClick={() => navigateTo('workflow')}
            className='mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <ArrowLeft className='w-5 h-5' />
          </button>
          <h1 className='text-xl font-semibold text-gray-800 dark:text-white'>
            Settings
          </h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
        <nav className='flex px-6'>
          <button
            className={`py-4 px-4 ${
              activeTab === 'account'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button
            className={`py-4 px-4 ${
              activeTab === 'preferences'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className='flex-1 overflow-auto p-6'>
        {activeTab === 'account' && (
          <AccountSettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
          />
        )}
        {activeTab === 'preferences' && (
          <PreferencesSettings
            settings={settings}
            updateSettings={updateSettings}
          />
        )}
      </div>
    </div>
  );
};

// Account settings component
const AccountSettings = ({ settings, updateNestedSetting }) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
          Account Settings
        </h2>

        {/* Notifications */}
        <div className='mb-8'>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <Bell className='w-5 h-5 mr-2' />
            Notification Settings
          </h3>

          <div className='space-y-4 pl-7'>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='email-notifications'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Email Notifications
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='email-notifications'
                  checked={settings.account.notifications.email}
                  onChange={(e) =>
                    updateNestedSetting(
                      'account',
                      'notifications',
                      'email',
                      e.target.checked
                    )
                  }
                  className='sr-only'
                />
                {/* Fixed toggle styling - removed inline style and used class-based approach */}
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    settings.account.notifications.email
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <label
                htmlFor='browser-notifications'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Browser Notifications
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='browser-notifications'
                  checked={settings.account.notifications.browser}
                  onChange={(e) =>
                    updateNestedSetting(
                      'account',
                      'notifications',
                      'browser',
                      e.target.checked
                    )
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    settings.account.notifications.browser
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <label
                htmlFor='mobile-notifications'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Mobile Notifications
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='mobile-notifications'
                  checked={settings.account.notifications.mobile}
                  onChange={(e) =>
                    updateNestedSetting(
                      'account',
                      'notifications',
                      'mobile',
                      e.target.checked
                    )
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    settings.account.notifications.mobile
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className='mb-8'>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <Shield className='w-5 h-5 mr-2' />
            Security
          </h3>

          <div className='space-y-4 pl-7'>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='two-factor-auth'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Two-Factor Authentication
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='two-factor-auth'
                  checked={settings.account.twoFactorAuth}
                  onChange={(e) =>
                    updateNestedSetting(
                      'account',
                      'twoFactorAuth',
                      e.target.checked
                    )
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    settings.account.twoFactorAuth
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <Globe className='w-5 h-5 mr-2' />
            Language
          </h3>

          <div className='pl-7'>
            <select
              id='language'
              value={settings.account.language}
              onChange={(e) =>
                updateNestedSetting('account', 'language', e.target.value)
              }
              className='block w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
            >
              <option value='English'>English</option>
              <option value='Spanish'>Spanish</option>
              <option value='French'>French</option>
              <option value='German'>German</option>
              <option value='Japanese'>Japanese</option>
              <option value='Chinese'>Chinese</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Preferences settings component
const PreferencesSettings = ({ settings, updateSettings }) => {
  const [formData, setFormData] = useState({
    theme: settings.preferences.theme,
    defaultView: settings.preferences.defaultView,
    autoSave: settings.preferences.autoSave,
    saveInterval: settings.preferences.saveInterval,
    gridSize: settings.preferences.gridSize,
    snapToGrid: settings.preferences.snapToGrid,
    showMinimap: settings.preferences.showMinimap,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings('preferences', formData);
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
          Preferences
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Theme */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              {formData.theme === 'dark' ? (
                <Moon className='w-5 h-5 mr-2' />
              ) : (
                <Sun className='w-5 h-5 mr-2' />
              )}
              Theme
            </h3>

            <div className='pl-7 space-y-4'>
              <div className='flex space-x-4'>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    name='theme'
                    value='light'
                    checked={formData.theme === 'light'}
                    onChange={handleChange}
                    className='form-radio text-blue-600'
                  />
                  <span className='ml-2 text-gray-700 dark:text-gray-300'>
                    Light
                  </span>
                </label>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    name='theme'
                    value='dark'
                    checked={formData.theme === 'dark'}
                    onChange={handleChange}
                    className='form-radio text-blue-600'
                  />
                  <span className='ml-2 text-gray-700 dark:text-gray-300'>
                    Dark
                  </span>
                </label>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    name='theme'
                    value='system'
                    checked={formData.theme === 'system'}
                    onChange={handleChange}
                    className='form-radio text-blue-600'
                  />
                  <span className='ml-2 text-gray-700 dark:text-gray-300'>
                    System
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Default View */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Eye className='w-5 h-5 mr-2' />
              Default View
            </h3>

            <div className='pl-7'>
              <select
                name='defaultView'
                value={formData.defaultView}
                onChange={handleChange}
                className='block w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
              >
                <option value='workflow'>Workflow</option>
                <option value='dashboard'>Dashboard</option>
                <option value='analytics'>Analytics</option>
              </select>
            </div>
          </div>

          {/* Auto Save */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Save className='w-5 h-5 mr-2' />
              Auto Save
            </h3>

            <div className='pl-7 space-y-4'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='autoSave'
                  name='autoSave'
                  checked={formData.autoSave}
                  onChange={handleChange}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='autoSave'
                  className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                >
                  Enable Auto Save
                </label>
              </div>

              {formData.autoSave && (
                <div>
                  <label
                    htmlFor='saveInterval'
                    className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Save Interval (minutes)
                  </label>
                  <input
                    type='number'
                    id='saveInterval'
                    name='saveInterval'
                    min='1'
                    max='60'
                    value={formData.saveInterval}
                    onChange={handleChange}
                    className='w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                  />
                </div>
              )}
            </div>
          </div>

          {/* Grid Settings */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Grid className='w-5 h-5 mr-2' />
              Grid Settings
            </h3>

            <div className='pl-7 space-y-4'>
              <div>
                <label
                  htmlFor='gridSize'
                  className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                >
                  Grid Size
                </label>
                <input
                  type='number'
                  id='gridSize'
                  name='gridSize'
                  min='5'
                  max='50'
                  value={formData.gridSize}
                  onChange={handleChange}
                  className='w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                />
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='snapToGrid'
                  name='snapToGrid'
                  checked={formData.snapToGrid}
                  onChange={handleChange}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='snapToGrid'
                  className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                >
                  Snap to Grid
                </label>
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='showMinimap'
                  name='showMinimap'
                  checked={formData.showMinimap}
                  onChange={handleChange}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='showMinimap'
                  className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                >
                  Show Minimap
                </label>
              </div>
            </div>
          </div>

          <div className='pt-4 pl-7'>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
