// src/components/pages/Tools.jsx - Fixed and cleaned version
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Copy,
  Wrench,
  Globe,
  Database,
  Cpu,
  MessageSquare,
  Image,
  Calculator,
  ArrowUpDown,
  Tag,
  User,
  Star,
  StarOff,
  Menu,
} from 'lucide-react';

// Mock data per i tool (mantengo i dati esistenti)
const mockTools = [
  {
    id: 'tool-1',
    name: 'Web Scraper',
    description: 'Extracts data from websites with intelligent parsing',
    category: 'Data Collection',
    type: 'API',
    version: '1.2.0',
    author: 'System',
    created: '2024-12-15',
    lastModified: '2024-12-20',
    isActive: true,
    isFavorite: false,
    usageCount: 45,
    tags: ['web', 'scraping', 'data'],
    config: {
      url: 'string',
      selectors: 'array',
      timeout: 'number',
    },
    icon: Globe,
    color: 'text-blue-600',
  },
  {
    id: 'tool-2',
    name: 'Database Query',
    description: 'Execute SQL queries across multiple database types',
    category: 'Database',
    type: 'SQL',
    version: '2.0.1',
    author: 'Admin',
    created: '2024-11-20',
    lastModified: '2024-12-18',
    isActive: true,
    isFavorite: true,
    usageCount: 128,
    tags: ['database', 'sql', 'query'],
    config: {
      connection: 'string',
      query: 'string',
      parameters: 'object',
    },
    icon: Database,
    color: 'text-green-600',
  },
  {
    id: 'tool-3',
    name: 'Text Analyzer',
    description: 'Advanced NLP processing for text analysis and sentiment',
    category: 'AI/ML',
    type: 'Python',
    version: '1.5.2',
    author: 'Simone Izzo',
    created: '2024-10-12',
    lastModified: '2024-12-19',
    isActive: true,
    isFavorite: false,
    usageCount: 89,
    tags: ['nlp', 'sentiment', 'analysis'],
    config: {
      text: 'string',
      language: 'string',
      features: 'array',
    },
    icon: MessageSquare,
    color: 'text-purple-600',
  },
  {
    id: 'tool-4',
    name: 'Image Generator',
    description: 'Generate images using AI models with custom prompts',
    category: 'AI/ML',
    type: 'API',
    version: '1.0.0',
    author: 'Antonio Capone',
    created: '2024-12-01',
    lastModified: '2024-12-15',
    isActive: false,
    isFavorite: false,
    usageCount: 23,
    tags: ['ai', 'image', 'generation'],
    config: {
      prompt: 'string',
      style: 'string',
      resolution: 'string',
    },
    icon: Image,
    color: 'text-pink-600',
  },
  {
    id: 'tool-5',
    name: 'Math Calculator',
    description: 'Advanced mathematical computations and formula evaluation',
    category: 'Utilities',
    type: 'JavaScript',
    version: '1.1.0',
    author: 'System',
    created: '2024-09-15',
    lastModified: '2024-11-30',
    isActive: true,
    isFavorite: true,
    usageCount: 67,
    tags: ['math', 'calculation', 'formula'],
    config: {
      expression: 'string',
      precision: 'number',
    },
    icon: Calculator,
    color: 'text-orange-600',
  },
];

const categories = [
  'All',
  'Data Collection',
  'Database',
  'AI/ML',
  'Utilities',
  'Communication',
];
const types = ['All', 'API', 'Python', 'JavaScript', 'SQL'];

