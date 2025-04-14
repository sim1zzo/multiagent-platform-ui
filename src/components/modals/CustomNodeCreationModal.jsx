// components/modals/CustomNodeCreationModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const CustomNodeCreationModal = ({
  isOpen,
  nodeType,
  initialData = {},
  onConfirm,
  onCancel,
}) => {
  // Base state for all node types
  const [nodeData, setNodeData] = useState({
    name: '',
    ...initialData,
  });

  // Reset form when node type changes
  useEffect(() => {
    setNodeData({
      name: initialData.name || '',
      ...initialData,
    });
  }, [initialData, nodeType]);

  // Safe update methods that don't rely on DOM direct access
  const updateName = (value) => {
    setNodeData((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const updateCondition = (value) => {
    setNodeData((prev) => ({
      ...prev,
      condition: value,
    }));
  };

  const updateTrueLabel = (value) => {
    setNodeData((prev) => ({
      ...prev,
      trueLabel: value,
    }));
  };

  const updateFalseLabel = (value) => {
    setNodeData((prev) => ({
      ...prev,
      falseLabel: value,
    }));
  };

  // Agent node specific state and handlers
  const [model, setModel] = useState(initialData.model || 'gpt-4');
  const [memory, setMemory] = useState(initialData.memory || 'chat-history');
  const [tools, setTools] = useState(initialData.tools || []);

  useEffect(() => {
    if (nodeType === 'agent') {
      setNodeData((prev) => ({
        ...prev,
        model,
        memory,
        tools,
      }));
    }
  }, [nodeType, model, memory, tools]);

  const toggleTool = (toolId) => {
    setTools((current) => {
      if (current.includes(toolId)) {
        return current.filter((id) => id !== toolId);
      } else {
        return [...current, toolId];
      }
    });
  };

  // Custom form renderer based on node type
  const renderForm = () => {
    if (!nodeType) return null;

    switch (nodeType) {
      case 'trigger':
        return renderTriggerForm();
      case 'agent':
        return renderAgentForm();
      case 'condition':
        return renderConditionForm();
      case 'action':
        return renderActionForm();
      default:
        return <div>Configuration options for {nodeType}</div>;
    }
  };

  // Trigger form renderer
  const renderTriggerForm = () => {
    const triggerTypes = [
      { id: 'api', label: 'API Call' },
      { id: 'chat', label: 'Chat Message' },
      { id: 'workflow', label: 'Workflow Activation' },
    ];

    return (
      <>
        <div className='mb-4'>
          <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Trigger Type
          </div>
          <div className='border border-gray-300 rounded-md p-0'>
            {triggerTypes.map((type) => (
              <div
                key={type.id}
                className={`px-3 py-2 cursor-pointer ${
                  nodeData.triggerType === type.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() =>
                  setNodeData((prev) => ({ ...prev, triggerType: type.id }))
                }
              >
                {type.label}
              </div>
            ))}
          </div>
        </div>

        <div className='mb-4'>
          <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Payload Schema
          </div>
          <textarea
            className='w-full p-2 border border-gray-300 rounded-md min-h-[100px] text-gray-800'
            value={nodeData.payload || ''}
            onChange={(e) =>
              setNodeData((prev) => ({
                ...prev,
                payload: e.target.value,
              }))
            }
            placeholder='Enter payload schema'
          />
        </div>
      </>
    );
  };

  // Agent form renderer
  const renderAgentForm = () => {
    const modelOptions = [
      { id: 'gpt-4', label: 'GPT-4' },
      { id: 'gpt-3.5', label: 'GPT-3.5' },
      { id: 'claude-3', label: 'Claude 3' },
      { id: 'llama-3', label: 'Llama 3' },
    ];

    const memoryOptions = [
      { id: 'chat-history', label: 'Chat History' },
      { id: 'vector-store', label: 'Vector Store' },
      { id: 'postgres', label: 'Postgres' },
      { id: 'redis', label: 'Redis' },
      { id: 'stateless', label: 'Stateless' },
    ];

    const toolOptions = [
      { id: 'rag', label: 'Retrieval Augmented Generation' },
      { id: 'web-search', label: 'Web Search' },
      { id: 'code-interpreter', label: 'Code Interpreter' },
      { id: 'api-connector', label: 'API Connector' },
    ];

    return (
      <>
        <div className='mb-4'>
          <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            AI Model
          </div>
          <div className='border border-gray-300 rounded-md'>
            {modelOptions.map((option) => (
              <div
                key={option.id}
                className={`px-3 py-2 cursor-pointer ${
                  model === option.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setModel(option.id)}
              >
                {option.label}
              </div>
            ))}
          </div>
          <div className='mt-1 text-xs text-gray-500 italic'>
            This will create a separate Model node connected to the Agent.
          </div>
        </div>

        <div className='mb-4'>
          <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Memory Type
          </div>
          <div className='border border-gray-300 rounded-md'>
            {memoryOptions.map((option) => (
              <div
                key={option.id}
                className={`px-3 py-2 cursor-pointer ${
                  memory === option.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setMemory(option.id)}
              >
                {option.label}
              </div>
            ))}
          </div>
          <div className='mt-1 text-xs text-gray-500 italic'>
            This will create a separate Memory node connected to the Agent.
          </div>
        </div>

        <div className='mb-4'>
          <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Tools
          </div>
          <div className='border border-gray-300 rounded-md p-2 space-y-2'>
            {toolOptions.map((tool) => (
              <div
                key={tool.id}
                className='flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded'
                onClick={() => toggleTool(tool.id)}
              >
                <div
                  className={`w-4 h-4 mr-2 border border-gray-300 rounded flex items-center justify-center ${
                    tools.includes(tool.id) ? 'bg-blue-500 border-blue-500' : ''
                  }`}
                >
                  {tools.includes(tool.id) && (
                    <svg
                      width='10'
                      height='10'
                      viewBox='0 0 10 10'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M8.5 2.5L4 7L1.5 4.5'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </div>
                <div className='text-sm'>{tool.label}</div>
              </div>
            ))}
          </div>
          <div className='mt-1 text-xs text-gray-500 italic'>
            Each selected tool will be created as a separate node connected to
            the Agent.
          </div>
        </div>
      </>
    );
  };

  // Condition form renderer
  const renderConditionForm = () => {
    return (
      <>
        <div className='mb-4'>
          <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Condition Expression
          </div>
          <textarea
            className='w-full p-2 border border-gray-300 rounded-md min-h-[100px] text-gray-800'
            value={nodeData.condition || ''}
            onChange={(e) => updateCondition(e.target.value)}
            placeholder="e.g., {{response.sentiment}} === 'positive'"
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              True Path Label
            </div>
            <input
              type='text'
              className='w-full p-2 border border-gray-300 rounded-md text-gray-800'
              value={nodeData.trueLabel || 'True'}
              onChange={(e) => updateTrueLabel(e.target.value)}
            />
          </div>

          <div>
            <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              False Path Label
            </div>
            <input
              type='text'
              className='w-full p-2 border border-gray-300 rounded-md text-gray-800'
              value={nodeData.falseLabel || 'False'}
              onChange={(e) => updateFalseLabel(e.target.value)}
            />
          </div>
        </div>
      </>
    );
  };

  // Action form renderer
  const renderActionForm = () => {
    const actionTypes = [
      { id: 'slack', label: 'Send Slack Message' },
      { id: 'jira', label: 'Create Jira Task' },
      { id: 'email', label: 'Send Email' },
      { id: 'code', label: 'Execute Code' },
    ];

    return (
      <>
        <div className='mb-4'>
          <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Action Type
          </div>
          <div className='border border-gray-300 rounded-md'>
            {actionTypes.map((type) => (
              <div
                key={type.id}
                className={`px-3 py-2 cursor-pointer ${
                  nodeData.actionType === type.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() =>
                  setNodeData((prev) => ({ ...prev, actionType: type.id }))
                }
              >
                {type.label}
              </div>
            ))}
          </div>
        </div>

        <div className='mb-4'>
          <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Configuration
          </div>
          <textarea
            className='w-full p-2 border border-gray-300 rounded-md min-h-[100px] text-gray-800'
            value={nodeData.config || ''}
            onChange={(e) =>
              setNodeData((prev) => ({
                ...prev,
                config: e.target.value,
              }))
            }
            placeholder='Add configuration details...'
          />
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md'>
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
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
            <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Node Name
            </div>
            <input
              type='text'
              className='w-full p-2 border border-gray-300 rounded-md text-gray-800'
              value={nodeData.name || ''}
              onChange={(e) => updateName(e.target.value)}
              placeholder='Enter node name...'
            />
          </div>

          {renderForm()}
        </div>

        <div className='flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 space-x-3'>
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
