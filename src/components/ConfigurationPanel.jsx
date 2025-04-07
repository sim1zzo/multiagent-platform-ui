// components/ConfigurationPanel.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const ConfigurationPanel = ({ agent, onUpdate, onClose }) => {
  const [formState, setFormState] = useState({
    name: '',
    role: '',
    parameters: {},
    knowledgeBase: null,
  });

  // Initialize form with agent data when selected agent changes
  useEffect(() => {
    if (agent) {
      setFormState({
        name: agent.name || '',
        role: agent.role || 'explorer',
        parameters: { ...agent.parameters } || {},
        knowledgeBase: agent.knowledgeBase || null,
      });
    }
  }, [agent]);

  // Available agent roles
  const roles = [
    { id: 'explorer', name: 'Explorer', description: 'Searches for information and resources' },
    { id: 'planner', name: 'Planner', description: 'Creates strategies and coordinates tasks' },
    { id: 'communicator', name: 'Communicator', description: 'Interfaces with users and other agents' },
    { id: 'thinker', name: 'Thinker', description: 'Analyzes data and makes decisions' },
    { id: 'storage', name: 'Storage', description: 'Stores and retrieves knowledge' },
    { id: 'executor', name: 'Executor', description: 'Performs actions in the environment' },
  ];

  // Available knowledge bases
  const knowledgeBases = [
    { id: 'general', name: 'General Knowledge' },
    { id: 'specialized', name: 'Specialized Domain' },
    { id: 'custom', name: 'Custom Database' },
  ];

  // Define parameter templates for each role
  const roleParameters = {
    explorer: [
      { id: 'searchDepth', name: 'Search Depth', type: 'number', default: 3 },
      { id: 'explorationRate', name: 'Exploration Rate', type: 'number', default: 0.7 },
    ],
    planner: [
      { id: 'planningHorizon', name: 'Planning Horizon', type: 'number', default: 5 },
      { id: 'optimizationGoal', name: 'Optimization Goal', type: 'select', 
        options: ['efficiency', 'accuracy', 'speed'], default: 'efficiency' },
    ],
    communicator: [
      { id: 'messageFormat', name: 'Message Format', type: 'select', 
        options: ['json', 'text', 'binary'], default: 'json' },
      { id: 'communicationFrequency', name: 'Communication Frequency', type: 'number', default: 1 },
    ],
    thinker: [
      { id: 'reasoningDepth', name: 'Reasoning Depth', type: 'number', default: 3 },
      { id: 'confidenceThreshold', name: 'Confidence Threshold', type: 'number', default: 0.8 },
    ],
    storage: [
      { id: 'storageCapacity', name: 'Storage Capacity', type: 'number', default: 1000 },
      { id: 'retrievalStrategy', name: 'Retrieval Strategy', type: 'select', 
        options: ['exact', 'semantic', 'hybrid'], default: 'hybrid' },
    ],
    executor: [
      { id: 'executionPriority', name: 'Execution Priority', type: 'number', default: 5 },
      { id: 'parallelExecutions', name: 'Parallel Executions', type: 'number', default: 1 },
    ],
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle role change and update parameter defaults
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    const roleParams = { ...formState.parameters };
    
    // Add default parameters for the new role
    if (roleParameters[newRole]) {
      roleParameters[newRole].forEach(param => {
        if (!roleParams[param.id]) {
          roleParams[param.id] = param.default;
        }
      });
    }
    
    setFormState({
      ...formState,
      role: newRole,
      parameters: roleParams,
    });
  };

  // Handle parameter changes
  const handleParameterChange = (paramId, value) => {
    setFormState({
      ...formState,
      parameters: {
        ...formState.parameters,
        [paramId]: value,
      },
    });
  };

  // Handle knowledge base change
  const handleKnowledgeBaseChange = (e) => {
    setFormState({
      ...formState,
      knowledgeBase: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  // Get current role parameters
  const currentRoleParams = roleParameters[formState.role] || [];

  if (!agent) return null;

  return (
    <div className="w-80 h-full border-l border-gray-200 bg-white overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Agent Configuration</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h3>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formState.role}
              onChange={handleRoleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {roles.find(r => r.id === formState.role)?.description}
            </p>
          </div>
        </div>
        
        {/* Parameters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Behavior Parameters</h3>
          
          {currentRoleParams.length > 0 ? (
            currentRoleParams.map(param => (
              <div key={param.id} className="mb-4">
                <label htmlFor={param.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {param.name}
                </label>
                
                {param.type === 'select' ? (
                  <select
                    id={param.id}
                    value={formState.parameters[param.id] || param.default}
                    onChange={(e) => handleParameterChange(param.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {param.options.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={param.type}
                    id={param.id}
                    value={formState.parameters[param.id] || param.default}
                    onChange={(e) => {
                      const value = param.type === 'number' 
                        ? parseFloat(e.target.value) 
                        : e.target.value;
                      handleParameterChange(param.id, value);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No parameters available for this role.</p>
          )}
        </div>
        
        {/* Knowledge Base */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Knowledge Base</h3>
          
          <div className="mb-4">
            <label htmlFor="knowledgeBase" className="block text-sm font-medium text-gray-700 mb-1">
              Connect to Knowledge Base
            </label>
            <select
              id="knowledgeBase"
              value={formState.knowledgeBase || ''}
              onChange={handleKnowledgeBaseChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">None</option>
              {knowledgeBases.map(kb => (
                <option key={kb.id} value={kb.id}>
                  {kb.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};