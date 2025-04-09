// components/visualization/AgentMemoryVisualization.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Minus,
  RotateCw,
  X,
  Info,
} from 'lucide-react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Node Types for Memory Visualization
const MemoryItemNode = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const getTypeColor = () => {
    switch (data.type) {
      case 'fact':
        return 'bg-blue-500 text-white';
      case 'concept':
        return 'bg-purple-500 text-white';
      case 'rule':
        return 'bg-amber-500 text-white';
      case 'query':
        return 'bg-green-500 text-white';
      case 'external':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getTypeLabel = () => {
    return data.type.charAt(0).toUpperCase() + data.type.slice(1);
  };

  return (
    <div
      className={`p-3 rounded-lg border shadow-sm w-64 ${
        expanded ? 'min-h-32' : 'h-auto'
      } bg-white dark:bg-gray-800 dark:border-gray-700`}
    >
      <div className='flex items-center justify-between mb-2'>
        <div
          className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor()}`}
        >
          {getTypeLabel()}
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400'>
          {data.timestamp
            ? new Date(data.timestamp).toLocaleTimeString()
            : 'No timestamp'}
        </div>
      </div>

      <div className='font-medium text-sm text-gray-800 dark:text-gray-200 mb-1'>
        {data.title || 'Unnamed Memory'}
      </div>

      {expanded ? (
        <div className='text-sm text-gray-600 dark:text-gray-300 mt-2 mb-1 overflow-auto max-h-40'>
          {data.content}
        </div>
      ) : (
        <div className='text-sm text-gray-600 dark:text-gray-300 truncate'>
          {data.content}
        </div>
      )}

      <div className='mt-2 flex justify-between items-center'>
        <div className='text-xs text-gray-500 dark:text-gray-400'>
          Confidence: {data.confidence || 'N/A'}
        </div>
        <button
          className='text-blue-500 dark:text-blue-400 text-xs hover:underline'
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
};

const nodeTypes = {
  memoryItem: MemoryItemNode,
};

export const AgentMemoryVisualization = ({ agentId, onClose }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reference to the ReactFlow instance
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Sample memory data for demonstration
  // In a real application, this would be fetched from an API
  const fetchAgentMemory = async (agentId) => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Sample data - in production this would come from your backend
      const memoryItems = [
        {
          id: 'm1',
          type: 'fact',
          title: 'User Preference',
          content:
            'User prefers short, concise responses with technical details.',
          timestamp: new Date().toISOString(),
          confidence: 0.92,
          connections: ['m3', 'm5'],
        },
        {
          id: 'm2',
          type: 'concept',
          title: 'Machine Learning Models',
          content:
            'Collection of knowledge about different ML model architectures and their applications.',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          confidence: 0.85,
          connections: ['m5'],
        },
        {
          id: 'm3',
          type: 'rule',
          title: 'Response Format',
          content:
            'When providing technical information, include code examples where applicable.',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          confidence: 0.78,
          connections: [],
        },
        {
          id: 'm4',
          type: 'query',
          title: 'Latest API Request',
          content:
            'User asked about implementing a neural network for image classification.',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          confidence: 0.95,
          connections: ['m2', 'm5'],
        },
        {
          id: 'm5',
          type: 'external',
          title: 'Documentation Reference',
          content: 'TensorFlow documentation for image classification models.',
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          confidence: 0.89,
          connections: [],
        },
        {
          id: 'm6',
          type: 'fact',
          title: 'User Context',
          content:
            'User is working on a web application that needs to identify objects in uploaded images.',
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          confidence: 0.81,
          connections: ['m4'],
        },
      ];

      return { memoryItems };
    } catch (err) {
      console.error('Error fetching agent memory:', err);
      setError('Failed to load agent memory. Please try again later.');
      return { memoryItems: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const generateGraphData = (memoryItems) => {
    // Create nodes
    const nodes = memoryItems.map((item, index) => ({
      id: item.id,
      type: 'memoryItem',
      position: {
        x: 100 + (index % 3) * 300,
        y: 100 + Math.floor(index / 3) * 200,
      },
      data: {
        ...item,
      },
    }));

    // Create edges
    let edges = [];
    memoryItems.forEach((item) => {
      if (item.connections && item.connections.length > 0) {
        item.connections.forEach((targetId) => {
          edges.push({
            id: `e-${item.id}-${targetId}`,
            source: item.id,
            target: targetId,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 15,
              height: 15,
            },
            style: {
              strokeWidth: 2,
            },
          });
        });
      }
    });

    return { nodes, edges };
  };

  // Initialize with sample data
  useEffect(() => {
    const loadMemoryData = async () => {
      const { memoryItems } = await fetchAgentMemory(agentId);

      if (memoryItems.length > 0) {
        const { nodes: newNodes, edges: newEdges } =
          generateGraphData(memoryItems);
        setNodes(newNodes);
        setEdges(newEdges);
      }
    };

    loadMemoryData();
  }, [agentId, setNodes, setEdges]);

  // Function to filter nodes based on search and filters
  const applyFilters = () => {
    // This would filter the graph based on search term, type filter, and time range
    // For demonstration, we're not implementing the full filtering logic
    console.log('Applying filters:', { searchTerm, typeFilter, timeRange });
  };

  const handleResetView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  };

  // Helper function to format time for dropdown options
  const formatTimeOption = (hours) => {
    if (hours === 0) return 'Last 30 minutes';
    if (hours === 1) return 'Last hour';
    return `Last ${hours} hours`;
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-5/6 h-5/6 flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white flex items-center'>
            <Info className='w-5 h-5 mr-2 text-blue-500 dark:text-blue-400' />
            Agent Memory Visualization
          </h2>
          <button
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            onClick={onClose}
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Filters Bar */}
        <div className='flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900'>
          <div className='relative flex-grow max-w-md'>
            <input
              type='text'
              placeholder='Search memory items...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
          </div>

          <div className='flex items-center space-x-2'>
            <Filter className='w-4 h-4 text-gray-600 dark:text-gray-400' />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className='block p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
            >
              <option value='all'>All Types</option>
              <option value='fact'>Facts</option>
              <option value='concept'>Concepts</option>
              <option value='rule'>Rules</option>
              <option value='query'>Queries</option>
              <option value='external'>External Sources</option>
            </select>
          </div>

          <div className='flex items-center space-x-2'>
            <RotateCw className='w-4 h-4 text-gray-600 dark:text-gray-400' />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className='block p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
            >
              <option value='all'>All Time</option>
              <option value='0.5'>{formatTimeOption(0)}</option>
              <option value='1'>{formatTimeOption(1)}</option>
              <option value='6'>{formatTimeOption(6)}</option>
              <option value='24'>{formatTimeOption(24)}</option>
            </select>
          </div>

          <button
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            onClick={applyFilters}
          >
            Apply Filters
          </button>

          <button
            className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md'
            onClick={handleResetView}
            title='Reset View'
          >
            <RotateCw className='w-4 h-4' />
          </button>

          <button
            className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md'
            onClick={() => {
              // This would download the memory data as JSON
              alert('Memory data would be downloaded here');
            }}
            title='Export Memory Data'
          >
            <Download className='w-4 h-4' />
          </button>
        </div>

        {/* Memory Visualization Area */}
        <div ref={reactFlowWrapper} className='flex-grow relative'>
          {isLoading ? (
            <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75'>
              <div className='flex flex-col items-center'>
                <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                <p className='mt-4 text-gray-600 dark:text-gray-300'>
                  Loading memory data...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='bg-red-100 dark:bg-red-900 p-4 rounded-md text-red-800 dark:text-red-200'>
                {error}
              </div>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onInit={setReactFlowInstance}
              fitView
            >
              <Controls />
              <MiniMap
                nodeStrokeWidth={3}
                nodeColor={(node) => {
                  switch (node.data?.type) {
                    case 'fact':
                      return '#3b82f6'; // blue-500
                    case 'concept':
                      return '#8b5cf6'; // purple-500
                    case 'rule':
                      return '#f59e0b'; // amber-500
                    case 'query':
                      return '#10b981'; // green-500
                    case 'external':
                      return '#6b7280'; // gray-500
                    default:
                      return '#e5e7eb'; // gray-200
                  }
                }}
              />
              <Background gap={16} size={1} />
            </ReactFlow>
          )}
        </div>

        {/* Legend */}
        <div className='flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700'>
          <span className='text-xs text-gray-600 dark:text-gray-400'>
            Memory Types:
          </span>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full bg-blue-500'></div>
            <span className='ml-1 text-xs text-gray-600 dark:text-gray-400'>
              Facts
            </span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full bg-purple-500'></div>
            <span className='ml-1 text-xs text-gray-600 dark:text-gray-400'>
              Concepts
            </span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full bg-amber-500'></div>
            <span className='ml-1 text-xs text-gray-600 dark:text-gray-400'>
              Rules
            </span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full bg-green-500'></div>
            <span className='ml-1 text-xs text-gray-600 dark:text-gray-400'>
              Queries
            </span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full bg-gray-500'></div>
            <span className='ml-1 text-xs text-gray-600 dark:text-gray-400'>
              External Sources
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
