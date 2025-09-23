import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Filter,
  Play,
  Edit,
  Copy,
  Trash2,
  Eye,
  X,
  Save,
  ArrowLeft,
  Pause,
  SkipForward,
  SkipBack,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  MessageSquare,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
} from 'lucide-react';

// Mock data for scenarios
const mockScenarios = [
  {
    id: 'scenario-1',
    name: 'Jira Flow',
    description: 'Test the complete jira ticketing process',
    workflowId: 'workflow-1',
    workflowName: 'Jira Worklow',
    creator: 'Simone Izzo',
    createdAt: '2025-09-23T10:00:00Z',
    lastRun: '2025-09-25T14:30:00Z',
    status: 'completed',
  },
  {
    id: 'scenario-2',
    name: 'Payment Processing Test',
    description: 'Validate payment processing with various payment methods',
    workflowId: 'workflow-2',
    workflowName: 'Payment Processing',
    creator: 'Jane Smith',
    createdAt: '2024-01-18T09:15:00Z',
    lastRun: 'Never',
    status: 'draft',
    inputParams: {
      amount: 299.99,
      currency: 'USD',
      paymentMethod: 'credit_card',
    },
    expectedResults: {
      transactionId: 'expected_format',
      status: 'completed',
      receiptGenerated: true,
    },
  },
];

// Mock data for simulation runs
const mockSimulationRuns = [
  {
    id: 'run-1',
    scenarioId: 'scenario-1',
    scenarioName: 'Jira Processing',
    startTime: '2024-01-20T14:30:00Z',
    endTime: '2024-01-20T14:45:00Z',
    duration: '15m 23s',
    status: 'completed',
    success: true,
    progress: 100,
  },
  {
    id: 'run-2',
    scenarioId: 'scenario-1',
    scenarioName: 'Customer Onboarding Flow',
    startTime: '2024-01-19T11:20:00Z',
    endTime: '2024-01-19T11:22:00Z',
    duration: '2m 15s',
    status: 'completed',
    success: false,
    progress: 45,
  },
];

// Mock workflow options
const mockWorkflows = [
  { id: 'workflow-1', name: 'Jira Processing' },
  { id: 'workflow-2', name: 'Payment Processing' },
  { id: 'workflow-3', name: 'Order Fulfillment' },
  { id: 'workflow-4', name: 'User Authentication' },
];

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          darkBg: 'dark:bg-green-900',
          darkText: 'dark:text-green-200',
          icon: <CheckCircle className='w-3 h-3 mr-1' />,
        };
      case 'running':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          darkBg: 'dark:bg-blue-900',
          darkText: 'dark:text-blue-200',
          icon: <Clock className='w-3 h-3 mr-1' />,
        };
      case 'failed':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          darkBg: 'dark:bg-red-900',
          darkText: 'dark:text-red-200',
          icon: <AlertCircle className='w-3 h-3 mr-1' />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          darkBg: 'dark:bg-gray-900',
          darkText: 'dark:text-gray-200',
          icon: <AlertCircle className='w-3 h-3 mr-1' />,
        };
    }
  };

  const { bg, text, darkBg, darkText, icon } = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} ${darkBg} ${darkText}`}
    >
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString || dateString === 'Never') return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const Simulations = () => {
  const [activeTab, setActiveTab] = useState('scenarios');
  const [scenarioList, setScenarioList] = useState([]);
  const [runsList, setRunsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentSimulation, setCurrentSimulation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedRun, setSelectedRun] = useState(null);

  // Filter options
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWorkflow, setFilterWorkflow] = useState('all');

  // Simulation playback controls
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Create scenario form data - Simplified version
  const [newScenario, setNewScenario] = useState({
    name: '',
    workflowId: '',
  });

  // Chat functionality
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch scenarios and runs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API fetch
      setTimeout(() => {
        setScenarioList(mockScenarios);
        setRunsList(mockSimulationRuns);
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get filtered scenarios
  const getFilteredScenarios = () => {
    return scenarioList.filter((scenario) => {
      // Filter by search term
      const matchesSearch =
        search === '' ||
        scenario.name.toLowerCase().includes(search.toLowerCase()) ||
        scenario.description.toLowerCase().includes(search.toLowerCase());

      // Filter by status
      const matchesStatus =
        filterStatus === 'all' || scenario.status === filterStatus;

      // Filter by workflow
      const matchesWorkflow =
        filterWorkflow === 'all' || scenario.workflowId === filterWorkflow;

      return matchesSearch && matchesStatus && matchesWorkflow;
    });
  };

  // Get filtered runs
  const getFilteredRuns = () => {
    return runsList.filter((run) => {
      // Filter by search term
      const matchesSearch =
        search === '' ||
        run.scenarioName.toLowerCase().includes(search.toLowerCase());

      // Filter by status
      const matchesStatus =
        filterStatus === 'all' || run.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  // Handle running a scenario
  const handleRunScenario = (scenario) => {
    setSelectedScenario(scenario);
    setShowRunModal(true);
  };

  // Handle starting a simulation
  const startSimulation = () => {
    // In a real app, this would initiate the simulation run
    setShowRunModal(false);

    // Mock adding a new run
    const newRun = {
      id: `run-${Date.now()}`,
      scenarioId: selectedScenario.id,
      scenarioName: selectedScenario.name,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 'Running',
      status: 'running',
      success: null,
      progress: 0,
    };

    setRunsList([newRun, ...runsList]);
    setActiveTab('runs');

    // Mock updating the scenario status
    setScenarioList(
      scenarioList.map((s) =>
        s.id === selectedScenario.id
          ? { ...s, status: 'running', lastRun: new Date().toISOString() }
          : s
      )
    );
  };

  // Handle view simulation details - Now opens chat modal
  const viewSimulation = (run) => {
    setSelectedRun(run);
    setShowChatModal(true);
    // Initialize chat with scenario context
    const initialMessages = [
      {
        id: 1,
        text: `Hello! I'm here to help you analyze and interact with the simulation run "${run.scenarioName}". What would you like to know about this simulation?`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        text: `**Simulation Details:**
