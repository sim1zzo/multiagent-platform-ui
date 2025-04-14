import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Filter, Search, RefreshCw, Clock, User, ArrowRight, Maximize, Minimize, Info, Check, X, MessageSquare, Bot, ExternalLink } from 'lucide-react';

// Mock conversation flow data
const mockConversationData = {
  conversations: [
    {
      id: 'conv-001',
      user: 'John Doe',
      startTime: '2025-04-12T10:15:32Z',
      endTime: '2025-04-12T10:18:45Z',
      duration: '3m 13s',
      status: 'completed',
      satisfaction: 4.8,
      path: [
        { 
          id: 'node-1', 
          type: 'trigger', 
          name: 'Chat Initiated',
          time: '10:15:32',
          duration: '0.2s'
        },
        { 
          id: 'node-2', 
          type: 'agent', 
          name: 'Support Triage Agent',
          time: '10:15:33',
          duration: '1.3s',
          sentiment: 'neutral',
          confidence: 0.92
        },
        { 
          id: 'node-3', 
          type: 'condition', 
          name: 'Issue Type Router',
          time: '10:15:36',
          duration: '0.1s',
          result: 'technical'
        },
        { 
          id: 'node-4', 
          type: 'agent', 
          name: 'Technical Support Agent',
          time: '10:15:38',
          duration: '2.5s',
          sentiment: 'positive',
          confidence: 0.88
        },
        { 
          id: 'node-5', 
          type: 'action', 
          name: 'Knowledge Base Lookup',
          time: '10:16:42',
          duration: '1.4s'
        },
        { 
          id: 'node-6', 
          type: 'agent', 
          name: 'Technical Support Agent',
          time: '10:17:12',
          duration: '1.8s',
          sentiment: 'positive',
          confidence: 0.95
        }
      ],
      messages: 8,
      issue: 'Password reset assistance',
      resolution: 'Resolved'
    },
    {
      id: 'conv-002',
      user: 'Emily Johnson',
      startTime: '2025-04-12T11:22:05Z',
      endTime: '2025-04-12T11:28:30Z',
      duration: '6m 25s',
      status: 'completed',
      satisfaction: 3.2,
      path: [
        { 
          id: 'node-1', 
          type: 'trigger', 
          name: 'Chat Initiated',
          time: '11:22:05',
          duration: '0.2s'
        },
        { 
          id: 'node-2', 
          type: 'agent', 
          name: 'Support Triage Agent',
          time: '11:22:06',
          duration: '1.5s',
          sentiment: 'neutral',
          confidence: 0.85
        },
        { 
          id: 'node-3', 
          type: 'condition', 
          name: 'Issue Type Router',
          time: '11:22:08',
          duration: '0.1s',
          result: 'billing'
        },
        { 
          id: 'node-4', 
          type: 'agent', 
          name: 'Billing Support Agent',
          time: '11:22:10',
          duration: '2.2s',
          sentiment: 'negative',
          confidence: 0.76
        },
        { 
          id: 'node-5', 
          type: 'action', 
          name: 'Account Lookup',
          time: '11:23:15',
          duration: '1.8s'
        },
        { 
          id: 'node-6', 
          type: 'agent', 
          name: 'Billing Support Agent',
          time: '11:24:20',
          duration: '1.5s',
          sentiment: 'neutral',
          confidence: 0.82
        },
        { 
          id: 'node-7', 
          type: 'condition', 
          name: 'Escalation Required',
          time: '11:25:40',
          duration: '0.1s',
          result: 'true'
        },
        { 
          id: 'node-8', 
          type: 'agent', 
          name: 'Human Support Agent',
          time: '11:26:00',
          duration: '0s',
          sentiment: 'positive',
          confidence: 1.0
        }
      ],
      messages: 12,
      issue: 'Disputed charge on account',
      resolution: 'Escalated to human agent'
    },
    {
      id: 'conv-003',
      user: 'Michael Smith',
      startTime: '2025-04-12T09:45:22Z',
      endTime: '2025-04-12T09:49:10Z',
      duration: '3m 48s',
      status: 'completed',
      satisfaction: 5.0,
      path: [
        { 
          id: 'node-1', 
          type: 'trigger', 
          name: 'Chat Initiated',
          time: '09:45:22',
          duration: '0.2s'
        },
        { 
          id: 'node-2', 
          type: 'agent', 
          name: 'Support Triage Agent',
          time: '09:45:23',
          duration: '1.1s',
          sentiment: 'positive',
          confidence: 0.94
        },
        { 
          id: 'node-3', 
          type: 'condition', 
          name: 'Issue Type Router',
          time: '09:45:25',
          duration: '0.1s',
          result: 'technical'
        },
        { 
          id: 'node-4', 
          type: 'agent', 
          name: 'Technical Support Agent',
          time: '09:45:26',
          duration: '2.3s',
          sentiment: 'positive',
          confidence: 0.91
        },
        { 
          id: 'node-5', 
          type: 'action', 
          name: 'Knowledge Base Lookup',
          time: '09:46:30',
          duration: '1.2s'
        },
        { 
          id: 'node-6', 
          type: 'agent', 
          name: 'Technical Support Agent',
          time: '09:47:00',
          duration: '1.5s',
          sentiment: 'positive',
          confidence: 0.97
        }
      ],
      messages: 6,
      issue: 'Feature usage instructions',
      resolution: 'Resolved'
    },
    {
      id: 'conv-004',
      user: 'Sarah Williams',
      startTime: '2025-04-12T14:02:12Z',
      endTime: null,
      duration: 'Active',
      status: 'active',
      satisfaction: null,
      path: [
        { 
          id: 'node-1', 
          type: 'trigger', 
          name: 'Chat Initiated',
          time: '14:02:12',
          duration: '0.2s'
        },
        { 
          id: 'node-2', 
          type: 'agent', 
          name: 'Support Triage Agent',
          time: '14:02:13',
          duration: '1.4s',
          sentiment: 'neutral',
          confidence: 0.87
        },
        { 
          id: 'node-3', 
          type: 'condition', 
          name: 'Issue Type Router',
          time: '14:02:15',
          duration: '0.1s',
          result: 'billing'
        },
        { 
          id: 'node-4', 
          type: 'agent', 
          name: 'Billing Support Agent',
          time: '14:02:17',
          duration: '2.0s',
          sentiment: 'neutral',
          confidence: 0.82
        },
        { 
          id: 'node-5', 
          type: 'action', 
          name: 'Account Lookup',
          time: '14:03:20',
          duration: '1.5s',
          inProgress: true
        }
      ],
      messages: 4,
      issue: 'Subscription upgrade questions',
      resolution: null
    },
    {
      id: 'conv-005',
      user: 'James Anderson',
      startTime: '2025-04-12T12:15:40Z',
      endTime: '2025-04-12T12:16:20Z',
      duration: '40s',
      status: 'abandoned',
      satisfaction: null,
      path: [
        { 
          id: 'node-1', 
          type: 'trigger', 
          name: 'Chat Initiated',
          time: '12:15:40',
          duration: '0.2s'
        },
        { 
          id: 'node-2', 
          type: 'agent', 
          name: 'Support Triage Agent',
          time: '12:15:41',
          duration: '1.2s',
          sentiment: 'neutral',
          confidence: 0.82
        },
        { 
          id: 'node-3', 
          type: 'condition', 
          name: 'Issue Type Router',
          time: '12:15:43',
          duration: '0.1s',
          result: 'technical'
        },
        { 
          id: 'node-4', 
          type: 'agent', 
          name: 'Technical Support Agent',
          time: '12:15:45',
          duration: '2.1s',
          sentiment: 'neutral',
          confidence: 0.79
        }
      ],
      messages: 2,
      issue: 'Unknown - conversation abandoned',
      resolution: 'Abandoned'
    }
  ],
  flowMetrics: {
    commonPaths: [
      {
        path: 'Triage → Technical Support → Knowledge Base → Resolution',
        count: 245,
        avgDuration: '3m 22s',
        avgSatisfaction: 4.5
      },
      {
        path: 'Triage → Billing Support → Account Lookup → Resolution',
        count: 178,
        avgDuration: '4m 15s',
        avgSatisfaction: 4.2
      },
      {
        path: 'Triage → Billing Support → Escalation → Human Agent',
        count: 52,
        avgDuration: '6m 35s',
        avgSatisfaction: 3.7
      }
    ],
    bottlenecks: [
      {
        node: 'Account Lookup Action',
        avgWaitTime: '45s',
        impact: 'high'
      },
      {
        node: 'Human Agent Handoff',
        avgWaitTime: '78s',
        impact: 'medium'
      }
    ],
    abandonmentPoints: [
      {
        node: 'Technical Support Agent',
        abandonCount: 12,
        percentage: 4.5
      },
      {
        node: 'Knowledge Base Lookup',
        abandonCount: 8,
        percentage: 3.2
      }
    ]
  },
  nodePerformance: [
    {
      id: 'node-2',
      name: 'Support Triage Agent',
      type: 'agent',
      avgProcessingTime: '1.3s',
      errorRate: 1.2,
      accuracy: 94.5,
      totalExecutions: 475
    },
    {
      id: 'node-4',
      name: 'Technical Support Agent',
      type: 'agent',
      avgProcessingTime: '2.4s',
      errorRate: 2.1,
      accuracy: 91.8,
      totalExecutions: 312
    },
    {
      id: 'alternative-4',
      name: 'Billing Support Agent',
      type: 'agent',
      avgProcessingTime: '2.2s',
      errorRate: 2.8,
      accuracy: 89.5,
      totalExecutions: 218
    },
    {
      id: 'node-5',
      name: 'Knowledge Base Lookup',
      type: 'action',
      avgProcessingTime: '1.5s',
      errorRate: 3.2,
      accuracy: 96.2,
      totalExecutions: 289
    }
  ]
};

