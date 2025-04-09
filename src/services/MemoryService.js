// services/MemoryService.js
/**
 * Service for handling agent memory operations
 */

// Mock data for demonstration purposes
const agentMemoryStore = {
  // Agent ID -> Memory items
  'agent-123456': [
    {
      id: 'm1',
      type: 'fact',
      title: 'User Preference',
      content: 'User prefers short, concise responses with technical details.',
      timestamp: new Date().toISOString(),
      confidence: 0.92,
      connections: ['m3', 'm5'],
      source: 'user-interaction',
      metadata: {
        created_by: 'system',
        priority: 'high',
      },
    },
    {
      id: 'm2',
      type: 'concept',
      title: 'Machine Learning Models',
      content:
        'Collection of knowledge about different ML model architectures and their applications.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      confidence: 0.85,
      connections: ['m5'],
      source: 'knowledge-base',
      metadata: {
        created_by: 'system',
        priority: 'medium',
      },
    },
    {
      id: 'm3',
      type: 'rule',
      title: 'Response Format',
      content:
        'When providing technical information, include code examples where applicable.',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      confidence: 0.78,
      connections: [],
      source: 'system',
      metadata: {
        created_by: 'admin',
        priority: 'medium',
      },
    },
    {
      id: 'm4',
      type: 'query',
      title: 'Latest API Request',
      content:
        'User asked about implementing a neural network for image classification.',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      confidence: 0.95,
      connections: ['m2', 'm5'],
      source: 'user-interaction',
      metadata: {
        created_by: 'user',
        priority: 'high',
      },
    },
    {
      id: 'm5',
      type: 'external',
      title: 'Documentation Reference',
      content: 'TensorFlow documentation for image classification models.',
      timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      confidence: 0.89,
      connections: [],
      source: 'external-api',
      metadata: {
        created_by: 'system',
        priority: 'low',
        url: 'https://www.tensorflow.org/tutorials/images/classification',
      },
    },
    {
      id: 'm6',
      type: 'fact',
      title: 'User Context',
      content:
        'User is working on a web application that needs to identify objects in uploaded images.',
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      confidence: 0.81,
      connections: ['m4'],
      source: 'inference',
      metadata: {
        created_by: 'agent',
        priority: 'medium',
      },
    },
  ],
  'agent-789012': [
    {
      id: 'm1',
      type: 'fact',
      title: 'Business Requirements',
      content:
        'Client needs a data visualization dashboard for financial metrics.',
      timestamp: new Date().toISOString(),
      confidence: 0.88,
      connections: [],
      source: 'user-interaction',
      metadata: {
        created_by: 'user',
        priority: 'high',
      },
    },
    {
      id: 'm2',
      type: 'rule',
      title: 'Reporting Standards',
      content:
        'Financial dashboards must include YoY comparison, MTD, and QTD metrics.',
      timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
      confidence: 0.9,
      connections: ['m1'],
      source: 'system',
      metadata: {
        created_by: 'admin',
        priority: 'high',
      },
    },
  ],
};

/**
 * Fetches memory items for a specific agent
 * @param {string} agentId - The ID of the agent
 * @param {object} options - Filter options
 * @returns {Promise<Array>} - The memory items
 */
export const getAgentMemory = async (agentId, options = {}) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      try {
        let items = [...(agentMemoryStore[agentId] || [])];

        // Apply search filter
        if (options.search) {
          const searchLower = options.search.toLowerCase();
          items = items.filter(
            (item) =>
              item.title.toLowerCase().includes(searchLower) ||
              item.content.toLowerCase().includes(searchLower)
          );
        }

        // Apply type filter
        if (options.type && options.type !== 'all') {
          items = items.filter((item) => item.type === options.type);
        }

        // Apply time range filter
        if (options.timeRange && options.timeRange !== 'all') {
          const hoursAgo = parseFloat(options.timeRange);
          const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
          items = items.filter(
            (item) => new Date(item.timestamp) >= cutoffTime
          );
        }

        // Apply confidence threshold filter
        if (options.confidenceThreshold) {
          items = items.filter(
            (item) => item.confidence >= options.confidenceThreshold
          );
        }

        // Sort by timestamp (newest first by default)
        items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        resolve(items);
      } catch (error) {
        reject(error);
      }
    }, 800); // Simulate network delay
  });
};

/**
 * Adds a new memory item to an agent's memory
 * @param {string} agentId - The ID of the agent
 * @param {object} memoryItem - The memory item to add
 * @returns {Promise<object>} - The added memory item with generated ID
 */
export const addMemoryItem = async (agentId, memoryItem) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Ensure the agent exists in the store
        if (!agentMemoryStore[agentId]) {
          agentMemoryStore[agentId] = [];
        }

        // Generate a unique ID
        const newId = `m${Date.now()}`;

        // Create new memory item with defaults
        const newItem = {
          id: newId,
          timestamp: new Date().toISOString(),
          confidence: 1.0,
          connections: [],
          ...memoryItem,
        };

        // Add to store
        agentMemoryStore[agentId].push(newItem);

        resolve(newItem);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Updates an existing memory item
 * @param {string} agentId - The ID of the agent
 * @param {string} itemId - The ID of the memory item to update
 * @param {object} updates - The updates to apply
 * @returns {Promise<object>} - The updated memory item
 */
