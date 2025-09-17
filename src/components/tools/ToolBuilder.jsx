// src/components/tools/ToolBuilder.jsx - Fixed and cleaned version
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code,
  Play,
  Save,
  XCircle,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Database,
  Globe,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const toolTypes = {
  api: {
    name: 'API Tool',
    icon: Globe,
    color: 'text-blue-600',
    description: 'Makes HTTP requests to external APIs',
    template: `function apiTool(params) {
  const { url, method = 'GET', headers = {}, body } = params;
  
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })
  .then(response => response.json())
  .catch(error => {
    throw new Error(\`API call failed: \${error.message}\`);
  });
}`,
    parameters: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'API endpoint URL',
      },
      {
        name: 'method',
        type: 'string',
        required: false,
        description: 'HTTP method',
        default: 'GET',
      },
      {
        name: 'headers',
        type: 'object',
        required: false,
        description: 'Request headers',
      },
      {
        name: 'body',
        type: 'object',
        required: false,
        description: 'Request body',
      },
    ],
  },
  python: {
    name: 'Python Script',
    icon: Code,
    color: 'text-green-600',
    description: 'Executes Python code with custom logic',
    template: `def python_tool(**kwargs):
    """
    Python tool template
    """
    # Your Python code here
    result = "Hello from Python!"
    
    return {
        "success": True,
        "result": result,
        "data": kwargs
    }`,
    parameters: [
      {
        name: 'input_data',
        type: 'any',
        required: true,
        description: 'Input data for processing',
      },
    ],
  },
  javascript: {
    name: 'JavaScript Function',
    icon: Code,
    color: 'text-yellow-600',
    description: 'Custom JavaScript function',
    template: `function javascriptTool(params) {
  // Your JavaScript code here
  const { input } = params;
  
  const result = \`Processed: \${input}\`;
  
  return {
    success: true,
    result: result,
    timestamp: new Date().toISOString()
  };
}`,
    parameters: [
      {
        name: 'input',
        type: 'string',
        required: true,
        description: 'Input to process',
      },
    ],
  },
  sql: {
    name: 'SQL Query',
    icon: Database,
    color: 'text-purple-600',
    description: 'Database query tool',
    template: `-- SQL Query Template
SELECT 
    column1,
    column2,
    COUNT(*) as count
FROM table_name 
WHERE condition = ?
GROUP BY column1, column2
ORDER BY count DESC
LIMIT 100;`,
    parameters: [
      {
        name: 'connection',
        type: 'string',
        required: true,
        description: 'Database connection string',
      },
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'SQL query to execute',
      },
      {
        name: 'parameters',
        type: 'array',
        required: false,
        description: 'Query parameters',
      },
    ],
  },
};

