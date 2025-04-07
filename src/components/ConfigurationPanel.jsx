// components/ConfigurationPanel.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

// Shared component for different node type configurations
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
    default:
      return <div>Unknown node type: {node.type}</div>;
  }
};

// Trigger Node Configuration
const TriggerNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    triggerType: 'api',
    payload: '',
  });

  // Initialize form with node data
  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        triggerType: node.triggerType || 'api',
        payload: node.payload || '',
      });
    }
  }, [node]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission
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
            <option value='chat'>Chat Message</option>
            <option value='workflow'>Workflow Activation</option>
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
    model: 'gpt-4',
    memory: 'chat-history',
  });

  // Initialize form with node data
  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        model: node.model || 'gpt-4',
        memory: node.memory || 'chat-history',
      });
    }
  }, [node]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <div className='mb-6'>
        <h3 className='text-sm font-medium text-gray-700 mb-3'>
          Agent Configuration
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
            className='w-full p-2 border border-gray-300 rounded-md'
          >
            <option value='gpt-4'>GPT-4</option>
            <option value='gpt-3.5'>GPT-3.5</option>
            <option value='claude-3'>Claude 3</option>
            <option value='llama-3'>Llama 3</option>
          </select>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='memory'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Memory Type
          </label>
          <select
            id='memory'
            name='memory'
            value={formState.memory}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded-md'
          >
            <option value='chat-history'>Chat History</option>
            <option value='vector-store'>Vector Store</option>
            <option value='stateless'>Stateless</option>
          </select>
        </div>

        <div className='mb-4'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Connected Tools
          </h4>
          <div className='border border-gray-300 rounded-md p-2 space-y-2 max-h-40 overflow-y-auto'>
            {/* This section would list connected tools, but we don't have access
                to the edges/nodes here. You could pass this info as props or use context. */}
            <div className='text-gray-500 text-sm italic'>
              Tool nodes are managed separately. You can connect tool nodes to
              this agent by dragging connections in the workflow editor.
            </div>
          </div>
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

// Condition Node Configuration
const ConditionNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    condition: '',
    trueLabel: 'True',
    falseLabel: 'False',
  });

  // Initialize form with node data
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <div className='mb-6'>
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

        <div className='mb-4'>
          <label
            htmlFor='condition'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Condition Expression
          </label>
          <textarea
            id='condition'
            name='condition'
            value={formState.condition}
            onChange={handleChange}
            rows={4}
            className='w-full p-2 border border-gray-300 rounded-md'
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
              name='trueLabel'
              value={formState.trueLabel}
              onChange={handleChange}
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
              name='falseLabel'
              value={formState.falseLabel}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-md'
            />
          </div>
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

// Action Node Configuration
const ActionNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    actionType: 'slack',
    config: '',
  });

  // Initialize form with node data
  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        actionType: node.actionType || 'slack',
        config: node.config || '',
      });
    }
  }, [node]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <div className='mb-6'>
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

        <div className='mb-4'>
          <label
            htmlFor='actionType'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Action Type
          </label>
          <select
            id='actionType'
            name='actionType'
            value={formState.actionType}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded-md'
          >
            <option value='slack'>Send Slack Message</option>
            <option value='jira'>Create Jira Task</option>
            <option value='email'>Send Email</option>
            <option value='code'>Execute Code</option>
          </select>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='config'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Configuration
          </label>
          <textarea
            id='config'
            name='config'
            value={formState.config}
            onChange={handleChange}
            rows={4}
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder='Configuration details and parameters'
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

// Tool Node Configuration
const ToolNodeForm = ({ node, onUpdate }) => {
  const [formState, setFormState] = useState({
    name: '',
    toolType: 'api',
    config: '',
  });

  // Initialize form with node data
  useEffect(() => {
    if (node) {
      setFormState({
        name: node.name || '',
        toolType: node.toolType || 'api',
        config: node.config || '',
      });
    }
  }, [node]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <div className='mb-6'>
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

        <div className='mb-4'>
          <label
            htmlFor='toolType'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Tool Type
          </label>
          <select
            id='toolType'
            name='toolType'
            value={formState.toolType}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded-md'
          >
            <option value='api'>API Connector</option>
            <option value='scraper'>Web Scraper</option>
            <option value='database'>Database Connector</option>
            <option value='file'>File Processor</option>
            <option value='rag'>Retrieval Augmented Generation</option>
            <option value='web-search'>Web Search</option>
            <option value='code-interpreter'>Code Interpreter</option>
          </select>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='config'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Configuration
          </label>
          <textarea
            id='config'
            name='config'
            value={formState.config}
            onChange={handleChange}
            rows={4}
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder='Tool configuration details'
          />
        </div>

        <div className='text-xs text-gray-500 italic mb-2'>
          Note: This tool must be connected to an AI Agent node to function
          properly.
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