export const Tools = ({ onCreateTool, onEditTool }) => {
  const { settings } = useApp();
  const darkMode = settings?.preferences?.theme === 'dark' || false;

  // Stati per la gestione della pagina
  const [tools, setTools] = useState(mockTools);
  const [selectedTool, setSelectedTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('lastModified');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Funzione per filtrare i tool
  const getFilteredTools = () => {
    return tools
      .filter((tool) => {
        const matchesSearch =
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesCategory =
          selectedCategory === 'All' || tool.category === selectedCategory;
        const matchesType =
          selectedType === 'All' || tool.type === selectedType;
        const matchesActive = !showActiveOnly || tool.isActive;
        const matchesFavorites = !showFavoritesOnly || tool.isFavorite;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          matchesActive &&
          matchesFavorites
        );
      })
      .sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === 'name') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  };

  // Tool operations
  const toggleFavorite = (toolId) => {
    setTools(
      tools.map((tool) =>
        tool.id === toolId ? { ...tool, isFavorite: !tool.isFavorite } : tool
      )
    );
  };

  const toggleActive = (toolId) => {
    setTools(
      tools.map((tool) =>
        tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool
      )
    );
  };

  const deleteTool = (toolId) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      setTools(tools.filter((tool) => tool.id !== toolId));
      if (selectedTool && selectedTool.id === toolId) {
        setSelectedTool(null);
      }
    }
  };

  const duplicateTool = (toolId) => {
    const tool = tools.find((t) => t.id === toolId);
    if (tool) {
      const newTool = {
        ...tool,
        id: `tool-${Date.now()}`,
        name: `${tool.name} (Copy)`,
        created: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        usageCount: 0,
      };
      setTools([...tools, newTool]);
    }
  };

  const handleCreateTool = () => {
    if (onCreateTool) {
      onCreateTool();
    }
  };

  const handleEditTool = (tool) => {
    if (onEditTool) {
      onEditTool(tool);
    }
  };

  // Components
  const StatusBadge = ({ isActive }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  const ToolCard = ({ tool }) => {
    const IconComponent = tool.icon;

    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group'>
        <div className='p-6'>
          {/* Header */}
          <div className='flex items-start justify-between mb-3'>
            <div className='flex items-center space-x-3'>
              <div
                className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${tool.color}`}
              >
                <IconComponent className='w-5 h-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white truncate'>
                  {tool.name}
                </h3>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  v{tool.version} • {tool.type}
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
              <button
                onClick={() => toggleFavorite(tool.id)}
                className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  tool.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                }`}
                title={
                  tool.isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                {tool.isFavorite ? (
                  <Star className='w-4 h-4 fill-current' />
                ) : (
                  <StarOff className='w-4 h-4' />
                )}
              </button>

              <div className='relative'>
                <button className='p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors'>
                  <MoreVertical className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className='text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 min-h-[2.5rem]'>
            {tool.description || 'No description provided'}
          </p>

          {/* Tags */}
          <div className='flex flex-wrap gap-1 mb-4 min-h-[1.5rem]'>
            {tool.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className='inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
              >
                {tag}
              </span>
            ))}
            {tool.tags?.length > 3 && (
              <span className='text-xs text-gray-500 dark:text-gray-400 py-1'>
                +{tool.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Status and Usage */}
          <div className='flex items-center justify-between mb-4'>
            <StatusBadge isActive={tool.isActive} />
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Used {tool.usageCount || 0} times
            </div>
          </div>

          {/* Category */}
          <div className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
            <Tag className='w-3 h-3 inline mr-1' />
            {tool.category}
          </div>
        </div>

        {/* Actions Footer */}
        <div className='px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750'>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-gray-500 dark:text-gray-400 flex items-center'>
              <User className='w-3 h-3 mr-1' />
              {tool.author}
            </div>

            <div className='flex items-center space-x-2'>
              <button
                onClick={() => handleEditTool(tool)}
                className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium transition-colors'
              >
                Edit
              </button>
              <button
                onClick={() => duplicateTool(tool.id)}
                className='p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                title='Duplicate tool'
              >
                <Copy className='w-4 h-4' />
              </button>
              <button
                className='p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-green-500 hover:text-green-600 transition-colors'
                title='Test tool'
                disabled={!tool.isActive}
              >
                <Play className='w-4 h-4' />
              </button>
              <button
                onClick={() => deleteTool(tool.id)}
                className='p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-red-400 hover:text-red-600 transition-colors'
                title='Delete tool'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredTools = getFilteredTools();

  return (
    <div className='flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-h-screen'>
      {/* Header */}
      <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center'>
              <Wrench className='w-6 h-6 mr-2 text-blue-600' />
              Tools
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Manage cross-agent tools and utilities
            </p>
          </div>

          <div className='flex items-center space-x-3'>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              {filteredTools.length} of {tools.length} tools
            </div>
            <button
              onClick={handleCreateTool}
              className='flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
            >
              <Plus className='w-4 h-4 mr-2' />
              Create Tool
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4'>
        <div className='flex items-center justify-between mb-4'>
          {/* Search */}
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search tools...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* View Controls */}
          <div className='flex items-center space-x-3'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                showFilters
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className='w-4 h-4 mr-1' />
              Filters
            </button>

            <div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-md'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title='Grid view'
              >
                <div className='w-4 h-4 grid grid-cols-2 gap-0.5'>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title='List view'
              >
                <Menu className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Sort by
              </label>
              <div className='flex space-x-2'>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
                >
                  <option value='name'>Name</option>
                  <option value='created'>Created</option>
                  <option value='lastModified'>Modified</option>
                  <option value='usageCount'>Usage</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }
                  className='px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
                  title={`Sort ${
                    sortOrder === 'asc' ? 'descending' : 'ascending'
                  }`}
                >
                  <ArrowUpDown className='w-4 h-4' />
                </button>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Status Filters
              </label>
              <div className='space-y-2'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={showActiveOnly}
                    onChange={(e) => setShowActiveOnly(e.target.checked)}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>
                    Active only
                  </span>
                </label>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={showFavoritesOnly}
                    onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>
                    Favorites only
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className='px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
        <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
          <div className='flex items-center space-x-6'>
            <span>
              <span className='font-medium text-gray-900 dark:text-white'>
                {filteredTools.length}
              </span>{' '}
              of {tools.length} tools
            </span>
            <span>
              <span className='font-medium text-green-600'>
                {tools.filter((t) => t.isActive).length}
              </span>{' '}
              active
            </span>
            <span>
              <span className='font-medium text-yellow-600'>
                {tools.filter((t) => t.isFavorite).length}
              </span>{' '}
              favorites
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        <div className='p-6'>
          {filteredTools.length === 0 ? (
            <div className='text-center py-12'>
              <Wrench className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-500 dark:text-gray-400 text-lg mb-2'>
                {tools.length === 0
                  ? 'No tools created yet'
                  : 'No tools match your filters'}
              </p>
              <p className='text-gray-400 dark:text-gray-500 text-sm mb-4'>
                {tools.length === 0
                  ? 'Create your first tool to get started with cross-agent utilities'
                  : 'Try adjusting your search or filter criteria'}
              </p>
              {tools.length === 0 && (
                <button
                  onClick={handleCreateTool}
                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
                >
                  Create your first tool
                </button>
              )}
            </div>
          ) : (
            <div
              className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }`}
            >
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
