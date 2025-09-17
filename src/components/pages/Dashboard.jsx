// components/pages/Dashboard.jsx - Integrato con Tools Management
import React, { useState, useEffect } from 'react';
import {
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Play,
  Pause,
  RefreshCw,
  Users,
  Zap,
  Edit,
  Eye,
  BrainCircuit,
  Wrench, // Aggiunto per i tools
} from 'lucide-react';
import ConversationFlowVisualizer from '../visualization/ConversationFlowVisualizer';
import DashboardToolsWidget from '../dashboard/DashboardToolsWidget'; // Import del widget tools

// Dummy data for the dashboard (con aggiunta dei dati tools)
const mockData = {
  overviewStats: {
    activeWorkflows: 7,
    totalAgents: 12,
    completedTasks: 124,
    failedTasks: 3,
    totalTools: 15, // Aggiunto
    activeTools: 12, // Aggiunto
  },
  systemMetrics: {
    cpuUsage: 42,
    memoryUsage: 68,
    apiCalls: 1248,
    responseTime: 420,
  },
  recentWorkflows: [
    {
      id: 'wf-1',
      name: 'Customer Support Assistant',
      status: 'active',
      lastRun: '2 minutes ago',
      successRate: 98,
    },
    {
      id: 'wf-2',
      name: 'Data Analysis Pipeline',
      status: 'completed',
      lastRun: '1 hour ago',
      successRate: 100,
    },
    {
      id: 'wf-3',
      name: 'Content Moderation',
      status: 'active',
      lastRun: '15 minutes ago',
      successRate: 96,
    },
    {
      id: 'wf-4',
      name: 'Lead Qualification',
      status: 'paused',
      lastRun: '1 day ago',
      successRate: 94,
    },
    {
      id: 'wf-5',
      name: 'Document Processor',
      status: 'failed',
      lastRun: '5 hours ago',
      successRate: 80,
    },
  ],
  agentPerformance: [
    {
      id: 'agent-1',
      name: 'Support Triage Agent',
      status: 'healthy',
      load: 'medium',
      responseTime: '0.8s',
      errorRate: 1.2,
    },
    {
      id: 'agent-2',
      name: 'Technical Support Agent',
      status: 'healthy',
      load: 'high',
      responseTime: '1.2s',
      errorRate: 0.5,
    },
    {
      id: 'agent-3',
      name: 'Data Analyst Agent',
      status: 'healthy',
      load: 'low',
      responseTime: '2.1s',
      errorRate: 0,
    },
    {
      id: 'agent-4',
      name: 'Content Reviewer',
      status: 'warning',
      load: 'high',
      responseTime: '1.9s',
      errorRate: 4.2,
    },
    {
      id: 'agent-5',
      name: 'Lead Scoring Agent',
      status: 'offline',
      load: 'none',
      responseTime: 'n/a',
      errorRate: 'n/a',
    },
  ],
  activities: [
    {
      id: 'act-1',
      action: 'Workflow completed',
      target: 'Data Analysis Pipeline',
      time: '1 hour ago',
      user: 'System',
    },
    {
      id: 'act-2',
      action: 'Agent restarted',
      target: 'Content Reviewer',
      time: '2 hours ago',
      user: 'Maria K.',
    },
    {
      id: 'act-3',
      action: 'Tool created', // Aggiunto activity per tools
      target: 'Web Scraper Tool',
      time: '3 hours ago',
      user: 'John D.',
    },
    {
      id: 'act-4',
      action: 'Workflow modified',
      target: 'Lead Qualification',
      time: '1 day ago',
      user: 'John D.',
    },
    {
      id: 'act-5',
      action: 'Agent created',
      target: 'Knowledge Base Assistant',
      time: '2 days ago',
      user: 'Sarah M.',
    },
    {
      id: 'act-6',
      action: 'Template imported',
      target: 'Customer Feedback Analysis',
      time: '3 days ago',
      user: 'Alex T.',
    },
  ],
};

