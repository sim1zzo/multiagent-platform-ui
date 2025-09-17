// components/modals/CustomNodeCreationModal.jsx
import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

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

  // System Prompt specific state
  const [systemPrompt, setSystemPrompt] = useState(
    initialData.systemPrompt || ''
  );
  const [charCount, setCharCount] = useState(
    (initialData.systemPrompt || '').length
  );

  // Reset form when node type changes
  useEffect(() => {
    setNodeData({
      name: initialData.name || '',
      ...initialData,
    });
    setSystemPrompt(initialData.systemPrompt || '');
    setCharCount((initialData.systemPrompt || '').length);
  }, [initialData, nodeType]);

  // Agent node specific state and handlers
  const [model, setModel] = useState(initialData.model || 'gpt-5');
  const [memory, setMemory] = useState(initialData.memory || 'short-memory');
  const [tools, setTools] = useState(initialData.tools || []);

  useEffect(() => {
    if (nodeType === 'agent') {
      setNodeData((prev) => ({
        ...prev,
        model,
        memory,
        tools,
        systemPrompt,
      }));
    }
  }, [nodeType, model, memory, tools, systemPrompt]);

  const toggleTool = (toolId) => {
    setTools((current) => {
      if (current.includes(toolId)) {
        return current.filter((id) => id !== toolId);
      } else {
        return [...current, toolId];
      }
    });
  };

  const handleSystemPromptChange = (value) => {
    setSystemPrompt(value);
    setCharCount(value.length);
  };

  // Template insertion function
  const insertTemplate = (templateKey) => {
    const templates = {
      'customer-service': `You are a helpful and professional customer service assistant. Your goal is to:

• Provide excellent customer support with a friendly, empathetic tone
• Listen carefully to customer concerns and provide clear solutions
• Escalate complex issues to human agents when necessary
• Always maintain a positive attitude, even with frustrated customers
• Ask clarifying questions to better understand the customer's needs

Remember to be patient, understanding, and always put the customer's satisfaction first.`,

      'technical-support': `You are a technical support specialist with expertise in troubleshooting and problem-solving. Your responsibilities include:

• Diagnosing technical issues through systematic questioning
• Providing clear, step-by-step solutions that are easy to follow
• Explaining technical concepts in simple, understandable terms
• Documenting common issues and their resolutions
• Knowing when to escalate complex technical problems

Always be thorough in your analysis and patient in your explanations.`,

      'data-analyst': `You are a data analyst AI assistant specialized in data analysis and insights. Your role includes:

• Analyzing datasets to identify trends, patterns, and anomalies
• Creating clear visualizations and reports from complex data
• Providing actionable business insights and recommendations
• Explaining statistical concepts in business-friendly language
• Ensuring data accuracy and highlighting any limitations

Focus on delivering valuable insights that drive informed decision-making.`,

      'creative-writer': `You are a creative writing assistant with a flair for storytelling and content creation. Your expertise includes:

• Crafting engaging narratives, articles, and marketing copy
• Adapting writing style to match brand voice and target audience
• Generating creative ideas for content campaigns and stories
• Providing constructive feedback on writing drafts
• Ensuring content is original, compelling, and error-free

Always prioritize creativity while maintaining professional quality standards.`,
    };

    const template = templates[templateKey];
    if (template) {
      handleSystemPromptChange(template);
    }
  };

  // Handle confirm
  const handleConfirm = () => {
    onConfirm(nodeData);
  };

  if (!isOpen) return null;

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
      { id: 'jira', label: 'Jira' },
      { id: 'kafka', label: 'Kafka' },
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

  // Agent form renderer - UPDATED WITH SYSTEM PROMPT
  const renderAgentForm = () => {
    const modelOptions = [
      { id: 'gpt-5', label: 'GPT-5' },
      { id: 'gpt-4.5', label: 'GPT-4.5' },
      { id: 'claude-4', label: 'Claude 4' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    ];

    const memoryOptions = [
      { id: 'short-memory', label: 'Short Memory' },
      { id: 'long-memory', label: 'Long Memory' },
    ];

    const toolOptions = [
      { id: 'rag', label: 'Retrieval Augmented Generation' },
      { id: 'web-search', label: 'Web Search' },
      { id: 'code-interpreter', label: 'Code Interpreter' },
      { id: 'api-connector', label: 'API Connector' },
      { id: 'mongodb', label: 'MongoDB' },
    ];

    return (
      <>
        {/* AI Model Selection */}
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

        {/* SYSTEM PROMPT SECTION - NEW */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center'>
            <FileText className='w-4 h-4 mr-1' />
            System Prompt
          </label>
          <div className='relative'>
            <textarea
              value={systemPrompt}
              onChange={(e) => handleSystemPromptChange(e.target.value)}
              placeholder="Define the agent's role, personality, and instructions. For example: 'You are a helpful customer service assistant. Always be polite and professional when helping customers with their inquiries...'"
              rows={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none ${
                charCount > 2000
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }`}
            />
            <div
              className={`absolute bottom-2 right-2 text-xs ${
                charCount > 2000 ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {charCount} / 2000
            </div>
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            This prompt defines how your agent will behave and respond to users.
          </p>

          {/* Quick Prompt Templates */}
          <div className='mt-2'>
            <p className='text-xs font-medium text-gray-600 mb-1'>
              Quick Templates:
            </p>
            <div className='flex flex-wrap gap-1'>
              <button
                type='button'
                onClick={() => insertTemplate('customer-service')}
                className='px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors'
              >
                Customer Service
              </button>
              <button
                type='button'
                onClick={() => insertTemplate('technical-support')}
                className='px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors'
              >
                Technical Support
              </button>
              <button
                type='button'
                onClick={() => insertTemplate('data-analyst')}
                className='px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors'
              >
                Data Analyst
              </button>
              <button
                type='button'
                onClick={() => insertTemplate('creative-writer')}
                className='px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors'
              >
                Creative Writer
              </button>
            </div>
          </div>
        </div>

        {/* Memory Type Selection */}
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

        {/* Tools Selection */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Tools
          </label>
          <div className='space-y-2 border border-gray-300 rounded-md p-2'>
            {toolOptions.map((tool) => (
              <div key={tool.id} className='flex items-center'>
                <div
                  className='flex items-center cursor-pointer w-full py-1 px-1 hover:bg-gray-50'
                  onClick={() => toggleTool(tool.id)}
                >
                  {/* Custom checkbox appearance */}
                  <div className='mr-2 h-4 w-4 flex items-center justify-center border border-gray-300 rounded'>
                    {tools.includes(tool.id) && (
                      <div className='h-2 w-2 bg-blue-600 rounded-sm'></div>
                    )}
                  </div>
                  <span className='text-sm text-gray-700'>{tool.label}</span>
                </div>
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
            className='w-full p-2 border border-gray-300 rounded-md min-h-[80px]'
            value={nodeData.condition || ''}
            onChange={(e) =>
              setNodeData((prev) => ({
                ...prev,
                condition: e.target.value,
              }))
            }
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
              className='w-full p-2 border border-gray-300 rounded-md'
              value={nodeData.trueLabel || 'True'}
              onChange={(e) =>
                setNodeData((prev) => ({
                  ...prev,
                  trueLabel: e.target.value,
                }))
              }
              placeholder='True'
            />
          </div>

          <div>
            <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              False Path Label
            </div>
            <input
              type='text'
              className='w-full p-2 border border-gray-300 rounded-md'
              value={nodeData.falseLabel || 'False'}
              onChange={(e) =>
                setNodeData((prev) => ({
                  ...prev,
                  falseLabel: e.target.value,
                }))
              }
              placeholder='False'
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
            className='w-full p-2 border border-gray-300 rounded-md min-h-[100px]'
            value={nodeData.config || ''}
            onChange={(e) =>
              setNodeData((prev) => ({
                ...prev,
                config: e.target.value,
              }))
            }
            placeholder='Configuration details and parameters'
          />
        </div>
      </>
    );
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            Configure{' '}
            {nodeType
              ? nodeType.charAt(0).toUpperCase() + nodeType.slice(1)
              : ''}{' '}
            Node
          </h2>
          <button
            onClick={onCancel}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={24} />
          </button>
        </div>

        {/* Name Field - Always Present */}
        <div className='mb-4'>
          <div className='block text-sm font-medium text-gray-700 mb-1'>
            Node Name
          </div>
          <input
            type='text'
            className='w-full p-2 border border-gray-300 rounded-md'
            value={nodeData.name}
            onChange={(e) =>
              setNodeData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder='Enter node name...'
          />
        </div>

        {/* Dynamic Form Content */}
        {renderForm()}

        {/* Footer */}
        <div className='flex justify-end space-x-3 mt-6'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
          >
            Create Node
          </button>
        </div>
      </div>
    </div>
  );
};
