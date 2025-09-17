// src/components/pages/Tools.jsx - Integrated with ToolService
import React, { useState, useEffect } from 'react';
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
// NUOVO IMPORT
import ToolService from '../../services/ToolService';

// Icon mapping per i tool
const getToolIcon = (category) => {
  switch (category) {
    case 'Data Collection':
      return Globe;
    case 'Database':
      return Database;
    case 'AI/ML':
      return Cpu;
    case 'Information':
      return MessageSquare;
    case 'Development':
      return Cpu;
    case 'Utilities':
      return Calculator;
    default:
      return Wrench;
  }
};

const getToolColor = (category) => {
  switch (category) {
    case 'Data Collection':
      return 'text-blue-600';
    case 'Database':
      return 'text-green-600';
    case 'AI/ML':
      return 'text-purple-600';
    case 'Information':
      return 'text-orange-600';
    case 'Development':
      return 'text-indigo-600';
    case 'Utilities':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};

export const Tools = ({ onCreateTool, onEditTool, onDeleteTool }) => {
  const { settings } = useApp();
  const darkMode = settings?.preferences?.theme === 'dark' || false;

  // Stati per la gestione della pagina - AGGIORNATI PER TOOLSERVICE
  const [tools, setTools] = useState([]);
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
  const [loading, setLoading] = useState(true);

  // NUOVO: Carica i tool dal ToolService
  useEffect(() => {
    loadTools();

    // Ascolta gli aggiornamenti dei tool
    const handleToolsUpdate = (event) => {
      setTools(event.detail.tools);
    };

    window.addEventListener('toolsUpdated', handleToolsUpdate);

    return () => {
      window.removeEventListener('toolsUpdated', handleToolsUpdate);
    };
  }, []);

  // NUOVO: Funzione per caricare i tool
  const loadTools = () => {
    try {
      setLoading(true);
      const allTools = ToolService.getToolsForDashboard();

      // Aggiungi icon e color ai tool basati sulla categoria
      const toolsWithDisplay = allTools.map((tool) => ({
        ...tool,
        icon: getToolIcon(tool.category),
        color: getToolColor(tool.category),
      }));

      setTools(toolsWithDisplay);
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ottieni categorie e tipi dinamicamente
  const getCategories = () => {
    const categories = [...new Set(tools.map((tool) => tool.category))];
    return ['All', ...categories.sort()];
  };

  const getTypes = () => {
    const types = [...new Set(tools.map((tool) => tool.type))];
    return ['All', ...types.sort()];
  };

  // Funzione per filtrare i tool - AGGIORNATA
  const getFilteredTools = () => {
    return tools
      .filter((tool) => {
        const matchesSearch =
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.tags?.some((tag) =>
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

  // Tool operations - AGGIORNATE PER TOOLSERVICE
  const toggleFavorite = (toolId) => {
    const tool = tools.find((t) => t.id === toolId);
    if (tool) {
      const updated = ToolService.updateTool(toolId, {
        isFavorite: !tool.isFavorite,
      });
      if (updated) {
        // L'aggiornamento sarà gestito dall'event listener
      }
    }
  };

  const toggleActive = (toolId) => {
    ToolService.toggleToolActive(toolId);
    // L'aggiornamento sarà gestito dall'event listener
  };

  const handleDeleteTool = (toolId) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      const success = ToolService.deleteTool(toolId);

      if (success) {
        // L'aggiornamento sarà gestito dall'event listener
        if (selectedTool && selectedTool.id === toolId) {
          setSelectedTool(null);
        }

        // Chiama la funzione parent se fornita
        if (onDeleteTool) {
          onDeleteTool(toolId);
        }
      }
    }
  };

  const handleDuplicateTool = (toolId) => {
    const tool = tools.find((t) => t.id === toolId);
    if (tool) {
      const duplicatedTool = {
        ...tool,
        name: `${tool.name} (Copy)`,
        id: undefined, // Sarà generato automaticamente
        created: undefined, // Sarà generato automaticamente
        usageCount: 0,
        isFavorite: false,
      };

      ToolService.createTool(duplicatedTool);
      // L'aggiornamento sarà gestito dall'event listener
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

  // Component per visualizzare un singolo tool
  const ToolCard = ({ tool }) => {
    const IconComponent = tool.icon || Wrench;

    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border ${
          selectedTool?.id === tool.id
            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
            : 'border-gray-200 dark:border-gray-700'
        } hover:shadow-md transition-all duration-200 cursor-pointer`}
        onClick={() => setSelectedTool(tool)}
      >
        {/* Header del tool */}
        <div className='p-4 border-b border-gray-100 dark:border-gray-700'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start space-x-3'>
              <div
                className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${tool.color}`}
              >
                <IconComponent className='w-5 h-5' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
                  {tool.name}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                  v{tool.version} • {tool.type}
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-2'>
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Menu azioni */}
            <div className='flex items-center space-x-2'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(tool.id);
                }}
                className='p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                title={
                  tool.isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                {tool.isFavorite ? (
                  <Star className='w-4 h-4 text-yellow-400 fill-current' />
                ) : (
                  <StarOff className='w-4 h-4 text-gray-400' />
                )}
              </button>

              <div className='relative group'>
                <button className='p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
                  <MoreVertical className='w-4 h-4 text-gray-500' />
                </button>

                {/* Dropdown menu */}
                <div className='absolute right-0 top-6 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10'>
                  <div className='py-1'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTool(tool);
                      }}
                      className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                      <Edit className='w-4 h-4 mr-2' />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateTool(tool.id);
                      }}
                      className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                      <Copy className='w-4 h-4 mr-2' />
                      Duplicate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActive(tool.id);
                      }}
                      className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                      <Play className='w-4 h-4 mr-2' />
                      {tool.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <div className='border-t border-gray-100 dark:border-gray-700 my-1'></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTool(tool.id);
                      }}
                      className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corpo del tool */}
        <div className='p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center space-x-2'>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tool.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {tool.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                <Tag className='w-3 h-3 mr-1' />
                {tool.category}
              </span>
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Used {tool.usageCount || 0} times
            </div>
          </div>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className='flex flex-wrap gap-1 mb-3'>
              {tool.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className='inline-block px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded'
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className='inline-block px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded'>
                  +{tool.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
            <div className='flex items-center'>
              <User className='w-3 h-3 mr-1' />
              {tool.author}
            </div>
            <div>Updated {tool.lastModified}</div>
          </div>
        </div>
      </div>
    );
  };

  const filteredTools = getFilteredTools();

  // Loading state
  if (loading) {
    return (
      <div className='flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='flex flex-col items-center'>
          <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-300'>
            Loading tools...
          </p>
        </div>
      </div>
    );
  }

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
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              <Plus className='w-4 h-4 mr-2' />
              Create Tool
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1'>
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
          </div>

          {/* Filters */}
          <div className='flex gap-3'>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              {getCategories().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              {getTypes().map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                showActiveOnly
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Active Only
            </button>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                showFavoritesOnly
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Star className='w-4 h-4 mr-1' />
              Favorites
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 p-6'>
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
