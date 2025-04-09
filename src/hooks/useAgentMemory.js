// hooks/useAgentMemory.js
import { useState, useEffect, useCallback } from 'react';
import * as MemoryService from '../services/MemoryService';

/**
 * Custom hook for working with agent memory
 * @param {string} agentId - The ID of the agent
 * @param {object} initialFilters - Initial filter settings
 * @returns {object} - Memory data and operations
 */
export const useAgentMemory = (agentId, initialFilters = {}) => {
  const [memoryItems, setMemoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    timeRange: 'all',
    confidenceThreshold: 0,
    ...initialFilters,
  });
  const [stats, setStats] = useState(null);

  // Fetch memory items based on current filters
  const fetchMemoryItems = useCallback(async () => {
    if (!agentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const items = await MemoryService.getAgentMemory(agentId, filters);
      setMemoryItems(items);
    } catch (err) {
      setError(err.message || 'Failed to load agent memory');
      console.error('Error fetching agent memory:', err);
    } finally {
      setIsLoading(false);
    }
  }, [agentId, filters]);

  // Fetch memory statistics
  const fetchStats = useCallback(async () => {
    if (!agentId) return;

    try {
      const memoryStats = await MemoryService.getMemoryStats(agentId);
      setStats(memoryStats);
    } catch (err) {
      console.error('Error fetching memory stats:', err);
      // Don't set error state here to avoid blocking the main memory display
    }
  }, [agentId]);

  // Initial data loading
  useEffect(() => {
    fetchMemoryItems();
    fetchStats();
  }, [fetchMemoryItems, fetchStats]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Reset filters to default
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      type: 'all',
      timeRange: 'all',
      confidenceThreshold: 0,
    });
  }, []);

  // Add a new memory item
  const addMemoryItem = useCallback(
    async (memoryItem) => {
      if (!agentId) return null;

      try {
        const newItem = await MemoryService.addMemoryItem(agentId, memoryItem);
        setMemoryItems((prev) => [newItem, ...prev]);
        return newItem;
      } catch (err) {
        setError(err.message || 'Failed to add memory item');
        console.error('Error adding memory item:', err);
        return null;
      }
    },
    [agentId]
  );

  // Update an existing memory item
  const updateMemoryItem = useCallback(
    async (itemId, updates) => {
      if (!agentId) return false;

      try {
        const updatedItem = await MemoryService.updateMemoryItem(
          agentId,
          itemId,
          updates
        );
        setMemoryItems((prev) =>
          prev.map((item) => (item.id === itemId ? updatedItem : item))
        );
        return true;
      } catch (err) {
        setError(err.message || 'Failed to update memory item');
        console.error('Error updating memory item:', err);
        return false;
      }
    },
    [agentId]
  );

  // Delete a memory item
  const deleteMemoryItem = useCallback(
    async (itemId) => {
      if (!agentId) return false;

      try {
        await MemoryService.deleteMemoryItem(agentId, itemId);
        setMemoryItems((prev) => prev.filter((item) => item.id !== itemId));
        return true;
      } catch (err) {
        setError(err.message || 'Failed to delete memory item');
        console.error('Error deleting memory item:', err);
        return false;
      }
    },
    [agentId]
  );

  // Create a connection between memory items
  const createConnection = useCallback(
    async (sourceId, targetId) => {
      if (!agentId) return false;

      try {
        await MemoryService.createConnection(agentId, sourceId, targetId);
        setMemoryItems((prev) => {
          return prev.map((item) => {
            if (item.id === sourceId) {
              const connections = item.connections || [];
              if (!connections.includes(targetId)) {
                return {
                  ...item,
                  connections: [...connections, targetId],
                };
              }
            }
            return item;
          });
        });
        return true;
      } catch (err) {
        setError(err.message || 'Failed to create connection');
        console.error('Error creating connection:', err);
        return false;
      }
    },
    [agentId]
  );

  // Delete a connection between memory items
  const deleteConnection = useCallback(
    async (sourceId, targetId) => {
      if (!agentId) return false;

      try {
        await MemoryService.deleteConnection(agentId, sourceId, targetId);
        setMemoryItems((prev) => {
          return prev.map((item) => {
            if (item.id === sourceId && item.connections) {
              return {
                ...item,
                connections: item.connections.filter((id) => id !== targetId),
              };
            }
            return item;
          });
        });
        return true;
      } catch (err) {
        setError(err.message || 'Failed to delete connection');
        console.error('Error deleting connection:', err);
        return false;
      }
    },
    [agentId]
  );

  // Export memory data
  const exportMemory = useCallback(async () => {
    if (!agentId) return null;

    try {
      const exportData = await MemoryService.exportMemoryData(agentId);

      // Create and download a JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `agent-${agentId}-memory-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      return true;
    } catch (err) {
      setError(err.message || 'Failed to export memory data');
      console.error('Error exporting memory data:', err);
      return false;
    }
  }, [agentId]);

  // Refresh both memory items and stats
  const refreshMemory = useCallback(() => {
    fetchMemoryItems();
    fetchStats();
  }, [fetchMemoryItems, fetchStats]);

  return {
    memoryItems,
    isLoading,
    error,
    filters,
    stats,
    updateFilters,
    resetFilters,
    addMemoryItem,
    updateMemoryItem,
    deleteMemoryItem,
    createConnection,
    deleteConnection,
    exportMemory,
    refreshMemory,
  };
};