// Helper components (mantenuti uguali)
const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'healthy':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          darkBg: 'dark:bg-green-900',
          darkText: 'dark:text-green-300',
          icon: <CheckCircle className='w-3 h-3 mr-1' />,
        };
      case 'paused':
      case 'warning':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          darkBg: 'dark:bg-yellow-900',
          darkText: 'dark:text-yellow-300',
          icon: <AlertCircle className='w-3 h-3 mr-1' />,
        };
      case 'failed':
      case 'offline':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          darkBg: 'dark:bg-red-900',
          darkText: 'dark:text-red-300',
          icon: <XCircle className='w-3 h-3 mr-1' />,
        };
      case 'completed':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          darkBg: 'dark:bg-blue-900',
          darkText: 'dark:text-blue-300',
          icon: <CheckCircle className='w-3 h-3 mr-1' />,
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

const LoadIndicator = ({ load }) => {
  if (load === 'none' || load === 'n/a')
    return <span className='text-gray-400 dark:text-gray-500'>N/A</span>;

  const getLoadConfig = () => {
    switch (load.toLowerCase()) {
      case 'low':
        return { width: 'w-1/4', bg: 'bg-green-500' };
      case 'medium':
        return { width: 'w-2/4', bg: 'bg-blue-500' };
      case 'high':
        return { width: 'w-3/4', bg: 'bg-yellow-500' };
      case 'critical':
        return { width: 'w-full', bg: 'bg-red-500' };
      default:
        return { width: 'w-0', bg: 'bg-gray-500' };
    }
  };

  const { width, bg } = getLoadConfig();

  return (
    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
      <div className={`${bg} h-2 rounded-full ${width}`}></div>
    </div>
  );
};

