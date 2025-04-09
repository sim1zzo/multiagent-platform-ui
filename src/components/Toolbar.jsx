// components/Toolbar.jsx - Updated with Marketplace button
import React, { useState } from 'react';
import {
  Power,
  Brain,
  GitBranch,
  Play,
  Wrench,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  Tag,
  Save,
  Upload,
  Store,
  BarChart2,
} from 'lucide-react';

export const Toolbar = ({ onNodeCreate, onOpenMarketplace }) => {
  const [expanded, setExpanded] = useState(true);

  const nodeTypes = [
    {
      id: 'trigger',
      name: 'Trigger Node',
      icon: <Power className='w-5 h-5' />,
      description: 'Starting point that initiates the workflow',
      color: 'text-red-600',
    },
    {
      id: 'agent',
      name: 'Agent Node',
      icon: <Brain className='w-5 h-5' />,
      description: 'AI agent with model, memory and tools',
      color: 'text-blue-600',
    },
    {
      id: 'condition',
      name: 'Condition Node',
      icon: <GitBranch className='w-5 h-5' />,
      description: 'Creates branches based on conditions',
      color: 'text-purple-600',
    },
    {
      id: 'action',
      name: 'Action Node',
      icon: <Play className='w-5 h-5' />,
      description: 'Executes specific tasks or operations',
      color: 'text-green-600',
    },
    {
      id: 'tool',
      name: 'Tool Node',
      icon: <Wrench className='w-5 h-5' />,
      description: 'Provides auxiliary functionality',
      color: 'text-yellow-600',
    },
  ];

  const organizationTools = [
    {
      id: 'createFolder',
      name: 'Create Folder',
      icon: <FolderPlus className='w-5 h-5' />,
    },
    { id: 'addTag', name: 'Add Tag', icon: <Tag className='w-5 h-5' /> },
    {
      id: 'saveWorkspace',
      name: 'Save Workspace',
      icon: <Save className='w-5 h-5' />,
    },
    {
      id: 'loadWorkspace',
      name: 'Load Workspace',
      icon: <Upload className='w-5 h-5' />,
    },
  ];

  // New marketplace button
  const marketplaceButton = {
    id: 'marketplace',
    name: 'Workflow Marketplace',
    icon: <Store className='w-5 h-5' />,
    description: 'Browse and import pre-built workflow templates',
    action: onOpenMarketplace,
    highlight: true,
  };

  // Analytics button
  const analyticsButton = {
    id: 'analytics',
    name: 'Memory Analytics',
    icon: <BarChart2 className='w-5 h-5' />,
    description: 'View and analyze agent memory',
    highlight: false,
  };

  return (
    <div
      className={`h-full border-r border-gray-200 bg-white transition-all duration-300 ${
        expanded ? 'w-64' : 'w-16'
      }`}
    >
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        <h2 className={`font-medium ${expanded ? 'block' : 'hidden'}`}>
          Workflow Nodes
        </h2>
        <button
          className='p-1 rounded-md hover:bg-gray-100'
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <div className='p-2'>
        {/* Marketplace Feature (New) */}
        <div className='mb-6'>
          <button
            className={`flex items-center w-full p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
              expanded ? 'justify-start' : 'justify-center'
            }`}
            onClick={marketplaceButton.action}
            title={!expanded ? marketplaceButton.name : undefined}
          >
            <div className='text-white'>{marketplaceButton.icon}</div>

            {expanded && (
              <div className='ml-3 text-left'>
                <div className='text-sm font-medium text-white'>
                  {marketplaceButton.name}
                </div>
                {marketplaceButton.description && (
                  <div className='text-xs text-blue-100'>
                    {marketplaceButton.description}
                  </div>
                )}
              </div>
            )}
          </button>
        </div>

        <div className='mb-6'>
          <h3
            className={`text-sm font-medium text-gray-700 mb-3 ${
              expanded ? 'block' : 'hidden'
            }`}
          >
            Node Types
          </h3>

          <div className='space-y-2'>
            {nodeTypes.map((nodeType) => (
              <button
                key={nodeType.id}
                className={`flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition-colors ${
                  expanded ? 'justify-start' : 'justify-center'
                }`}
                onClick={() => onNodeCreate(nodeType.id)}
                title={!expanded ? nodeType.name : undefined}
              >
                <div className={nodeType.color}>{nodeType.icon}</div>

                {expanded && (
                  <div className='ml-3 text-left'>
                    <div className='text-sm font-medium text-gray-700'>
                      {nodeType.name}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {nodeType.description}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Tools Section with Memory Analytics */}
        <div className='mb-6'>
          <h3
            className={`text-sm font-medium text-gray-700 mb-3 ${
              expanded ? 'block' : 'hidden'
            }`}
          >
            Advanced Tools
          </h3>

          <div className='space-y-2'>
            <button
              className={`flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition-colors ${
                expanded ? 'justify-start' : 'justify-center'
              }`}
              title={!expanded ? analyticsButton.name : undefined}
            >
              <div className='text-purple-600'>{analyticsButton.icon}</div>

              {expanded && (
                <div className='ml-3 text-left'>
                  <div className='text-sm font-medium text-gray-700'>
                    {analyticsButton.name}
                  </div>
                  {analyticsButton.description && (
                    <div className='text-xs text-gray-500'>
                      {analyticsButton.description}
                    </div>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>

        <div>
          <h3
            className={`text-sm font-medium text-gray-700 mb-3 ${
              expanded ? 'block' : 'hidden'
            }`}
          >
            Organization
          </h3>

          <div className='space-y-2'>
            {organizationTools.map((tool) => (
              <button
                key={tool.id}
                className={`flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition-colors ${
                  expanded ? 'justify-start' : 'justify-center'
                }`}
                title={!expanded ? tool.name : undefined}
              >
                <div className='text-gray-600'>{tool.icon}</div>

                {expanded && (
                  <div className='ml-3 text-left'>
                    <div className='text-sm font-medium text-gray-700'>
                      {tool.name}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
