// components/pages/MemoryAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Brain,
  BarChart2,
  Filter,
  Download,
  RefreshCw,
  Search,
  Calendar,
  Clock,
  Database,
  Activity,
  TrendingUp,
  TrendingDown,
  FileText,
  Globe,
  Users,
  Zap,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const MemoryAnalytics = ({ onClose }) => {
  const { navigateTo, settings } = useApp();
  const darkMode = settings?.preferences?.theme === 'dark' || false;

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [selectedAgents, setSelectedAgents] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [memoryData, setMemoryData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    usage: true,
    patterns: false,
    agents: false,
  });

  // Mock data per la demo
  const mockMemoryData = {
    overview: {
      totalMemoryItems: 15247,
      averageConfidence: 0.847,
      memoryUsage: '2.3 GB',
      lastAnalysis: new Date().toISOString(),
      growthRate: 12.5,
    },
    agents: [
      {
        id: 'agent-001',
        name: 'Customer Support Agent',
        memoryItems: 4521,
        confidence: 0.92,
        usage: '820 MB',
        lastAccess: '2 min ago',
        status: 'active',
        memoryTypes: {
          conversations: 2341,
          knowledge: 1876,
          procedures: 304,
        },
      },
      {
        id: 'agent-002',
        name: 'Data Analysis Agent',
        memoryItems: 3782,
        confidence: 0.89,
        usage: '654 MB',
        lastAccess: '15 min ago',
        status: 'active',
        memoryTypes: {
          conversations: 1298,
          knowledge: 1876,
          procedures: 608,
        },
      },
      {
        id: 'agent-003',
        name: 'Content Generation Agent',
        memoryItems: 2956,
        confidence: 0.76,
        usage: '423 MB',
        lastAccess: '1h ago',
        status: 'idle',
        memoryTypes: {
          conversations: 1432,
          knowledge: 1124,
          procedures: 400,
        },
      },
      {
        id: 'agent-004',
        name: 'Translation Agent',
        memoryItems: 3988,
        confidence: 0.84,
        usage: '567 MB',
        lastAccess: '3h ago',
        status: 'idle',
        memoryTypes: {
          conversations: 2104,
          knowledge: 1534,
          procedures: 350,
        },
      },
    ],
    memoryTypes: {
      conversations: { count: 7175, growth: 8.2, avgConfidence: 0.91 },
      knowledge: { count: 6410, growth: 15.7, avgConfidence: 0.85 },
      procedures: { count: 1662, growth: 4.3, avgConfidence: 0.82 },
    },
    trends: {
      memoryGrowth: [
        { time: '7d ago', value: 13200 },
        { time: '6d ago', value: 13450 },
        { time: '5d ago', value: 13890 },
        { time: '4d ago', value: 14250 },
        { time: '3d ago', value: 14567 },
        { time: '2d ago', value: 14823 },
        { time: '1d ago', value: 15089 },
        { time: 'now', value: 15247 },
      ],
      confidenceOverTime: [
        { time: '7d ago', value: 0.823 },
        { time: '6d ago', value: 0.834 },
        { time: '5d ago', value: 0.841 },
        { time: '4d ago', value: 0.839 },
        { time: '3d ago', value: 0.844 },
        { time: '2d ago', value: 0.851 },
        { time: '1d ago', value: 0.849 },
        { time: 'now', value: 0.847 },
      ],
    },
    topMemoryItems: [
      {
        id: 'mem-001',
        content: 'Customer prefers email notifications over SMS',
        confidence: 0.94,
        agent: 'Customer Support Agent',
        type: 'knowledge',
        created: '2024-01-15',
        accessed: 234,
      },
      {
        id: 'mem-002',
        content: 'SQL query optimization for large datasets',
        confidence: 0.91,
        agent: 'Data Analysis Agent',
        type: 'procedures',
        created: '2024-01-12',
        accessed: 189,
      },
      {
        id: 'mem-003',
        content: 'Brand voice guidelines for marketing content',
        confidence: 0.88,
        agent: 'Content Generation Agent',
        type: 'knowledge',
        created: '2024-01-10',
        accessed: 167,
      },
    ],
  };

  // Simulazione loading dei dati
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setMemoryData(mockMemoryData);
      setIsLoading(false);
    }, 800);
  }, [timeRange]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMemoryData(mockMemoryData);
      setIsLoading(false);
    }, 500);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400';
      case 'idle':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'inactive':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Componente per le card statistiche
  const StatCard = ({ title, value, icon, change, changeType, subtitle }) => (
    <div
      className={`p-6 rounded-lg border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm`}
    >
      <div className='flex items-center justify-between'>
        <div>
          <p
            className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-semibold mt-1 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className={`text-xs mt-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}
        >
          {icon}
        </div>
      </div>
      {change && (
        <div className='flex items-center mt-4'>
          {changeType === 'increase' ? (
            <TrendingUp className='w-4 h-4 text-green-500 mr-1' />
          ) : (
            <TrendingDown className='w-4 h-4 text-red-500 mr-1' />
          )}
          <span
            className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
          <span
            className={`text-sm ml-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            vs last {timeRange}
          </span>
        </div>
      )}
    </div>
  );

  // Componente per le sezioni espandibili
  const ExpandableSection = ({
    title,
    children,
    sectionKey,
    defaultExpanded = true,
  }) => (
    <div
      className={`rounded-lg border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm overflow-hidden`}
    >
      <button
        onClick={() => toggleSection(sectionKey)}
        className={`w-full px-6 py-4 flex items-center justify-between ${
          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
        } transition-colors`}
      >
        <h3
          className={`text-lg font-medium ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp className='w-5 h-5 text-gray-400' />
        ) : (
          <ChevronDown className='w-5 h-5 text-gray-400' />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className='px-6 pb-6'>{children}</div>
      )}
    </div>
  );

  if (isLoading || !memoryData) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className='flex flex-col items-center'>
          <div className='w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading memory analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 overflow-auto ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <div
        className={`border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        } px-6 py-4`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <button
              onClick={() => (onClose ? onClose() : navigateTo('workflow'))}
              className={`mr-4 ${
                darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowLeft className='w-5 h-5' />
            </button>
            <div className='flex items-center'>
              <div className='w-8 h-8 rounded-md bg-purple-600 flex items-center justify-center text-white mr-3'>
                <Brain className='w-5 h-5' />
              </div>
              <h1
                className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}
              >
                Memory Analytics
              </h1>
            </div>
          </div>

          {/* Controls */}
          <div className='flex items-center space-x-3'>
            {/* Time Range Selector */}
            <div
              className={`flex items-center space-x-1 rounded-lg p-1 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              {['day', 'week', 'month'].map((range) => (
                <button
                  key={range}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === range
                      ? darkMode
                        ? 'bg-gray-600 text-white shadow-sm'
                        : 'bg-white text-gray-900 shadow-sm'
                      : darkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setTimeRange(range)}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              className={`p-2 rounded-md ${
                darkMode
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } transition-colors`}
              title='Refresh data'
            >
              <RefreshCw className='w-5 h-5' />
            </button>

            <button
              className={`p-2 rounded-md ${
                darkMode
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } transition-colors`}
              title='Export data'
            >
              <Download className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div
          className={`mt-4 text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Last updated:{' '}
          {new Date(memoryData.overview.lastAnalysis).toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className='p-6 space-y-6'>
        {/* Overview Stats */}
        <ExpandableSection title='Overview' sectionKey='overview'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <StatCard
              title='Total Memory Items'
              value={formatNumber(memoryData.overview.totalMemoryItems)}
              icon={<Database className='w-5 h-5 text-blue-600' />}
              change={`+${memoryData.overview.growthRate}%`}
              changeType='increase'
            />
            <StatCard
              title='Average Confidence'
              value={`${(memoryData.overview.averageConfidence * 100).toFixed(
                1
              )}%`}
              icon={<TrendingUp className='w-5 h-5 text-green-600' />}
              change='+2.3%'
              changeType='increase'
            />
            <StatCard
              title='Memory Usage'
              value={memoryData.overview.memoryUsage}
              icon={<BarChart2 className='w-5 h-5 text-purple-600' />}
              change='+180MB'
              changeType='increase'
            />
            <StatCard
              title='Active Agents'
              value={
                memoryData.agents.filter((a) => a.status === 'active').length
              }
              icon={<Activity className='w-5 h-5 text-orange-600' />}
              subtitle='Out of 4 total'
            />
          </div>
        </ExpandableSection>

        {/* Memory by Type */}
        <ExpandableSection
          title='Memory Distribution by Type'
          sectionKey='usage'
        >
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {Object.entries(memoryData.memoryTypes).map(([type, data]) => (
              <div
                key={type}
                className={`p-4 rounded-lg border ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}
              >
                <div className='flex items-center justify-between mb-3'>
                  <h4
                    className={`font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </h4>
                  <div
                    className={`p-1 rounded ${
                      type === 'conversations'
                        ? 'bg-blue-100 text-blue-600'
                        : type === 'knowledge'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {type === 'conversations' ? (
                      <Users className='w-4 h-4' />
                    ) : type === 'knowledge' ? (
                      <Globe className='w-4 h-4' />
                    ) : (
                      <Zap className='w-4 h-4' />
                    )}
                  </div>
                </div>
                <div
                  className={`text-2xl font-bold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {formatNumber(data.count)}
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span
                    className={`${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Confidence: {(data.avgConfidence * 100).toFixed(1)}%
                  </span>
                  <span className='text-green-600 font-medium'>
                    +{data.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ExpandableSection>

        {/* Agents Overview */}
        <ExpandableSection title='Agent Memory Overview' sectionKey='agents'>
          <div className='space-y-4'>
            {memoryData.agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-4 border rounded-lg ${
                  darkMode
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3'>
                      <Brain className='w-5 h-5' />
                    </div>
                    <div>
                      <h4
                        className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {agent.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Last access: {agent.lastAccess}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        agent.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : agent.status === 'idle'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {agent.status}
                    </span>
                    <button
                      className={`p-1 rounded ${
                        darkMode
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <Eye className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div>
                    <p
                      className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Memory Items
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {formatNumber(agent.memoryItems)}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Confidence
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {(agent.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Usage
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {agent.usage}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Memory Types
                    </p>
                    <div className='flex space-x-1 mt-1'>
                      <span
                        className='w-3 h-3 bg-blue-500 rounded-full'
                        title={`Conversations: ${agent.memoryTypes.conversations}`}
                      ></span>
                      <span
                        className='w-3 h-3 bg-green-500 rounded-full'
                        title={`Knowledge: ${agent.memoryTypes.knowledge}`}
                      ></span>
                      <span
                        className='w-3 h-3 bg-yellow-500 rounded-full'
                        title={`Procedures: ${agent.memoryTypes.procedures}`}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ExpandableSection>

        {/* Top Memory Items */}
        <ExpandableSection
          title='High-Value Memory Items'
          sectionKey='patterns'
        >
          <div className='space-y-3'>
            {memoryData.topMemoryItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg ${
                  darkMode
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center mb-2'>
                      <div
                        className={`p-1 rounded mr-2 ${
                          item.type === 'knowledge'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : item.type === 'procedures'
                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}
                      >
                        {item.type === 'knowledge' ? (
                          <Globe className='w-3 h-3' />
                        ) : item.type === 'procedures' ? (
                          <Zap className='w-3 h-3' />
                        ) : (
                          <Users className='w-3 h-3' />
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.type === 'knowledge'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : item.type === 'procedures'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <p
                      className={`font-medium mb-1 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.content}
                    </p>
                    <div className='flex items-center text-sm space-x-4'>
                      <span
                        className={`${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Agent: {item.agent}
                      </span>
                      <span
                        className={`${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Created: {new Date(item.created).toLocaleDateString()}
                      </span>
                      <span
                        className={`${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Accessed: {item.accessed} times
                      </span>
                    </div>
                  </div>
                  <div className='ml-4 text-right'>
                    <div
                      className={`text-lg font-bold ${
                        item.confidence >= 0.9
                          ? 'text-green-600'
                          : item.confidence >= 0.8
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {(item.confidence * 100).toFixed(1)}%
                    </div>
                    <div
                      className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      confidence
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ExpandableSection>

        {/* Search and Filters */}
        <div
          className={`p-6 rounded-lg border ${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } shadow-sm`}
        >
          <h3
            className={`text-lg font-medium mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Search Memory Items
          </h3>

          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <input
                  type='text'
                  placeholder='Search memory content...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                  } focus:outline-none focus:ring-2`}
                />
              </div>
            </div>

            <select
              value={selectedAgents}
              onChange={(e) => setSelectedAgents(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'
              } focus:outline-none focus:ring-2`}
            >
              <option value='all'>All Agents</option>
              {memoryData.agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>

            <button className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center'>
              <Filter className='w-4 h-4 mr-2' />
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
