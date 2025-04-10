// components/pages/Simulations.jsx
import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Plus,
  Copy,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Save,
  X,
} from 'lucide-react';

// Mock data for simulations
const mockScenarios = [
  {
    id: 'scenario-1',
    name: 'Customer Support Chatbot - Basic Queries',
    description:
      "Tests the chatbot's ability to handle basic customer inquiries about product features and pricing.",
    workflowId: 'wf-1',
    workflowName: 'Customer Support Assistant',
    creator: 'John D.',
    createdAt: '2025-03-15T14:30:00Z',
    lastRun: '2025-04-08T09:45:00Z',
    status: 'ready',
    inputParams: {
      userQueries: [
        'What are the pricing tiers?',
        'How do I reset my password?',
        'Do you offer a free trial?',
      ],
      responseTimeout: 5000,
      maxTokens: 500,
    },
    expectedResults: {
      successRate: 95,
      avgResponseTime: 1200,
      containsKeyInfo: true,
    },
  },
  {
    id: 'scenario-2',
    name: 'Data Analysis Pipeline - Large Dataset',
    description:
      "Tests the data pipeline's performance with a large CSV dataset containing 100,000+ rows.",
    workflowId: 'wf-2',
    workflowName: 'Data Analysis Pipeline',
    creator: 'Maria K.',
    createdAt: '2025-03-20T10:15:00Z',
    lastRun: '2025-04-07T14:30:00Z',
    status: 'ready',
    inputParams: {
      datasetSize: 'large',
      analysisType: 'comprehensive',
      timeout: 30000,
    },
    expectedResults: {
      completionTime: '<20s',
      memoryUsage: '<2GB',
      outputFormat: 'JSON',
    },
  },
  {
    id: 'scenario-3',
    name: 'Content Moderation - Toxic Content Detection',
    description:
      'Tests the ability to identify and flag harmful content across multiple languages.',
    workflowId: 'wf-3',
    workflowName: 'Content Moderation',
    creator: 'Alex T.',
    createdAt: '2025-03-25T16:45:00Z',
    lastRun: '2025-04-09T11:20:00Z',
    status: 'running',
    inputParams: {
      contentSamples: [
        'This is normal content',
        'This is harmful content with threats',
        'This is content in Spanish with inappropriate words',
      ],
      sensitivityLevel: 'high',
      languages: ['en', 'es', 'fr'],
    },
    expectedResults: {
      flaggedContentAccuracy: '>90%',
      falsePositiveRate: '<5%',
      classificationTime: '<1s',
    },
  },
  {
    id: 'scenario-4',
    name: 'Lead Qualification - Edge Cases',
    description:
      'Tests the lead scoring system with unusual or edge case prospect data.',
    workflowId: 'wf-4',
    workflowName: 'Lead Qualification',
    creator: 'Sarah M.',
    createdAt: '2025-04-01T09:30:00Z',
    lastRun: 'Never',
    status: 'draft',
    inputParams: {
      leadProfiles: [
        {
          company: 'Unknown Corp',
          revenue: null,
          employees: 10000,
          industry: 'Other',
        },
        {
          company: 'New Startup LLC',
          revenue: '$50K',
          employees: 2,
          industry: 'Technology',
        },
      ],
      scoreThreshold: 65,
    },
    expectedResults: {
      accurateScoring: '>85%',
      processingTime: '<3s',
      followupRecommendations: true,
    },
  },
  {
    id: 'scenario-5',
    name: 'Document Processor - Multi-Format Test',
    description:
      "Tests the document processor's ability to handle PDF, DOCX, and scanned image files.",
    workflowId: 'wf-5',
    workflowName: 'Document Processor',
    creator: 'Carlos R.',
    createdAt: '2025-04-02T14:20:00Z',
    lastRun: '2025-04-06T10:15:00Z',
    status: 'failed',
    inputParams: {
      documentTypes: ['PDF', 'DOCX', 'JPG (scanned)'],
      extractionLevel: 'full',
      includeMetadata: true,
    },
    expectedResults: {
      extractionAccuracy: '>90%',
      processingTimePerPage: '<2s',
      metadataCompleteness: 'full',
    },
    failureReason: 'OCR service timeout on scanned documents',
  },
];