export const ToolBuilder = ({ tool, onSave, onCancel, mode = 'create' }) => {
  const { settings } = useApp();
  const darkMode = settings.appearance.darkMode;

  // Tool configuration states
  const [selectedType, setSelectedType] = useState(tool?.type || 'api');
  const [toolName, setToolName] = useState(tool?.name || '');
  const [toolDescription, setToolDescription] = useState(
    tool?.description || ''
  );
  const [toolCode, setToolCode] = useState(
    tool?.code || toolTypes[tool?.type || 'api'].template
  );
  const [toolCategory, setToolCategory] = useState(
    tool?.category || 'Utilities'
  );
  const [toolTags, setToolTags] = useState(tool?.tags || []);
  const [parameters, setParameters] = useState(
    tool?.parameters || toolTypes[tool?.type || 'api'].parameters
  );
  const [documentation, setDocumentation] = useState(tool?.documentation || '');

  // UI States
  const [activeTab, setActiveTab] = useState('code');
  const [testResult, setTestResult] = useState(null);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testParameters, setTestParameters] = useState(
    JSON.stringify(
      {
        input: 'test data',
        options: { format: 'json' },
      },
      null,
      2
    )
  );
  const [expandedSections, setExpandedSections] = useState({
    parameters: true,
    settings: false,
  });
  const [newTag, setNewTag] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  // Handle type change
  const handleTypeChange = (type) => {
    if (selectedType !== type) {
      setSelectedType(type);
      setToolCode(toolTypes[type].template);
      setParameters([...toolTypes[type].parameters]);
      setValidationErrors([]);
    }
  };

  // Tag management
  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !toolTags.includes(trimmedTag)) {
      setToolTags([...toolTags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setToolTags(toolTags.filter((tag) => tag !== tagToRemove));
  };

  // Parameter management
  const addParameter = () => {
    const newParam = {
      name: `param_${parameters.length + 1}`,
      type: 'string',
      required: false,
      description: 'Parameter description',
    };
    setParameters([...parameters, newParam]);
  };

  const updateParameter = (index, field, value) => {
    const updatedParams = parameters.map((param, i) =>
      i === index ? { ...param, [field]: value } : param
    );
    setParameters(updatedParams);
  };

  const removeParameter = (index) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  // Section toggle
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Validation
  const validateTool = () => {
    const errors = [];

    if (!toolName.trim()) {
      errors.push('Tool name is required');
    }

    if (!toolDescription.trim()) {
      errors.push('Tool description is required');
    }

    if (!toolCode.trim()) {
      errors.push('Tool code cannot be empty');
    }

    // Validate parameters
    parameters.forEach((param, index) => {
      if (!param.name.trim()) {
        errors.push(`Parameter ${index + 1} name is required`);
      }
      if (!param.description.trim()) {
        errors.push(`Parameter ${index + 1} description is required`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Test tool
  const testTool = async () => {
    setIsTestRunning(true);
    setTestResult(null);

    try {
      // Parse test parameters
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(testParameters);
      } catch (parseError) {
        throw new Error('Invalid JSON in test parameters');
      }

      // Simulate tool execution
      await new Promise((resolve) =>
        setTimeout(resolve, 1500 + Math.random() * 1000)
      );

      // Mock successful result
      setTestResult({
        success: true,
        message: 'Tool executed successfully!',
        output: {
          result: `Tool '${toolName}' processed successfully`,
          parameters: parsedParams,
          timestamp: new Date().toISOString(),
          executionTime: Math.round(1000 + Math.random() * 2000) + 'ms',
        },
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Tool execution failed',
        error: error.message,
      });
    } finally {
      setIsTestRunning(false);
    }
  };

  // Generate documentation
  const generateDocumentation = () => {
    const doc = `# ${toolName || 'Tool Name'}

## Description
${toolDescription || 'Tool description goes here'}

## Category
${toolCategory}

## Parameters
${parameters
  .map(
    (p) =>
      `- **${p.name}** (${p.type}${
        p.required ? ', required' : ', optional'
      }): ${p.description}`
  )
  .join('\n')}

## Usage Example
\`\`\`javascript
// Example usage for ${selectedType} tool
${
  selectedType === 'javascript'
    ? 'const result = ' + toolName + '({ /* parameters */ });'
    : selectedType === 'python'
    ? 'result = ' + toolName + '(**params)'
    : selectedType === 'sql'
    ? '-- Execute the query with your database connection'
    : 'const response = await ' + toolName + '({ /* API parameters */ });'
}
\`\`\`

## Return Format
The tool returns a structured response:
\`\`\`json
{
  "success": boolean,
  "result": any,
  "error": string
}
\`\`\`

## Tags
${toolTags.join(', ')}

## Version
1.0.0

---
*Generated automatically on ${new Date().toISOString().split('T')[0]}*`;

    setDocumentation(doc);
  };

  // Save tool
  const handleSave = () => {
    if (!validateTool()) {
      return;
    }

    const toolData = {
      id: tool?.id || `tool-${Date.now()}`,
      name: toolName.trim(),
      description: toolDescription.trim(),
      type: selectedType,
      category: toolCategory,
      tags: toolTags,
      code: toolCode,
      parameters: parameters,
      documentation: documentation || generateDocumentation(),
      version: tool?.version || '1.0.0',
      author: 'Current User',
      created: tool?.created || new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      isActive: tool?.isActive ?? true,
      isFavorite: tool?.isFavorite || false,
      usageCount: tool?.usageCount || 0,
    };

    onSave(toolData);
  };

  const currentType = toolTypes[selectedType];
  const IconComponent = currentType.icon;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col'>
        {/* Header */}
        <div className='p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div
              className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${currentType.color}`}
            >
              <IconComponent className='w-6 h-6' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                {mode === 'create'
                  ? 'Create New Tool'
                  : `Edit ${toolName || 'Tool'}`}
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {currentType.description}
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={testTool}
              disabled={isTestRunning || !toolName.trim()}
              className='flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-md transition-colors'
            >
              {isTestRunning ? (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
              ) : (
                <Play className='w-4 h-4 mr-2' />
              )}
              Test
            </button>
            <button
              onClick={handleSave}
              disabled={validationErrors.length > 0}
              className='flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-md transition-colors'
            >
              <Save className='w-4 h-4 mr-2' />
              {mode === 'create' ? 'Create' : 'Save'}
            </button>
            <button
              onClick={onCancel}
              className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 transition-colors'
              title='Cancel and close'
            >
              <XCircle className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className='px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800'>
            <div className='flex items-start space-x-2'>
              <AlertTriangle className='w-5 h-5 text-red-600 dark:text-red-400 mt-0.5' />
              <div>
                <h4 className='text-sm font-medium text-red-800 dark:text-red-200'>
                  Please fix the following errors:
                </h4>
                <ul className='mt-1 text-sm text-red-700 dark:text-red-300 list-disc list-inside'>
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className='flex-1 flex overflow-hidden'>
          {/* Left Panel - Configuration */}
          <div className='w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto'>
            <div className='p-6 space-y-6'>
              {/* Basic Info */}
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Basic Information
                </h3>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Tool Type *
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      {Object.entries(toolTypes).map(([key, type]) => (
                        <option key={key} value={key}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Name *
                    </label>
                    <input
                      type='text'
                      value={toolName}
                      onChange={(e) => setToolName(e.target.value)}
                      placeholder='Enter tool name'
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Description *
                    </label>
                    <textarea
                      value={toolDescription}
                      onChange={(e) => setToolDescription(e.target.value)}
                      placeholder='Describe what this tool does'
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Category
                    </label>
                    <select
                      value={toolCategory}
                      onChange={(e) => setToolCategory(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='Data Collection'>Data Collection</option>
                      <option value='Database'>Database</option>
                      <option value='AI/ML'>AI/ML</option>
                      <option value='Utilities'>Utilities</option>
                      <option value='Communication'>Communication</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className='text-md font-medium text-gray-900 dark:text-white mb-2'>
                  Tags
                </h4>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {toolTags.map((tag) => (
                    <span
                      key={tag}
                      className='inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className='ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
                        title='Remove tag'
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className='flex space-x-2'>
                  <input
                    type='text'
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder='Add tag'
                    className='flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500'
                  />
                  <button
                    onClick={addTag}
                    disabled={!newTag.trim()}
                    className='px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-md text-sm transition-colors'
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Parameters */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='text-md font-medium text-gray-900 dark:text-white'>
                    Parameters ({parameters.length})
                  </h4>
                  <button
                    onClick={() => toggleSection('parameters')}
                    className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                  >
                    {expandedSections.parameters ? (
                      <ChevronUp className='w-4 h-4' />
                    ) : (
                      <ChevronDown className='w-4 h-4' />
                    )}
                  </button>
                </div>

                {expandedSections.parameters && (
                  <div className='space-y-3'>
                    {parameters.map((param, index) => (
                      <div
                        key={index}
                        className='p-3 border border-gray-200 dark:border-gray-700 rounded-md'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <input
                            type='text'
                            value={param.name}
                            onChange={(e) =>
                              updateParameter(index, 'name', e.target.value)
                            }
                            className='text-sm font-medium bg-transparent border-none p-0 text-gray-900 dark:text-white focus:outline-none flex-1'
                            placeholder='Parameter name'
                          />
                          <button
                            onClick={() => removeParameter(index)}
                            className='text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs transition-colors ml-2'
                            title='Remove parameter'
                          >
                            <Minus className='w-3 h-3' />
                          </button>
                        </div>

                        <div className='grid grid-cols-2 gap-2 mb-2'>
                          <select
                            value={param.type}
                            onChange={(e) =>
                              updateParameter(index, 'type', e.target.value)
                            }
                            className='text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none'
                          >
                            <option value='string'>String</option>
                            <option value='number'>Number</option>
                            <option value='boolean'>Boolean</option>
                            <option value='object'>Object</option>
                            <option value='array'>Array</option>
                            <option value='any'>Any</option>
                          </select>

                          <label className='flex items-center text-xs'>
                            <input
                              type='checkbox'
                              checked={param.required}
                              onChange={(e) =>
                                updateParameter(
                                  index,
                                  'required',
                                  e.target.checked
                                )
                              }
                              className='mr-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                            />
                            Required
                          </label>
                        </div>

                        <textarea
                          value={param.description}
                          onChange={(e) =>
                            updateParameter(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                          placeholder='Parameter description'
                          rows={2}
                          className='w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none'
                        />
                      </div>
                    ))}

                    <button
                      onClick={addParameter}
                      className='w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500'
                    >
                      <Plus className='w-4 h-4 mx-auto mb-1' />
                      Add Parameter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className='flex-1 flex flex-col'>
            {/* Tabs */}
            <div className='border-b border-gray-200 dark:border-gray-700'>
              <nav className='flex px-6'>
                {['code', 'test', 'docs'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className='flex-1 overflow-hidden'>
              {activeTab === 'code' && (
                <div className='h-full p-6'>
                  <div className='h-full'>
                    <textarea
                      value={toolCode}
                      onChange={(e) => setToolCode(e.target.value)}
                      className='w-full h-full p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Enter your code here...'
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'test' && (
                <div className='h-full p-6 overflow-y-auto'>
                  <div className='space-y-4 h-full'>
                    <div>
                      <h4 className='text-md font-medium text-gray-900 dark:text-white mb-2'>
                        Test Parameters
                      </h4>
                      <textarea
                        value={testParameters}
                        onChange={(e) => setTestParameters(e.target.value)}
                        placeholder='Enter test parameters in JSON format...'
                        rows={8}
                        className='w-full p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>

                    {testResult && (
                      <div
                        className={`p-4 rounded-md ${
                          testResult.success
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}
                      >
                        <div className='flex items-center mb-2'>
                          <CheckCircle
                            className={`w-5 h-5 mr-2 ${
                              testResult.success
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          />
                          <h5
                            className={`font-medium ${
                              testResult.success
                                ? 'text-green-800 dark:text-green-200'
                                : 'text-red-800 dark:text-red-200'
                            }`}
                          >
                            {testResult.message}
                          </h5>
                        </div>

                        {testResult.output && (
                          <pre
                            className={`text-sm p-3 rounded mt-2 overflow-x-auto ${
                              testResult.success
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-100'
                                : 'bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100'
                            }`}
                          >
                            {JSON.stringify(testResult.output, null, 2)}
                          </pre>
                        )}

                        {testResult.error && (
                          <div className='text-red-600 dark:text-red-400 text-sm mt-2 font-mono bg-red-100 dark:bg-red-900/40 p-2 rounded'>
                            {testResult.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className='h-full p-6 flex flex-col'>
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className='text-md font-medium text-gray-900 dark:text-white'>
                      Tool Documentation
                    </h4>
                    <button
                      onClick={generateDocumentation}
                      className='px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors'
                    >
                      Auto-generate
                    </button>
                  </div>
                  <textarea
                    value={documentation}
                    onChange={(e) => setDocumentation(e.target.value)}
                    placeholder='Document your tool usage, examples, and best practices...'
                    className='flex-1 p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    spellCheck={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