const StatCard = ({ title, value, icon, change, changeType }) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
          {title}
        </h3>
        <div className='p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400'>
          {icon}
        </div>
      </div>
      <div className='flex items-end justify-between'>
        <p className='text-2xl font-semibold text-gray-800 dark:text-white'>
          {value}
        </p>
        {change && (
          <span
            className={`text-xs flex items-center ${
              changeType === 'increase' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {changeType === 'increase' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
    </div>
  );
};

// Componente principale Dashboard aggiornato
export const Dashboard = ({ onNavigate, onCreateTool, onShowToolBuilder }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [showConversationFlow, setShowConversationFlow] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setData(mockData);
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, [timeRange]);

  const handleRefresh = () => {
    setData(null);
    setIsLoading(true);
    // In a real app, this would refresh the data from the API
    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 800);
  };

  // Toggle conversation flow visualizer
  const toggleConversationFlow = () => {
    setShowConversationFlow(!showConversationFlow);
  };

  // Handler per navigare alla pagina Tools
  const handleNavigateToTools = () => {
    if (onNavigate) {
      onNavigate('tools');
    }
  };

  // Handler per creare un nuovo tool
  const handleCreateNewTool = () => {
    if (onCreateTool) {
      onCreateTool();
    } else if (onShowToolBuilder) {
      onShowToolBuilder();
    }
  };

  if (isLoading || !data) {
    return (
      <div className='flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='flex flex-col items-center'>
          <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-300'>
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  // If showing conversation flow visualizer
  if (showConversationFlow) {
    return (
      <div className='flex-1 overflow-auto bg-gray-50 dark:bg-gray-900'>
        <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4'>
          <div className='flex items-center'>
            <button
              onClick={toggleConversationFlow}
              className='mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            >
              <ArrowLeft className='w-5 h-5' />
            </button>
            <h1 className='text-xl font-semibold text-gray-800 dark:text-white'>
              Conversation Flow Analysis
            </h1>
          </div>
        </div>

        <ConversationFlowVisualizer />
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-auto bg-gray-50 dark:bg-gray-900'>
      {/* Dashboard Header */}
      <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-semibold text-gray-800 dark:text-white'>
            Dashboard
          </h1>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1'>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 'day'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setTimeRange('day')}
              >
                Day
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 'week'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setTimeRange('week')}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 'month'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setTimeRange('month')}
              >
                Month
              </button>
            </div>
            <button
              className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'
              onClick={handleRefresh}
              title='Refresh data'
            >
              <RefreshCw className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className='p-6'>
        {/* Overview Stats - Aggiunta card per i Tools */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-6'>
          <StatCard
            title='Active Workflows'
            value={data.overviewStats.activeWorkflows}
            icon={<Activity className='w-5 h-5' />}
            change='12%'
            changeType='increase'
          />
          <StatCard
            title='Total Agents'
            value={data.overviewStats.totalAgents}
            icon={<Users className='w-5 h-5' />}
            change='3'
            changeType='increase'
          />
          <StatCard
            title='Active Tools'
            value={data.overviewStats.activeTools}
            icon={<Wrench className='w-5 h-5' />}
            change='2'
            changeType='increase'
          />
          <StatCard
            title='Tasks Completed'
            value={data.overviewStats.completedTasks}
            icon={<CheckCircle className='w-5 h-5' />}
            change='8%'
            changeType='increase'
          />
          <StatCard
            title='Failed Tasks'
            value={data.overviewStats.failedTasks}
            icon={<XCircle className='w-5 h-5' />}
            change='2'
            changeType='decrease'
          />
          <StatCard
            title='Total Tools'
            value={data.overviewStats.totalTools}
            icon={<Wrench className='w-5 h-5' />}
            change='1'
            changeType='increase'
          />
        </div>

        {/* Main Content Grid - Aggiunto Tools Widget */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
          {/* Tools Widget - NUOVA SEZIONE */}
          <div className='lg:col-span-1'>
            <DashboardToolsWidget
              onNavigateToTools={handleNavigateToTools}
              onCreateTool={handleCreateNewTool}
            />
          </div>

          {/* Conversation Flow Analysis - spostato nella griglia */}
          <div className='lg:col-span-2'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-medium text-gray-800 dark:text-white'>
                  Conversation Flow Analysis
                </h3>
                <button
                  onClick={toggleConversationFlow}
                  className='px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700'
                >
                  <BrainCircuit className='w-4 h-4 mr-2 inline' />
                  Open Visualizer
                </button>
              </div>

              <div className='flex flex-col md:flex-row'>
                <div className='md:w-1/2 mb-4 md:mb-0 md:pr-4'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Most Common Conversation Paths
                  </h4>
                  <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-3'>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          Triage → Technical Support → Resolution
                        </div>
                        <div className='text-sm font-medium text-gray-800 dark:text-white'>
                          245
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          Triage → Billing Support → Resolution
                        </div>
                        <div className='text-sm font-medium text-gray-800 dark:text-white'>
                          178
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          Triage → Billing → Escalation → Human
                        </div>
                        <div className='text-sm font-medium text-gray-800 dark:text-white'>
                          52
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='md:w-1/2 md:pl-4'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Flow Bottlenecks
                  </h4>
                  <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-3'>
                    <div className='space-y-3'>
                      <div className='flex items-start'>
                        <div className='w-2 h-2 mt-1.5 rounded-full bg-red-500 mr-2'></div>
                        <div className='flex-1'>
                          <div className='flex justify-between'>
                            <div className='text-sm font-medium text-gray-800 dark:text-white'>
                              Account Lookup Action
                            </div>
                            <div className='text-sm text-red-600 dark:text-red-400'>
                              45s avg wait
                            </div>
                          </div>
                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                            High impact on conversation flow
                          </div>
                        </div>
                      </div>
                      <div className='flex items-start'>
                        <div className='w-2 h-2 mt-1.5 rounded-full bg-yellow-500 mr-2'></div>
                        <div className='flex-1'>
                          <div className='flex justify-between'>
                            <div className='text-sm font-medium text-gray-800 dark:text-white'>
                              Human Agent Handoff
                            </div>
                            <div className='text-sm text-yellow-600 dark:text-yellow-400'>
                              78s avg wait
                            </div>
                          </div>
                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                            Medium impact on conversation flow
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                CPU Usage
              </h3>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                {data.systemMetrics.cpuUsage}%
              </span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
              <div
                className={`bg-blue-600 h-2.5 rounded-full`}
                style={{ width: `${data.systemMetrics.cpuUsage}%` }}
              ></div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Memory Usage
              </h3>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                {data.systemMetrics.memoryUsage}%
              </span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
              <div
                className={`${
                  data.systemMetrics.memoryUsage > 80
                    ? 'bg-red-600'
                    : 'bg-green-600'
                } h-2.5 rounded-full`}
                style={{ width: `${data.systemMetrics.memoryUsage}%` }}
              ></div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                API Calls
              </h3>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                {data.systemMetrics.apiCalls} / hour
              </span>
            </div>
            <div className='flex items-center mt-2'>
              <Zap className='w-4 h-4 text-yellow-500 mr-1' />
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                24.8% increase from yesterday
              </span>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Avg. Response Time
              </h3>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                {data.systemMetrics.responseTime} ms
              </span>
            </div>
            <div className='flex items-center mt-2'>
              <Clock className='w-4 h-4 text-green-500 mr-1' />
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                12% faster than last week
              </span>
            </div>
          </div>
        </div>

        {/* Recent Workflows & Agent Performance */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Recent Workflows - mantenuto uguale */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-lg font-medium text-gray-800 dark:text-white'>
                Recent Workflows
              </h2>
              <button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
                View All
              </button>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-900/50'>
                  <tr>
                    <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Success Rate
                    </th>
                    <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {data.recentWorkflows.map((workflow) => (
                    <tr key={workflow.id}>
                      <td className='px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                        {workflow.name}
                      </td>
                      <td className='px-5 py-4 whitespace-nowrap text-sm'>
                        <StatusBadge status={workflow.status} />
                      </td>
                      <td className='px-5 py-4 whitespace-nowrap text-sm'>
                        <div className='flex items-center'>
                          <span
                            className={`text-xs font-medium ${
                              workflow.successRate >= 95
                                ? 'text-green-600 dark:text-green-400'
                                : workflow.successRate >= 90
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {workflow.successRate}%
                          </span>
                        </div>
                      </td>
                      <td className='px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        <div className='flex items-center space-x-2'>
                          <button
                            className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                            title='View'
                          >
                            <Eye className='w-4 h-4' />
                          </button>
                          <button
                            className='text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300'
                            title='Edit'
                          >
                            <Edit className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agent Performance - mantenuto uguale ma compatto */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-lg font-medium text-gray-800 dark:text-white'>
                Agent Performance
              </h2>
              <button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
                View All
              </button>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-900/50'>
                  <tr>
                    <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Agent
                    </th>
                    <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Load
                    </th>
                    <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Error Rate
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {data.agentPerformance.map((agent) => (
                    <tr key={agent.id}>
                      <td className='px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                        {agent.name}
                      </td>
                      <td className='px-5 py-4 whitespace-nowrap text-sm'>
                        <StatusBadge status={agent.status} />
                      </td>
                      <td className='px-5 py-4 whitespace-nowrap text-sm'>
                        <div className='w-20'>
                          <LoadIndicator load={agent.load} />
                        </div>
                      </td>
                      <td className='px-5 py-4 whitespace-nowrap text-sm'>
                        {agent.errorRate === 'n/a' ? (
                          <span className='text-gray-400 dark:text-gray-500'>
                            N/A
                          </span>
                        ) : (
                          <span
                            className={`${
                              agent.errorRate < 1
                                ? 'text-green-600 dark:text-green-400'
                                : agent.errorRate < 5
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {agent.errorRate}%
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6'>
          <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-medium text-gray-800 dark:text-white'>
              Recent Activities
            </h2>
            <button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
              View All
            </button>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-900/50'>
                <tr>
                  <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Action
                  </th>
                  <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Target
                  </th>
                  <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    User
                  </th>
                  <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {data.activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className='px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                      {activity.action}
                    </td>
                    <td className='px-5 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400'>
                      {activity.target}
                    </td>
                    <td className='px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                      {activity.user}
                    </td>
                    <td className='px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                      {activity.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
