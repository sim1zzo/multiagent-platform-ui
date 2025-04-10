// components/pages/Analytics.jsx
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  BarChart2,
  TrendingUp,
  Download,
  Users,
  MessageSquare,
  Zap,
  RefreshCw,
  ChevronDown,
  Database,
  Cpu,
  Server,
  Book,
  ListChecks,
  GitBranch,
} from 'lucide-react';

// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalExecutions: 1248,
    activeAgents: 12,
    completionRate: 97.2,
    avgResponseTime: 850, // ms
    tokensUsed: 1532456,
    lastUpdated: new Date().toISOString(),
  },
  workflowPerformance: [
    {
      id: 'wf-1',
      name: 'Customer Support Assistant',
      executions: 587,
      avgResponseTime: 750,
      completionRate: 98.5,
      agentCount: 3,
    },
    {
      id: 'wf-2',
      name: 'Data Analysis Pipeline',
      executions: 123,
      avgResponseTime: 1200,
      completionRate: 92.8,
      agentCount: 4,
    },
    {
      id: 'wf-3',
      name: 'Content Moderation',
      executions: 357,
      avgResponseTime: 680,
      completionRate: 99.1,
      agentCount: 2,
    },
    {
      id: 'wf-4',
      name: 'Lead Qualification',
      executions: 89,
      avgResponseTime: 920,
      completionRate: 95.6,
      agentCount: 1,
    },
    {
      id: 'wf-5',
      name: 'Document Processor',
      executions: 92,
      avgResponseTime: 1500,
      completionRate: 91.2,
      agentCount: 2,
    },
  ],
  agentIntelligence: [
    {
      id: 'agent-1',
      name: 'Support Triage Agent',
      accuracy: 97.2,
      improvement: 2.1,
      knowledgeUtilization: 78,
      efficiency: 94.5,
    },
    {
      id: 'agent-2',
      name: 'Technical Support Agent',
      accuracy: 95.8,
      improvement: 1.5,
      knowledgeUtilization: 92,
      efficiency: 88.3,
    },
    {
      id: 'agent-3',
      name: 'Data Analyst Agent',
      accuracy: 99.3,
      improvement: 0.7,
      knowledgeUtilization: 85,
      efficiency: 96.7,
    },
    {
      id: 'agent-4',
      name: 'Content Reviewer',
      accuracy: 98.1,
      improvement: 3.2,
      knowledgeUtilization: 72,
      efficiency: 91.9,
    },
    {
      id: 'agent-5',
      name: 'Lead Scoring Agent',
      accuracy: 94.5,
      improvement: 5.3,
      knowledgeUtilization: 68,
      efficiency: 87.2,
    },
  ],
  userInteractions: {
    totalInteractions: 4256,
    responseRate: 97.8,
    userSatisfaction: 4.2, // out of 5
    topQueries: [
      { query: 'How do I reset my password?', count: 127 },
      { query: 'What are your pricing plans?', count: 98 },
      { query: 'Can I get a refund?', count: 72 },
      { query: 'How do I cancel my subscription?', count: 65 },
      { query: 'How do I export my data?', count: 59 },
    ],
    queriesByTime: {
      '00:00': 12,
      '01:00': 8,
      '02:00': 5,
      '03:00': 3,
      '04:00': 4,
      '05:00': 7,
      '06:00': 15,
      '07:00': 35,
      '08:00': 78,
      '09:00': 124,
      '10:00': 187,
      '11:00': 201,
      '12:00': 176,
      '13:00': 165,
      '14:00': 189,
      '15:00': 210,
      '16:00': 172,
      '17:00': 145,
      '18:00': 110,
      '19:00': 87,
      '20:00': 65,
      '21:00': 42,
      '22:00': 28,
      '23:00': 17,
    },
  },
  resourceUsage: {
    cpu: [
      { timestamp: '2025-04-09T00:00:00Z', value: 32 },
      { timestamp: '2025-04-09T01:00:00Z', value: 28 },
      { timestamp: '2025-04-09T02:00:00Z', value: 24 },
      { timestamp: '2025-04-09T03:00:00Z', value: 22 },
      { timestamp: '2025-04-09T04:00:00Z', value: 20 },
      { timestamp: '2025-04-09T05:00:00Z', value: 25 },
      { timestamp: '2025-04-09T06:00:00Z', value: 35 },
      { timestamp: '2025-04-09T07:00:00Z', value: 48 },
      { timestamp: '2025-04-09T08:00:00Z', value: 62 },
      { timestamp: '2025-04-09T09:00:00Z', value: 78 },
      { timestamp: '2025-04-09T10:00:00Z', value: 87 },
      { timestamp: '2025-04-09T11:00:00Z', value: 92 },
      { timestamp: '2025-04-09T12:00:00Z', value: 88 },
      { timestamp: '2025-04-09T13:00:00Z', value: 82 },
      { timestamp: '2025-04-09T14:00:00Z', value: 86 },
      { timestamp: '2025-04-09T15:00:00Z', value: 95 },
      { timestamp: '2025-04-09T16:00:00Z', value: 90 },
      { timestamp: '2025-04-09T17:00:00Z', value: 82 },
      { timestamp: '2025-04-09T18:00:00Z', value: 74 },
      { timestamp: '2025-04-09T19:00:00Z', value: 68 },
      { timestamp: '2025-04-09T20:00:00Z', value: 55 },
      { timestamp: '2025-04-09T21:00:00Z', value: 48 },
      { timestamp: '2025-04-09T22:00:00Z', value: 42 },
      { timestamp: '2025-04-09T23:00:00Z', value: 38 },
    ],
    memory: [
      { timestamp: '2025-04-09T00:00:00Z', value: 45 },
      { timestamp: '2025-04-09T01:00:00Z', value: 42 },
      { timestamp: '2025-04-09T02:00:00Z', value: 40 },
      { timestamp: '2025-04-09T03:00:00Z', value: 38 },
      { timestamp: '2025-04-09T04:00:00Z', value: 38 },
      { timestamp: '2025-04-09T05:00:00Z', value: 40 },
      { timestamp: '2025-04-09T06:00:00Z', value: 45 },
      { timestamp: '2025-04-09T07:00:00Z', value: 52 },
      { timestamp: '2025-04-09T08:00:00Z', value: 58 },
      { timestamp: '2025-04-09T09:00:00Z', value: 68 },
      { timestamp: '2025-04-09T10:00:00Z', value: 78 },
      { timestamp: '2025-04-09T11:00:00Z', value: 85 },
      { timestamp: '2025-04-09T12:00:00Z', value: 82 },
      { timestamp: '2025-04-09T13:00:00Z', value: 78 },
      { timestamp: '2025-04-09T14:00:00Z', value: 82 },
      { timestamp: '2025-04-09T15:00:00Z', value: 88 },
      { timestamp: '2025-04-09T16:00:00Z', value: 84 },
      { timestamp: '2025-04-09T17:00:00Z', value: 78 },
      { timestamp: '2025-04-09T18:00:00Z', value: 72 },
      { timestamp: '2025-04-09T19:00:00Z', value: 65 },
      { timestamp: '2025-04-09T20:00:00Z', value: 58 },
      { timestamp: '2025-04-09T21:00:00Z', value: 52 },
      { timestamp: '2025-04-09T22:00:00Z', value: 48 },
      { timestamp: '2025-04-09T23:00:00Z', value: 46 },
    ],
    apiRequests: [
      { timestamp: '2025-04-09T00:00:00Z', value: 24 },
      { timestamp: '2025-04-09T01:00:00Z', value: 18 },
      { timestamp: '2025-04-09T02:00:00Z', value: 12 },
      { timestamp: '2025-04-09T03:00:00Z', value: 8 },
      { timestamp: '2025-04-09T04:00:00Z', value: 6 },
      { timestamp: '2025-04-09T05:00:00Z', value: 15 },
      { timestamp: '2025-04-09T06:00:00Z', value: 32 },
      { timestamp: '2025-04-09T07:00:00Z', value: 68 },
      { timestamp: '2025-04-09T08:00:00Z', value: 112 },
      { timestamp: '2025-04-09T09:00:00Z', value: 178 },
      { timestamp: '2025-04-09T10:00:00Z', value: 232 },
      { timestamp: '2025-04-09T11:00:00Z', value: 265 },
      { timestamp: '2025-04-09T12:00:00Z', value: 245 },
      { timestamp: '2025-04-09T13:00:00Z', value: 234 },
      { timestamp: '2025-04-09T14:00:00Z', value: 256 },
      { timestamp: '2025-04-09T15:00:00Z', value: 278 },
      { timestamp: '2025-04-09T16:00:00Z', value: 245 },
      { timestamp: '2025-04-09T17:00:00Z', value: 214 },
      { timestamp: '2025-04-09T18:00:00Z', value: 165 },
      { timestamp: '2025-04-09T19:00:00Z', value: 124 },
      { timestamp: '2025-04-09T20:00:00Z', value: 95 },
      { timestamp: '2025-04-09T21:00:00Z', value: 68 },
      { timestamp: '2025-04-09T22:00:00Z', value: 45 },
      { timestamp: '2025-04-09T23:00:00Z', value: 32 },
    ],
  },
  costOptimization: {
    tokensPerWorkflow: [
      { name: 'Customer Support Assistant', usage: 785250, cost: 1962.5 },
      { name: 'Data Analysis Pipeline', usage: 332450, cost: 831.12 },
      { name: 'Content Moderation', usage: 224890, cost: 562.22 },
      { name: 'Lead Qualification', usage: 108450, cost: 271.12 },
      { name: 'Document Processor', usage: 81420, cost: 203.55 },
    ],
    modelUsage: [
      { model: 'GPT-4', usage: 65, cost: 2340.8 },
      { model: 'GPT-3.5', usage: 28, cost: 840.4 },
      { model: 'Claude 3', usage: 4, cost: 520.2 },
      { model: 'Custom Model', usage: 3, cost: 129.1 },
    ],
    recommendations: [
      {
        id: 1,
        title: 'Optimize token usage in Customer Support',
        saving: 420.5,
        implementation: 'Medium',
      },
      {
        id: 2,
        title: 'Downgrade to GPT-3.5 for routine tasks',
        saving: 680.2,
        implementation: 'Easy',
      },
      {
        id: 3,
        title: 'Implement caching for common queries',
        saving: 312.8,
        implementation: 'Hard',
      },
      {
        id: 4,
        title: 'Optimize prompt length in Data Analysis',
        saving: 210.3,
        implementation: 'Medium',
      },
    ],
  },
};

