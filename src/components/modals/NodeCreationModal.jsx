// components/modals/NodeCreationModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const TriggerNodeConfig = ({ data, onChange }) => {
  const [triggerType, setTriggerType] = useState(data?.triggerType || 'api');
  const [payload, setPayload] = useState(data?.payload || '');

  useEffect(() => {
    if (onChange) {
      onChange({ ...data, triggerType, payload });
    }
  }, [triggerType, payload, data, onChange]);

  const handleTriggerTypeChange = (e) => {
    if (e && e.target) {
      setTriggerType(e.target.value);
    }
  };

  const handlePayloadChange = (e) => {
    if (e && e.target) {
      setPayload(e.target.value);
    }
  };

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
          onChange={handleTriggerTypeChange}
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
          value={payload}
          onChange={handlePayloadChange}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder='Define payload schema here...'
        />
      </div>
    </div>
  );
};

const AgentNodeConfig = ({ data, onChange }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4');
  const [memory, setMemory] = useState(data?.memory || 'chat-history');
  const [tools, setTools] = useState(data?.tools || []);

  const availableTools = [
    { id: 'rag', name: 'Retrieval Augmented Generation' },
    { id: 'web-search', name: 'Web Search' },
    { id: 'code-interpreter', name: 'Code Interpreter' },
    { id: 'api-connector', name: 'API Connector' },
  ];

  useEffect(() => {
    if (onChange) {
      onChange({ ...data, model, memory, tools });
    }
  }, [model, memory, tools, data, onChange]);

  const handleModelChange = (e) => {
    if (e && e.target) {
      setModel(e.target.value);
    }
  };

  const handleMemoryChange = (e) => {
    if (e && e.target) {
      setMemory(e.target.value);
    }
  };

  // Simple tool toggle function without using the event object
  const handleToolToggle = (toolId) => {
    setTools((currentTools) => {
      if (currentTools.includes(toolId)) {
        return currentTools.filter((id) => id !== toolId);
      } else {
        return [...currentTools, toolId];
      }
    });
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
          onChange={handleModelChange}
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
          onChange={handleMemoryChange}
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
              {/* Simple div click handler instead of checkbox */}
              <div
                className='flex items-center cursor-pointer w-full py-1 px-1 hover:bg-gray-50'
                onClick={() => handleToolToggle(tool.id)}
              >
                {/* Custom checkbox appearance */}
                <div className='mr-2 h-4 w-4 flex items-center justify-center border border-gray-300 rounded'>
                  {tools.includes(tool.id) && (
                    <div className='h-2 w-2 bg-blue-600 rounded-sm'></div>
                  )}
                </div>
                <span className='text-sm text-gray-700'>{tool.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className='mt-1 text-xs text-gray-500 italic'>
          Each selected tool will be created as a separate node connected to the
          Agent.
        </div>
      </div>
    </div>
  );
};

const ConditionNodeConfig = ({ data, onChange }) => {
  // Add local state to manage form values
  const [condition, setCondition] = useState(data?.condition || '');
  const [trueLabel, setTrueLabel] = useState(data?.trueLabel || 'True');
  const [falseLabel, setFalseLabel] = useState(data?.falseLabel || 'False');

  // Update parent when state changes
  useEffect(() => {
    if (onChange) {
      onChange({
        ...data,
        condition,
        trueLabel,
        falseLabel,
      });
    }
  }, [condition, trueLabel, falseLabel, data, onChange]);

  // Safe event handlers with validation
  const handleConditionChange = (e) => {
    if (e && e.target) {
      setCondition(e.target.value);
    }
  };

  const handleTrueLabelChange = (e) => {
    if (e && e.target) {
      setTrueLabel(e.target.value);
    }
  };

  const handleFalseLabelChange = (e) => {
    if (e && e.target) {
      setFalseLabel(e.target.value);
    }
  };

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
          value={condition}
          onChange={handleConditionChange}
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
            value={trueLabel}
            onChange={handleTrueLabelChange}
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
            value={falseLabel}
            onChange={handleFalseLabelChange}
            className='w-full p-2 border border-gray-300 rounded-md'
          />
        </div>
      </div>
    </div>
  );
};

const ActionNodeConfig = ({ data, onChange }) => {
  const [actionType, setActionType] = useState(data?.actionType || 'slack');
  const [config, setConfig] = useState(data?.config || '');

  useEffect(() => {
    if (onChange) {
      onChange({ ...data, actionType, config });
    }
  }, [actionType, config, data, onChange]);

  const handleActionTypeChange = (e) => {
    if (e && e.target) {
      setActionType(e.target.value);
    }
  };

  const handleConfigChange = (e) => {
    if (e && e.target) {
      setConfig(e.target.value);
    }
  };

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
          onChange={handleActionTypeChange}
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
          value={config}
          onChange={handleConfigChange}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder='Add configuration details...'
        />
      </div>
    </div>
  );
};

