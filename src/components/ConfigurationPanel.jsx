// components/ConfigurationPanel.jsx
import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

// Trigger Node Configuration
const TriggerNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    triggerType: 'api',
    payload: '',
  });

  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        triggerType: node.triggerType || 'api',
        payload: node.payload || '',
      });
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <div className='mb-6'>
        <h3 className='text-sm font-medium text-gray-700 mb-3'>
          Trigger Configuration
        </h3>

        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formState.name}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded-md'
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='triggerType'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Trigger Type
          </label>
          <select
            id='triggerType'
            name='triggerType'
            value={formState.triggerType}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded-md'
          >
            <option value='api'>API Call</option>
            <option value='chat'>Jira</option>
            <option value='kafka'>Kafka</option>
          </select>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='payload'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Payload Schema
          </label>
          <textarea
            id='payload'
            name='payload'
            value={formState.payload}
            onChange={handleChange}
            rows={4}
            className='w-full p-2 border border-gray-300 rounded-md'
          />
        </div>
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700'
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

// Agent Node Configuration
const AgentNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    instructions: '',
    systemPrompt: '',
    role: 'thinker',
    model: 'gpt-5',
    memoryType: 'short-memory',
    tools: [],
  });

  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        instructions: node.instructions || '',
        systemPrompt: node.systemPrompt || '',
        role: node.role || 'thinker',
        model: node.model || 'gpt-5',
        memoryType: node.memoryType || 'short-memory',
        tools: node.tools || [],
      });
      setCharCount((node.systemPrompt || '').length);
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    if (name === 'systemPrompt') {
      setCharCount(value.length);
    }
  };

  const handleToolToggle = (toolId) => {
    setFormState((prevState) => {
      const currentTools = [...prevState.tools];
      if (currentTools.includes(toolId)) {
        return {
          ...prevState,
          tools: currentTools.filter((id) => id !== toolId),
        };
      } else {
        return {
          ...prevState,
          tools: [...currentTools, toolId],
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

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
      setFormState((prevState) => ({
        ...prevState,
        systemPrompt: template,
      }));
      setCharCount(template.length);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <div className='mb-6'>
        <h3 className='text-sm font-medium text-gray-700 mb-3'>
          Agent Configuration
        </h3>

        {/* Nome Agent */}
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formState.name}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Enter agent name...'
          />
        </div>

        {/* Role Selection */}
        <div className='mb-4'>
          <label
            htmlFor='role'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Agent Role
          </label>
          <select
            id='role'
            name='role'
            value={formState.role}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value='thinker'>Thinker</option>
            <option value='communicator'>Communicator</option>
            <option value='explorer'>Explorer</option>
            <option value='planner'>Planner</option>
            <option value='executor'>Executor</option>
            <option value='storage'>Storage</option>
          </select>
        </div>

        {/* Model Selection */}
        <div className='mb-4'>
          <label
            htmlFor='model'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            AI Model
          </label>
          <select
            id='model'
            name='model'
            value={formState.model}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value='gpt-5'>GPT-5</option>
            <option value='gpt-4.5'>GPT-4.5</option>
            <option value='claude-4'>Claude 4</option>
            <option value='gemini-2.5-pro'>Gemini 2.5 Pro</option>
          </select>
        </div>

        {/* System Prompt */}
        <div className='mb-4'>
          <label
            htmlFor='systemPrompt'
            className='block text-sm font-medium text-gray-700 mb-2 flex items-center'
          >
            <FileText className='w-4 h-4 mr-1' />
            System Prompt
          </label>
          <div className='relative'>
            <textarea
              id='systemPrompt'
              name='systemPrompt'
              value={formState.systemPrompt}
              onChange={handleChange}
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

        {/* Memory Type */}
        <div className='mb-4'>
          <label
            htmlFor='memoryType'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Memory Type
          </label>
          <select
            id='memoryType'
            name='memoryType'
            value={formState.memoryType}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value='short-memory'>Short Memory</option>
            <option value='long-memory'>Long Memory</option>
            <option value='no-memory'>No Memory</option>
          </select>
          <p className='text-xs text-gray-500 mt-1'>
            This will create a separate Memory node connected to the Agent.
          </p>
        </div>

        {/* Tools Section */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Tools
          </label>
          <div className='space-y-2'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={formState.tools.includes('rag')}
                onChange={() => handleToolToggle('rag')}
                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='ml-2 text-sm text-gray-700'>
                Retrieval Augmented Generation
              </span>
            </label>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={formState.tools.includes('web-search')}
                onChange={() => handleToolToggle('web-search')}
                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='ml-2 text-sm text-gray-700'>Web Search</span>
            </label>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={formState.tools.includes('code-interpreter')}
                onChange={() => handleToolToggle('code-interpreter')}
                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='ml-2 text-sm text-gray-700'>
                Code Interpreter
              </span>
            </label>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={formState.tools.includes('api-connector')}
                onChange={() => handleToolToggle('api-connector')}
                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='ml-2 text-sm text-gray-700'>API Connector</span>
            </label>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={formState.tools.includes('mongodb')}
                onChange={() => handleToolToggle('mongodb')}
                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='ml-2 text-sm text-gray-700'>MongoDB</span>
            </label>
          </div>
          <p className='text-xs text-gray-500 mt-2'>
            Each selected tool will be created as a separate node connected to
            the Agent.
          </p>
        </div>

        {/* Legacy Instructions Field */}
        <div className='mb-4'>
          <label
            htmlFor='instructions'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Agent Instructions (Legacy)
          </label>
          <textarea
            id='instructions'
            name='instructions'
            value={formState.instructions}
            onChange={handleChange}
            rows={4}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Instructions for the AI agent...'
          />
          <p className='text-xs text-gray-500 mt-1'>
            This field is deprecated. Use System Prompt instead.
          </p>
        </div>

        {/* Connected Components Info */}
        <div className='mb-4'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Connected Components
          </h4>
          <div className='text-xs text-gray-500 mb-2'>
            The Agent uses Model, Memory, and Tool nodes that are connected to
            it.
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='bg-blue-50 p-2 rounded'>
              <div className='font-medium text-blue-700'>
                Model: {formState.model}
              </div>
              <div className='text-xs text-blue-600'>
                Model will be created automatically and connected to this Agent.
              </div>
            </div>
            <div className='bg-teal-50 p-2 rounded'>
              <div className='font-medium text-teal-700'>
                Memory: {formState.memoryType.replace('-', ' ')}
              </div>
              <div className='text-xs text-teal-600'>
                Memory will be created automatically and connected to this
                Agent.
              </div>
            </div>
            <div className='bg-yellow-50 p-2 rounded'>
              <div className='font-medium text-yellow-700'>
                Tools: {formState.tools.length} selected
              </div>
              <div className='text-xs text-yellow-600'>
                {formState.tools.length > 0
                  ? `Selected: ${formState.tools.join(', ')}`
                  : 'No tools selected'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors'
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

// Altri form components (semplificati per evitare errori)
const ConditionNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    condition: '',
    trueLabel: 'True',
    falseLabel: 'False',
  });

  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        condition: node.condition || '',
        trueLabel: node.trueLabel || 'True',
        falseLabel: node.falseLabel || 'False',
      });
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <h3 className='text-sm font-medium text-gray-700 mb-3'>
        Condition Configuration
      </h3>
      <div className='mb-4'>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formState.name}
          onChange={handleChange}
          className='w-full p-2 border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const ActionNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    actionType: 'slack',
    config: '',
  });

  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        actionType: node.actionType || 'slack',
        config: node.config || '',
      });
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <h3 className='text-sm font-medium text-gray-700 mb-3'>
        Action Configuration
      </h3>
      <div className='mb-4'>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formState.name}
          onChange={handleChange}
          className='w-full p-2 border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const ToolNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    toolType: 'api',
    config: '',
  });

  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        toolType: node.toolType || 'api',
        config: node.config || '',
      });
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <h3 className='text-sm font-medium text-gray-700 mb-3'>
        Tool Configuration
      </h3>
      <div className='mb-4'>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formState.name}
          onChange={handleChange}
          className='w-full p-2 border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const ModelNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    modelType: 'gpt-4',
    config: '',
  });

  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        modelType: node.modelType || 'gpt-4',
        config: node.config || '',
      });
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <h3 className='text-sm font-medium text-gray-700 mb-3'>
        Model Configuration
      </h3>
      <div className='mb-4'>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formState.name}
          onChange={handleChange}
          className='w-full p-2 border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const MemoryNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    memoryType: 'chat-history',
    config: '',
  });

  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        memoryType: node.memoryType || 'chat-history',
        config: node.config || '',
      });
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <h3 className='text-sm font-medium text-gray-700 mb-3'>
        Memory Configuration
      </h3>
      <div className='mb-4'>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formState.name}
          onChange={handleChange}
          className='w-full p-2 border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

