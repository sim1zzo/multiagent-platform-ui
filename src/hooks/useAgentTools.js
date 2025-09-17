// hooks/useAgentTools.js
import { useState, useEffect, useCallback } from 'react';
import ToolService from '../services/ToolService';

export const useAgentTools = (agentId) => {
  const [agentTools, setAgentTools] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load agent tools and available tools
  useEffect(() => {
    loadAgentTools();
    loadAvailableTools();

    // Listen for tool updates
    const handleToolsUpdate = () => {
      loadAvailableTools();
    };

    window.addEventListener('toolsUpdated', handleToolsUpdate);

    return () => {
      window.removeEventListener('toolsUpdated', handleToolsUpdate);
    };
  }, [agentId]);

  // Load tools assigned to this agent
  const loadAgentTools = useCallback(() => {
    try {
      // Load from localStorage or API
      const storedAgentTools = localStorage.getItem(`agent_tools_${agentId}`);
      if (storedAgentTools) {
        const toolIds = JSON.parse(storedAgentTools);
        const allTools = ToolService.getAllTools();
        const assignedTools = allTools.filter((tool) =>
          toolIds.includes(tool.id)
        );
        setAgentTools(assignedTools);
      } else {
        setAgentTools([]);
      }
    } catch (error) {
      console.error('Error loading agent tools:', error);
      setAgentTools([]);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  // Load all available tools
  const loadAvailableTools = useCallback(() => {
    const tools = ToolService.getAvailableToolsForAgents();
    setAvailableTools(tools);
  }, []);

  // Save agent tools to storage
  const saveAgentTools = useCallback(
    (tools) => {
      try {
        const toolIds = tools.map((tool) => tool.id);
        localStorage.setItem(`agent_tools_${agentId}`, JSON.stringify(toolIds));
      } catch (error) {
        console.error('Error saving agent tools:', error);
      }
    },
    [agentId]
  );

  // Add tool to agent
  const addToolToAgent = useCallback(
    (tool) => {
      const isAlreadyAdded = agentTools.some((t) => t.id === tool.id);
      if (!isAlreadyAdded) {
        const newTools = [...agentTools, tool];
        setAgentTools(newTools);
        saveAgentTools(newTools);

        // Increment usage count
        ToolService.incrementUsage(tool.id);

        return {
          success: true,
          message: `Tool "${tool.name}" added successfully`,
        };
      }
      return { success: false, message: 'Tool already added to this agent' };
    },
    [agentTools, saveAgentTools]
  );

  // Remove tool from agent
  const removeToolFromAgent = useCallback(
    (toolId) => {
      const newTools = agentTools.filter((tool) => tool.id !== toolId);
      setAgentTools(newTools);
      saveAgentTools(newTools);

      const removedTool = agentTools.find((tool) => tool.id === toolId);
      return {
        success: true,
        message: `Tool "${
          removedTool?.name || 'Unknown'
        }" removed successfully`,
      };
    },
    [agentTools, saveAgentTools]
  );

  // Update agent tools (bulk operation)
  const updateAgentTools = useCallback(
    (tools) => {
      setAgentTools(tools);
      saveAgentTools(tools);
      return { success: true, message: 'Agent tools updated successfully' };
    },
    [saveAgentTools]
  );

  // Execute tool (placeholder for actual execution logic)
  const executeTool = useCallback(
    async (toolId, parameters = {}) => {
      const tool = agentTools.find((t) => t.id === toolId);
      if (!tool) {
        return { success: false, error: 'Tool not found' };
      }

      try {
        // Increment usage count
        ToolService.incrementUsage(toolId);

        // Here you would implement the actual tool execution logic
        // This could involve calling APIs, running functions, etc.

        console.log(`Executing tool: ${tool.name}`, { tool, parameters });

        // Placeholder response
        return {
          success: true,
          result: `Tool "${tool.name}" executed successfully`,
          data: parameters,
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    [agentTools]
  );

  // Get tools by category
  const getToolsByCategory = useCallback(
    (category) => {
      return agentTools.filter((tool) => tool.category === category);
    },
    [agentTools]
  );

  // Get tool statistics for this agent
  const getAgentToolStats = useCallback(() => {
    const categories = [...new Set(agentTools.map((tool) => tool.category))];
    const types = [...new Set(agentTools.map((tool) => tool.type))];

    return {
      total: agentTools.length,
      categories: categories.length,
      types: types.length,
      categoriesBreakdown: categories.map((category) => ({
        category,
        count: agentTools.filter((tool) => tool.category === category).length,
      })),
      typesBreakdown: types.map((type) => ({
        type,
        count: agentTools.filter((tool) => tool.type === type).length,
      })),
      mostUsedTool: agentTools.reduce(
        (max, tool) =>
          (tool.usageCount || 0) > (max.usageCount || 0) ? tool : max,
        agentTools[0]
      ),
    };
  }, [agentTools]);

  // Validate tool configuration for agent
  const validateToolConfiguration = useCallback((tool) => {
    const errors = [];

    if (!tool.name || tool.name.trim() === '') {
      errors.push('Tool name is required');
    }

    if (!tool.description || tool.description.trim() === '') {
      errors.push('Tool description is required');
    }

    if (!tool.category || tool.category.trim() === '') {
      errors.push('Tool category is required');
    }

    // Validate parameters if they exist
    if (tool.parameters) {
      Object.entries(tool.parameters).forEach(([key, param]) => {
        if (param.required && !param.default) {
          // Check if required parameter has validation
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  // Get available tools that are not assigned to this agent
  const getUnassignedTools = useCallback(() => {
    return availableTools.filter(
      (tool) => !agentTools.some((assignedTool) => assignedTool.id === tool.id)
    );
  }, [availableTools, agentTools]);

  // Search tools (both assigned and available)
  const searchTools = useCallback(
    (query, includeAssigned = true, includeAvailable = true) => {
      const searchTerm = query.toLowerCase();
      let results = [];

      if (includeAssigned) {
        const assignedMatches = agentTools
          .filter(
            (tool) =>
              tool.name.toLowerCase().includes(searchTerm) ||
              tool.description.toLowerCase().includes(searchTerm) ||
              tool.category.toLowerCase().includes(searchTerm)
          )
          .map((tool) => ({ ...tool, source: 'assigned' }));
        results = [...results, ...assignedMatches];
      }

      if (includeAvailable) {
        const availableMatches = getUnassignedTools()
          .filter(
            (tool) =>
              tool.name.toLowerCase().includes(searchTerm) ||
              tool.description.toLowerCase().includes(searchTerm) ||
              tool.category.toLowerCase().includes(searchTerm)
          )
          .map((tool) => ({ ...tool, source: 'available' }));
        results = [...results, ...availableMatches];
      }

      return results;
    },
    [agentTools, getUnassignedTools]
  );

  return {
    // Data
    agentTools,
    availableTools,
    loading,

    // Tools management
    addToolToAgent,
    removeToolFromAgent,
    updateAgentTools,

    // Tool execution
    executeTool,

    // Utilities
    getToolsByCategory,
    getAgentToolStats,
    validateToolConfiguration,
    getUnassignedTools,
    searchTools,

    // Refresh functions
    refreshTools: loadAvailableTools,
    refreshAgentTools: loadAgentTools,
  };
};
