// src/components/pages/Settings.jsx
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
  Layout,
  Terminal,
  Cpu,
  Database,
  Zap,
  User,
  Key,
  Check,
  AlignCenter,
  Code,
  Workflow,
  Download, // Aggiungiamo l'icona Download qui
} from 'lucide-react';

export const Settings = () => {
  const { settings, updateSettings, updateNestedSetting, navigateTo } =
    useApp();
  const [activeTab, setActiveTab] = useState('appearance');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  // Function to handle tab change with unsaved changes warning
  const handleTabChange = (newTab) => {
    if (unsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      setActiveTab(newTab);
    }
  };

  // Function to mark changes as saved
  const markChangesSaved = () => {
    setUnsavedChanges(false);
  };

  return (
    <div className='flex-1 flex flex-col bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4'>
        <div className='flex items-center'>
          <button
            onClick={() => {
              if (unsavedChanges) {
                setShowUnsavedWarning(true);
              } else {
                navigateTo('workflow');
              }
            }}
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
        <nav className='flex px-6 overflow-x-auto'>
          <button
            className={`py-4 px-4 whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('appearance')}
          >
            Appearance
          </button>
          <button
            className={`py-4 px-4 whitespace-nowrap ${
              activeTab === 'workflow'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('workflow')}
          >
            Workflow Settings
          </button>
          <button
            className={`py-4 px-4 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('ai')}
          >
            AI Configuration
          </button>
          <button
            className={`py-4 px-4 whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('notifications')}
          >
            Notifications
          </button>
          <button
            className={`py-4 px-4 whitespace-nowrap ${
              activeTab === 'security'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('security')}
          >
            Security
          </button>
          <button
            className={`py-4 px-4 whitespace-nowrap ${
              activeTab === 'integrations'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('integrations')}
          >
            Integrations
          </button>
          <button
            className={`py-4 px-4 whitespace-nowrap ${
              activeTab === 'account'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('account')}
          >
            Account
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className='flex-1 overflow-auto p-6'>
        {activeTab === 'appearance' && (
          <AppearanceSettings
            settings={settings}
            updateSettings={updateSettings}
            markChangesSaved={markChangesSaved}
            setUnsavedChanges={setUnsavedChanges}
          />
        )}
        {activeTab === 'workflow' && (
          <WorkflowSettings
            settings={settings}
            updateSettings={updateSettings}
            markChangesSaved={markChangesSaved}
            setUnsavedChanges={setUnsavedChanges}
          />
        )}
        {activeTab === 'ai' && (
          <AISettings
            settings={settings}
            updateSettings={updateSettings}
            markChangesSaved={markChangesSaved}
            setUnsavedChanges={setUnsavedChanges}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationSettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
            markChangesSaved={markChangesSaved}
            setUnsavedChanges={setUnsavedChanges}
          />
        )}
        {activeTab === 'security' && (
          <SecuritySettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
            markChangesSaved={markChangesSaved}
            setUnsavedChanges={setUnsavedChanges}
          />
        )}
        {activeTab === 'integrations' && (
          <IntegrationsSettings
            settings={settings}
            updateSettings={updateSettings}
            markChangesSaved={markChangesSaved}
            setUnsavedChanges={setUnsavedChanges}
          />
        )}
        {activeTab === 'account' && (
          <AccountSettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
            markChangesSaved={markChangesSaved}
            setUnsavedChanges={setUnsavedChanges}
          />
        )}
      </div>

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              Unsaved Changes
            </h3>
            <p className='text-gray-700 dark:text-gray-300 mb-6'>
              You have unsaved changes. Do you want to save them before leaving
              this page?
            </p>
            <div className='flex justify-end space-x-3'>
              <button
                className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                onClick={() => {
                  setShowUnsavedWarning(false);
                  setUnsavedChanges(false);
                  if (activeTab !== 'workflow') navigateTo('workflow');
                }}
              >
                Discard
              </button>
              <button
                className='px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700'
                onClick={() => {
                  // Here you would save the changes
                  markChangesSaved();
                  setShowUnsavedWarning(false);
                  if (activeTab !== 'workflow') navigateTo('workflow');
                }}
              >
                Save
              </button>
              <button
                className='px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                onClick={() => setShowUnsavedWarning(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Appearance settings component (Theme, UI, etc.)
const AppearanceSettings = ({
  settings,
  updateSettings,
  markChangesSaved,
  setUnsavedChanges,
}) => {
  const [formData, setFormData] = useState({
    theme: settings.preferences.theme || 'light',
    density: settings.preferences.density || 'comfortable',
    fontSize: settings.preferences.fontSize || 'medium',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setUnsavedChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the settings
    updateSettings('preferences', {
      ...settings.preferences,
      ...formData,
    });

    markChangesSaved();
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
          Appearance Settings
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

          {/* UI Density */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Layout className='w-5 h-5 mr-2' />
              UI Density
            </h3>

            <div className='pl-7 space-y-4'>
              <div className='flex space-x-4'>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    name='density'
                    value='comfortable'
                    checked={formData.density === 'comfortable'}
                    onChange={handleChange}
                    className='form-radio text-blue-600'
                  />
                  <span className='ml-2 text-gray-700 dark:text-gray-300'>
                    Comfortable
                  </span>
                </label>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    name='density'
                    value='compact'
                    checked={formData.density === 'compact'}
                    onChange={handleChange}
                    className='form-radio text-blue-600'
                  />
                  <span className='ml-2 text-gray-700 dark:text-gray-300'>
                    Compact
                  </span>
                </label>
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Compact mode reduces padding and spacing throughout the
                interface.
              </p>
            </div>
          </div>

          {/* Font Size */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Terminal className='w-5 h-5 mr-2' />
              Font Size
            </h3>

            <div className='pl-7'>
              <select
                id='fontSize'
                name='fontSize'
                value={formData.fontSize}
                onChange={handleChange}
                className='block w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
              >
                <option value='small'>Small</option>
                <option value='medium'>Medium</option>
                <option value='large'>Large</option>
              </select>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                Changes the font size throughout the application.
              </p>
            </div>
          </div>

          <div className='pt-4 pl-7'>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Workflow settings component (Grid, Auto-Save, etc.)
const WorkflowSettings = ({
  settings,
  updateSettings,
  markChangesSaved,
  setUnsavedChanges,
}) => {
  const [formData, setFormData] = useState({
    defaultView: settings.preferences.defaultView || 'workflow',
    autoSave: settings.preferences.autoSave || true,
    saveInterval: settings.preferences.saveInterval || 5,
    gridSize: settings.preferences.gridSize || 20,
    snapToGrid: settings.preferences.snapToGrid || true,
    showMinimap: settings.preferences.showMinimap || true,
    confirmNodeDeletion: settings.preferences.confirmNodeDeletion || true,
    maxUndoSteps: settings.preferences.maxUndoSteps || 20,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setUnsavedChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings('preferences', formData);
    markChangesSaved();
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
          Workflow Builder Settings
        </h2>

        <form onSubmit={handleSubmit}>
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
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                Choose which view to show when you first open the application.
              </p>
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

          {/* Workflow Behavior */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Workflow className='w-5 h-5 mr-2' />
              Workflow Behavior
            </h3>

            <div className='pl-7 space-y-4'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='confirmNodeDeletion'
                  name='confirmNodeDeletion'
                  checked={formData.confirmNodeDeletion}
                  onChange={handleChange}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='confirmNodeDeletion'
                  className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                >
                  Confirm before deleting nodes
                </label>
              </div>

              <div>
                <label
                  htmlFor='maxUndoSteps'
                  className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                >
                  Maximum Undo Steps
                </label>
                <input
                  type='number'
                  id='maxUndoSteps'
                  name='maxUndoSteps'
                  min='5'
                  max='50'
                  value={formData.maxUndoSteps}
                  onChange={handleChange}
                  className='w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                />
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  Number of actions that can be undone.
                </p>
              </div>
            </div>
          </div>

          <div className='pt-4 pl-7'>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// AI Settings component
const AISettings = ({
  settings,
  updateSettings,
  markChangesSaved,
  setUnsavedChanges,
}) => {
  const [formData, setFormData] = useState({
    defaultModel: settings.ai?.defaultModel || 'gpt-5',
    temperature: settings.ai?.temperature || 0.7,
    maxTokens: settings.ai?.maxTokens || 2000,
    defaultMemoryType: settings.ai?.defaultMemoryType || 'short-memory',
    apiLimits: settings.ai?.apiLimits || false,
    rateLimit: settings.ai?.rateLimit || 100,
    defaultTools: settings.ai?.defaultTools || [
      'web-search',
      'code-interpreter',
    ],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setUnsavedChanges(true);
  };

  const handleToolToggle = (toolId) => {
    setFormData((prevData) => {
      const currentTools = [...prevData.defaultTools];
      if (currentTools.includes(toolId)) {
        return {
          ...prevData,
          defaultTools: currentTools.filter((id) => id !== toolId),
        };
      } else {
        return {
          ...prevData,
          defaultTools: [...currentTools, toolId],
        };
      }
    });
    setUnsavedChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings('ai', formData);
    markChangesSaved();
  };

  const toolOptions = [
    { id: 'web-search', label: 'Web Search' },
    { id: 'code-interpreter', label: 'Code Interpreter' },
    { id: 'rag', label: 'Retrieval Augmented Generation' },
    { id: 'api-connector', label: 'API Connector' },
    { id: 'database', label: 'Database Connector' },
    { id: 'file', label: 'File Processor' },
  ];

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
          AI Configuration
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Model Settings */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Cpu className='w-5 h-5 mr-2' />
              Model Settings
            </h3>

            <div className='pl-7 space-y-4'>
              <div>
                <label
                  htmlFor='defaultModel'
                  className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                >
                  Default AI Model
                </label>
                <select
                  id='defaultModel'
                  name='defaultModel'
                  value={formData.defaultModel}
                  onChange={handleChange}
                  className='block w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                >
                  <option value='gpt-5'>GPT-5</option>
                  <option value='gpt-4.5'>GPT-4.5</option>
                  <option value='claude-4'>Claude 4</option>
                  <option value='gemini-2.5-pro'>Gemini 2.5 Pro</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor='temperature'
                  className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                >
                  Temperature: {formData.temperature}
                </label>
                <input
                  type='range'
                  id='temperature'
                  name='temperature'
                  min='0'
                  max='1'
                  step='0.1'
                  value={formData.temperature}
                  onChange={handleChange}
                  className='w-full md:w-64'
                />
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  Higher values produce more creative outputs, lower values
                  produce more deterministic outputs.
                </p>
              </div>

              <div>
                <label
                  htmlFor='maxTokens'
                  className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                >
                  Max Tokens
                </label>
                <input
                  type='number'
                  id='maxTokens'
                  name='maxTokens'
                  min='100'
                  max='10000'
                  value={formData.maxTokens}
                  onChange={handleChange}
                  className='w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                />
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  Maximum number of tokens to generate for each agent response.
                </p>
              </div>
            </div>
          </div>

          {/* Memory Settings */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Database className='w-5 h-5 mr-2' />
              Memory Settings
            </h3>

            <div className='pl-7 space-y-4'>
              <div>
                <label
                  htmlFor='defaultMemoryType'
                  className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                >
                  Default Memory Type
                </label>
                <select
                  id='defaultMemoryType'
                  name='defaultMemoryType'
                  value={formData.defaultMemoryType}
                  onChange={handleChange}
                  className='block w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                >
                  <option value='short-memory'>Short Memory</option>
                  <option value='long-memory'>Long Memory</option>
                </select>
              </div>
            </div>
          </div>

          {/* API Rate Limits */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Zap className='w-5 h-5 mr-2' />
              API Usage Limits
            </h3>

            <div className='pl-7 space-y-4'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='apiLimits'
                  name='apiLimits'
                  checked={formData.apiLimits}
                  onChange={handleChange}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='apiLimits'
                  className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                >
                  Enable API Rate Limiting
                </label>
              </div>

              {formData.apiLimits && (
                <div>
                  <label
                    htmlFor='rateLimit'
                    className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Maximum Requests per Minute
                  </label>
                  <input
                    type='number'
                    id='rateLimit'
                    name='rateLimit'
                    min='10'
                    max='1000'
                    value={formData.rateLimit}
                    onChange={handleChange}
                    className='w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                  />
                </div>
              )}
            </div>
          </div>

          {/* Default Tools */}
          <div className='mb-6'>
            <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
              <Workflow className='w-5 h-5 mr-2' />
              Default Agent Tools
            </h3>

            <div className='pl-7 space-y-2'>
              <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'>
                Select the default tools to add to new agent nodes:
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-2 border border-gray-200 dark:border-gray-700 rounded-md p-3'>
                {toolOptions.map((tool) => (
                  <div
                    key={tool.id}
                    className='flex items-center cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded'
                    onClick={() => handleToolToggle(tool.id)}
                  >
                    <div
                      className={`w-4 h-4 flex-shrink-0 mr-2 rounded ${
                        formData.defaultTools.includes(tool.id)
                          ? 'bg-blue-500'
                          : 'border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {formData.defaultTools.includes(tool.id) && (
                        <Check className='w-4 h-4 text-white' />
                      )}
                    </div>
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      {tool.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='pt-4 pl-7'>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Notification settings component
const NotificationSettings = ({
  settings,
  updateNestedSetting,
  markChangesSaved,
  setUnsavedChanges,
}) => {
  const handleToggleChange = (key, value) => {
    updateNestedSetting('account', 'notifications', key, value);
    setUnsavedChanges(true);
    markChangesSaved(); // Immediate save for toggle changes
  };

  const handleChannelToggle = (channel, value) => {
    updateNestedSetting('notifications', 'channels', channel, value);
    setUnsavedChanges(true);
    markChangesSaved();
  };

  const handleEventToggle = (event, value) => {
    updateNestedSetting('notifications', 'events', event, value);
    setUnsavedChanges(true);
    markChangesSaved();
  };

  const notificationChannels = {
    email: settings.account.notifications.email,
    browser: settings.account.notifications.browser,
    mobile: settings.account.notifications.mobile,
    slack: settings.notifications?.channels?.slack || false,
    teams: settings.notifications?.channels?.teams || false,
  };

  const notificationEvents = {
    workflow_completed:
      settings.notifications?.events?.workflow_completed || true,
    workflow_error: settings.notifications?.events?.workflow_error || true,
    agent_created: settings.notifications?.events?.agent_created || false,
    system_updates: settings.notifications?.events?.system_updates || true,
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
          Notification Settings
        </h2>

        {/* Notification Channels */}
        <div className='mb-8'>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <Bell className='w-5 h-5 mr-2' />
            Notification Channels
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
                  checked={notificationChannels.email}
                  onChange={(e) =>
                    handleToggleChange('email', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    notificationChannels.email
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
                  checked={notificationChannels.browser}
                  onChange={(e) =>
                    handleToggleChange('browser', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    notificationChannels.browser
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
                  checked={notificationChannels.mobile}
                  onChange={(e) =>
                    handleToggleChange('mobile', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    notificationChannels.mobile
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <label
                htmlFor='slack-notifications'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Slack Notifications
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='slack-notifications'
                  checked={notificationChannels.slack}
                  onChange={(e) =>
                    handleChannelToggle('slack', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    notificationChannels.slack
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <label
                htmlFor='teams-notifications'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Microsoft Teams Notifications
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='teams-notifications'
                  checked={notificationChannels.teams}
                  onChange={(e) =>
                    handleChannelToggle('teams', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    notificationChannels.teams
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Events */}
        <div className='mb-8'>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <Bell className='w-5 h-5 mr-2' />
            Notification Events
          </h3>

          <div className='space-y-4 pl-7'>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='workflow-completed'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Workflow Completed
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='workflow-completed'
                  checked={notificationEvents.workflow_completed}
                  onChange={(e) =>
                    handleEventToggle('workflow_completed', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    notificationEvents.workflow_completed
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <label
                htmlFor='workflow-error'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Workflow Errors
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='workflow-error'
                  checked={notificationEvents.workflow_error}
                  onChange={(e) =>
                    handleEventToggle('workflow_error', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    notificationEvents.workflow_error
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <label
                htmlFor='agent-created'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                New Agent Created
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='agent-created'
                  checked={notificationEvents.agent_created}
                  onChange={(e) =>
                    handleEventToggle('agent_created', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    notificationEvents.agent_created
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <label
                htmlFor='system-updates'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                System Updates
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='system-updates'
                  checked={notificationEvents.system_updates}
                  onChange={(e) =>
                    handleEventToggle('system_updates', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    notificationEvents.system_updates
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Security settings component
const SecuritySettings = ({
  settings,
  updateNestedSetting,
  markChangesSaved,
  setUnsavedChanges,
}) => {
  const handleToggleChange = (setting, value) => {
    updateNestedSetting('account', setting, value);
    setUnsavedChanges(true);
    markChangesSaved(); // Immediate save for toggle changes
  };

  const handleSecurityChange = (setting, value) => {
    updateNestedSetting('security', setting, value);
    setUnsavedChanges(true);
    markChangesSaved();
  };

  const securitySettings = {
    twoFactorAuth: settings.account.twoFactorAuth || false,
    sessionTimeout: settings.security?.sessionTimeout || 30,
    ipRestrictions: settings.security?.ipRestrictions || false,
    apiAccessControl: settings.security?.apiAccessControl || false,
    auditLogging: settings.security?.auditLogging || true,
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
          Security Settings
        </h2>

        <div className='mb-8'>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <Shield className='w-5 h-5 mr-2' />
            Authentication & Access
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
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) =>
                    handleToggleChange('twoFactorAuth', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    securitySettings.twoFactorAuth
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            <div>
              <label
                htmlFor='sessionTimeout'
                className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
              >
                Session Timeout (minutes)
              </label>
              <select
                id='sessionTimeout'
                value={securitySettings.sessionTimeout}
                onChange={(e) =>
                  handleSecurityChange('sessionTimeout', e.target.value)
                }
                className='w-32 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
              >
                <option value='15'>15 minutes</option>
                <option value='30'>30 minutes</option>
                <option value='60'>1 hour</option>
                <option value='120'>2 hours</option>
                <option value='240'>4 hours</option>
              </select>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Time of inactivity before automatic logout.
              </p>
            </div>

            <div className='flex items-center justify-between'>
              <label
                htmlFor='ip-restrictions'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                IP Address Restrictions
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='ip-restrictions'
                  checked={securitySettings.ipRestrictions}
                  onChange={(e) =>
                    handleSecurityChange('ipRestrictions', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    securitySettings.ipRestrictions
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* API Security */}
        <div className='mb-8'>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <Key className='w-5 h-5 mr-2' />
            API Security
          </h3>

          <div className='space-y-4 pl-7'>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='api-access-control'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Advanced API Access Control
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='api-access-control'
                  checked={securitySettings.apiAccessControl}
                  onChange={(e) =>
                    handleSecurityChange('apiAccessControl', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    securitySettings.apiAccessControl
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Enable fine-grained access control for API keys with role-based
              permissions.
            </p>
          </div>
        </div>

        {/* Audit Logging */}
        <div className='mb-8'>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <AlignCenter className='w-5 h-5 mr-2' />
            Audit & Logging
          </h3>

          <div className='space-y-4 pl-7'>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='audit-logging'
                className='text-sm text-gray-700 dark:text-gray-300'
              >
                Audit Logging
              </label>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='audit-logging'
                  checked={securitySettings.auditLogging}
                  onChange={(e) =>
                    handleSecurityChange('auditLogging', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    securitySettings.auditLogging
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Track user actions, system changes, and security events for
              compliance and troubleshooting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Integrations settings component
const IntegrationsSettings = ({
  settings,
  updateSettings,
  markChangesSaved,
  setUnsavedChanges,
}) => {
  const [integrations, setIntegrations] = useState(
    settings.integrations || {
      slack: { enabled: false, webhook: '' },
      github: { enabled: false, token: '' },
      jira: { enabled: false, domain: '', apiKey: '' },
      aws: { enabled: false, accessKey: '', secretKey: '' },
      openai: { enabled: true, apiKey: '••••••••••••••••••••••' },
    }
  );

  const handleToggleChange = (integration, value) => {
    setIntegrations({
      ...integrations,
      [integration]: {
        ...integrations[integration],
        enabled: value,
      },
    });
    setUnsavedChanges(true);
  };

  const handleFieldChange = (integration, field, value) => {
    setIntegrations({
      ...integrations,
      [integration]: {
        ...integrations[integration],
        [field]: value,
      },
    });
    setUnsavedChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings('integrations', integrations);
    markChangesSaved();
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
          Integrations Settings
        </h2>

        <form onSubmit={handleSubmit}>
          {/* OpenAI Integration */}
          <div className='mb-8 border-b border-gray-200 dark:border-gray-700 pb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-md font-medium text-gray-800 dark:text-white flex items-center'>
                <div className='w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-2'>
                  <Code className='w-4 h-4 text-green-600 dark:text-green-400' />
                </div>
                OpenAI
              </h3>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='openai-integration'
                  checked={integrations.openai.enabled}
                  onChange={(e) =>
                    handleToggleChange('openai', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    integrations.openai.enabled
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            {integrations.openai.enabled && (
              <div className='pl-10 space-y-4'>
                <div>
                  <label
                    htmlFor='openai-api-key'
                    className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                  >
                    API Key
                  </label>
                  <div className='flex items-center'>
                    <input
                      type='password'
                      id='openai-api-key'
                      value={integrations.openai.apiKey}
                      onChange={(e) =>
                        handleFieldChange('openai', 'apiKey', e.target.value)
                      }
                      className='w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                      placeholder='sk-...'
                    />
                    <button
                      type='button'
                      className='ml-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
                      title='Reveal API Key'
                    >
                      <Eye className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slack Integration */}
          <div className='mb-8 border-b border-gray-200 dark:border-gray-700 pb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-md font-medium text-gray-800 dark:text-white flex items-center'>
                <div className='w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-2'>
                  <svg
                    className='w-4 h-4 text-purple-600 dark:text-purple-400'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z' />
                  </svg>
                </div>
                Slack
              </h3>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='slack-integration'
                  checked={integrations.slack.enabled}
                  onChange={(e) =>
                    handleToggleChange('slack', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    integrations.slack.enabled
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            {integrations.slack.enabled && (
              <div className='pl-10 space-y-4'>
                <div>
                  <label
                    htmlFor='slack-webhook'
                    className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Webhook URL
                  </label>
                  <input
                    type='text'
                    id='slack-webhook'
                    value={integrations.slack.webhook}
                    onChange={(e) =>
                      handleFieldChange('slack', 'webhook', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    placeholder='https://hooks.slack.com/services/...'
                  />
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Add a Slack webhook URL to send notifications to your
                  workspace.
                </p>
              </div>
            )}
          </div>

          {/* GitHub Integration */}
          <div className='mb-8 border-b border-gray-200 dark:border-gray-700 pb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-md font-medium text-gray-800 dark:text-white flex items-center'>
                <div className='w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2'>
                  <svg
                    className='w-5 h-5 text-gray-800 dark:text-gray-200'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
                  </svg>
                </div>
                GitHub
              </h3>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='github-integration'
                  checked={integrations.github.enabled}
                  onChange={(e) =>
                    handleToggleChange('github', e.target.checked)
                  }
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    integrations.github.enabled
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            {integrations.github.enabled && (
              <div className='pl-10 space-y-4'>
                <div>
                  <label
                    htmlFor='github-token'
                    className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Personal Access Token
                  </label>
                  <div className='flex items-center'>
                    <input
                      type='password'
                      id='github-token'
                      value={integrations.github.token}
                      onChange={(e) =>
                        handleFieldChange('github', 'token', e.target.value)
                      }
                      className='w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                      placeholder='ghp_...'
                    />
                    <button
                      type='button'
                      className='ml-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
                      title='Reveal Token'
                    >
                      <Eye className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                    </button>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    GitHub token with repo and workflow permissions.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Jira Integration */}
          <div className='mb-8 border-b border-gray-200 dark:border-gray-700 pb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-md font-medium text-gray-800 dark:text-white flex items-center'>
                <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-2'>
                  <svg
                    className='w-5 h-5 text-blue-600 dark:text-blue-400'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path
                      d='M11.571 11.513H0a5.759 5.759 0 0 0 5.9 5.9v-5.9h5.671zm5.9-5.9h-5.9v5.9H24a5.759 5.759 0 0 0-5.9-5.9z'
                      fill='#2684FF'
                    />
                    <path d='M11.571 5.613h5.9v5.9h-5.9z' fill='currentColor' />
                  </svg>
                </div>
                Jira
              </h3>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='jira-integration'
                  checked={integrations.jira.enabled}
                  onChange={(e) => handleToggleChange('jira', e.target.checked)}
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    integrations.jira.enabled
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            {integrations.jira.enabled && (
              <div className='pl-10 space-y-4'>
                <div>
                  <label
                    htmlFor='jira-domain'
                    className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Jira Domain
                  </label>
                  <input
                    type='text'
                    id='jira-domain'
                    value={integrations.jira.domain}
                    onChange={(e) =>
                      handleFieldChange('jira', 'domain', e.target.value)
                    }
                    className='w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    placeholder='your-company.atlassian.net'
                  />
                </div>

                <div>
                  <label
                    htmlFor='jira-apikey'
                    className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                  >
                    API Key
                  </label>
                  <div className='flex items-center'>
                    <input
                      type='password'
                      id='jira-apikey'
                      value={integrations.jira.apiKey}
                      onChange={(e) =>
                        handleFieldChange('jira', 'apiKey', e.target.value)
                      }
                      className='w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    />
                    <button
                      type='button'
                      className='ml-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
                      title='Reveal API Key'
                    >
                      <Eye className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AWS Integration */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-md font-medium text-gray-800 dark:text-white flex items-center'>
                <div className='w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-2'>
                  <svg
                    className='w-5 h-5 text-yellow-600 dark:text-yellow-400'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M18.7083 14.6268C18.7083 14.7836 18.6903 14.9214 18.6543 15.0323C18.6183 15.1431 18.5733 15.236 18.5133 15.3109C18.4533 15.3858 18.3763 15.4517 18.2822 15.5087C18.1882 15.5656 18.0901 15.6165 17.9901 15.6585C17.8899 15.7004 17.7808 15.7334 17.6628 15.7574C17.5447 15.7814 17.4227 15.7934 17.2977 15.7934C17.1636 15.7934 17.0346 15.7794 16.9106 15.7514C16.7866 15.7234 16.6735 15.6855 16.5715 15.6375C16.4695 15.5895 16.3784 15.5306 16.2984 15.4607C16.2184 15.3907 16.1574 15.3128 16.1154 15.2269C16.0684 15.3188 16.0074 15.4007 15.9324 15.4727C15.8574 15.5446 15.7724 15.6055 15.6764 15.6555C15.5804 15.7055 15.4784 15.7444 15.3694 15.7704C15.2604 15.7964 15.1484 15.8094 15.0333 15.8094C14.8862 15.8094 14.7502 15.7884 14.6242 15.7464C14.4982 15.7044 14.3882 15.6435 14.2942 15.5626C14.2002 15.4816 14.1252 15.3807 14.0692 15.2599C14.0132 15.139 13.9852 14.9991 13.9852 14.8403C13.9852 14.5916 14.0352 14.3818 14.1352 14.2109C14.2352 14.04 14.3712 13.9031 14.5433 13.8001C14.7153 13.6971 14.9163 13.6232 15.1464 13.5772C15.3764 13.5312 15.6154 13.5082 15.8634 13.5082H16.1034V13.4053C16.1034 13.2354 16.0574 13.1105 15.9654 13.0305C15.8734 12.9506 15.7324 12.9106 15.5414 12.9106C15.3953 12.9106 15.2503 12.9346 15.1064 12.9825C14.9623 13.0305 14.8323 13.0885 14.7153 13.1565L14.6153 12.7887C14.7203 12.7387 14.8563 12.6888 15.0243 12.6388C15.1923 12.5888 15.3773 12.5638 15.5804 12.5638C15.8914 12.5638 16.1264 12.6428 16.2854 12.8006C16.4444 12.9586 16.5235 13.1935 16.5235 13.5052V14.6088C16.5235 14.7057 16.5355 14.7826 16.5594 14.8396C16.5835 14.8965 16.6345 14.925 16.7125 14.925C16.7355 14.925 16.7615 14.924 16.7905 14.922C16.8196 14.92 16.8466 14.917 16.8715 14.913L16.9106 15.2479C16.8866 15.2599 16.8496 15.2709 16.7996 15.2809C16.7496 15.2909 16.6995 15.2959 16.6495 15.2959C16.5335 15.2959 16.4415 15.2689 16.3734 15.215C16.3055 15.161 16.2574 15.0751 16.2294 14.9571C16.0894 15.0601 15.9284 15.143 15.7464 15.206C15.5644 15.269 15.3714 15.3009 15.1674 15.3009C15.0553 15.3009 14.9483 15.2839 14.8463 15.2499C14.7443 15.216 14.6552 15.166 14.5792 15.1001C14.5033 15.0341 14.4432 14.9541 14.3992 14.8602C14.3552 14.7666 14.3332 14.6588 14.3332 14.5347C14.3332 14.307 14.3802 14.1281 14.4742 13.9981C14.5682 13.8681 14.6912 13.7672 14.8433 13.6942C14.9953 13.6212 15.1684 13.5692 15.3624 13.5382C15.5564 13.5072 15.7514 13.4913 15.9474 13.4913H16.1034V14.6268H18.7083ZM15.9654 14.0911C15.8354 14.0911 15.7014 14.0971 15.5624 14.1091C15.4234 14.1211 15.2974 14.1451 15.1833 14.1811C15.0693 14.2171 14.9763 14.267 14.9053 14.331C14.8343 14.395 14.7983 14.4789 14.7983 14.5828C14.7983 14.6867 14.8353 14.7676 14.9093 14.8256C14.9833 14.8836 15.0753 14.9125 15.1854 14.9125C15.2914 14.9125 15.3834 14.8965 15.4614 14.8646C15.5395 14.8326 15.6054 14.7896 15.6594 14.7356C15.7134 14.6817 15.7544 14.6188 15.7824 14.5467C15.8104 14.4747 15.8244 14.3988 15.8244 14.3189V14.0911H15.9654ZM5.2499 13.5502C5.2499 13.7591 5.2229 13.9621 5.1689 14.1591C5.1149 14.356 5.0469 14.529 4.9649 14.6779C4.8829 14.8268 4.7909 14.9448 4.6889 15.0327C4.5868 15.1207 4.4878 15.1647 4.3918 15.1647C4.3018 15.1647 4.2118 15.1337 4.1218 15.0717C4.0318 15.0097 3.9558 14.9428 3.8938 14.8708L3.8668 15.1017H3.4458V11.7695H3.8878V12.9345C3.9438 12.8785 4.0128 12.8345 4.0948 12.8025C4.1768 12.7705 4.2688 12.7545 4.3698 12.7545C4.5878 12.7545 4.7528 12.8575 4.8658 13.0635C4.9788 13.2694 5.0348 13.5552 5.0348 13.921C5.0348 14.121 5.0158 14.296 4.9778 14.4459C4.9398 14.5959 4.8908 14.7209 4.8308 14.8198C4.7708 14.9188 4.7048 14.9938 4.6338 15.0447C4.5628 15.0957 4.4928 15.1217 4.4248 15.1217C4.3498 15.1217 4.2788 15.1037 4.2118 15.0687C4.1448 15.0337 4.0868 14.9848 4.0378 14.9228V13.2244C4.0788 13.1694 4.1268 13.1284 4.1818 13.1014C4.2368 13.0744 4.2968 13.0614 4.3598 13.0614C4.4968 13.0614 4.6058 13.1334 4.6868 13.2774C4.7678 13.4214 4.8088 13.6383 4.8088 13.9361C4.8088 14.116 4.7928 14.271 4.7618 14.3999C4.7308 14.5289 4.6928 14.6339 4.6478 14.7149C4.6028 14.7959 4.5568 14.8538 4.5108 14.8888C4.4648 14.9238 4.4258 14.9418 4.3938 14.9418C4.3618 14.9418 4.3318 14.9288 4.3038 14.9038C4.2758 14.8788 4.2468 14.8508 4.2168 14.8198V13.3654C4.2498 13.3274 4.2898 13.2964 4.3358 13.2724C4.3818 13.2484 4.4338 13.2364 4.4918 13.2364C4.6608 13.2364 4.7988 13.3274 4.9058 13.5094C5.0138 13.6913 5.0678 13.9631 5.0678 14.3249C5.0678 14.5358 5.0488 14.7119 5.0108 14.8538C4.9728 14.9958 4.9258 15.1097 4.8698 15.1957C4.8138 15.2816 4.7548 15.3436 4.6938 15.3816C4.6328 15.4195 4.5778 15.4385 4.5298 15.4385C4.4418 15.4385 4.3618 15.4145 4.2918 15.3666C4.2218 15.3186 4.1598 15.2556 4.1058 15.1777V15.5235C4.1658 15.5775 4.2318 15.6185 4.3038 15.6455C4.3758 15.6725 4.4458 15.686 4.5128 15.686C4.6708 15.686 4.8158 15.6235 4.9468 15.4996C5.0778 15.3756 5.1868 15.2106 5.2738 15.0047C5.3608 14.7987 5.4258 14.5678 5.4688 14.3119C5.5118 14.056 5.5338 13.797 5.5338 13.5352C5.5338 13.0964 5.5038 12.7335 5.4438 12.4455C5.3838 12.1575 5.3038 11.9276 5.2038 11.7556C5.1038 11.5836 4.9918 11.4586 4.8688 11.3807C4.7458 11.3027 4.6238 11.2637 4.5028 11.2637C4.2908 11.2637 4.1178 11.3147 3.9838 11.4166C3.8498 11.5186 3.7258 11.6196 3.6128 11.7196L3.5638 11.4556H3.1428V16.5242H3.5848V15.3176C3.6408 15.3716 3.7138 15.4155 3.8038 15.4495C3.8938 15.4835 3.9808 15.5005 4.0648 15.5005C4.2108 15.5005 4.3538 15.4545 4.4958 15.3635C4.6378 15.2725 4.7628 15.1467 4.8718 14.9858C4.9808 14.8248 5.0678 14.6359 5.1328 14.419C5.1978 14.202 5.2318 13.9741 5.2338 13.7352L5.2499 13.5502ZM6.1051 15.6864H6.5691V13.1004H6.1051V15.6864ZM6.3371 12.7056C6.4221 12.7056 6.4941 12.6776 6.5531 12.6216C6.6121 12.5656 6.6411 12.4936 6.6411 12.4056C6.6411 12.3176 6.6121 12.2456 6.5531 12.1896C6.4941 12.1336 6.4221 12.1056 6.3371 12.1056C6.2521 12.1056 6.1791 12.1336 6.1191 12.1896C6.0591 12.2456 6.0291 12.3176 6.0291 12.4056C6.0291 12.4936 6.0591 12.5656 6.1191 12.6216C6.1791 12.6776 6.2521 12.7056 6.3371 12.7056ZM13.0835 14.0401C13.0835 14.382 13.0455 14.677 12.9695 14.925C12.8935 15.173 12.7875 15.376 12.6525 15.532C12.5175 15.688 12.3585 15.8 12.1754 15.868C11.9923 15.936 11.7923 15.97 11.5753 15.97C11.3753 15.97 11.1903 15.939 11.0193 15.877C10.8483 15.815 10.6963 15.712 10.5633 15.568C10.4302 15.424 10.3242 15.232 10.2452 14.993C10.1662 14.754 10.1272 14.459 10.1272 14.109C10.1272 13.767 10.1652 13.472 10.2412 13.224C10.3172 12.976 10.4232 12.773 10.5592 12.615C10.6953 12.457 10.8543 12.345 11.0363 12.277C11.2183 12.209 11.4193 12.175 11.6373 12.175C11.8373 12.175 12.0223 12.206 12.1933 12.268C12.3642 12.33 12.5162 12.433 12.6492 12.577C12.7822 12.721 12.8882 12.911 12.9672 13.146C13.0462 13.381 13.0852 13.677 13.0852 14.027L13.0835 14.0401Z' />
                  </svg>
                </div>
                AWS
              </h3>
              <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                <input
                  type='checkbox'
                  id='aws-integration'
                  checked={integrations.aws.enabled}
                  onChange={(e) => handleToggleChange('aws', e.target.checked)}
                  className='sr-only'
                />
                <div
                  className={`toggle-bg block w-10 h-6 rounded-full ${
                    integrations.aws.enabled
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-colors duration-200`}
                ></div>
              </div>
            </div>

            {integrations.aws.enabled && (
              <div className='pl-10 space-y-4'>
                <div>
                  <label
                    htmlFor='aws-access-key'
                    className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Access Key ID
                  </label>
                  <input
                    type='text'
                    id='aws-access-key'
                    value={integrations.aws.accessKey}
                    onChange={(e) =>
                      handleFieldChange('aws', 'accessKey', e.target.value)
                    }
                    className='w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    placeholder='AKIA...'
                  />
                </div>

                <div>
                  <label
                    htmlFor='aws-secret-key'
                    className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Secret Access Key
                  </label>
                  <div className='flex items-center'>
                    <input
                      type='password'
                      id='aws-secret-key'
                      value={integrations.aws.secretKey}
                      onChange={(e) =>
                        handleFieldChange('aws', 'secretKey', e.target.value)
                      }
                      className='w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    />
                    <button
                      type='button'
                      className='ml-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
                      title='Reveal Secret Key'
                    >
                      <Eye className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                    </button>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    Used for S3 storage, Lambda functions, and other AWS
                    services.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className='pt-4 pl-7'>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Account settings component
const AccountSettings = ({
  settings,
  updateNestedSetting,
  markChangesSaved,
  setUnsavedChanges,
}) => {
  const [userData, setUserData] = useState({
    name: settings?.account?.userName || 'Simone Izzo',
    email: settings?.account?.email || 'si.izzo@reply.it',
    role: settings?.account?.role || 'Administrator',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    setUnsavedChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update user data in settings
    Object.entries(userData).forEach(([key, value]) => {
      updateNestedSetting('account', key, value);
    });

    markChangesSaved();
    alert('Profile information updated successfully');
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
          Account Settings
        </h2>

        {/* Profile Information */}
        <div className='mb-8'>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <User className='w-5 h-5 mr-2' />
            Profile Information
          </h3>

          <form onSubmit={handleSubmit} className='space-y-4 pl-7'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
              >
                Full Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={userData.name}
                onChange={handleInputChange}
                className='w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
              />
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
              >
                Email Address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={userData.email}
                onChange={handleInputChange}
                className='w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
              />
            </div>

            <div>
              <label
                htmlFor='role'
                className='block text-sm text-gray-700 dark:text-gray-300 mb-1'
              >
                Role
              </label>
              <select
                id='role'
                name='role'
                value={userData.role}
                onChange={handleInputChange}
                className='w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
              >
                <option value='Administrator'>Administrator</option>
                <option value='Developer'>Developer</option>
                <option value='Analyst'>Analyst</option>
                <option value='Viewer'>Viewer</option>
              </select>
            </div>

            <div className='pt-4'>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>

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

            <div>
              <button
                className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium'
                onClick={() => {
                  alert('Change password functionality would open here');
                }}
              >
                Change Password
              </button>
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
              <option value='Italian'>Italian</option>
              <option value='Russian'>Russian</option>
            </select>
          </div>
        </div>

        {/* Account Management */}
        <div className='mt-8'>
          <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
            <User className='w-5 h-5 mr-2' />
            Account Management
          </h3>

          <div className='pl-7 space-y-4'>
            <div>
              <button
                className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center'
                onClick={() => {
                  // Handle export data
                  alert('Export account data functionality would open here');
                }}
              >
                <Download className='w-4 h-4 mr-1' />
                Export Your Data
              </button>
            </div>

            <div>
              <button
                className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center'
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to deactivate your account? This action cannot be undone.'
                    )
                  ) {
                    // Handle account deactivation
                    alert('Account deactivation would happen here');
                  }
                }}
              >
                <User className='w-4 h-4 mr-1' />
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