// Router component
const NodeConfigForm = ({ node, onUpdate }) => {
  if (!node) return null;

  switch (node.type) {
    case 'trigger':
      return <TriggerNodeForm node={node} onUpdate={onUpdate} />;
    case 'agent':
      return <AgentNodeForm node={node} onUpdate={onUpdate} />;
    case 'condition':
      return <ConditionNodeForm node={node} onUpdate={onUpdate} />;
    case 'action':
      return <ActionNodeForm node={node} onUpdate={onUpdate} />;
    case 'tool':
      return <ToolNodeForm node={node} onUpdate={onUpdate} />;
    case 'model':
      return <ModelNodeForm node={node} onUpdate={onUpdate} />;
    case 'memory':
      return <MemoryNodeForm node={node} onUpdate={onUpdate} />;
    default:
      return <div>Unknown node type: {node.type}</div>;
  }
};

// Main component
export const ConfigurationPanel = ({ node, onUpdate, onClose }) => {
  if (!node) return null;

  return (
    <div className='w-80 h-full border-l border-gray-200 bg-white overflow-y-auto'>
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        <h2 className='text-lg font-medium'>Node Configuration</h2>
        <button className='text-gray-500 hover:text-gray-700' onClick={onClose}>
          <X className='w-5 h-5' />
        </button>
      </div>
      <NodeConfigForm node={node} onUpdate={onUpdate} />
    </div>
  );
};
