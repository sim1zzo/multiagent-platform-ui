// components/nodes/CustomNodes.jsx
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import {
  Power,
  Brain,
  GitBranch,
  Play,
  Wrench,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const NodeCard = ({ children, className = '', onDelete, ...props }) => {
  return (
    <div
      className={`relative rounded-lg border bg-white shadow-sm ${className}`}
      {...props}
    >
      <button
        className='absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors'
        onClick={(e) => {
          e.stopPropagation();
          onDelete && onDelete();
        }}
      >
        <Trash2 className='w-4 h-4' />
      </button>
      {children}
    </div>
  );
};

export const TriggerNode = memo(({ data, isConnectable }) => {
  const [expanded, setExpanded] = React.useState(false);

  const { name, triggerType = 'api', onDelete, isSelected } = data;

  const getTriggerTypeLabel = (type) => {
    switch (type) {
      case 'api':
        return 'API Call';
      case 'chat':
        return 'Chat Message';
      case 'workflow':
        return 'Workflow Activation';
      default:
        return 'Unknown Trigger';
    }
  };

  return (
    <NodeCard
      className={`w-48 ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
      onDelete={onDelete}
    >
      <Handle
        type='source'
        position={Position.Bottom}
        className='w-3 h-3 bg-red-500'
        isConnectable={isConnectable}
      />

      <div className='flex items-center p-2 rounded-t-lg bg-red-500 text-white'>
        <Power className='w-4 h-4 mr-2' />
        <div className='flex-1 font-medium truncate'>{name}</div>
      </div>

      <div className='p-2 text-sm'>
        <div className='text-gray-600'>
          Type: {getTriggerTypeLabel(triggerType)}
        </div>

        <button
          className='flex items-center text-xs text-blue-500 mt-1'
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
      </div>

      {expanded && (
        <div className='p-2 border-t border-gray-200 text-xs'>
          <div className='mb-1 font-medium'>Configuration:</div>
          <div className='text-gray-600'>
            Trigger Type: {getTriggerTypeLabel(triggerType)}
          </div>
          {data.payload && (
            <div className='mt-1'>
              <div className='font-medium'>Payload Schema:</div>
              <div className='text-gray-600 whitespace-pre-wrap overflow-hidden max-h-20'>
                {data.payload}
              </div>
            </div>
          )}
        </div>
      )}
    </NodeCard>
  );
});

export const AgentNode = memo(({ data, isConnectable }) => {
  const [expanded, setExpanded] = React.useState(false);

  const {
    name,
    model = 'gpt-4',
    memory = 'chat-history',
    tools = [],
    onDelete,
    isSelected,
  } = data;

  const getModelLabel = (modelId) => {
    switch (modelId) {
      case 'gpt-4':
        return 'GPT-4';
      case 'gpt-3.5':
        return 'GPT-3.5';
      case 'claude-3':
        return 'Claude 3';
      case 'llama-3':
        return 'Llama 3';
      default:
        return modelId;
    }
  };

  const getMemoryLabel = (memoryType) => {
    switch (memoryType) {
      case 'chat-history':
        return 'Chat History';
      case 'vector-store':
        return 'Vector Store';
      case 'stateless':
        return 'Stateless';
      default:
        return memoryType;
    }
  };

  const getToolLabel = (toolId) => {
    switch (toolId) {
      case 'rag':
        return 'RAG';
      case 'web-search':
        return 'Web Search';
      case 'code-interpreter':
        return 'Code Interpreter';
      case 'api-connector':
        return 'API Connector';
      default:
        return toolId;
    }
  };

  return (
    <NodeCard
      className={`w-48 ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
      onDelete={onDelete}
    >
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

      <div className='flex items-center p-2 rounded-t-lg bg-blue-500 text-white'>
        <Brain className='w-4 h-4 mr-2' />
        <div className='flex-1 font-medium truncate'>{name}</div>
      </div>

      <div className='p-2 text-sm'>
        <div className='text-gray-600'>Model: {getModelLabel(model)}</div>
        <div className='text-gray-600'>Memory: {getMemoryLabel(memory)}</div>

        <button
          className='flex items-center text-xs text-blue-500 mt-1'
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
      </div>

      {expanded && (
        <div className='p-2 border-t border-gray-200 text-xs'>
          <div className='mb-1 font-medium'>Tools:</div>
          {tools.length > 0 ? (
            <ul className='text-gray-600'>
              {tools.map((tool) => (
                <li key={tool}>{getToolLabel(tool)}</li>
              ))}
            </ul>
          ) : (
            <div className='text-gray-400'>No tools configured</div>
          )}
        </div>
      )}
    </NodeCard>
  );
});

export const ConditionNode = memo(({ data, isConnectable }) => {
  const [expanded, setExpanded] = React.useState(false);

  const {
    name,
    condition = '',
    trueLabel = 'True',
    falseLabel = 'False',
    onDelete,
    isSelected,
  } = data;

  return (
    <NodeCard
      className={`w-48 ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
      onDelete={onDelete}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='w-3 h-3 bg-purple-500'
        isConnectable={isConnectable}
      />
      <Handle
        id='true'
        type='source'
        position={Position.Bottom}
        className='left-1/3 -translate-x-1/2 w-3 h-3 bg-green-500'
        isConnectable={isConnectable}
      />
      <Handle
        id='false'
        type='source'
        position={Position.Bottom}
        className='left-2/3 -translate-x-1/2 w-3 h-3 bg-red-500'
        isConnectable={isConnectable}
      />

      <div className='flex items-center p-2 rounded-t-lg bg-purple-500 text-white'>
        <GitBranch className='w-4 h-4 mr-2' />
        <div className='flex-1 font-medium truncate'>{name}</div>
      </div>

      <div className='p-2 text-sm'>
        <div className='text-gray-600'>Condition Node</div>

        <button
          className='flex items-center text-xs text-blue-500 mt-1'
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
      </div>

      {expanded && (
        <div className='p-2 border-t border-gray-200 text-xs'>
          <div className='mb-1 font-medium'>Expression:</div>
          <div className='text-gray-600 whitespace-pre-wrap'>{condition}</div>

          <div className='mt-2 flex justify-between'>
            <div className='text-green-600'>{trueLabel}</div>
            <div className='text-red-600'>{falseLabel}</div>
          </div>
        </div>
      )}
    </NodeCard>
  );
});

export const ActionNode = memo(({ data, isConnectable }) => {
  const [expanded, setExpanded] = React.useState(false);

  const {
    name,
    actionType = 'slack',
    config = '',
    onDelete,
    isSelected,
  } = data;

  const getActionTypeLabel = (type) => {
    switch (type) {
      case 'slack':
        return 'Slack Message';
      case 'jira':
        return 'Jira Task';
      case 'email':
        return 'Email';
      case 'code':
        return 'Execute Code';
      default:
        return type;
    }
  };

  return (
    <NodeCard
      className={`w-48 ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
      onDelete={onDelete}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='w-3 h-3 bg-green-500'
        isConnectable={isConnectable}
      />
      <Handle
        type='source'
        position={Position.Bottom}
        className='w-3 h-3 bg-green-500'
        isConnectable={isConnectable}
      />

      <div className='flex items-center p-2 rounded-t-lg bg-green-500 text-white'>
        <Play className='w-4 h-4 mr-2' />
        <div className='flex-1 font-medium truncate'>{name}</div>
      </div>

      <div className='p-2 text-sm'>
        <div className='text-gray-600'>
          Type: {getActionTypeLabel(actionType)}
        </div>

        <button
          className='flex items-center text-xs text-blue-500 mt-1'
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
      </div>

      {expanded && (
        <div className='p-2 border-t border-gray-200 text-xs'>
          <div className='mb-1 font-medium'>Configuration:</div>
          <div className='text-gray-600 whitespace-pre-wrap overflow-hidden max-h-20'>
            {config}
          </div>
        </div>
      )}
    </NodeCard>
  );
});

export const ToolNode = memo(({ data, isConnectable }) => {
  const [expanded, setExpanded] = React.useState(false);

  const { name, toolType = 'api', config = '', onDelete, isSelected } = data;

  const getToolTypeLabel = (type) => {
    switch (type) {
      case 'api':
        return 'API Connector';
      case 'scraper':
        return 'Web Scraper';
      case 'database':
        return 'Database Connector';
      case 'file':
        return 'File Processor';
      default:
        return type;
    }
  };

  return (
    <NodeCard
      className={`w-48 ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
      onDelete={onDelete}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='w-3 h-3 bg-yellow-500'
        isConnectable={isConnectable}
      />
      <Handle
        type='source'
        position={Position.Bottom}
        className='w-3 h-3 bg-yellow-500'
        isConnectable={isConnectable}
      />

      <div className='flex items-center p-2 rounded-t-lg bg-yellow-500 text-white'>
        <Wrench className='w-4 h-4 mr-2' />
        <div className='flex-1 font-medium truncate'>{name}</div>
      </div>

      <div className='p-2 text-sm'>
        <div className='text-gray-600'>Type: {getToolTypeLabel(toolType)}</div>

        <button
          className='flex items-center text-xs text-blue-500 mt-1'
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
      </div>

      {expanded && (
        <div className='p-2 border-t border-gray-200 text-xs'>
          <div className='mb-1 font-medium'>Configuration:</div>
          <div className='text-gray-600 whitespace-pre-wrap overflow-hidden max-h-20'>
            {config}
          </div>
        </div>
      )}
    </NodeCard>
  );
});
