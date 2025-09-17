// src/hooks/useTools.js
import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../components/context/AppContext';

export const useTools = () => {
  const {
    tools,
    addTool,
    updateTool,
    deleteTool,
    duplicateTool,
    toggleToolFavorite,
    toggleToolActive,
    incrementToolUsage,
    getToolsByCategory,
    getToolsByType,
    getFavoriteTools,
    getActiveTools,
    searchTools,
    exportTools,
    importTools,
    getToolStats,
  } = useApp();

  // Local state for advanced filtering and search
  const [filteredTools, setFilteredTools] = useState(tools);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: 'All',
    type: 'All',
    showActiveOnly: false,
    showFavoritesOnly: false,
    sortBy: 'lastModified',
    sortOrder: 'desc',
  });

  // Update filtered tools when tools or filters change
  useEffect(() => {
    let filtered = [...tools];

    // Apply search
    if (searchQuery.trim()) {
      filtered = searchTools(searchQuery);
    }

    // Apply category filter
    if (activeFilters.category !== 'All') {
      filtered = filtered.filter(
        (tool) => tool.category === activeFilters.category
      );
    }

    // Apply type filter
    if (activeFilters.type !== 'All') {
      filtered = filtered.filter((tool) => tool.type === activeFilters.type);
    }

    // Apply active filter
    if (activeFilters.showActiveOnly) {
      filtered = filtered.filter((tool) => tool.isActive);
    }

    // Apply favorites filter
    if (activeFilters.showFavoritesOnly) {
      filtered = filtered.filter((tool) => tool.isFavorite);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[activeFilters.sortBy];
      let bValue = b[activeFilters.sortBy];

      if (activeFilters.sortBy === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (activeFilters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTools(filtered);
  }, [tools, searchQuery, activeFilters, searchTools]);

  // Filter and search functions
  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const updateFilter = useCallback((filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setActiveFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({
      category: 'All',
      type: 'All',
      showActiveOnly: false,
      showFavoritesOnly: false,
      sortBy: 'lastModified',
      sortOrder: 'desc',
    });
    setSearchQuery('');
  }, []);

  // Tool operations with enhanced functionality
  const createTool = useCallback(
    (toolData) => {
      try {
        const newTool = addTool(toolData);
        return { success: true, tool: newTool };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [addTool]
  );

  const editTool = useCallback(
    (toolId, updates) => {
      try {
        updateTool(toolId, updates);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [updateTool]
  );

  const removeTool = useCallback(
    (toolId) => {
      try {
        deleteTool(toolId);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [deleteTool]
  );

  const copyTool = useCallback(
    (toolId) => {
      try {
        const newTool = duplicateTool(toolId);
        return { success: true, tool: newTool };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [duplicateTool]
  );

  // Tool execution simulation
  const executeTool = useCallback(
    async (toolId, parameters = {}) => {
      const tool = tools.find((t) => t.id === toolId);
      if (!tool) {
        return { success: false, error: 'Tool not found' };
      }

      if (!tool.isActive) {
        return { success: false, error: 'Tool is not active' };
      }

      try {
        // Increment usage count
        incrementToolUsage(toolId);

        // Simulate tool execution
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 2000)
        );

        // Mock successful execution
        const result = {
          toolId,
          toolName: tool.name,
          executedAt: new Date().toISOString(),
          parameters,
          output: {
            status: 'completed',
            result: `Tool ${tool.name} executed successfully with parameters`,
            metadata: {
              executionTime: Math.round(1000 + Math.random() * 2000),
              version: tool.version,
            },
          },
        };

        return { success: true, result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [tools, incrementToolUsage]
  );

  // Tool validation
  const validateTool = useCallback(
    (toolData) => {
      const errors = [];
      const warnings = [];

      // Required fields
      if (!toolData.name?.trim()) {
        errors.push('Tool name is required');
      }
      if (!toolData.description?.trim()) {
        warnings.push('Tool description is recommended');
      }
      if (!toolData.type) {
        errors.push('Tool type is required');
      }
      if (!toolData.category) {
        errors.push('Tool category is required');
      }

      // Name uniqueness (exclude self when editing)
      const existingTool = tools.find(
        (t) =>
          t.name.toLowerCase() === toolData.name?.toLowerCase() &&
          t.id !== toolData.id
      );
      if (existingTool) {
        errors.push('A tool with this name already exists');
      }

      // Code validation
      if (toolData.code?.trim()) {
        try {
          // Basic syntax validation for JavaScript tools
          if (toolData.type === 'javascript') {
            new Function(toolData.code);
          }
        } catch (syntaxError) {
          errors.push(`Code syntax error: ${syntaxError.message}`);
        }
      } else {
        warnings.push('Tool code is empty');
      }

      // Parameters validation
      if (toolData.parameters) {
        toolData.parameters.forEach((param, index) => {
          if (!param.name?.trim()) {
            errors.push(`Parameter ${index + 1} name is required`);
          }
          if (!param.type) {
            errors.push(`Parameter ${index + 1} type is required`);
          }
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    },
    [tools]
  );

  // Get tools by various criteria
  const getRecentTools = useCallback(
    (limit = 5) => {
      return [...tools]
        .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
        .slice(0, limit);
    },
    [tools]
  );

  const getMostUsedTools = useCallback(
    (limit = 5) => {
      return [...tools]
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, limit);
    },
    [tools]
  );

  const getToolsByAuthor = useCallback(
    (author) => {
      return tools.filter((tool) => tool.author === author);
    },
    [tools]
  );

  // Batch operations
  const batchUpdateTools = useCallback(
    (toolIds, updates) => {
      try {
        toolIds.forEach((toolId) => {
          updateTool(toolId, updates);
        });
        return { success: true, updated: toolIds.length };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [updateTool]
  );

  const batchDeleteTools = useCallback(
    (toolIds) => {
      try {
        toolIds.forEach((toolId) => {
          deleteTool(toolId);
        });
        return { success: true, deleted: toolIds.length };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [deleteTool]
  );

  // Tool categories and types
  const getAvailableCategories = useCallback(() => {
    const categories = [...new Set(tools.map((tool) => tool.category))];
    return ['All', ...categories.sort()];
  }, [tools]);

  const getAvailableTypes = useCallback(() => {
    const types = [...new Set(tools.map((tool) => tool.type))];
    return ['All', ...types.sort()];
  }, [tools]);

  const getAvailableAuthors = useCallback(() => {
    const authors = [...new Set(tools.map((tool) => tool.author))];
    return authors.sort();
  }, [tools]);

  // Export hook interface
  return {
    // Tools data
    tools,
    filteredTools,

    // Search and filtering
    searchQuery,
    activeFilters,
    updateSearchQuery,
    updateFilter,
    updateFilters,
    clearFilters,

    // CRUD operations
    createTool,
    editTool,
    removeTool,
    copyTool,

    // Tool state management
    toggleFavorite: toggleToolFavorite,
    toggleActive: toggleToolActive,

    // Tool execution
    executeTool,

    // Tool validation
    validateTool,

    // Data retrieval
    getToolsByCategory,
    getToolsByType,
    getFavoriteTools,
    getActiveTools,
    getRecentTools,
    getMostUsedTools,
    getToolsByAuthor,

    // Batch operations
    batchUpdateTools,
    batchDeleteTools,

    // Metadata
    getAvailableCategories,
    getAvailableTypes,
    getAvailableAuthors,
    getToolStats,

    // Import/Export
    exportTools,
    importTools,

    // Computed values
    totalTools: tools.length,
    activeToolsCount: getActiveTools().length,
    favoriteToolsCount: getFavoriteTools().length,
    filteredCount: filteredTools.length,
  };
};