// Helper components
const StatCard = ({ title, value, icon, change, changeType, subtitle }) => {
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
        <div>
          <p className='text-2xl font-semibold text-gray-800 dark:text-white'>
            {value}
          </p>
          {subtitle && (
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              {subtitle}
            </p>
          )}
        </div>
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

const ChartCard = ({ title, children, subtext, actionButton }) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-medium text-gray-800 dark:text-white'>
          {title}
        </h3>
        {actionButton}
      </div>
      {subtext && (
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
          {subtext}
        </p>
      )}
      {children}
    </div>
  );
};

// Simulate simple bar chart since we can't use real charts here
const SimpleBarChart = ({ data, maxValue, valueKey, nameKey }) => {
  return (
    <div className='space-y-3'>
      {data.map((item, index) => (
        <div key={index} className='space-y-1'>
          <div className='flex justify-between text-xs'>
            <span className='font-medium text-gray-700 dark:text-gray-300'>
              {item[nameKey]}
            </span>
            <span className='text-gray-500 dark:text-gray-400'>
              {item[valueKey]}
            </span>
          </div>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
            <div
              className='bg-blue-600 h-2 rounded-full'
              style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Line chart component for time series data
const SimpleLineChart = ({ data, label }) => {
  // Since we can't render actual charts here, show a simplified version
  return (
    <div className='w-full h-48 relative flex items-end pb-4'>
      <div className='absolute left-0 top-2 text-xs text-gray-500 dark:text-gray-400'>
        {label}
      </div>
      <div className='w-full h-32 flex items-end justify-between pt-6'>
        {data
          .filter((_, i) => i % 4 === 0)
          .map((point, index) => (
            <div
              key={index}
              className='h-full flex flex-col items-center justify-end'
            >
              <div
                className='w-2 bg-blue-600 rounded-t'
                style={{ height: `${(point.value / 100) * 100}%` }}
              ></div>
              <span className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                {new Date(point.timestamp).getHours() + 'h'}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState('day');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setAnalyticsData(mockAnalyticsData);
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, [timeRange]);

  // Format number helper
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format time helper
  const formatTime = (ms) => {
    return ms >= 1000 ? (ms / 1000).toFixed(1) + 's' : ms + 'ms';
  };

  // Handle refresh
  const handleRefresh = () => {
    setAnalyticsData(null);
    setIsLoading(true);
    // In a real app, this would refresh the data from the API
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      setIsLoading(false);
    }, 800);
  };

  if (isLoading || !analyticsData) {
    return (
      <div className='flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='flex flex-col items-center'>
          <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-300'>
            Loading analytics data...
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
            Analytics
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
            <button
              className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'
              title='Export analytics'
            >
              <Download className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
          Last updated:{' '}
          {new Date(analyticsData.overview.lastUpdated).toLocaleString()}
        </div>
      </div>

      {/* Analytics Content */}
      <div className='p-6 space-y-6'>
        {/* System Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          <StatCard
            title='Total Executions'
            value={formatNumber(analyticsData.overview.totalExecutions)}
            icon={<BarChart2 className='w-5 h-5' />}
            change='15%'
            changeType='increase'
          />
          <StatCard
            title='Active Agents'
            value={analyticsData.overview.activeAgents}
            icon={<Users className='w-5 h-5' />}
            change='2'
            changeType='increase'
          />
          <StatCard
            title='Completion Rate'
            value={`${analyticsData.overview.completionRate}%`}
            icon={<TrendingUp className='w-5 h-5' />}
            change='1.2%'
            changeType='increase'
          />
          <StatCard
            title='Avg Response Time'
            value={formatTime(analyticsData.overview.avgResponseTime)}
            icon={<Clock className='w-5 h-5' />}
            change='120ms'
            changeType='decrease'
            subtitle='12% faster than last week'
          />
        </div>

        {/* Workflow Performance & Agent Intelligence */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <ChartCard
            title='Workflow Performance'
            actionButton={
              <div className='relative'>
                <button className='text-sm text-gray-500 dark:text-gray-400 flex items-center'>
                  Sort By
                  <ChevronDown className='w-4 h-4 ml-1' />
                </button>
              </div>
            }
          >
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-900/50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Workflow
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Executions
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Response Time
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Success Rate
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {analyticsData.workflowPerformance.map((workflow) => (
                    <tr
                      key={workflow.id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    >
                      <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                        {workflow.name}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {formatNumber(workflow.executions)}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {formatTime(workflow.avgResponseTime)}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='w-full max-w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2'>
                            <div
                              className={`h-2 rounded-full ${
                                workflow.completionRate >= 95
                                  ? 'bg-green-500'
                                  : workflow.completionRate >= 90
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${workflow.completionRate}%` }}
                            ></div>
                          </div>
                          <span className='text-xs font-medium text-gray-900 dark:text-white'>
                            {workflow.completionRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          <ChartCard title='Agent Intelligence Metrics'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-900/50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Agent
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Accuracy
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Knowledge
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Improvement
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {analyticsData.agentIntelligence.map((agent) => (
                    <tr
                      key={agent.id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    >
                      <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                        {agent.name}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='w-full max-w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2'>
                            <div
                              className='bg-blue-600 h-2 rounded-full'
                              style={{ width: `${agent.accuracy}%` }}
                            ></div>
                          </div>
                          <span className='text-xs font-medium text-gray-900 dark:text-white'>
                            {agent.accuracy}%
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='w-full max-w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2'>
                            <div
                              className='bg-purple-600 h-2 rounded-full'
                              style={{
                                width: `${agent.knowledgeUtilization}%`,
                              }}
                            ></div>
                          </div>
                          <span className='text-xs font-medium text-gray-900 dark:text-white'>
                            {agent.knowledgeUtilization}%
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm'>
                        <span className='text-green-500 flex items-center'>
                          ↑ {agent.improvement}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

        {/* User Interactions & Resource Usage */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <ChartCard title='User Interactions'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <div className='text-3xl font-bold text-gray-800 dark:text-white'>
                      {formatNumber(
                        analyticsData.userInteractions.totalInteractions
                      )}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Total Interactions
                    </div>
                  </div>
                  <div>
                    <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                      {analyticsData.userInteractions.userSatisfaction}
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        /5
                      </span>
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Satisfaction Score
                    </div>
                  </div>
                </div>

                <div className='mt-6'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                    Top User Queries
                  </h4>
                  <div className='space-y-2'>
                    {analyticsData.userInteractions.topQueries.map(
                      (item, index) => (
                        <div
                          key={index}
                          className='flex justify-between text-sm'
                        >
                          <span className='text-gray-600 dark:text-gray-400'>
                            {item.query}
                          </span>
                          <span className='text-gray-800 dark:text-gray-200 font-medium'>
                            {item.count}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                  Query Distribution by Hour
                </h4>
                <div className='h-56 flex items-end space-x-1'>
                  {Object.entries(
                    analyticsData.userInteractions.queriesByTime
                  ).map(([hour, count], index) => {
                    const maxCount = Math.max(
                      ...Object.values(
                        analyticsData.userInteractions.queriesByTime
                      )
                    );
                    const height = (count / maxCount) * 100;
                    return (
                      <div
                        key={index}
                        className='flex-1 flex flex-col items-center'
                      >
                        <div
                          className='w-full bg-blue-500 dark:bg-blue-600 rounded-t'
                          style={{ height: `${height}%` }}
                        ></div>
                        {index % 6 === 0 && (
                          <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                            {hour}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ChartCard>

          <ChartCard title='System Resource Usage'>
            <div className='space-y-6'>
              <div>
                <div className='flex justify-between items-center mb-2'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    CPU Utilization
                  </h4>
                  <div className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                    95% <span className='text-xs text-red-500'>↑ 8%</span>
                  </div>
                </div>
                <SimpleLineChart
                  data={analyticsData.resourceUsage.cpu}
                  label='CPU %'
                />
              </div>

              <div>
                <div className='flex justify-between items-center mb-2'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Memory Usage
                  </h4>
                  <div className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                    88% <span className='text-xs text-red-500'>↑ 5%</span>
                  </div>
                </div>
                <SimpleLineChart
                  data={analyticsData.resourceUsage.memory}
                  label='Memory %'
                />
              </div>

              <div>
                <div className='flex justify-between items-center mb-2'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    API Requests
                  </h4>
                  <div className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                    278 <span className='text-xs text-green-500'>↑ 12%</span>
                  </div>
                </div>
                <SimpleLineChart
                  data={analyticsData.resourceUsage.apiRequests}
                  label='Requests'
                />
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Cost Optimization */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2'>
            <ChartCard
              title='Token Usage by Workflow'
              actionButton={
                <button className='text-xs text-blue-600 dark:text-blue-400'>
                  View Detailed Report
                </button>
              }
            >
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead className='bg-gray-50 dark:bg-gray-900/50'>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Workflow
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Tokens Used
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Cost ($)
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                    {analyticsData.costOptimization.tokensPerWorkflow.map(
                      (workflow, index) => {
                        const totalCost =
                          analyticsData.costOptimization.tokensPerWorkflow.reduce(
                            (sum, w) => sum + w.cost,
                            0
                          );
                        const percentOfTotal = (
                          (workflow.cost / totalCost) *
                          100
                        ).toFixed(1);

                        return (
                          <tr
                            key={index}
                            className='hover:bg-gray-50 dark:hover:bg-gray-900/50'
                          >
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                              {workflow.name}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                              {formatNumber(workflow.usage)}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                              ${workflow.cost.toFixed(2)}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='w-full max-w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2'>
                                  <div
                                    className='bg-blue-600 h-2 rounded-full'
                                    style={{ width: `${percentOfTotal}%` }}
                                  ></div>
                                </div>
                                <span className='text-xs font-medium text-gray-900 dark:text-white'>
                                  {percentOfTotal}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>

          <div>
            <ChartCard
              title='Optimization Opportunities'
              subtext='Potential cost savings based on current usage patterns'
            >
              <div className='space-y-4'>
                {analyticsData.costOptimization.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'
                  >
                    <div className='font-medium text-blue-700 dark:text-blue-400 text-sm mb-1'>
                      {rec.title}
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600 dark:text-gray-400'>
                        Potential savings:
                      </span>
                      <span className='font-medium text-green-600 dark:text-green-400'>
                        ${rec.saving.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm mt-1'>
                      <span className='text-gray-600 dark:text-gray-400'>
                        Implementation:
                      </span>
                      <span
                        className={`font-medium ${
                          rec.implementation === 'Easy'
                            ? 'text-green-600 dark:text-green-400'
                            : rec.implementation === 'Medium'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {rec.implementation}
                      </span>
                    </div>
                  </div>
                ))}

                <div className='mt-6'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                    Model Usage Distribution
                  </h4>
                  <div className='space-y-2'>
                    {analyticsData.costOptimization.modelUsage.map(
                      (model, index) => {
                        const totalUsage =
                          analyticsData.costOptimization.modelUsage.reduce(
                            (sum, m) => sum + m.usage,
                            0
                          );
                        return (
                          <div key={index} className='space-y-1'>
                            <div className='flex justify-between text-xs'>
                              <span className='font-medium text-gray-700 dark:text-gray-300'>
                                {model.model}
                              </span>
                              <span className='text-gray-500 dark:text-gray-400'>
                                {model.usage}%
                              </span>
                            </div>
                            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                              <div
                                className={`h-2 rounded-full ${
                                  index === 0
                                    ? 'bg-blue-600'
                                    : index === 1
                                    ? 'bg-green-500'
                                    : index === 2
                                    ? 'bg-purple-500'
                                    : 'bg-yellow-500'
                                }`}
                                style={{
                                  width: `${(model.usage / 100) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
};
