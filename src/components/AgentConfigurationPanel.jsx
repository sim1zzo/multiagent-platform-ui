// components/AgentConfigurationPanel.jsx (Updated with Tools)
import React, { useState, useEffect } from 'react';
import { X, Save, Settings, Wrench, Brain, MessageSquare } from 'lucide-react';
import AgentToolSelector from './agents/AgentToolSelector';
import { useAgentTools } from '../hooks/useAgentTools';

const AgentConfigurationPanel = ({
  selectedAgent,
  onUpdateAgent,
  onClose,
  onCreateNewTool,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    instructions: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    tools: [],
  });

  const [activeTab, setActiveTab] = useState('general');

  // Use the agent tools hook
  const {
    agentTools,
    addToolToAgent,
    removeToolFromAgent,
    updateAgentTools,
    getAgentToolStats,
    loading: toolsLoading,
  } = useAgentTools(selectedAgent?.id);

  useEffect(() => {
    if (selectedAgent) {
      setFormData({
        name: selectedAgent.data?.name || '',
        role: selectedAgent.data?.role || '',
        instructions: selectedAgent.data?.instructions || '',
        model: selectedAgent.data?.model || 'gpt-4',
        temperature: selectedAgent.data?.temperature || 0.7,
        maxTokens: selectedAgent.data?.maxTokens || 2048,
        tools: agentTools || [],
      });
    }
  }, [selectedAgent, agentTools]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToolsChange = (newTools) => {
    setFormData((prev) => ({
      ...prev,
      tools: newTools,
    }));
    updateAgentTools(newTools);
  };

  const handleSave = () => {
    if (selectedAgent && onUpdateAgent) {
      const updatedAgent = {
        ...selectedAgent,
        data: {
          ...selectedAgent.data,
          ...formData,
          tools: agentTools, // Use the tools from the hook
        },
      };
      onUpdateAgent(updatedAgent);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'tools', name: 'Tools', icon: Wrench },
    { id: 'model', name: 'Model', icon: Brain },
    { id: 'instructions', name: 'Instructions', icon: MessageSquare },
  ];

  const toolStats = getAgentToolStats();

  if (!selectedAgent) return null;

  return (
    <div className='w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full'>
      {/* Header */}
      <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Configure Agent
          </h3>
          <button
            onClick={onClose}
            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
          {selectedAgent.data?.name || 'Unnamed Agent'}
        </div>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <nav className='flex space-x-0'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className='w-4 h-4 mr-1' />
                {tab.name}
                {tab.id === 'tools' && agentTools.length > 0 && (
                  <span className='ml-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full px-1.5 py-0.5'>
                    {agentTools.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {activeTab === 'general' && (
          <>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Agent Name
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter agent name...'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Role
              </label>
              <input
                type='text'
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='e.g., Customer Support, Data Analyst...'
              />
            </div>

            {agentTools.length > 0 && (
              <div className='bg-gray-50 dark:bg-gray-750 rounded-lg p-3'>
                <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                  Agent Overview
                </h4>
                <div className='grid grid-cols-2 gap-3 text-xs'>
                  <div>
                    <span className='text-gray-500 dark:text-gray-400'>
                      Tools:
                    </span>
                    <span className='ml-1 font-medium text-gray-900 dark:text-white'>
                      {toolStats.total}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-500 dark:text-gray-400'>
                      Categories:
                    </span>
                    <span className='ml-1 font-medium text-gray-900 dark:text-white'>
                      {toolStats.categories}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'tools' && (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                Agent Tools
              </h4>
              {agentTools.length > 0 && (
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  {agentTools.length} tool{agentTools.length !== 1 ? 's' : ''}{' '}
                  assigned
                </span>
              )}
            </div>

            <AgentToolSelector
              selectedTools={agentTools}
              onToolsChange={handleToolsChange}
              onCreateNewTool={onCreateNewTool}
              maxTools={10}
            />

            {agentTools.length > 0 && (
              <div className='bg-gray-50 dark:bg-gray-750 rounded-lg p-3'>
                <h5 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                  Tool Categories
                </h5>
                <div className='space-y-1'>
                  {toolStats.categoriesBreakdown?.map((cat, index) => (
                    <div key={index} className='flex justify-between text-xs'>
                      <span className='text-gray-600 dark:text-gray-400'>
                        {cat.category}
                      </span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'model' && (
          <>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Model
              </label>
              <select
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='gpt-4'>GPT-4</option>
                <option value='gpt-3.5-turbo'>GPT-3.5 Turbo</option>
                <option value='claude-3'>Claude 3</option>
                <option value='llama-2'>Llama 2</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Temperature: {formData.temperature}
              </label>
              <input
                type='range'
                min='0'
                max='2'
                step='0.1'
                value={formData.temperature}
                onChange={(e) =>
                  handleInputChange('temperature', parseFloat(e.target.value))
                }
                className='w-full'
              />
              <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1'>
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Max Tokens
              </label>
              <input
                type='number'
                value={formData.maxTokens}
                onChange={(e) =>
                  handleInputChange('maxTokens', parseInt(e.target.value))
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min='100'
                max='8000'
              />
            </div>
          </>
        )}

        {activeTab === 'instructions' && (
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              System Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) =>
                handleInputChange('instructions', e.target.value)
              }
              rows={10}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
              placeholder='Enter detailed instructions for this agent...'
            />
            <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              Define the agent's behavior, capabilities, and response style.
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
        <div className='flex space-x-2'>
          <button
            onClick={handleSave}
            className='flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Save className='w-4 h-4 mr-2' />
            Save Changes
          </button>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentConfigurationPanel;