// Function to get node type icon
const getNodeIcon = (type) => {
  switch (type) {
    case 'trigger':
      return <MessageSquare className="w-4 h-4" />;
    case 'agent':
      return <Bot className="w-4 h-4" />;
    case 'condition':
      return <ArrowRight className="w-4 h-4" />;
    case 'action':
      return <ExternalLink className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

// Function to get node background color
const getNodeColor = (type, sentiment = 'neutral') => {
  // First determine type-based color
  let bgColor;
  switch (type) {
    case 'trigger':
      bgColor = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      break;
    case 'agent':
      // For agents, we modify based on sentiment
      if (sentiment === 'positive') {
        bgColor = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      } else if (sentiment === 'negative') {
        bgColor = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      } else {
        bgColor = 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      }
      break;
    case 'condition':
      bgColor = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      break;
    case 'action':
      bgColor = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      break;
    default:
      bgColor = 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  }
  
  return bgColor;
};

// Status component
const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { 
          bg: 'bg-green-100', 
          text: 'text-green-800', 
          darkBg: 'dark:bg-green-900', 
          darkText: 'dark:text-green-300', 
          icon: <Check className="w-3 h-3 mr-1" /> 
        };
      case 'active':
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-800', 
          darkBg: 'dark:bg-blue-900', 
          darkText: 'dark:text-blue-300', 
          icon: <Clock className="w-3 h-3 mr-1" /> 
        };
      case 'abandoned':
        return { 
          bg: 'bg-red-100', 
          text: 'text-red-800', 
          darkBg: 'dark:bg-red-900', 
          darkText: 'dark:text-red-300', 
          icon: <X className="w-3 h-3 mr-1" /> 
        };
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800', 
          darkBg: 'dark:bg-gray-900', 
          darkText: 'dark:text-gray-300', 
          icon: <Info className="w-3 h-3 mr-1" /> 
        };
    }
  };

  const { bg, text, darkBg, darkText, icon } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} ${darkBg} ${darkText}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Single conversation flow component
