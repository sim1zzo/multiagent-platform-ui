// components/WorkspaceManager.jsx
import React, { useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AgentNode } from './nodes/AgentNode';
import { ConnectionLine } from './edges/ConnectionLine';
import { NavigationPanel } from './NavigationPanel';

// Register custom node types
const nodeTypes = {
  agent: AgentNode,
};

// Register custom edge types
const edgeTypes = {
  custom: ConnectionLine,
};

export const WorkspaceManager = ({
  agents,
  connections,
  selectedAgent,
  workspaceConfig,
  onAgentSelect,
  onAgentUpdate,
  onAgentDelete,
  onConnectionCreate,
  onConnectionDelete,
  onWorkspaceConfig,
}) => {
  // Convert our agents to ReactFlow nodes
  const initialNodes = agents.map(agent => ({
    id: agent.id,
    type: 'agent',
    position: agent.position,
    data: { 
      ...agent,
      isSelected: agent.id === selectedAgent,
      onSelect: () => onAgentSelect(agent.id),
      onDelete: () => onAgentDelete(agent.id),
    },
  }));

  // Convert our connections to ReactFlow edges
  const initialEdges = connections.map(connection => ({
    id: connection.id,
    source: connection.source,
    target: connection.target,
    type: 'custom',
    data: {
      ...connection,
      onDelete: () => onConnectionDelete(connection.id),
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when agents change
  React.useEffect(() => {
    setNodes(agents.map(agent => ({
      id: agent.id,
      type: 'agent',
      position: agent.position,
      data: { 
        ...agent,
        isSelected: agent.id === selectedAgent,
        onSelect: () => onAgentSelect(agent.id),
        onDelete: () => onAgentDelete(agent.id),
      },
    })));
  }, [agents, selectedAgent, onAgentSelect, onAgentDelete, setNodes]);

  // Update edges when connections change
  React.useEffect(() => {
    setEdges(connections.map(connection => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      type: 'custom',
      data: {
        ...connection,
        onDelete: () => onConnectionDelete(connection.id),
      },
    })));
  }, [connections, onConnectionDelete, setEdges]);

  // Handle node position changes
  const onNodeDragStop = useCallback((event, node) => {
    onAgentUpdate(node.id, { position: node.position });
  }, [onAgentUpdate]);

  // Handle new connections
  const onConnect = useCallback((params) => {
    onConnectionCreate(params.source, params.target);
  }, [onConnectionCreate]);

  // Handle zoom changes
  const onMoveEnd = useCallback((_, viewport) => {
    onWorkspaceConfig({ 
      zoom: viewport.zoom,
      panX: viewport.x,
      panY: viewport.y,
    });
  }, [onWorkspaceConfig]);

  return (
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
          color="#aaa" 
          gap={20} 
          size={1}
          visible={workspaceConfig.showGrid} 
        />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            return node.data.isSelected ? '#ff0072' : '#eee';
          }}
        />
      </ReactFlow>
      
      <NavigationPanel 
        config={workspaceConfig}
        onConfigChange={onWorkspaceConfig}
      />
    </div>
  );
};