• Status: ${run.status}
• Started: ${formatDate(run.startTime)}
• Duration: ${run.duration}
• Scenario: ${run.scenarioName}

Feel free to ask me questions about the results, upload screenshots for analysis, or request specific insights about this simulation run.`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        isSystemMessage: true,
      },
    ];
    setMessages(initialMessages);
  };

  // Handle sending messages in chat
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        text: generateAssistantResponse(newMessage, selectedRun),
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Generate assistant response based on message and simulation context
  const generateAssistantResponse = (message, run) => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('status') ||
      (lowerMessage.includes('how') && lowerMessage.includes('going'))
    ) {
      return `The simulation "${run.scenarioName}" has a status of **${
        run.status
      }**. ${
        run.status === 'completed'
          ? 'It completed successfully!'
          : run.status === 'failed'
          ? 'Unfortunately, it encountered some issues.'
          : "It's currently in progress."
      }`;
    } else if (
      lowerMessage.includes('result') ||
      lowerMessage.includes('outcome')
    ) {
      return `Based on the simulation results, I can provide detailed insights. The run took ${run.duration} to execute. Would you like me to analyze specific metrics or compare this with previous runs?`;
    } else if (
      lowerMessage.includes('error') ||
      lowerMessage.includes('problem') ||
      lowerMessage.includes('issue')
    ) {
      return run.status === 'failed'
        ? `I can see this simulation encountered some issues. Let me help you debug this. Can you share any specific error messages or upload screenshots of the problem areas?`
        : `This simulation appears to have run without major issues. Is there a specific aspect you'd like me to investigate?`;
    } else if (
      lowerMessage.includes('compare') ||
      lowerMessage.includes('performance')
    ) {
      return `I can help you compare this simulation's performance with others. This run completed in ${run.duration}. Would you like me to analyze trends or suggest optimizations?`;
    } else {
      return `That's an interesting question about the simulation "${run.scenarioName}". I can help you analyze the results, debug issues, compare performance, or provide insights. What specific aspect would you like to explore?`;
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageMessage = {
            id: Date.now(),
            text: `I've uploaded an image related to the simulation.`,
            sender: 'user',
            timestamp: new Date().toISOString(),
            image: e.target.result,
            fileName: file.name,
          };
          setMessages((prev) => [...prev, imageMessage]);

          // Simulate assistant response to image
          setTimeout(() => {
            const assistantMessage = {
              id: Date.now() + 1,
              text: `I can see the image you've shared. This appears to be related to your simulation "${selectedRun?.scenarioName}". I can help you analyze what I see in the image. What specific aspects would you like me to focus on?`,
              sender: 'assistant',
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }, 1000);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Reset simulation view
  const resetSimulationView = () => {
    setCurrentSimulation(null);
  };

  // Handle saving a new scenario - Simplified version
  const handleSaveScenario = () => {
    // Validate form
    if (!newScenario.name || !newScenario.workflowId) {
      // Show error
      return;
    }

    // Find selected workflow name
    const selectedWorkflow = mockWorkflows.find(
      (w) => w.id === newScenario.workflowId
    );

    // Mock saving a new scenario
    const newScenarioObj = {
      id: `scenario-${Date.now()}`,
      name: newScenario.name,
      description: '', // Empty description in simplified version
      workflowId: newScenario.workflowId,
      workflowName: selectedWorkflow
        ? selectedWorkflow.name
        : 'Unknown Workflow',
      creator: 'Current User',
      createdAt: new Date().toISOString(),
      lastRun: 'Never',
      status: 'draft',
      inputParams: {}, // Empty input params in simplified version
      expectedResults: {}, // Empty expected results in simplified version
    };

    setScenarioList([newScenarioObj, ...scenarioList]);
    setShowCreateModal(false);

    // Reset form
    setNewScenario({
      name: '',
      workflowId: '',
    });
  };

  // If details view is active, show simulation details
  if (currentSimulation) {
    return (
      <div className='flex-1 overflow-auto bg-gray-50 dark:bg-gray-900'>
        {/* Header */}
        <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4'>
          <div className='flex items-center'>
            <button
              onClick={resetSimulationView}
              className='mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            >
              <ArrowLeft className='w-5 h-5' />
            </button>
            <h1 className='text-xl font-semibold text-gray-800 dark:text-white'>
              Simulation Details
            </h1>

            <div className='ml-4'>
              <StatusBadge status={currentSimulation.status} />
            </div>
          </div>
        </div>

        {/* Simulation Details Content */}
        <div className='p-6'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6'>
            <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-lg font-medium text-gray-800 dark:text-white'>
                {currentSimulation.scenarioName}
              </h2>
              <div className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                <p>Run ID: {currentSimulation.id}</p>
                <p>Started: {formatDate(currentSimulation.startTime)}</p>
                <p>Duration: {currentSimulation.duration}</p>
              </div>
            </div>

            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4'>
                    Progress
                  </h3>
                  <div className='bg-gray-200 dark:bg-gray-700 rounded-full h-4'>
                    <div
                      className='bg-blue-600 h-4 rounded-full transition-all duration-300'
                      style={{ width: `${currentSimulation.progress}%` }}
                    ></div>
                  </div>
                  <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                    {currentSimulation.progress}% Complete
                  </p>
                </div>

                <div>
                  <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4'>
                    Status
                  </h3>
                  <StatusBadge status={currentSimulation.status} />
                </div>
              </div>

              {currentSimulation.status === 'running' && (
                <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-2'>
                      <button
                        className='p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <Pause className='w-4 h-4' />
                        ) : (
                          <Play className='w-4 h-4' />
                        )}
                      </button>
                      <button className='p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'>
                        <SkipBack className='w-4 h-4' />
                      </button>
                      <button className='p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'>
                        <SkipForward className='w-4 h-4' />
                      </button>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <span className='text-blue-700 dark:text-blue-300 text-sm'>
                        Speed:
                      </span>
                      <select
                        value={playbackSpeed}
                        onChange={(e) =>
                          setPlaybackSpeed(Number(e.target.value))
                        }
                        className='bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded text-sm px-2 py-1'
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='flex-1 overflow-auto bg-gray-50 dark:bg-gray-900'>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <p className='ml-4 text-gray-600 dark:text-gray-300'>
            Loading simulation data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-auto bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-semibold text-gray-800 dark:text-white'>
            Simulations
          </h1>

          <div className='flex items-center space-x-2'>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className='w-4 h-4 mr-2 inline-block' />
              New Scenario
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex mt-4 border-b border-gray-200 dark:border-gray-700'>
          <button
            className={`py-2 px-4 ${
              activeTab === 'scenarios'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('scenarios')}
          >
            Scenarios
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'runs'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('runs')}
          >
            Simulation Runs
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search scenarios...'
                className='pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Filter className='text-gray-500 dark:text-gray-400 w-4 h-4' />
            <select
              className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value='all'>All Status</option>
              <option value='draft'>Draft</option>
              <option value='completed'>Completed</option>
              <option value='running'>Running</option>
              <option value='failed'>Failed</option>
            </select>

            {activeTab === 'scenarios' && (
              <select
                className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
                value={filterWorkflow}
                onChange={(e) => setFilterWorkflow(e.target.value)}
              >
                <option value='all'>All Workflows</option>
                <option value='workflow-1'>Customer Onboarding</option>
                <option value='workflow-2'>Payment Processing</option>
                <option value='workflow-3'>Order Fulfillment</option>
                <option value='workflow-4'>User Authentication</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        {activeTab === 'scenarios' && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead>
                  <tr className='border-b border-gray-200 dark:border-gray-700'>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Workflow
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Created
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Last Run
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {getFilteredScenarios().map((scenario) => (
                    <tr
                      key={scenario.id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-750'
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {scenario.name}
                          </div>
                          <div className='text-sm text-gray-500 dark:text-gray-400'>
                            {scenario.description}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                        {scenario.workflowName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <StatusBadge status={scenario.status} />
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {formatDate(scenario.createdAt)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {formatDate(scenario.lastRun)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex justify-end space-x-2'>
                          {scenario.status !== 'running' && (
                            <button
                              className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                              title='Run Scenario'
                              onClick={() => handleRunScenario(scenario)}
                            >
                              <Play className='w-5 h-5' />
                            </button>
                          )}
                          <button
                            className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                            title='Edit Scenario'
                          >
                            <Edit className='w-5 h-5' />
                          </button>
                          <button
                            className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                            title='Duplicate Scenario'
                          >
                            <Copy className='w-5 h-5' />
                          </button>
                          <button
                            className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
                            title='Delete Scenario'
                          >
                            <Trash2 className='w-5 h-5' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {getFilteredScenarios().length === 0 && (
                <div className='text-center py-8'>
                  <p className='text-gray-500 dark:text-gray-400'>
                    No scenarios found. Try adjusting your filters or create a
                    new scenario.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'runs' && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead>
                  <tr className='border-b border-gray-200 dark:border-gray-700'>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Scenario
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Started
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Duration
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {getFilteredRuns().map((run) => (
                    <tr
                      key={run.id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-750'
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                        {run.scenarioName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <StatusBadge status={run.status} />
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {formatDate(run.startTime)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {run.duration}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <button
                          className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                          title='Chat about this simulation'
                          onClick={() => viewSimulation(run)}
                        >
                          <MessageSquare className='w-5 h-5' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {getFilteredRuns().length === 0 && (
                <div className='text-center py-8'>
                  <p className='text-gray-500 dark:text-gray-400'>
                    No simulation runs found. Try adjusting your filters or run
                    a scenario.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create New Scenario Modal - Simplified Version */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-lg font-medium text-gray-800 dark:text-white'>
                Create New Scenario
              </h2>
              <button
                className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                onClick={() => setShowCreateModal(false)}
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-6'>
              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='scenarioName'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Scenario Name
                  </label>
                  <input
                    type='text'
                    id='scenarioName'
                    placeholder='Enter scenario name'
                    className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    value={newScenario.name}
                    onChange={(e) =>
                      setNewScenario({ ...newScenario, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor='workflow'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Workflow
                  </label>
                  <select
                    id='workflow'
                    className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    value={newScenario.workflowId}
                    onChange={(e) =>
                      setNewScenario({
                        ...newScenario,
                        workflowId: e.target.value,
                      })
                    }
                  >
                    <option value=''>Select a workflow</option>
                    {mockWorkflows.map((workflow) => (
                      <option key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-x-3'>
              <button
                className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={handleSaveScenario}
                disabled={!newScenario.name || !newScenario.workflowId}
              >
                <Save className='w-4 h-4 mr-2 inline-block' />
                Save Scenario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Run Scenario Modal */}
      {showRunModal && selectedScenario && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-lg font-medium text-gray-800 dark:text-white'>
                Run Scenario
              </h2>
              <button
                className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                onClick={() => setShowRunModal(false)}
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-6'>
              <div className='mb-4'>
                <h3 className='text-md font-medium text-gray-800 dark:text-white mb-2'>
                  {selectedScenario.name}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {selectedScenario.description || 'No description available.'}
                </p>
              </div>

              <div className='bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4'>
                <div className='flex items-start'>
                  <Play className='text-blue-500 dark:text-blue-400 w-5 h-5 mr-2 mt-0.5' />
                  <div>
                    <h4 className='text-blue-800 dark:text-blue-300 font-medium'>
                      Ready to run simulation
                    </h4>
                    <p className='text-blue-700 dark:text-blue-400 mt-1 text-sm'>
                      This will execute the scenario against the "
                      {selectedScenario.workflowName}" workflow.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-x-3'>
              <button
                className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
                onClick={() => setShowRunModal(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                onClick={startSimulation}
              >
                <Play className='w-4 h-4 mr-2 inline-block' />
                Start Simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal for Simulation Analysis */}
      {showChatModal && selectedRun && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col'>
            {/* Chat Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center space-x-3'>
                <MessageSquare className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                <div>
                  <h2 className='text-lg font-medium text-gray-800 dark:text-white'>
                    Chat about Simulation
                  </h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {selectedRun.scenarioName} • {selectedRun.status}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'
                  title='More options'
                >
                  <MoreVertical className='w-5 h-5' />
                </button>
                <button
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  onClick={() => setShowChatModal(false)}
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto p-6 space-y-4'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.isSystemMessage
                        ? 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.image && (
                      <div className='mb-3'>
                        <img
                          src={message.image}
                          alt={message.fileName}
                          className='max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600'
                          style={{ maxHeight: '200px' }}
                        />
                        <p className='text-xs mt-1 opacity-75'>
                          {message.fileName}
                        </p>
                      </div>
                    )}
                    <div
                      className={`text-sm ${
                        message.isSystemMessage ? 'whitespace-pre-line' : ''
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: message.text.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong>$1</strong>'
                        ),
                      }}
                    />
                    <div
                      className={`text-xs mt-2 opacity-75 ${
                        message.sender === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className='flex justify-start'>
                  <div className='bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 max-w-[80%]'>
                    <div className='flex space-x-1'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className='border-t border-gray-200 dark:border-gray-700 p-4'>
              <form
                onSubmit={handleSendMessage}
                className='flex items-end space-x-3'
              >
                <div className='flex-1'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <button
                      type='button'
                      className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                      onClick={() => fileInputRef.current?.click()}
                      title='Upload image'
                    >
                      <ImageIcon className='w-5 h-5' />
                    </button>
                    <button
                      type='button'
                      className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                      title='Attach file'
                    >
                      <Paperclip className='w-5 h-5' />
                    </button>
                    <button
                      type='button'
                      className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                      title='Add emoji'
                    >
                      <Smile className='w-5 h-5' />
                    </button>
                    <button
                      type='button'
                      className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                      title='Voice message'
                    >
                      <Mic className='w-5 h-5' />
                    </button>
                  </div>
                  <div className='flex items-end space-x-3'>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder='Ask me anything about this simulation...'
                      className='flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <button
                      type='submit'
                      disabled={!newMessage.trim()}
                      className='p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                      <Send className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              </form>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                className='hidden'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
