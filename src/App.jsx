// App.jsx - Main container component
import React, { useState } from 'react';
import { Header } from './components/Header';
import { WorkspaceManager } from './components/WorkspaceManager';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { Toolbar } from './components/Toolbar';
import { NodeCreationModal } from './components/modals/NodeCreationModal';
import { ErrorModal } from './components/modals/ErrorModal';

const App = () => {
  // Workflow state
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // UI state
  const [workspaceConfig, setWorkspaceConfig] = useState({
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    snapToGrid: true,
  });

  // Modal state
  const [nodeCreationModal, setNodeCreationModal] = useState({
    isOpen: false,
    nodeType: null,
  });

  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: '',
  });

  // Check if a trigger node exists
  const hasTriggerNode = () => {
    return nodes.some((node) => node.type === 'trigger');
  };

  // Initialize node creation - check rules before opening modal
  const handleInitNodeCreate = (nodeType) => {
    // Rule: First node must be a trigger
    if (nodes.length === 0 && nodeType !== 'trigger') {
      setErrorModal({
        isOpen: true,
        message:
          'The first node in a workflow must be a Trigger Node. Please add a Trigger Node before adding other nodes.',
      });
      return;
    }

    // Show node creation modal
    setNodeCreationModal({
      isOpen: true,
      nodeType,
    });
  };

  // Create node after modal confirmation
  const handleNodeCreate = (nodeData) => {
    const newNode = {
      id: `${nodeData.nodeType || nodeCreationModal.nodeType}-${Date.now()}`,
      type: nodeData.nodeType || nodeCreationModal.nodeType,
      name: nodeData.name,
      position: { x: 100, y: 100 }, // Default position
      ...nodeData,
    };

    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
    setNodeCreationModal({ isOpen: false, nodeType: null });
  };

  // Cancel node creation
  const handleCancelNodeCreate = () => {
    setNodeCreationModal({ isOpen: false, nodeType: null });
  };

  // Select node
  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId);
  };

  // Update node
  const handleNodeUpdate = (nodeId, updates) => {
    setNodes(
      nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node))
    );
  };

  // Delete node
  const handleNodeDelete = (nodeId) => {
    setNodes(nodes.filter((node) => node.id !== nodeId));

    // Also remove any edges involving this node
    setEdges(
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );

    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  // Create connection (edge)
  const handleConnectionCreate = (params) => {
    // Check if connection already exists
    const connectionExists = edges.some(
      (edge) =>
        edge.source === params.source &&
        edge.target === params.target &&
        edge.sourceHandle === params.sourceHandle &&
        edge.targetHandle === params.targetHandle
    );

    if (!connectionExists && params.source !== params.target) {
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      };

      setEdges([...edges, newEdge]);
    }
  };

  // Delete connection
  const handleConnectionDelete = (edgeId) => {
    setEdges(edges.filter((edge) => edge.id !== edgeId));
  };

  // Update workspace configuration
  const handleWorkspaceConfig = (updates) => {
    setWorkspaceConfig({ ...workspaceConfig, ...updates });
  };

  // Save workspace
  const handleSaveWorkspace = () => {
    const workspace = {
      nodes,
      edges,
      config: workspaceConfig,
    };

    const workspaceJson = JSON.stringify(workspace);
    localStorage.setItem('workflow-workspace', workspaceJson);

    // In a real application, you would likely save to a server
    console.log('Workspace saved', workspace);
  };

  // Load workspace
  const handleLoadWorkspace = () => {
    const savedWorkspace = localStorage.getItem('workflow-workspace');

    if (savedWorkspace) {
      try {
        const workspace = JSON.parse(savedWorkspace);
        setNodes(workspace.nodes || []);
        setEdges(workspace.edges || []);
        setWorkspaceConfig(workspace.config || workspaceConfig);
        setSelectedNode(null);
      } catch (error) {
        console.error('Failed to load workspace', error);
        setErrorModal({
          isOpen: true,
          message: 'Failed to load workspace: ' + error.message,
        });
      }
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <Header onSave={handleSaveWorkspace} onLoad={handleLoadWorkspace} />

      <div className='flex flex-1 overflow-hidden'>
        <Toolbar onNodeCreate={handleInitNodeCreate} />

        <WorkspaceManager
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          workspaceConfig={workspaceConfig}
          onNodeSelect={handleNodeSelect}
          onNodeUpdate={handleNodeUpdate}
          onNodeDelete={handleNodeDelete}
          onConnectionCreate={handleConnectionCreate}
          onConnectionDelete={handleConnectionDelete}
          onWorkspaceConfig={handleWorkspaceConfig}
        />

        {selectedNode && (
          <ConfigurationPanel
            node={nodes.find((n) => n.id === selectedNode)}
            onUpdate={(updates) => handleNodeUpdate(selectedNode, updates)}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>

      {/* Modals */}
      <NodeCreationModal
        isOpen={nodeCreationModal.isOpen}
        nodeType={nodeCreationModal.nodeType}
        onConfirm={handleNodeCreate}
        onCancel={handleCancelNodeCreate}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />
    </div>
  );
};

export default App;
