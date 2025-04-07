// App.jsx - Main container component
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WorkspaceManager } from './components/WorkspaceManager';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { Toolbar } from './components/Toolbar';
import { NodeCreationModal } from './components/modals/NodeCreationModal';
import { ErrorModal } from './components/modals/ErrorModal';

const App = () => {
  // Active page state - without using context for now
  const [activePage, setActivePage] = useState('workflow');

  // Mock user profile for demonstration
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
  });

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
    darkMode: false,
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

  // Apply dark mode classes to body
  useEffect(() => {
    if (workspaceConfig.darkMode) {
      document.body.classList.add('dark', 'bg-gray-900');
    } else {
      document.body.classList.remove('dark', 'bg-gray-900');
    }
  }, [workspaceConfig.darkMode]);

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

  // Helper function to get tool name from ID
  const getToolName = (toolId) => {
    const toolNames = {
      rag: 'Retrieval Augmented Generation',
      'web-search': 'Web Search',
      'code-interpreter': 'Code Interpreter',
      'api-connector': 'API Connector',
      database: 'Database Connector',
      file: 'File Processor',
      scraper: 'Web Scraper',
    };

    return toolNames[toolId] || toolId;
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

    const newNodes = [...nodes, newNode];
    let newEdges = [...edges];

    // If this is an agent node with tools, create tool nodes
    if (newNode.type === 'agent' && newNode.tools && newNode.tools.length > 0) {
      const toolNodes = [];
      const toolEdges = [];

      // Position calculation for tools layout
      const toolsPerRow = 3;
      const horizontalSpacing = 170;
      const verticalSpacing = 120;
      const startX =
        newNode.position.x -
        ((Math.min(newNode.tools.length, toolsPerRow) - 1) *
          horizontalSpacing) /
          2;
      const startY = newNode.position.y + 200; // Place tools below the agent

      // Create tool nodes for each selected tool
      newNode.tools.forEach((toolId, index) => {
        const row = Math.floor(index / toolsPerRow);
        const col = index % toolsPerRow;

        const toolNode = {
          id: `tool-${toolId}-${Date.now()}-${index}`,
          type: 'tool',
          name: getToolName(toolId),
          toolType: toolId,
          position: {
            x: startX + col * horizontalSpacing,
            y: startY + row * verticalSpacing,
          },
          config: '',
        };

        // Create edge from tool to agent
        const toolEdge = {
          id: `edge-${toolNode.id}-to-${newNode.id}`,
          source: toolNode.id,
          target: newNode.id,
          // Use specific handle if needed
          // sourceHandle: 'output',
          // targetHandle: 'tool',
        };

        toolNodes.push(toolNode);
        toolEdges.push(toolEdge);
      });

      // Add the tool nodes and edges
      newNodes.push(...toolNodes);
      newEdges.push(...toolEdges);

      // Remove tools array from agent node since they're now separate nodes
      delete newNode.tools;
    }

    setNodes(newNodes);
    setEdges(newEdges);
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
      // Get source and target node types
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      // Validate connection rules
      if (sourceNode && targetNode) {
        // Tool nodes can only connect to agent nodes
        if (sourceNode.type === 'tool' && targetNode.type !== 'agent') {
          setErrorModal({
            isOpen: true,
            message: 'Tool nodes can only connect to Agent nodes.',
          });
          return;
        }

        // Add additional validation rules here if needed
      }

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

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !workspaceConfig.darkMode;
    setWorkspaceConfig({
      ...workspaceConfig,
      darkMode: newDarkMode,
    });
  };

  // Export workspace
  const handleExportWorkflow = () => {
    const workspace = {
      nodes,
      edges,
      config: workspaceConfig,
    };

    // Create a JSON Blob
    const jsonBlob = new Blob([JSON.stringify(workspace, null, 2)], {
      type: 'application/json',
    });

    // Create a download link
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset workspace
  const handleResetWorkflow = () => {
    if (
      window.confirm(
        'Are you sure you want to reset the workspace? All unsaved changes will be lost.'
      )
    ) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
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

  // Navigation function for the header
  const navigateTo = (page) => {
    setActivePage(page);
    // For simplicity, we'll just redirect back to workflow for now
    if (page !== 'workflow') {
      alert(
        `Navigation to ${page} page - This would show the ${page} interface if fully implemented`
      );
      // Redirect back to workflow for demo purposes
      setActivePage('workflow');
    }
  };

  return (
    <div
      className={`h-screen flex flex-col ${
        workspaceConfig.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'
      }`}
    >
      <Header
        onSave={handleSaveWorkspace}
        onLoad={handleLoadWorkspace}
        onExport={handleExportWorkflow}
        onReset={handleResetWorkflow}
        darkMode={workspaceConfig.darkMode}
        toggleDarkMode={toggleDarkMode}
        navigateTo={navigateTo}
        activePage={activePage}
        userName={userProfile.name}
      />

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
