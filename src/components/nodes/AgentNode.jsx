// components/nodes/AgentNode.jsx - Updated with Memory Visualization
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
} from 'lucide-react';
import { AgentMemoryVisualization } from '../visualization/AgentMemoryVisualization';

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

export const AgentNode = memo(({ data, isConnectable }) => {
  // DEBUG: Verifica TUTTO il contenuto di data
  console.log('=== AGENTNODE DEBUG ===');
  console.log('Tutto data:', data);
  console.log('data.tools:', data.tools);
  console.log('Tipo di data.tools:', typeof data.tools);
  console.log('È array?', Array.isArray(data.tools));
  console.log('Lunghezza:', data.tools?.length);

  const [expanded, setExpanded] = React.useState(false);
  const [showMemory, setShowMemory] = useState(false);

  const {
    name,
    role,
    type,
    isSelected,
    parameters = {}, // default value
    knowledgeBase,
    onSelect,
    onDelete,
  } = data;
  // DEBUG: Verifica dopo la destrutturazione
  const tools = data.tools || [];
  console.log('tools dopo destrutturazione:', tools);
  console.log('tools === data.tools?', tools === data.tools);

  const roleColor = getRoleColor(role);
  const RoleIcon = getRoleIcon(role);
  const agentId = data.id || 'agent-123456';

  return (
    <>
      <div
        className={`relative w-48 rounded-lg border ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
        } bg-white`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* Handles rimangono uguali */}
        <Handle
          type='target'
          position={Position.Top}
          className='w-3 h-3 bg-blue-500'
          isConnectable={isConnectable}
        />
        <Handle
          type='source'
          position={Position.Bottom}
          className='w-3 h-3 bg-blue-500'
          isConnectable={isConnectable}
        />

        {/* Header rimane uguale */}
        <div
          className={`flex items-center p-2 rounded-t-lg ${roleColor} text-white`}
        >
          <div className='mr-2'>{RoleIcon}</div>
          <div className='flex-1 font-medium truncate'>{name}</div>
          <button
            className='text-white hover:text-red-200 transition-colors'
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>

        {/* Basic Info - QUI È IL PROBLEMA */}
        {/* Basic Info */}
        <div className='p-2 text-sm'>
          <div className='text-gray-600'>Type: {type}</div>
          <div className='text-gray-600'>Role: {role}</div>

          {/* DEBUG: Aggiungi questi log per vedere cosa succede */}
          {console.log('AgentNode rendering - data:', data)}
          {console.log('AgentNode rendering - data.tools:', data.tools)}

          {/* FIX 1: Usa data.tools direttamente (bypassa destrutturazione) */}
          {data.tools && Array.isArray(data.tools) && data.tools.length > 0 && (
            <div className='mt-1 text-xs text-gray-500'>
              Tools: {data.tools.join(', ')}
            </div>
          )}

          {/* DEBUG: Mostra sempre per test - RIMUOVI DOPO */}
          <div className='mt-1 text-xs text-red-500'>
            Debug: {data.tools ? JSON.stringify(data.tools) : 'NO TOOLS'}
          </div>

          <div className='flex justify-between items-center mt-2'>
            <button
              className='flex items-center text-xs text-blue-500'
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <>
                  <ChevronUp className='w-3 h-3 mr-1' />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className='w-3 h-3 mr-1' />
                  Show Details
                </>
              )}
            </button>

            <button
              className='flex items-center text-xs text-purple-500 hover:text-purple-700'
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

        {/* Expanded Details - rimane uguale */}
        {expanded && (
          <div className='p-2 border-t border-gray-200 text-xs'>
            <div className='mb-1 font-medium'>Parameters:</div>
            {Object.keys(parameters || {}).length > 0 ? (
              <ul className='text-gray-600 mb-2'>
                {Object.entries(parameters || {}).map(([key, value]) => (
                  <li key={key}>
                    {key}: {String(value)}
                  </li>
                ))}
              </ul>
            ) : (
              <div className='text-gray-400 mb-2'>No parameters configured</div>
            )}

            <div className='mb-1 font-medium'>Knowledge Base:</div>
            {knowledgeBase ? (
              <div className='text-gray-600'>{knowledgeBase}</div>
            ) : (
              <div className='text-gray-400'>No knowledge base connected</div>
            )}
          </div>
        )}
      </div>

      {/* Memory visualization modal - rimane uguale */}
      {showMemory && (
        <AgentMemoryVisualization
          agentId={agentId}
          onClose={() => setShowMemory(false)}
        />
      )}
    </>
  );
});