export const updateMemoryItem = async (agentId, itemId, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Find the memory store for this agent
        const agentMemory = agentMemoryStore[agentId];
        if (!agentMemory) {
          throw new Error(`Agent ${agentId} not found`);
        }

        // Find the specific memory item
        const itemIndex = agentMemory.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
          throw new Error(
            `Memory item ${itemId} not found for agent ${agentId}`
          );
        }

        // Update the item
        const updatedItem = {
          ...agentMemory[itemIndex],
          ...updates,
        };

        // Replace in the store
        agentMemory[itemIndex] = updatedItem;

        resolve(updatedItem);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Deletes a memory item
 * @param {string} agentId - The ID of the agent
 * @param {string} itemId - The ID of the memory item to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteMemoryItem = async (agentId, itemId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Find the memory store for this agent
        const agentMemory = agentMemoryStore[agentId];
        if (!agentMemory) {
          throw new Error(`Agent ${agentId} not found`);
        }

        // Find the specific memory item
        const itemIndex = agentMemory.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
          throw new Error(
            `Memory item ${itemId} not found for agent ${agentId}`
          );
        }

        // Remove from the store
        agentMemory.splice(itemIndex, 1);

        // Also remove any connections to this item from other items
        agentMemory.forEach((item) => {
          if (item.connections && item.connections.includes(itemId)) {
            item.connections = item.connections.filter((id) => id !== itemId);
          }
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Creates a connection between two memory items
 * @param {string} agentId - The ID of the agent
 * @param {string} sourceId - The ID of the source memory item
 * @param {string} targetId - The ID of the target memory item
 * @returns {Promise<boolean>} - Success status
 */
export const createConnection = async (agentId, sourceId, targetId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Find the memory store for this agent
        const agentMemory = agentMemoryStore[agentId];
        if (!agentMemory) {
          throw new Error(`Agent ${agentId} not found`);
        }

        // Find the source memory item
        const sourceItem = agentMemory.find((item) => item.id === sourceId);
        if (!sourceItem) {
          throw new Error(`Source memory item ${sourceId} not found`);
        }

        // Find the target memory item
        const targetExists = agentMemory.some((item) => item.id === targetId);
        if (!targetExists) {
          throw new Error(`Target memory item ${targetId} not found`);
        }

        // Ensure connections array exists
        if (!sourceItem.connections) {
          sourceItem.connections = [];
        }

        // Add connection if it doesn't already exist
        if (!sourceItem.connections.includes(targetId)) {
          sourceItem.connections.push(targetId);
        }

        resolve(true);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Deletes a connection between two memory items
 * @param {string} agentId - The ID of the agent
 * @param {string} sourceId - The ID of the source memory item
 * @param {string} targetId - The ID of the target memory item
 * @returns {Promise<boolean>} - Success status
 */
export const deleteConnection = async (agentId, sourceId, targetId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Find the memory store for this agent
        const agentMemory = agentMemoryStore[agentId];
        if (!agentMemory) {
          throw new Error(`Agent ${agentId} not found`);
        }

        // Find the source memory item
        const sourceItem = agentMemory.find((item) => item.id === sourceId);
        if (!sourceItem) {
          throw new Error(`Source memory item ${sourceId} not found`);
        }

        // Remove the connection
        if (sourceItem.connections) {
          sourceItem.connections = sourceItem.connections.filter(
            (id) => id !== targetId
          );
        }

        resolve(true);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Exports the agent's memory data as JSON
 * @param {string} agentId - The ID of the agent
 * @returns {Promise<object>} - The memory data in JSON format
 */
export const exportMemoryData = async (agentId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Find the memory store for this agent
        const agentMemory = agentMemoryStore[agentId];
        if (!agentMemory) {
          throw new Error(`Agent ${agentId} not found`);
        }

        // Create export object with metadata
        const exportData = {
          agentId,
          exportDate: new Date().toISOString(),
          memoryItems: [...agentMemory],
          stats: {
            totalItems: agentMemory.length,
            typeBreakdown: agentMemory.reduce((acc, item) => {
              acc[item.type] = (acc[item.type] || 0) + 1;
              return acc;
            }, {}),
            avgConfidence:
              agentMemory.reduce(
                (sum, item) => sum + (item.confidence || 0),
                0
              ) / agentMemory.length,
          },
        };

        resolve(exportData);
      } catch (error) {
        reject(error);
      }
    }, 800);
  });
};

/**
 * Gets memory statistics for an agent
 * @param {string} agentId - The ID of the agent
 * @returns {Promise<object>} - Memory statistics
 */
export const getMemoryStats = async (agentId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Find the memory store for this agent
        const agentMemory = agentMemoryStore[agentId] || [];

        // Generate statistics
        const stats = {
          totalItems: agentMemory.length,
          typeBreakdown: agentMemory.reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
          }, {}),
          confidenceDistribution: {
            high: agentMemory.filter((item) => item.confidence >= 0.8).length,
            medium: agentMemory.filter(
              (item) => item.confidence >= 0.5 && item.confidence < 0.8
            ).length,
            low: agentMemory.filter((item) => item.confidence < 0.5).length,
          },
          connectionsDensity:
            agentMemory.reduce(
              (sum, item) => sum + (item.connections?.length || 0),
              0
            ) / agentMemory.length,
          recentActivity: {
            last24h: agentMemory.filter((item) => {
              return (
                new Date(item.timestamp) >
                new Date(Date.now() - 24 * 60 * 60 * 1000)
              );
            }).length,
            last7d: agentMemory.filter((item) => {
              return (
                new Date(item.timestamp) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              );
            }).length,
          },
        };

        resolve(stats);
      } catch (error) {
        reject(error);
      }
    }, 600);
  });
};
