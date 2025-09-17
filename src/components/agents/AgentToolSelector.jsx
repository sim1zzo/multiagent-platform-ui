// src/components/agents/AgentToolSelector.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Wrench, Star, Tag } from 'lucide-react';
import ToolService from '../../services/ToolService';

const AgentToolSelector = ({
  selectedTools = [],
  onToolsChange,
  onCreateNewTool,
  maxTools = null,
}) => {
  const [availableTools, setAvailableTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadAvailableTools();

    // Listen for tool updates
    const handleToolsUpdate = () => {
      loadAvailableTools();
    };

    window.addEventListener('toolsUpdated', handleToolsUpdate);

    return () => {
      window.removeEventListener('toolsUpdated', handleToolsUpdate);
    };
  }, []);

  const loadAvailableTools = () => {
    const tools = ToolService.getAvailableToolsForAgents();
    setAvailableTools(tools);
  };

  const getCategories = () => {
    const categories = [
      ...new Set(availableTools.map((tool) => tool.category)),
    ];
    return ['All', ...categories.sort()];
  };

  const getFilteredTools = () => {
    return availableTools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || tool.category === selectedCategory;
      const notSelected = !selectedTools.some(
        (selected) => selected.id === tool.id
      );

      return matchesSearch && matchesCategory && notSelected;
    });
  };

  const handleToolSelect = (tool) => {
    if (maxTools && selectedTools.length >= maxTools) {
      alert(`Maximum ${maxTools} tools allowed`);
      return;
    }

    const newSelectedTools = [
      ...selectedTools,
      {
        id: tool.id,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        type: tool.type,
        parameters: tool.parameters,
      },
    ];

    onToolsChange(newSelectedTools);

    // Increment usage count
    ToolService.incrementUsage(tool.id);

    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleToolRemove = (toolId) => {
    const newSelectedTools = selectedTools.filter((tool) => tool.id !== toolId);
    onToolsChange(newSelectedTools);
  };

  return (
    <div className='space-y-4'>
      {/* Selected Tools */}
      {selectedTools.length > 0 && (
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Selected Tools ({selectedTools.length}
            {maxTools ? `/${maxTools}` : ''})
          </label>

          <div className='space-y-2'>
            {selectedTools.map((tool) => (
              <div
                key={tool.id}
                className='flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg'
              >
                <div className='flex items-center space-x-3'>
                  <Wrench className='w-4 h-4 text-blue-600' />
                  <div>
                    <div className='font-medium text-gray-900 dark:text-white'>
                      {tool.name}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {tool.category} • {tool.description}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToolRemove(tool.id)}
                  className='p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors'
                  title='Remove tool'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Selector */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Add Tools
        </label>

        <div className='relative'>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className='w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
          >
            <div className='flex items-center space-x-2'>
              <Plus className='w-4 h-4 text-gray-400' />
              <span className='text-gray-700 dark:text-gray-300'>
                Select tools for this agent...
              </span>
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              {availableTools.length} available
            </div>
          </button>

          {showDropdown && (
            <div className='absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-hidden'>
              {/* Search and Filter */}
              <div className='p-3 border-b border-gray-200 dark:border-gray-700'>
                <div className='space-y-2'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      type='text'
                      placeholder='Search tools...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    {getCategories().map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tools List */}
              <div className='max-h-60 overflow-y-auto'>
                {getFilteredTools().map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool)}
                    className='w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors'
                  >
                    <div className='flex items-start space-x-3'>
                      <Wrench className='w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0' />
                      <div className='flex-1 min-w-0'>
                        <div className='font-medium text-gray-900 dark:text-white'>
                          {tool.name}
                        </div>
                        <div className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                          {tool.description}
                        </div>
                        <div className='flex items-center space-x-2 mt-1'>
                          <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'>
                            <Tag className='w-3 h-3 mr-1' />
                            {tool.category}
                          </span>
                          <span className='text-xs text-gray-400'>
                            {tool.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {getFilteredTools().length === 0 && (
                  <div className='p-6 text-center'>
                    <Wrench className='w-8 h-8 text-gray-300 mx-auto mb-2' />
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                      No tools found
                    </p>
                    {onCreateNewTool && (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onCreateNewTool();
                        }}
                        className='text-sm text-blue-600 hover:text-blue-700'
                      >
                        Create a new tool
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className='p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {getFilteredTools().length} tools available
                  </span>
                  {onCreateNewTool && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onCreateNewTool();
                      }}
                      className='text-xs text-blue-600 hover:text-blue-700'
                    >
                      + Create New Tool
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tool Creation Shortcut */}
      {selectedTools.length === 0 &&
        availableTools.length === 0 &&
        onCreateNewTool && (
          <div className='p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center'>
            <Wrench className='w-8 h-8 text-gray-400 mx-auto mb-2' />
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
              No tools available yet
            </p>
            <button
              onClick={onCreateNewTool}
              className='text-sm text-blue-600 hover:text-blue-700 font-medium'
            >
              Create your first tool
            </button>
          </div>
        )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className='fixed inset-0 z-0'
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default AgentToolSelector;
