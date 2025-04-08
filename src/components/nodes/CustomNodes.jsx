// components/nodes/CustomNodes.jsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import {
  Zap,
  Bot,
  GitBranch,
  Activity,
  Database,
  Cpu,
  X,
  Wrench, // Replaced 'Tool' with 'Wrench' that is available in lucide-react
} from 'lucide-react';

// Base Node UI Component
const BaseNode = ({
  icon,
  label,
  color,
  children,
  onSelect,
  onDelete,
  isSelected,
}) => {
  return (
    <div
      className={`px-4 py-2 rounded-md shadow-md border ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      style={{ backgroundColor: color, minWidth: '180px' }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className='flex items-center justify-between pb-1 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center'>
          {icon}
          <span className='ml-2 font-medium text-gray-800 dark:text-white'>
            {label}
          </span>
        </div>
        <button
          className='text-gray-400 hover:text-red-500 transition-colors'
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X size={16} />
        </button>
      </div>
      {children}
    </div>
  );
};

// Trigger Node
export const TriggerNode = ({ data }) => {
  return (
    <>
      <Handle type='source' position={Position.Right} id='default' />

      <BaseNode
        icon={<Zap size={18} className='text-red-500' />}
        label={data.name || 'Trigger'}
        color='white'
        onSelect={data.onSelect}
        onDelete={data.onDelete}
        isSelected={data.isSelected}
      >
        <div className='mt-2 text-xs text-gray-500'>
          Type: {data.triggerType || 'API'}
        </div>
      </BaseNode>
    </>
  );
};

// Agent Node
export const AgentNode = ({ data }) => {
  return (
    <>
      <Handle type='target' position={Position.Left} id='default' />
      <Handle
        type='target'
        position={Position.Bottom}
        id='model'
        style={{ left: '30%', bottom: 0 }}
      />
      <Handle
        type='target'
        position={Position.Bottom}
        id='memory'
        style={{ left: '50%', bottom: 0 }}
      />
      <Handle
        type='target'
        position={Position.Bottom}
        id='tool'
        style={{ left: '70%', bottom: 0 }}
      />
      <Handle type='source' position={Position.Right} id='default' />

      <BaseNode
        icon={<Bot size={18} className='text-blue-500' />}
        label={data.name || 'Agent'}
        color='white'
        onSelect={data.onSelect}
        onDelete={data.onDelete}
        isSelected={data.isSelected}
      >
        <div className='mt-2 grid grid-cols-3 gap-1 text-center text-xs'>
          <div className='px-1 py-0.5 bg-blue-100 rounded text-blue-700'>
            Model
          </div>
          <div className='px-1 py-0.5 bg-teal-100 rounded text-teal-700'>
            Memory
          </div>
          <div className='px-1 py-0.5 bg-yellow-100 rounded text-yellow-700'>
            Tools
          </div>
        </div>
      </BaseNode>
    </>
  );
};

// Condition Node
export const ConditionNode = ({ data }) => {
  return (
    <>
      <Handle type='target' position={Position.Left} id='default' />
      <Handle
        type='source'
        position={Position.Right}
        id='true'
        style={{ top: '30%' }}
      />
      <Handle
        type='source'
        position={Position.Right}
        id='false'
        style={{ top: '70%' }}
      />

      <BaseNode
        icon={<GitBranch size={18} className='text-purple-500' />}
        label={data.name || 'Condition'}
        color='white'
        onSelect={data.onSelect}
        onDelete={data.onDelete}
        isSelected={data.isSelected}
      >
        <div className='mt-2 text-xs text-gray-500'>
          <div className='mb-1'>
            {data.condition || 'Define a condition...'}
          </div>
          <div className='grid grid-cols-2 gap-2 mt-2'>
            <div className='bg-green-100 text-green-700 px-2 py-1 rounded text-center'>
              {data.trueLabel || 'True'}
            </div>
            <div className='bg-red-100 text-red-700 px-2 py-1 rounded text-center'>
              {data.falseLabel || 'False'}
            </div>
          </div>
        </div>
      </BaseNode>
    </>
  );
};

// Action Node
export const ActionNode = ({ data }) => {
  return (
    <>
      <Handle type='target' position={Position.Left} id='default' />
      <Handle type='source' position={Position.Right} id='default' />

      <BaseNode
        icon={<Activity size={18} className='text-green-500' />}
        label={data.name || 'Action'}
        color='white'
        onSelect={data.onSelect}
        onDelete={data.onDelete}
        isSelected={data.isSelected}
      >
        <div className='mt-2 text-xs text-gray-500'>
          Type: {data.actionType || 'Slack Message'}
        </div>
      </BaseNode>
    </>
  );
};

// Tool Node
export const ToolNode = ({ data }) => {
  return (
    <>
      <Handle type='source' position={Position.Top} id='output' />

      <BaseNode
        icon={<Wrench size={18} className='text-yellow-500' />}
        label={data.name || 'Tool'}
        color='white'
        onSelect={data.onSelect}
        onDelete={data.onDelete}
        isSelected={data.isSelected}
      >
        <div className='mt-2 text-xs text-gray-500'>
          Type: {data.toolType || 'API Connector'}
        </div>
      </BaseNode>
    </>
  );
};

// Model Node
export const ModelNode = ({ data }) => {
  return (
    <>
      <Handle type='source' position={Position.Top} id='output' />

      <BaseNode
        icon={<Cpu size={18} className='text-sky-500' />}
        label={data.name || 'Model'}
        color='white'
        onSelect={data.onSelect}
        onDelete={data.onDelete}
        isSelected={data.isSelected}
      >
        <div className='mt-2 text-xs text-gray-500'>
          Type: {data.modelType || 'GPT-4'}
        </div>
      </BaseNode>
    </>
  );
};

// Memory Node
export const MemoryNode = ({ data }) => {
  return (
    <>
      <Handle type='source' position={Position.Top} id='output' />

      <BaseNode
        icon={<Database size={18} className='text-teal-500' />}
        label={data.name || 'Memory'}
        color='white'
        onSelect={data.onSelect}
        onDelete={data.onDelete}
        isSelected={data.isSelected}
      >
        <div className='mt-2 text-xs text-gray-500'>
          Type: {data.memoryType || 'Chat History'}
        </div>
      </BaseNode>
    </>
  );
};
