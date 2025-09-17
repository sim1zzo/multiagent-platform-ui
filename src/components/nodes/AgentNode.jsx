// components/nodes/AgentNode.jsx - Complete Updated Version
import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import {
  Brain,
  Search,
  MessageSquare,
  Lightbulb,
  Database,
  Play,
  Trash2,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Settings,
  Zap,
  FileText,
  User,
} from 'lucide-react';
import { AgentMemoryVisualization } from '../visualization/AgentMemoryVisualization';

// Get role-specific icon
const getRoleIcon = (role) => {
  switch (role) {
    case 'explorer':
      return <Search className='w-4 h-4' />;
    case 'planner':
      return <Brain className='w-4 h-4' />;
    case 'communicator':
      return <MessageSquare className='w-4 h-4' />;
    case 'thinker':
      return <Lightbulb className='w-4 h-4' />;
    case 'storage':
      return <Database className='w-4 h-4' />;
    case 'executor':
      return <Play className='w-4 h-4' />;
    default:
      return <Brain className='w-4 h-4' />;
  }
};

// Get role-specific color
const getRoleColor = (role) => {
  switch (role) {
    case 'explorer':
      return 'bg-blue-500';
    case 'planner':
      return 'bg-purple-500';
    case 'communicator':
      return 'bg-green-500';
    case 'thinker':
      return 'bg-yellow-500';
    case 'storage':
      return 'bg-gray-500';
    case 'executor':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};

// Get tool icon
const getToolIcon = (toolName) => {
  const lowerTool = toolName.toLowerCase();
  if (lowerTool.includes('search') || lowerTool.includes('web'))
    return <Search className='w-3 h-3' />;
  if (lowerTool.includes('database') || lowerTool.includes('mongo'))
    return <Database className='w-3 h-3' />;
  if (lowerTool.includes('code') || lowerTool.includes('interpreter'))
    return <FileText className='w-3 h-3' />;
  if (lowerTool.includes('api') || lowerTool.includes('connector'))
    return <Zap className='w-3 h-3' />;
  return <Settings className='w-3 h-3' />;
};

export const AgentNode = memo(({ data, isConnectable }) => {
  const [expanded, setExpanded] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Extract data with safe defaults
  const {
    id,
    name = 'Unnamed Agent',
    role = 'thinker',
    type = 'agent',
    isSelected = false,
    parameters = {},
    knowledgeBase,
    systemPrompt,
    model,
    memoryType,
    onSelect,
    onDelete,
    onEdit,
  } = data;

  // Safe access to tools array
  const tools = Array.isArray(data.tools) ? data.tools : [];

  const roleColor = getRoleColor(role);
  const RoleIcon = getRoleIcon(role);
  const agentId = id || 'agent-default';

  // Handle system prompt truncation
  const truncatePrompt = (text, maxLength = 100) => {
    if (!text) return 'No system prompt configured';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  console.log('=== AGENT NODE RENDER ===');
  console.log('Data:', data);
  console.log('Tools:', tools);
  console.log('SystemPrompt:', systemPrompt);

  return (
    <>
      <div
        className={`relative w-56 rounded-lg border-2 transition-all duration-200 ${
          isSelected
            ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
            : 'border-gray-300 hover:border-gray-400'
        } bg-white cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect && onSelect();
        }}
      >
        {/* Connection Handles */}
        <Handle
          type='target'
          position={Position.Top}
          className='w-3 h-3 bg-blue-500 border-2 border-white'
          isConnectable={isConnectable}
        />
        <Handle
          type='source'
          position={Position.Bottom}
          className='w-3 h-3 bg-blue-500 border-2 border-white'
          isConnectable={isConnectable}
        />

        {/* Additional handles for model and memory connections */}
        <Handle
          type='target'
          position={Position.Left}
          id='model-input'
          className='w-2 h-2 bg-purple-500 border border-white'
          style={{ top: '60%' }}
          isConnectable={isConnectable}
        />
        <Handle
          type='target'
          position={Position.Right}
          id='memory-input'
          className='w-2 h-2 bg-orange-500 border border-white'
          style={{ top: '60%' }}
          isConnectable={isConnectable}
        />

        {/* Header Section */}
        <div
          className={`flex items-center justify-between p-3 rounded-t-lg ${roleColor} text-white`}
        >
          <div className='flex items-center flex-1 min-w-0'>
            <div className='mr-2 flex-shrink-0'>{RoleIcon}</div>
            <div className='font-medium truncate' title={name}>
              {name}
            </div>
          </div>
          <div className='flex items-center space-x-1 ml-2'>
            {onEdit && (
              <button
                className='text-white/80 hover:text-white transition-colors p-1 rounded'
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                title='Edit Agent'
              >
                <Settings className='w-3 h-3' />
              </button>
            )}
            {onDelete && (
              <button
                className='text-white/80 hover:text-red-200 transition-colors p-1 rounded'
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title='Delete Agent'
              >
                <Trash2 className='w-3 h-3' />
              </button>
            )}
          </div>
        </div>

        {/* Basic Info Section */}
        <div className='p-3 text-sm space-y-2'>
          <div className='flex justify-between text-xs text-gray-600'>
            <span>Type: {type}</span>
            <span>Role: {role}</span>
          </div>

          {/* Model Info */}
          {model && (
            <div className='text-xs text-gray-600 flex items-center'>
              <Brain className='w-3 h-3 mr-1' />
              Model: {model}
            </div>
          )}

          {/* Memory Info */}
          {memoryType && (
            <div className='text-xs text-gray-600 flex items-center'>
              <Database className='w-3 h-3 mr-1' />
              Memory: {memoryType}
            </div>
          )}

          {/* System Prompt Preview - NUOVA SEZIONE */}
          {systemPrompt && (
            <div className='text-xs'>
              <div className='text-gray-600 mb-1 flex items-center'>
                <FileText className='w-3 h-3 mr-1' />
                System Prompt:
              </div>
              <div
                className='text-gray-700 bg-gray-50 p-2 rounded text-xs cursor-pointer hover:bg-gray-100 transition-colors border'
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPrompt(!showPrompt);
                }}
                title='Click to view full prompt'
              >
                {showPrompt ? systemPrompt : truncatePrompt(systemPrompt)}
              </div>
            </div>
          )}

          {/* Tools Section - MIGLIORATA */}
          {tools.length > 0 && (
            <div className='text-xs'>
              <div className='text-gray-600 mb-1 flex items-center'>
                <Zap className='w-3 h-3 mr-1' />
                Tools ({tools.length}):
              </div>
              <div className='flex flex-wrap gap-1'>
                {tools.slice(0, 3).map((tool, index) => (
                  <div
                    key={index}
                    className='flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200'
                    title={tool}
                  >
                    {getToolIcon(tool)}
                    <span className='ml-1 truncate max-w-20'>{tool}</span>
                  </div>
                ))}
                {tools.length > 3 && (
                  <div className='px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs border'>
                    +{tools.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DEBUG INFO - RIMUOVI DOPO TEST */}
          <div className='text-xs text-red-500 bg-red-50 p-1 rounded'>
            Debug - Tools: {JSON.stringify(tools)} | SystemPrompt:{' '}
            {systemPrompt ? 'YES' : 'NO'}
          </div>

          {/* Action Buttons */}
          <div className='flex justify-between items-center pt-2 border-t border-gray-100'>
            <button
              className='flex items-center text-xs text-blue-500 hover:text-blue-700 transition-colors px-2 py-1 rounded hover:bg-blue-50'
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <>
                  <ChevronUp className='w-3 h-3 mr-1' />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className='w-3 h-3 mr-1' />
                  More
                </>
              )}
            </button>

            <button
              className='flex items-center text-xs text-purple-500 hover:text-purple-700 transition-colors px-2 py-1 rounded hover:bg-purple-50'
              onClick={(e) => {
                e.stopPropagation();
                setShowMemory(true);
              }}
              title='View Agent Memory'
            >
              <BarChart2 className='w-3 h-3 mr-1' />
              Memory
            </button>
          </div>
        </div>

        {/* Expanded Details Section - MIGLIORATA */}
        {expanded && (
          <div className='p-3 border-t border-gray-200 text-xs bg-gray-50 rounded-b-lg'>
            {/* Parameters */}
            <div className='mb-3'>
              <div className='font-medium text-gray-700 mb-2 flex items-center'>
                <Settings className='w-3 h-3 mr-1' />
                Parameters:
              </div>
              {Object.keys(parameters).length > 0 ? (
                <div className='space-y-1'>
                  {Object.entries(parameters).map(([key, value]) => (
                    <div
                      key={key}
                      className='flex justify-between items-center bg-white p-2 rounded border'
                    >
                      <span className='text-gray-600 font-medium'>{key}:</span>
                      <span className='text-gray-800 ml-2 truncate max-w-24'>
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-gray-400 bg-white p-2 rounded border'>
                  No parameters configured
                </div>
              )}
            </div>

            {/* Knowledge Base */}
            <div className='mb-3'>
              <div className='font-medium text-gray-700 mb-2 flex items-center'>
                <Database className='w-3 h-3 mr-1' />
                Knowledge Base:
              </div>
              {knowledgeBase ? (
                <div className='text-gray-700 bg-white p-2 rounded border'>
                  {knowledgeBase}
                </div>
              ) : (
                <div className='text-gray-400 bg-white p-2 rounded border'>
                  No knowledge base connected
                </div>
              )}
            </div>

            {/* Full System Prompt */}
            {systemPrompt && (
              <div className='mb-3'>
                <div className='font-medium text-gray-700 mb-2 flex items-center'>
                  <FileText className='w-3 h-3 mr-1' />
                  Full System Prompt:
                </div>
                <div className='text-gray-700 bg-white p-2 rounded border text-xs max-h-24 overflow-y-auto'>
                  {systemPrompt}
                </div>
              </div>
            )}

            {/* Full Tools List */}
            {tools.length > 3 && (
              <div className='mb-3'>
                <div className='font-medium text-gray-700 mb-2 flex items-center'>
                  <Zap className='w-3 h-3 mr-1' />
                  All Tools:
                </div>
                <div className='space-y-1'>
                  {tools.map((tool, index) => (
                    <div
                      key={index}
                      className='flex items-center text-gray-700 bg-white p-2 rounded border'
                    >
                      {getToolIcon(tool)}
                      <span className='ml-2 text-xs'>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Status */}
            <div className='pt-2 border-t border-gray-200'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center text-gray-600'>
                  <User className='w-3 h-3 mr-1' />
                  <span className='text-xs'>Status: Active</span>
                </div>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Memory Visualization Modal */}
      {showMemory && (
        <AgentMemoryVisualization
          agentId={agentId}
          onClose={() => setShowMemory(false)}
        />
      )}
    </>
  );
});

AgentNode.displayName = 'AgentNode';
