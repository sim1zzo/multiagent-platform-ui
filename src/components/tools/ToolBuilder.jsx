// src/components/tools/ToolBuilder.jsx - Enhanced version
import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Play,
  Plus,
  Minus,
  Code,
  Settings,
  Tag,
  User,
  Calendar,
  Info,
  Wrench,
  Star,
  StarOff,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const ToolBuilder = ({ tool, mode = 'create', onSave, onCancel }) => {
  // Form states
  const [toolName, setToolName] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [toolCategory, setToolCategory] = useState('General');
  const [toolType, setToolType] = useState('Function');
  const [toolAuthor, setToolAuthor] = useState('User');
  const [toolVersion, setToolVersion] = useState('1.0.0');
  const [toolCode, setToolCode] = useState('');
  const [toolTags, setToolTags] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // UI states
  const [activeTab, setActiveTab] = useState('general');
  const [expandedSections, setExpandedSections] = useState({
    parameters: true,
    code: false,
    advanced: false,
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testParameters, setTestParameters] = useState('{}');
  const [showPreview, setShowPreview] = useState(false);

  // Predefined categories and types
  const categories = [
    'General',
    'Information',
    'Utilities',
    'Development',
    'Data Collection',
    'Database',
    'AI/ML',
    'Communication',
    'Integration',
    'Automation',
  ];

  const types = ['Function', 'API', 'SQL', 'Python', 'JavaScript'];

  const parameterTypes = ['string', 'number', 'boolean', 'object', 'array'];

  // Initialize form when tool prop changes
  useEffect(() => {
    if (tool && mode === 'edit') {
      setToolName(tool.name || '');
      setToolDescription(tool.description || '');
      setToolCategory(tool.category || 'General');
      setToolType(tool.type || 'Function');
      setToolAuthor(tool.author || 'User');
      setToolVersion(tool.version || '1.0.0');
      setToolCode(tool.code || '');
      setToolTags(tool.tags || []);
      setIsActive(tool.isActive !== undefined ? tool.isActive : true);
      setIsFavorite(tool.isFavorite || false);

      // Convert parameters object to array format
      if (tool.parameters) {
        const paramArray = Object.entries(tool.parameters).map(
          ([key, value]) => ({
            name: key,
            type: value.type || 'string',
            required: value.required || false,
            description: value.description || '',
            defaultValue: value.default || '',
          })
        );
        setParameters(paramArray);
      }
    } else {
      // Reset form for create mode
      resetForm();
    }
  }, [tool, mode]);

  const resetForm = () => {
    setToolName('');
    setToolDescription('');
    setToolCategory('General');
    setToolType('Function');
    setToolAuthor('User');
    setToolVersion('1.0.0');
    setToolCode('');
    setToolTags([]);
    setParameters([]);
    setIsActive(true);
    setIsFavorite(false);
    setValidationErrors([]);
    setTestResult(null);
  };

  // Tag management
  const addTag = (tagText) => {
    if (tagText.trim() && !toolTags.includes(tagText.trim().toLowerCase())) {
      setToolTags([...toolTags, tagText.trim().toLowerCase()]);
    }
  };

  const removeTag = (indexToRemove) => {
    setToolTags(toolTags.filter((_, index) => index !== indexToRemove));
  };

  // Parameter management
  const addParameter = () => {
    setParameters([
      ...parameters,
      {
        name: '',
        type: 'string',
        required: false,
        description: '',
        defaultValue: '',
      },
    ]);
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

    // Validate parameters
    parameters.forEach((param, index) => {
      if (!param.name.trim()) {
        errors.push(`Parameter ${index + 1} name is required`);
      }
      if (!param.description.trim()) {
        errors.push(`Parameter ${index + 1} description is required`);
      }
    });

    // Code validation for JavaScript tools
    if (toolType === 'JavaScript' && toolCode.trim()) {
      try {
        new Function(toolCode);
      } catch (syntaxError) {
        errors.push(`JavaScript syntax error: ${syntaxError.message}`);
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Test tool functionality
  const testTool = async () => {
    if (!validateTool()) return;

    setIsTestRunning(true);
    setTestResult(null);

    try {
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

  // Save tool
  const handleSave = () => {
    if (!validateTool()) {
      setActiveTab('general');
      return;
    }

    // Convert parameters array back to object format
    const parametersObj = {};
    parameters.forEach((param) => {
      parametersObj[param.name] = {
        type: param.type,
        required: param.required,
        description: param.description,
        ...(param.defaultValue && { default: param.defaultValue }),
      };
    });

    const toolData = {
      name: toolName,
      description: toolDescription,
      category: toolCategory,
      type: toolType,
      author: toolAuthor,
      version: toolVersion,
      code: toolCode,
      tags: toolTags,
      parameters: parametersObj,
      isActive,
      isFavorite,
    };

    onSave(toolData);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'parameters', name: 'Parameters', icon: Tag },
    { id: 'code', name: 'Code', icon: Code },
    { id: 'test', name: 'Test', icon: Play },
  ];

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
              <Wrench className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {mode === 'create'
                  ? 'Create New Tool'
                  : `Edit ${tool?.name || 'Tool'}`}
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {mode === 'create'
                  ? 'Build a custom tool for your agents'
                  : 'Modify tool configuration and parameters'}
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className='mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg'>
            <h4 className='text-sm font-medium text-red-800 dark:text-red-200 mb-2'>
              Please fix the following errors:
            </h4>
            <ul className='list-disc list-inside text-sm text-red-700 dark:text-red-300'>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tabs */}
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <nav className='flex space-x-0 px-6'>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className='w-4 h-4 mr-2' />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className='flex-1 overflow-y-auto p-6 max-h-[60vh]'>
          {activeTab === 'general' && (
            <div className='space-y-6'>
              {/* Basic Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Tool Name *
                  </label>
                  <input
                    type='text'
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter tool name...'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Version
                  </label>
                  <input
                    type='text'
                    value={toolVersion}
                    onChange={(e) => setToolVersion(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='1.0.0'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Description *
                </label>
                <textarea
                  value={toolDescription}
                  onChange={(e) => setToolDescription(e.target.value)}
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                  placeholder='Describe what this tool does...'
                />
              </div>

              {/* Category and Type */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Category
                  </label>
                  <select
                    value={toolCategory}
                    onChange={(e) => setToolCategory(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Type
                  </label>
                  <select
                    value={toolType}
                    onChange={(e) => setToolType(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Author
                  </label>
                  <input
                    type='text'
                    value={toolAuthor}
                    onChange={(e) => setToolAuthor(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Tool author'
                  />
                </div>
              </div>

              {/* Status toggles */}
              <div className='flex items-center space-x-6'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='isActive'
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <label
                    htmlFor='isActive'
                    className='ml-2 text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Active
                  </label>
                </div>

                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='isFavorite'
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <label
                    htmlFor='isFavorite'
                    className='ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center'
                  >
                    <Star className='w-4 h-4 mr-1' />
                    Favorite
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Tags
                </label>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {toolTags.map((tag, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    >
                      {tag}
                      <button
                        type='button'
                        onClick={() => removeTag(index)}
                        className='ml-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type='text'
                  placeholder='Add tags (press Enter)'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Tool Parameters
                </h3>
                <button
                  onClick={addParameter}
                  className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add Parameter
                </button>
              </div>

              {parameters.length === 0 ? (
                <div className='text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg'>
                  <Tag className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    No parameters defined
                  </p>
                  <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>
                    Add parameters to make your tool configurable
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {parameters.map((param, index) => (
                    <div
                      key={index}
                      className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                          Parameter {index + 1}
                        </h4>
                        <button
                          onClick={() => removeParameter(index)}
                          className='text-red-400 hover:text-red-600 transition-colors'
                        >
                          <Minus className='w-4 h-4' />
                        </button>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Name *
                          </label>
                          <input
                            type='text'
                            value={param.name}
                            onChange={(e) =>
                              updateParameter(index, 'name', e.target.value)
                            }
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='parameter_name'
                          />
                        </div>

                        <div>
                          <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Type
                          </label>
                          <select
                            value={param.type}
                            onChange={(e) =>
                              updateParameter(index, 'type', e.target.value)
                            }
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          >
                            {parameterTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className='mt-4'>
                        <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Description *
                        </label>
                        <input
                          type='text'
                          value={param.description}
                          onChange={(e) =>
                            updateParameter(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          placeholder='Describe this parameter'
                        />
                      </div>

                      <div className='flex items-center space-x-4 mt-4'>
                        <div className='flex items-center'>
                          <input
                            type='checkbox'
                            id={`required-${index}`}
                            checked={param.required}
                            onChange={(e) =>
                              updateParameter(
                                index,
                                'required',
                                e.target.checked
                              )
                            }
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                          />
                          <label
                            htmlFor={`required-${index}`}
                            className='ml-2 text-xs font-medium text-gray-700 dark:text-gray-300'
                          >
                            Required
                          </label>
                        </div>

                        <div className='flex-1'>
                          <input
                            type='text'
                            value={param.defaultValue}
                            onChange={(e) =>
                              updateParameter(
                                index,
                                'defaultValue',
                                e.target.value
                              )
                            }
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='Default value (optional)'
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Tool Implementation
                </h3>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  {toolType} Code
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Code Implementation
                </label>
                <textarea
                  value={toolCode}
                  onChange={(e) => setToolCode(e.target.value)}
                  rows={15}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                  placeholder={`Enter your ${toolType} code here...`}
                />
              </div>

              {toolType === 'JavaScript' && (
                <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4'>
                  <h4 className='text-sm font-medium text-blue-800 dark:text-blue-200 mb-2'>
                    JavaScript Template
                  </h4>
                  <pre className='text-xs text-blue-700 dark:text-blue-300 overflow-x-auto'>
                    {`function ${
                      toolName.replace(/\s+/g, '') || 'toolName'
                    }(parameters) {
  // Your tool logic here
  const { ${parameters.map((p) => p.name).join(', ')} } = parameters;
  
  try {
    // Implementation
    return {
      success: true,
      result: 'Tool executed successfully',
      data: {}
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'test' && (
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Test Tool Execution
                </h3>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Test Parameters (JSON)
                    </label>
                    <textarea
                      value={testParameters}
                      onChange={(e) => setTestParameters(e.target.value)}
                      rows={8}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='Enter test parameters in JSON format...'
                    />

                    <button
                      onClick={testTool}
                      disabled={isTestRunning || !toolName.trim()}
                      className='mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isTestRunning ? (
                        <>
                          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className='w-4 h-4 mr-2' />
                          Run Test
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Test Result
                    </label>
                    <div className='h-48 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 p-3 overflow-y-auto'>
                      {testResult ? (
                        <div
                          className={`text-sm ${
                            testResult.success
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-red-700 dark:text-red-300'
                          }`}
                        >
                          <div className='font-medium mb-2'>
                            {testResult.success ? '✓ Success' : '✗ Error'}
                          </div>
                          <div className='mb-2'>{testResult.message}</div>
                          {testResult.output && (
                            <pre className='text-xs bg-white dark:bg-gray-800 p-2 rounded border overflow-x-auto'>
                              {JSON.stringify(testResult.output, null, 2)}
                            </pre>
                          )}
                          {testResult.error && (
                            <div className='text-xs bg-red-100 dark:bg-red-900/20 p-2 rounded border'>
                              {testResult.error}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='text-gray-500 dark:text-gray-400 text-sm italic'>
                          Run a test to see results here...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700'>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            {mode === 'create'
              ? 'Creating new tool'
              : `Editing ${tool?.name || 'tool'}`}
          </div>

          <div className='flex space-x-3'>
            <button
              onClick={onCancel}
              className='px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              <Save className='w-4 h-4 mr-2' />
              {mode === 'create' ? 'Create Tool' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolBuilder;