// Mock simulation runs
const mockSimulationRuns = [
  {
    id: 'run-1',
    scenarioId: 'scenario-1',
    scenarioName: 'Customer Support Chatbot - Basic Queries',
    startTime: '2025-04-08T09:45:00Z',
    endTime: '2025-04-08T09:46:12Z',
    duration: '1m 12s',
    status: 'completed',
    success: true,
    results: {
      successRate: 97,
      avgResponseTime: 980,
      containsKeyInfo: true,
    },
    metrics: {
      queries: 3,
      tokensUsed: 1240,
      totalApiCalls: 9,
    },
  },
  {
    id: 'run-2',
    scenarioId: 'scenario-2',
    scenarioName: 'Data Analysis Pipeline - Large Dataset',
    startTime: '2025-04-07T14:30:00Z',
    endTime: '2025-04-07T14:30:17Z',
    duration: '17s',
    status: 'completed',
    success: true,
    results: {
      completionTime: '17.2s',
      memoryUsage: '1.8GB',
      outputFormat: 'JSON',
    },
    metrics: {
      rowsProcessed: 124532,
      dataVolume: '48MB',
      cpuUsagePeak: '72%',
    },
  },
  {
    id: 'run-3',
    scenarioId: 'scenario-3',
    scenarioName: 'Content Moderation - Toxic Content Detection',
    startTime: '2025-04-09T11:20:00Z',
    endTime: null,
    duration: 'Running',
    status: 'running',
    success: null,
    progress: 65,
    intermediateResults: {
      samplesProcessed: 2,
      samplesRemaining: 1,
    },
  },
  {
    id: 'run-4',
    scenarioId: 'scenario-5',
    scenarioName: 'Document Processor - Multi-Format Test',
    startTime: '2025-04-06T10:15:00Z',
    endTime: '2025-04-06T10:17:45Z',
    duration: '2m 45s',
    status: 'failed',
    success: false,
    error: {
      component: 'OCR Service',
      message: 'Timeout after 120s when processing scanned images',
      recommendation: 'Increase OCR service timeout or reduce image resolution',
    },
    partialResults: {
      documentsProcessed: 2,
      documentsSuccessful: 2,
      documentsFailed: 1,
    },
  },
];

