// components/modals/NodeCreationModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TriggerNodeConfig = ({ data, onChange }) => {
  const [triggerType, setTriggerType] = useState(data.triggerType || 'api');

  useEffect(() => {
    onChange({ ...data, triggerType });
  }, [triggerType]);

  return (
    <div className='space-y-4'>
      <div>
        <label
          htmlFor='triggerType'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Trigger Type
        </label>
        <select
          id='triggerType'
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded-md'
        >
          <option value='api'>API Call</option>
          <option value='chat'>Chat Message</option>
          <option value='workflow'>Workflow Activation</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='payload'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Payload Schema
        </label>
        <textarea
          id='payload'
          value={data.payload || ''}
          onChange={(e) => onChange({ ...data, payload: e.target.value })}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder='Define payload schema here...'
        />
      </div>
    </div>
  );
};

const AgentNodeConfig = ({ data, onChange }) => {
  const [model, setModel] = useState(data.model || 'gpt-4');
  const [memory, setMemory] = useState(data.memory || 'chat-history');
  const [tools, setTools] = useState(data.tools || []);

  const availableTools = [
    { id: 'rag', name: 'Retrieval Augmented Generation' },
    { id: 'web-search', name: 'Web Search' },
    { id: 'code-interpreter', name: 'Code Interpreter' },
    { id: 'api-connector', name: 'API Connector' },
  ];

  useEffect(() => {
    onChange({ ...data, model, memory, tools });
  }, [model, memory, tools]);

  const handleToolToggle = (toolId) => {
    if (tools.includes(toolId)) {
      setTools(tools.filter((id) => id !== toolId));
    } else {
      setTools([...tools, toolId]);
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <label
          htmlFor='model'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          AI Model
        </label>
        <select
          id='model'
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded-md'
        >
          <option value='gpt-4'>GPT-4</option>
          <option value='gpt-3.5'>GPT-3.5</option>
          <option value='claude-3'>Claude 3</option>
          <option value='llama-3'>Llama 3</option>
        </select>
        <div className='mt-1 text-xs text-gray-500 italic'>
          This will create a separate Model node connected to the Agent.
        </div>
      </div>

      <div>
        <label
          htmlFor='memory'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Memory Type
        </label>
        <select
          id='memory'
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded-md'
        >
          <option value='chat-history'>Chat History</option>
          <option value='vector-store'>Vector Store</option>
          <option value='postgres'>Postgres</option>
          <option value='redis'>Redis</option>
          <option value='stateless'>Stateless</option>
        </select>
        <div className='mt-1 text-xs text-gray-500 italic'>
          This will create a separate Memory node connected to the Agent.
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Tools
        </label>
        <div className='space-y-2 border border-gray-300 rounded-md p-2'>
          {availableTools.map((tool) => (
            <div key={tool.id} className='flex items-center'>
              <input
                type='checkbox'
                id={`tool-${tool.id}`}
                checked={tools.includes(tool.id)}
                onChange={() => handleToolToggle(tool.id)}
                className='mr-2'
              />
              <label
                htmlFor={`tool-${tool.id}`}
                className='text-sm text-gray-700'
              >
                {tool.name}
              </label>
            </div>
          ))}
        </div>
        <div className='mt-1 text-xs text-gray-500 italic'>
          Each selected tool will be created as a separate node connected to the Agent.
        </div>
      </div>
    </div>
  );
};

const ConditionNodeConfig = ({ data, onChange }) => {
  return (
    <div className='space-y-4'>
      <div>
        <label
          htmlFor='condition'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Condition Expression
        </label>
        <textarea
          id='condition'
          value={data.condition || ''}
          onChange={(e) => onChange({ ...data, condition: e.target.value })}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder="e.g., {{response.sentiment}} === 'positive'"
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label
            htmlFor='trueLabel'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            True Path Label
          </label>
          <input
            type='text'
            id='trueLabel'
            value={data.trueLabel || 'True'}
            onChange={(e) => onChange({ ...data, trueLabel: e.target.value })}
            className='w-full p-2 border border-gray-300 rounded-md'
          />
        </div>

        <div>
          <label
            htmlFor='falseLabel'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            False Path Label
          </label>
          <input
            type='text'
            id='falseLabel'
            value={data.falseLabel || 'False'}
            onChange={(e) => onChange({ ...data, falseLabel: e.target.value })}
            className='w-full p-2 border border-gray-300 rounded-md'
          />
        </div>
      </div>
    </div>
  );
};

const ActionNodeConfig = ({ data, onChange }) => {
  const [actionType, setActionType] = useState(data.actionType || 'slack');

  useEffect(() => {
    onChange({ ...data, actionType });
  }, [actionType]);

  return (
    <div className='space-y-4'>
      <div>
        <label
          htmlFor='actionType'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Action Type
        </label>
        <select
          id='actionType'
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded-md'
        >
          <option value='slack'>Send Slack Message</option>
          <option value='jira'>Create Jira Task</option>
          <option value='email'>Send Email</option>
          <option value='code'>Execute Code</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='config'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Configuration
        </label>
        <textarea
          id='config'
          value={data.config || ''}
          onChange={(e) => onChange({ ...data, config: e.target.value })}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder='Add configuration details...'
        />
      </div>
    </div>
  );
};

const ToolNodeConfig = ({ data, onChange }) => {
  const [toolType, setToolType] = useState(data.toolType || 'api');

  useEffect(() => {
    onChange({ ...data, toolType });
  }, [toolType]);

  return (
    <div className='space-y-4'>
      <div>
        <label
          htmlFor='toolType'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Tool Type
        </label>
        <select
          id='toolType'
          value={toolType}
          onChange={(e) => setToolType(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded-md'
        >
          <option value='api'>API Connector</option>
          <option value='scraper'>Web Scraper</option>
          <option value='database'>Database Connector</option>
          <option value='file'>File Processor</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='config'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Configuration
        </label>
        <textarea
          id='config'
          value={data.config || ''}
          onChange={(e) => onChange({ ...data, config: e.target.value })}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder='Add configuration details...'
        />
      </div>
    </div>
  );
};

const ModelNodeConfig = ({ data, onChange }) => {
  const [modelType, setModelType] = useState(data.modelType || 'gpt-4');

  useEffect(() => {
    onChange({ ...data, modelType });
  }, [modelType]);

  return (
    <div className='space-y-4'>
      <div>
        <label
          htmlFor='modelType'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Model Type
        </label>
        <select
          id='modelType'
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded-md'
        >
          <option value='gpt-4'>GPT-4</option>
          <option value='gpt-3.5'>GPT-3.5</option>
          <option value='claude-3'>Claude 3</option>
          <option value='llama-3'>Llama 3</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='config'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Configuration
        </label>
        <textarea
          id='config'
          value={data.config || ''}
          onChange={(e) => onChange({ ...data, config: e.target.value })}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder='Add configuration details...'
        />
      </div>
    </div>
  );
};

const MemoryNodeConfig = ({ data, onChange }) => {
  const [memoryType, setMemoryType] = useState(data.memoryType || 'chat-history');

  useEffect(() => {
    onChange({ ...data, memoryType });
  }, [memoryType]);

  return (
    <div className='space-y-4'>
      <div>
        <label
          htmlFor='memoryType'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Memory Type
        </label>
        <select
          id='memoryType'
          value={memoryType}
          onChange={(e) => setMemoryType(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded-md'
        >
          <option value='chat-history'>Chat History</option>
          <option value='vector-store'>Vector Store</option>
          <option value='postgres'>Postgres</option>
          <option value='redis'>Redis</option>
          <option value='stateless'>Stateless</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='config'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Configuration
        </label>
        <textarea
          id='config'
          value={data.config || ''}
          onChange={(e) => onChange({ ...data, config: e.target.value })}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder='Add configuration details...'
        />
      </div>
    </div>
  );
};

export const NodeCreationModal = ({
  isOpen,
  nodeType,
  initialData = {},
  onConfirm,
  onCancel,
}) => {
  const [nodeData, setNodeData] = useState({
    name: initialData.name || '',
    ...initialData,
  });

  useEffect(() => {
    setNodeData({
      name: initialData.name || '',
      ...initialData,
    });
  }, [initialData, nodeType]);

  if (!isOpen) return null;

  const renderConfigForm = () => {
    switch (nodeType) {
      case 'trigger':
        return <TriggerNodeConfig data={nodeData} onChange={setNodeData} />;
      case 'agent':
        return <AgentNodeConfig data={nodeData} onChange={setNodeData} />;
      case 'condition':
        return <ConditionNodeConfig data={nodeData} onChange={setNodeData} />;
      case 'action':
        return <ActionNodeConfig data={nodeData} onChange={setNodeData} />;
      case 'tool':
        return <ToolNodeConfig data={nodeData} onChange={setNodeData} />;
      case 'model':
        return <ModelNodeConfig data={nodeData} onChange={setNodeData} />;
      case 'memory':
        return <MemoryNodeConfig data={nodeData} onChange={setNodeData} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium'>
            Configure {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}{' '}
            Node
          </h2>
          <button
            className='text-gray-500 hover:text-gray-700'
            onClick={onCancel}
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-4'>
          <div className='mb-4'>
            <label
              htmlFor='nodeName'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Node Name
            </label>
            <input
              type='text'
              id='nodeName'
              value={nodeData.name}
              onChange={(e) =>
                setNodeData({ ...nodeData, name: e.target.value })
              }
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Enter node name...'
            />
          </div>

          {renderConfigForm()}
        </div>

        <div className='flex justify-end p-4 border-t border-gray-200'>
          <button
            type='button'
            className='px-4 py-2 mr-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type='button'
            className='px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700'
            onClick={() => onConfirm(nodeData)}
          >
            Create Node
          </button>
        </div>
      </div>
    </div>
  );
};