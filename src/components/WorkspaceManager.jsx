// components/WorkspaceManager.jsx - Updated with Memory Visualization
import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  TriggerNode,
  AgentNode,
  ConditionNode,
  ActionNode,
  ToolNode,
  ModelNode,
  MemoryNode,
} from './nodes/CustomNodes';
import { ConnectionLine } from './edges/ConnectionLine';
import { NavigationPanel } from './NavigationPanel';
import { ChatPanel } from './ChatPanel';
import { AgentMemoryVisualization } from './visualization/AgentMemoryVisualization';

// Register custom node types
const nodeTypes = {
  trigger: TriggerNode,
  agent: AgentNode,
  condition: ConditionNode,
  action: ActionNode,
  tool: ToolNode,
  model: ModelNode,
  memory: MemoryNode,
};

// Register custom edge types
const edgeTypes = {
  custom: ConnectionLine,
};

export const WorkspaceManager = ({
  nodes,
  edges,
  selectedNode,
  workspaceConfig,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onConnectionCreate,
  onConnectionDelete,
  onWorkspaceConfig,
}) => {
  const [reactflowNodes, setNodes, onNodesChange] = useNodesState([]);
  const [reactflowEdges, setEdges, onEdgesChange] = useEdgesState([]);
  const [memoryVisualizationOpen, setMemoryVisualizationOpen] = useState(false);
  const [selectedAgentForMemory, setSelectedAgentForMemory] = useState(null);

  // Update nodes when they change
  React.useEffect(() => {
    setNodes(
      nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          ...node,
          isSelected: node.id === selectedNode,
          onSelect: () => onNodeSelect(node.id),
          onDelete: () => onNodeDelete(node.id),
          onViewMemory:
            node.type === 'agent'
              ? () => {
                  setSelectedAgentForMemory(node.id);
                  setMemoryVisualizationOpen(true);
                }
              : undefined,
        },
      }))
    );
  }, [nodes, selectedNode, onNodeSelect, onNodeDelete, setNodes]);

  // Update edges when connections change
  React.useEffect(() => {
    setEdges(
      edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: 'custom',
        data: {
          ...edge,
          onDelete: () => onConnectionDelete(edge.id),
        },
      }))
    );
  }, [edges, onConnectionDelete, setEdges]);

  // Handle node position changes
  const onNodeDragStop = useCallback(
    (event, node) => {
      onNodeUpdate(node.id, { position: node.position });
    },
    [onNodeUpdate]
  );

  // Validate connection
  const isValidConnection = useCallback(
    (params) => {
      const sourceNodeId = params.source;
      const targetNodeId = params.target;

      // Find source and target nodes
      const sourceNode = reactflowNodes.find(
        (node) => node.id === sourceNodeId
      );
      const targetNode = reactflowNodes.find(
        (node) => node.id === targetNodeId
      );

      if (!sourceNode || !targetNode) return false;

      // Model nodes can only connect to agent nodes
      if (sourceNode.type === 'model' && targetNode.type !== 'agent') {
        return false;
      }

      // Memory nodes can only connect to agent nodes
      if (sourceNode.type === 'memory' && targetNode.type !== 'agent') {
        return false;
      }

      // // Tool nodes can only connect to agent nodes
      if (sourceNode.type === 'tool' && targetNode.type !== 'agent') {
        return false;
      }

      // Model nodes can only have one outbound connection
      if (sourceNode.type === 'model') {
        const existingConnections = reactflowEdges.filter(
          (edge) => edge.source === sourceNodeId
        );
        if (existingConnections.length > 0) {
          return false;
        }
      }

      // Memory nodes can only have one outbound connection
      if (sourceNode.type === 'memory') {
        const existingConnections = reactflowEdges.filter(
          (edge) => edge.source === sourceNodeId
        );
        if (existingConnections.length > 0) {
          return false;
        }
      }

      // Tool nodes can only have one outbound connection
      if (sourceNode.type === 'tool') {
        const existingConnections = reactflowEdges.filter(
          (edge) => edge.source === sourceNodeId
        );
        if (existingConnections.length > 0) {
          return false;
        }
      }

      return true;
    },
    [reactflowNodes, reactflowEdges]
  );

  // Handle new connections
  const onConnect = useCallback(
    (params) => {
      if (isValidConnection(params)) {
        onConnectionCreate(params);
      } else {
        console.error('Invalid connection attempt');
        // You could trigger the error modal here or provide feedback
      }
    },
    [onConnectionCreate, isValidConnection]
  );

  // Handle zoom changes
  const onMoveEnd = useCallback(
    (_, viewport) => {
      onWorkspaceConfig({
        zoom: viewport.zoom,
        panX: viewport.x,
        panY: viewport.y,
      });
    },
    [onWorkspaceConfig]
  );

  // Close memory visualization
  const closeMemoryVisualization = useCallback(() => {
    setMemoryVisualizationOpen(false);
    setSelectedAgentForMemory(null);
  }, []);

  return (
    <div className='flex-1 h-full relative'>
      <ReactFlow
        nodes={reactflowNodes}
        edges={reactflowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultZoom={workspaceConfig.zoom}
        defaultPosition={[workspaceConfig.panX, workspaceConfig.panY]}
        snapToGrid={workspaceConfig.snapToGrid}
        snapGrid={[20, 20]}
        fitView
      >
        <Background
          color='#aaa'
          gap={20}
          size={1}
          visible={workspaceConfig.showGrid}
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'trigger':
                return '#ef4444'; // red-500
              case 'agent':
                return '#3b82f6'; // blue-500
              case 'condition':
                return '#a855f7'; // purple-500
              case 'action':
                return '#22c55e'; // green-500
              case 'tool':
                return '#eab308'; // yellow-500
              case 'model':
                return '#0ea5e9'; // sky-500
              case 'memory':
                return '#14b8a6'; // teal-500
              default:
                return '#94a3b8'; // slate-400
            }
          }}
        />
      </ReactFlow>

      <NavigationPanel
        config={workspaceConfig}
        onConfigChange={onWorkspaceConfig}
      />

      {/* Chat Panel Component */}
      <ChatPanel />

      {/* Memory Visualization Modal */}
      {memoryVisualizationOpen && selectedAgentForMemory && (
        <AgentMemoryVisualization
          agentId={selectedAgentForMemory}
          onClose={closeMemoryVisualization}
        />
      )}
    </div>
  );
};