// Status badge helper component
const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'ready':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          darkBg: 'dark:bg-blue-900',
          darkText: 'dark:text-blue-300',
          icon: <CheckCircle className='w-3 h-3 mr-1' />,
        };
      case 'running':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          darkBg: 'dark:bg-green-900',
          darkText: 'dark:text-green-300',
          icon: <Play className='w-3 h-3 mr-1' />,
        };
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          darkBg: 'dark:bg-green-900',
          darkText: 'dark:text-green-300',
          icon: <CheckCircle className='w-3 h-3 mr-1' />,
        };
      case 'draft':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          darkBg: 'dark:bg-yellow-900',
          darkText: 'dark:text-yellow-300',
          icon: <AlertCircle className='w-3 h-3 mr-1' />,
        };
      case 'failed':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          darkBg: 'dark:bg-red-900',
          darkText: 'dark:text-red-300',
          icon: <XCircle className='w-3 h-3 mr-1' />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          darkBg: 'dark:bg-gray-900',
          darkText: 'dark:text-gray-300',
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
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Filter options
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWorkflow, setFilterWorkflow] = useState('all');

  // Simulation playback controls
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Create scenario form data
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    workflowId: '',
    inputParams: {},
    expectedResults: {},
  });

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

  // Handle view simulation details
  const viewSimulation = (run) => {
    setCurrentSimulation(run);
  };

  // Reset simulation view
  const resetSimulationView = () => {
    setCurrentSimulation(null);
  };

  // Handle saving a new scenario
  const handleSaveScenario = () => {
    // Validate form
    if (!newScenario.name || !newScenario.workflowId) {
      // Show error
      return;
    }

    // Mock saving a new scenario
    const newScenarioObj = {
      id: `scenario-${Date.now()}`,
      name: newScenario.name,
      description: newScenario.description,
      workflowId: newScenario.workflowId,
      workflowName: 'Selected Workflow', // In real app, this would be looked up
      creator: 'Current User',
      createdAt: new Date().toISOString(),
      lastRun: 'Never',
      status: 'draft',
      inputParams: newScenario.inputParams,
      expectedResults: newScenario.expectedResults,
    };

    setScenarioList([newScenarioObj, ...scenarioList]);
    setShowCreateModal(false);

    // Reset form
    setNewScenario({
      name: '',
      description: '',
      workflowId: '',
      inputParams: {},
      expectedResults: {},
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
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                Run ID: {currentSimulation.id}
              </p>
            </div>

            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                    Start Time
                  </h3>
                  <p className='text-gray-800 dark:text-white'>
                    {formatDate(currentSimulation.startTime)}
                  </p>
                </div>

                <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                    End Time
                  </h3>
                  <p className='text-gray-800 dark:text-white'>
                    {currentSimulation.endTime
                      ? formatDate(currentSimulation.endTime)
                      : 'Running'}
                  </p>
                </div>

                <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                    Duration
                  </h3>
                  <p className='text-gray-800 dark:text-white'>
                    {currentSimulation.duration}
                  </p>
                </div>
              </div>

              {/* Simulation results section */}
              {currentSimulation.status === 'completed' && (
                <div className='mb-6'>
                  <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4'>
                    Results
                  </h3>

                  <div className='bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4'>
                    <div className='flex items-center'>
                      <CheckCircle className='text-green-500 dark:text-green-400 w-5 h-5 mr-2' />
                      <span className='text-green-800 dark:text-green-300 font-medium'>
                        All tests passed successfully
                      </span>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                      <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                        Expected Results
                      </h4>
                      <ul className='space-y-2'>
                        {Object.entries(currentSimulation.results).map(
                          ([key, value]) => (
                            <li key={key} className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                {key}:
                              </span>
                              <span className='text-gray-900 dark:text-white font-medium'>
                                {value}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                      <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                        Metrics
                      </h4>
                      <ul className='space-y-2'>
                        {Object.entries(currentSimulation.metrics).map(
                          ([key, value]) => (
                            <li key={key} className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                {key}:
                              </span>
                              <span className='text-gray-900 dark:text-white font-medium'>
                                {value}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Failure details if applicable */}
              {currentSimulation.status === 'failed' && (
                <div className='mb-6'>
                  <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4'>
                    Failure Details
                  </h3>

                  <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4'>
                    <div className='flex items-start'>
                      <XCircle className='text-red-500 dark:text-red-400 w-5 h-5 mr-2 mt-0.5' />
                      <div>
                        <h4 className='text-red-800 dark:text-red-300 font-medium'>
                          {currentSimulation.error.component} Error
                        </h4>
                        <p className='text-red-700 dark:text-red-400 mt-1'>
                          {currentSimulation.error.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4'>
                    <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Recommendation
                    </h4>
                    <p className='text-gray-700 dark:text-gray-300'>
                      {currentSimulation.error.recommendation}
                    </p>
                  </div>

                  {currentSimulation.partialResults && (
                    <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                      <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                        Partial Results
                      </h4>
                      <ul className='space-y-2'>
                        {Object.entries(currentSimulation.partialResults).map(
                          ([key, value]) => (
                            <li key={key} className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                {key}:
                              </span>
                              <span className='text-gray-900 dark:text-white font-medium'>
                                {value}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Progress display if running */}
              {currentSimulation.status === 'running' && (
                <div className='mb-6'>
                  <h3 className='text-md font-medium text-gray-800 dark:text-white mb-4'>
                    Progress
                  </h3>

                  <div className='mb-4'>
                    <div className='flex justify-between mb-1'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Execution Progress
                      </span>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {currentSimulation.progress}%
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                      <div
                        className='bg-blue-600 h-2.5 rounded-full'
                        style={{ width: `${currentSimulation.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {currentSimulation.intermediateResults && (
                    <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                      <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                        Intermediate Results
                      </h4>
                      <ul className='space-y-2'>
                        {Object.entries(
                          currentSimulation.intermediateResults
                        ).map(([key, value]) => (
                          <li key={key} className='flex justify-between'>
                            <span className='text-gray-600 dark:text-gray-400'>
                              {key}:
                            </span>
                            <span className='text-gray-900 dark:text-white font-medium'>
                              {value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Simulation Playback Controls */}
                  <div className='mt-6 flex items-center justify-center space-x-4'>
                    <button className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'>
                      <RotateCcw className='w-5 h-5' />
                    </button>

                    <button
                      className='p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700'
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className='w-6 h-6' />
                      ) : (
                        <Play className='w-6 h-6' />
                      )}
                    </button>

                    <button className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'>
                      <FastForward className='w-5 h-5' />
                    </button>

                    <select
                      value={playbackSpeed}
                      onChange={(e) =>
                        setPlaybackSpeed(parseFloat(e.target.value))
                      }
                      className='ml-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm'
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1x</option>
                      <option value={2}>2x</option>
                      <option value={4}>4x</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className='flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <button className='px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600'>
                  <Download className='w-4 h-4 mr-2 inline-block' />
                  Export Results
                </button>

                {currentSimulation.status === 'failed' && (
                  <button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
                    <RefreshCw className='w-4 h-4 mr-2 inline-block' />
                    Retry Simulation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='flex flex-col items-center'>
          <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-300'>
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

      {/* Search and filters */}
      <div className='p-6'>
        <div className='flex flex-col md:flex-row md:items-center mb-6 gap-4'>
          <div className='relative flex-grow max-w-md'>
            <input
              type='text'
              placeholder='Search scenarios...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
          </div>

          <div className='flex items-center'>
            <Filter className='w-4 h-4 text-gray-600 dark:text-gray-400 mr-2' />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className='block p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white mr-2'
            >
              <option value='all'>All Statuses</option>
              <option value='ready'>Ready</option>
              <option value='running'>Running</option>
              <option value='completed'>Completed</option>
              <option value='failed'>Failed</option>
              <option value='draft'>Draft</option>
            </select>

            {activeTab === 'scenarios' && (
              <select
                value={filterWorkflow}
                onChange={(e) => setFilterWorkflow(e.target.value)}
                className='block p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
              >
                <option value='all'>All Workflows</option>
                <option value='wf-1'>Customer Support Assistant</option>
                <option value='wf-2'>Data Analysis Pipeline</option>
                <option value='wf-3'>Content Moderation</option>
                <option value='wf-4'>Lead Qualification</option>
                <option value='wf-5'>Document Processor</option>
              </select>
            )}
          </div>
        </div>

        {/* Scenarios Tab Content */}
        {activeTab === 'scenarios' && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-900/50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Scenario
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Workflow
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Last Run
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Created By
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {getFilteredScenarios().map((scenario) => (
                    <tr
                      key={scenario.id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            {scenario.name}
                          </span>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {scenario.description}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {scenario.workflowName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <StatusBadge status={scenario.status} />
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {formatDate(scenario.lastRun)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {scenario.creator}
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

        {/* Runs Tab Content */}
        {activeTab === 'runs' && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-900/50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Run ID
                    </th>
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
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {getFilteredRuns().map((run) => (
                    <tr
                      key={run.id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                        {run.id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
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
                          title='View Details'
                          onClick={() => viewSimulation(run)}
                        >
                          <Eye className='w-5 h-5' />
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

      {/* Create New Scenario Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl'>
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
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Scenario Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    value={newScenario.name}
                    onChange={(e) =>
                      setNewScenario({ ...newScenario, name: e.target.value })
                    }
                    placeholder='Enter scenario name'
                  />
                </div>

                <div>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Description
                  </label>
                  <textarea
                    id='description'
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    value={newScenario.description}
                    onChange={(e) =>
                      setNewScenario({
                        ...newScenario,
                        description: e.target.value,
                      })
                    }
                    placeholder='Describe what this scenario tests'
                    rows='3'
                  ></textarea>
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
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    value={newScenario.workflowId}
                    onChange={(e) =>
                      setNewScenario({
                        ...newScenario,
                        workflowId: e.target.value,
                      })
                    }
                  >
                    <option value=''>Select a workflow</option>
                    <option value='wf-1'>Customer Support Assistant</option>
                    <option value='wf-2'>Data Analysis Pipeline</option>
                    <option value='wf-3'>Content Moderation</option>
                    <option value='wf-4'>Lead Qualification</option>
                    <option value='wf-5'>Document Processor</option>
                  </select>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Input Parameters
                    </h3>
                    <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-md min-h-32'>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
                        Configure test inputs here. In a real app, this would be
                        a dynamic form based on the selected workflow.
                      </p>
                      <textarea
                        className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs font-mono'
                        rows='6'
                        placeholder='{ ... }'
                        onChange={(e) => {
                          try {
                            const params = JSON.parse(e.target.value);
                            setNewScenario({
                              ...newScenario,
                              inputParams: params,
                            });
                          } catch (error) {
                            // Handle invalid JSON
                          }
                        }}
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Expected Results
                    </h3>
                    <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-md min-h-32'>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
                        Define expected outcomes to verify test success. In a
                        real app, this would also be dynamic.
                      </p>
                      <textarea
                        className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs font-mono'
                        rows='6'
                        placeholder='{ ... }'
                        onChange={(e) => {
                          try {
                            const results = JSON.parse(e.target.value);
                            setNewScenario({
                              ...newScenario,
                              expectedResults: results,
                            });
                          } catch (error) {
                            // Handle invalid JSON
                          }
                        }}
                      ></textarea>
                    </div>
                  </div>
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
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                onClick={handleSaveScenario}
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
                  {selectedScenario.description}
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

              <div className='space-y-4'>
                <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Input Parameters
                  </h4>
                  <div className='overflow-x-auto max-h-40 text-sm'>
                    <pre className='text-gray-700 dark:text-gray-300 text-xs'>
                      {JSON.stringify(selectedScenario.inputParams, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Expected Results
                  </h4>
                  <div className='overflow-x-auto max-h-40 text-sm'>
                    <pre className='text-gray-700 dark:text-gray-300 text-xs'>
                      {JSON.stringify(
                        selectedScenario.expectedResults,
                        null,
                        2
                      )}
                    </pre>
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
    </div>
  );
};
