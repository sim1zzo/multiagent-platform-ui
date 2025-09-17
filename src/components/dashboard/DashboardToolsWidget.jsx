// src/components/dashboard/DashboardToolsWidget.jsx
import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Play,
  Settings,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react';
import ToolService from '../../services/ToolService';

const DashboardToolsWidget = ({ onNavigateToTools, onCreateTool }) => {
  const [tools, setTools] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToolsData();

    // Listen for tool updates
    const handleToolsUpdate = (event) => {
      setTools(event.detail.tools);
      setStats(ToolService.getToolStats());
    };

    window.addEventListener('toolsUpdated', handleToolsUpdate);

    return () => {
      window.removeEventListener('toolsUpdated', handleToolsUpdate);
    };
  }, []);

  const loadToolsData = () => {
    try {
      setLoading(true);
      const allTools = ToolService.getToolsForDashboard();
      const toolStats = ToolService.getToolStats();

      setTools(allTools);
      setStats(toolStats);
    } catch (error) {
      console.error('Error loading tools data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToolToggle = (toolId) => {
    ToolService.toggleToolActive(toolId);
    // Update will be handled by the event listener
  };

  const getRecentTools = () => {
    return tools
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
      .slice(0, 3);
  };

  const getMostUsedTools = () => {
    return tools
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
        <div className='flex items-center mb-4'>
          <Wrench className='w-5 h-5 text-blue-600 mr-2' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Tools
          </h3>
        </div>
        <div className='animate-pulse space-y-3'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
      {/* Header */}
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Wrench className='w-5 h-5 text-blue-600 mr-2' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Tools Overview
            </h3>
          </div>
          <div className='flex items-center space-x-2'>
            <button
              onClick={onCreateTool}
              className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
              title='Create new tool'
            >
              <Plus className='w-4 h-4' />
            </button>
            <button
              onClick={onNavigateToTools}
              className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors'
              title='Manage tools'
            >
              <Settings className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {stats.total || 0}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Total Tools
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600'>
              {stats.active || 0}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Active
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-yellow-600'>
              {stats.favorites || 0}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Favorites
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {stats.categories || 0}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Categories
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tools */}
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between mb-3'>
          <h4 className='text-sm font-medium text-gray-900 dark:text-white flex items-center'>
            <TrendingUp className='w-4 h-4 mr-1 text-green-600' />
            Recent Tools
          </h4>
          <button
            onClick={onNavigateToTools}
            className='text-xs text-blue-600 hover:text-blue-700'
          >
            View all
          </button>
        </div>

        <div className='space-y-2'>
          {getRecentTools().map((tool) => (
            <div
              key={tool.id}
              className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            >
              <div className='flex items-center space-x-2 flex-1 min-w-0'>
                <div className='flex items-center space-x-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      tool.isActive ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  />
                  {tool.isFavorite && (
                    <Star className='w-3 h-3 text-yellow-400 fill-current' />
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                    {tool.name}
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                    {tool.category} • Used {tool.usageCount || 0} times
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-1'>
                <button
                  onClick={() => handleToolToggle(tool.id)}
                  className={`p-1 rounded transition-colors ${
                    tool.isActive
                      ? 'text-red-400 hover:text-red-600'
                      : 'text-green-400 hover:text-green-600'
                  }`}
                  title={tool.isActive ? 'Deactivate tool' : 'Activate tool'}
                >
                  <Play className='w-3 h-3' />
                </button>
              </div>
            </div>
          ))}
        </div>

        {tools.length === 0 && (
          <div className='text-center py-4'>
            <Wrench className='w-8 h-8 text-gray-300 mx-auto mb-2' />
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              No tools created yet
            </p>
            <button
              onClick={onCreateTool}
              className='mt-2 text-sm text-blue-600 hover:text-blue-700'
            >
              Create your first tool
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className='p-4'>
        <div className='grid grid-cols-2 gap-2'>
          <button
            onClick={onCreateTool}
            className='flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors'
          >
            <Plus className='w-4 h-4 mr-1' />
            New Tool
          </button>
          <button
            onClick={onNavigateToTools}
            className='flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
          >
            <Users className='w-4 h-4 mr-1' />
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardToolsWidget;