const ConversationFlowView = ({ conversation }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            Conversation {conversation.id}
            <StatusBadge status={conversation.status} className="ml-2" />
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {conversation.user} • Started {new Date(conversation.startTime).toLocaleTimeString()} • Duration: {conversation.duration}
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <button 
            onClick={toggleExpand}
            className="text-blue-600 dark:text-blue-400 text-sm flex items-center"
          >
            {expanded ? (
              <>
                <Minimize className="w-4 h-4 mr-1" />
                Collapse Details
              </>
            ) : (
              <>
                <Maximize className="w-4 h-4 mr-1" />
                View Details
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Issue: {conversation.issue}
        </div>
        {conversation.resolution && (
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Resolution: {conversation.resolution}
          </div>
        )}
      </div>
      
      {/* Conversation Flow Diagram */}
      <div className="relative pb-4">
        <div className="flex flex-nowrap overflow-x-auto py-4 px-2">
          {conversation.path.map((node, index) => (
            <div key={node.id} className="flex flex-col items-center min-w-fit">
              {/* Node */}
              <div className={`flex items-center justify-center p-2 rounded-lg ${getNodeColor(node.type, node?.sentiment)} ${index === conversation.path.length - 1 ? 'border-2 border-dashed' : ''}`}>
                <div className="mr-2">
                  {getNodeIcon(node.type)}
                </div>
                <div className="text-sm font-medium">{node.name}</div>
              </div>
              
              {/* Duration */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 whitespace-nowrap">
                {node.duration} {node?.inProgress && "(in progress)"}
              </div>
              
              {/* Connecting Line */}
              {index < conversation.path.length - 1 && (
                <div className="flex-1 w-16 flex items-center justify-center mt-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conversation Details
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Messages:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{conversation.messages}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Start Time:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {new Date(conversation.startTime).toLocaleString()}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">End Time:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {conversation.endTime ? new Date(conversation.endTime).toLocaleString() : 'Active'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">User Satisfaction:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {conversation.satisfaction ? `${conversation.satisfaction}/5.0` : 'N/A'}
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Node Performance
              </h4>
              <div className="space-y-3">
                {conversation.path.filter(node => node.type === 'agent').map((node, index) => (
                  <div key={`perf-${node.id}-${index}`} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500 dark:text-gray-400">{node.name}:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {node.confidence ? `${(node.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          node.sentiment === 'positive' ? 'bg-green-500' : 
                          node.sentiment === 'negative' ? 'bg-red-500' : 
                          'bg-blue-500'
                        }`}
                        style={{ width: `${(node.confidence || 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Statistics view component
const ConversationStats = ({ flowMetrics, nodePerformance }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Common Paths Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Common Conversation Paths</h3>
        <div className="space-y-5">
          {flowMetrics.commonPaths.map((pathData, index) => (
            <div key={`path-${index}`} className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="text-sm font-medium text-gray-800 dark:text-white">
                  {pathData.path}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Count</div>
                  <div className="font-medium text-gray-900 dark:text-white">{pathData.count}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Avg Duration</div>
                  <div className="font-medium text-gray-900 dark:text-white">{pathData.avgDuration}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Satisfaction</div>
                  <div className="font-medium text-gray-900 dark:text-white">{pathData.avgSatisfaction}/5.0</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottlenecks and Abandonment */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Flow Bottlenecks</h3>
        
        <div className="mb-6">
          <div className="space-y-3">
            {flowMetrics.bottlenecks.map((bottleneck, index) => (
              <div key={`bottleneck-${index}`} className="border-l-4 border-yellow-500 pl-3 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{bottleneck.node}</span>
                  <div 
                    className={`text-xs px-2 py-1 rounded-full ${
                      bottleneck.impact === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}
                  >
                    {bottleneck.impact} impact
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Average wait time: {bottleneck.avgWaitTime}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Abandonment Points</h3>
        <div className="space-y-3">
          {flowMetrics.abandonmentPoints.map((point, index) => (
            <div key={`abandon-${index}`} className="border-l-4 border-red-500 pl-3 py-2">
              <div className="text-sm font-medium text-gray-800 dark:text-white">{point.node}</div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {point.abandonCount} abandonments
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {point.percentage}% rate
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Node Performance */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Node Performance Metrics</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Node Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avg Processing Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Error Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Executions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {nodePerformance.map((node, index) => (
                <tr key={node.id} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900/50"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {node.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {node.avgProcessingTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      node.errorRate < 2 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : node.errorRate < 5
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}>
                      {node.errorRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full max-w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            node.accuracy >= 95 
                              ? "bg-green-500" 
                              : node.accuracy >= 90 
                                ? "bg-yellow-500" 
                                : "bg-red-500"
                          }`} 
                          style={{ width: `${node.accuracy}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {node.accuracy}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {node.totalExecutions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main Conversation Flow Visualizer component
const ConversationFlowVisualizer = () => {
  const [conversationData, setConversationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('day');
  const [activeTab, setActiveTab] = useState('conversations');
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be an API call
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setConversationData(mockConversationData);
      } catch (err) {
        console.error('Error fetching conversation data:', err);
        setError('Failed to load conversation data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);

  const handleRefresh = () => {
    setConversationData(null);
    setIsLoading(true);
    // In a real app, this would fetch updated data
    setTimeout(() => {
      setConversationData(mockConversationData);
      setIsLoading(false);
    }, 800);
  };

  const handleExport = () => {
    // In a real implementation, this would generate and download a report
    alert('Exporting conversation flow data (This would download a report in a real implementation)');
  };

  // Filter conversations based on search and status
  const filteredConversations = conversationData?.conversations.filter(conversation => {
    const matchesSearch = search === '' || 
      conversation.user.toLowerCase().includes(search.toLowerCase()) || 
      conversation.issue.toLowerCase().includes(search.toLowerCase()) ||
      conversation.id.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = filterStatus === 'all' || conversation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // If loading
  if (isLoading || !conversationData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading conversation data...</p>
        </div>
      </div>
    );
  }

  // If error occurred
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <X className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If a single conversation is selected for detailed view
  if (selectedConversation) {
    const conversation = conversationData.conversations.find(c => c.id === selectedConversation);
    
    if (!conversation) {
      return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300">Conversation not found.</p>
            <button 
              onClick={() => setSelectedConversation(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Conversations
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <button 
                onClick={() => setSelectedConversation(null)}
                className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              Conversation Details: {conversation.id}
            </h2>
            
            <StatusBadge status={conversation.status} />
          </div>
          
          <ConversationFlowView conversation={conversation} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Conversation Flow Visualizer
          </h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button 
                className={`px-3 py-1 text-sm rounded-md ${timeRange === 'day' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setTimeRange('day')}
              >
                Day
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setTimeRange('week')}
              >
                Week
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setTimeRange('month')}
              >
                Month
              </button>
            </div>
            <button 
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={handleRefresh}
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={handleExport}
              title="Export data"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex mt-4 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 ${
              activeTab === 'conversations'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('conversations')}
          >
            Conversations
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'stats'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Flow Analytics
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {activeTab === 'conversations' && (
          <>
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white mr-2"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="active">Active</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>
            </div>

            {/* Conversations List */}
            <div className="space-y-6">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(conversation => (
                  <ConversationFlowView 
                    key={conversation.id} 
                    conversation={conversation} 
                  />
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No conversations found matching your filters.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <ConversationStats 
            flowMetrics={conversationData.flowMetrics}
            nodePerformance={conversationData.nodePerformance}
          />
        )}
      </div>
    </div>
  );
};

export default ConversationFlowVisualizer;