const ToolNodeConfig = ({ data, onChange }) => {
  const [toolType, setToolType] = useState(data?.toolType || 'api');
  const [config, setConfig] = useState(data?.config || '');

  useEffect(() => {
    if (onChange) {
      onChange({ ...data, toolType, config });
    }
  }, [toolType, config, data, onChange]);

  const handleToolTypeChange = (e) => {
    if (e && e.target) {
      setToolType(e.target.value);
    }
  };

  const handleConfigChange = (e) => {
    if (e && e.target) {
      setConfig(e.target.value);
    }
  };

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
          onChange={handleToolTypeChange}
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
          value={config}
          onChange={handleConfigChange}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder='Add configuration details...'
        />
      </div>
    </div>
  );
};

const ModelNodeConfig = ({ data, onChange }) => {
  const [modelType, setModelType] = useState(data?.modelType || 'gpt-4');
  const [config, setConfig] = useState(data?.config || '');

  useEffect(() => {
    if (onChange) {
      onChange({ ...data, modelType, config });
    }
  }, [modelType, config, data, onChange]);

  const handleModelTypeChange = (e) => {
    if (e && e.target) {
      setModelType(e.target.value);
    }
  };

  const handleConfigChange = (e) => {
    if (e && e.target) {
      setConfig(e.target.value);
    }
  };

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
          onChange={handleModelTypeChange}
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
          value={config}
          onChange={handleConfigChange}
          className='w-full p-2 border border-gray-300 rounded-md'
          rows={4}
          placeholder='Add configuration details...'
        />
      </div>
    </div>
  );
};

const MemoryNodeConfig = ({ data, onChange }) => {
  const [memoryType, setMemoryType] = useState(
    data?.memoryType || 'chat-history'
  );
  const [config, setConfig] = useState(data?.config || '');

  useEffect(() => {
    if (onChange) {
      onChange({ ...data, memoryType, config });
    }
  }, [memoryType, config, data, onChange]);

  const handleMemoryTypeChange = (e) => {
    if (e && e.target) {
      setMemoryType(e.target.value);
    }
  };

  const handleConfigChange = (e) => {
    if (e && e.target) {
      setConfig(e.target.value);
    }
  };

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
          onChange={handleMemoryTypeChange}
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
          value={config}
          onChange={handleConfigChange}
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

  // Reset the form when nodeType or initialData changes
  useEffect(() => {
    setNodeData({
      name: initialData.name || '',
      ...initialData,
    });
  }, [initialData, nodeType]);

  // Safe update function for node data
  const updateNodeData = useCallback((data) => {
    if (data) {
      setNodeData((prevData) => ({
        ...prevData,
        ...data,
      }));
    }
  }, []);

  // Handle name change safely
  const handleNameChange = (e) => {
    // Ensure we have a valid event with a target
    if (e && e.target && e.target.value !== undefined) {
      // Use functional state update to ensure we have the latest state
      setNodeData((prevData) => ({
        ...prevData,
        name: e.target.value,
      }));
    }
  };

  if (!isOpen) return null;

  // Render the appropriate config form for the node type
  const renderConfigForm = () => {
    // Make sure nodeType is valid before rendering
    if (!nodeType) {
      return <div>No node type specified</div>;
    }

    switch (nodeType) {
      case 'trigger':
        return <TriggerNodeConfig data={nodeData} onChange={updateNodeData} />;
      case 'agent':
        return <AgentNodeConfig data={nodeData} onChange={updateNodeData} />;
      case 'condition':
        return (
          <ConditionNodeConfig data={nodeData} onChange={updateNodeData} />
        );
      case 'action':
        return <ActionNodeConfig data={nodeData} onChange={updateNodeData} />;
      case 'tool':
        return <ToolNodeConfig data={nodeData} onChange={updateNodeData} />;
      case 'model':
        return <ModelNodeConfig data={nodeData} onChange={updateNodeData} />;
      case 'memory':
        return <MemoryNodeConfig data={nodeData} onChange={updateNodeData} />;
      default:
        console.warn(`Unknown node type: ${nodeType}`);
        return <div>Unknown node type: {nodeType}</div>;
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium'>
            Configure{' '}
            {nodeType && nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}{' '}
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
              name='nodeName'
              value={nodeData.name}
              onChange={handleNameChange}
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Enter node name...'
              autoComplete='off'
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
            onClick={() => {
              if (onConfirm) {
                onConfirm(nodeData);
              }
            }}
          >
            Create Node
          </button>
        </div>
      </div>
    </div>
  );
};
