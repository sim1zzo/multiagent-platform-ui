// App.jsx - AGGIORNATO con Workflow Execution Engine
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WorkspaceManager } from './components/WorkspaceManager';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { Toolbar } from './components/Toolbar';
import { ErrorModal } from './components/modals/ErrorModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { CustomNodeCreationModal } from './components/modals/CustomNodeCreationModal';
import { LoginPage } from './components/pages/LoginPage';
import { Settings } from './components/pages/Settings';
import { Profile } from './components/pages/Profile';
import { AppProvider, useApp } from './components/context/AppContext';
import { WorkflowMarketplace } from './components/marketplace/WorkflowMarketplace';
import { AgentMemoryVisualization } from './components/visualization/AgentMemoryVisualization';
import { useWorkflowMarketplace } from './hooks/useWorkflowMarketplace';
import { Dashboard } from './components/pages/Dashboard';
import { Analytics } from './components/pages/Analytics';
import { Simulations } from './components/pages/Simulations';
import ConversationFlowVisualizer from './components/visualization/ConversationFlowVisualizer';

// NUOVI IMPORTS per Execution Engine
import ExecutionMonitor from './components/execution/ExecutionMonitor';
import ExecutionControlPanel from './components/execution/ExecutionControlPanel';
import { workflowExecutor } from './services/WorkflowExecutor';

const MainApp = () => {
  // Get app context
  const { activePage, navigateTo, settings } = useApp();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Use the marketplace hook
  const {
    isMarketplaceOpen,
    openMarketplace,
    closeMarketplace,
    importTemplate,
  } = useWorkflowMarketplace();

  // NUOVI STATI per Execution Engine
  const [isExecutionMonitorOpen, setIsExecutionMonitorOpen] = useState(false);
  const [showExecutionPanel, setShowExecutionPanel] = useState(true);

  // On component mount, check if user is already authenticated (from local storage)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Handle invalid stored user data
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login handler
  const handleLogin = (userData) => {
    // Save user to state and localStorage
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Workflow state
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Memory visualization state
  const [memoryVisualizationOpen, setMemoryVisualizationOpen] = useState(false);
  const [selectedAgentForMemory, setSelectedAgentForMemory] = useState(null);

  // UI state
  const [workspaceConfig, setWorkspaceConfig] = useState({
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    snapToGrid: true,
    darkMode: settings.preferences.theme === 'dark',
  });

  // Modal state
  const [nodeCreationModal, setNodeCreationModal] = useState({
    isOpen: false,
    nodeType: null,
  });

  // Separate modals for error and notification/success
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: '',
  });

  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    message: '',
    type: 'info', // can be 'success', 'info', 'warning'
  });

  // Apply dark mode classes to body
  useEffect(() => {
    if (workspaceConfig.darkMode) {
      document.body.classList.add('dark', 'bg-gray-900');
    } else {
      document.body.classList.remove('dark', 'bg-gray-900');
    }
  }, [workspaceConfig.darkMode]);

  // Update darkMode when theme preference changes
  useEffect(() => {
    setWorkspaceConfig((prev) => ({
      ...prev,
      darkMode: settings.preferences.theme === 'dark',
    }));
  }, [settings.preferences.theme]);

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

    setNodeCreationModal({
      isOpen: true,
      nodeType: nodeType,
    });
  };

  // Create node
  const handleNodeCreate = (nodeData) => {
    const newNode = {
      id: `${nodeData.type}-${Date.now()}`,
      type: nodeData.type,
      name: nodeData.name,
      position: { x: 200 + nodes.length * 50, y: 200 + nodes.length * 50 },
      ...nodeData,
    };

    setNodes([...nodes, newNode]);
    setNodeCreationModal({ isOpen: false, nodeType: null });

    // Show success message
    setNotificationModal({
      isOpen: true,
      message: `${nodeData.name} node created successfully`,
      type: 'success',
    });
  };

  // Update node
  const handleNodeUpdate = (nodeId, updates) => {
    setNodes(
      nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node))
    );
  };

  // Delete node
  const handleNodeDelete = (nodeId) => {
    // Remove node
    setNodes(nodes.filter((node) => node.id !== nodeId));
    // Remove connected edges
    setEdges(
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    // Clear selection if deleted node was selected
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  // Handle node selection
  const handleNodeSelect = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    setSelectedNode(node);
  };

  // Handle connection creation with validation
  const handleConnectionCreate = (params) => {
    // Prevent self-connection
    if (params.source === params.target) {
      setErrorModal({
        isOpen: true,
        message: 'Nodes cannot connect to themselves.',
      });
      return;
    }

    // Check for duplicate connections
    const existingConnection = edges.find(
      (edge) => edge.source === params.source && edge.target === params.target
    );

    if (existingConnection) {
      setErrorModal({
        isOpen: true,
        message: 'A connection between these nodes already exists.',
      });
      return;
    }

    // Additional validation based on node types
    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target);

    if (sourceNode && targetNode) {
      // Model nodes can only connect to agent nodes
      if (sourceNode.type === 'model' && targetNode.type !== 'agent') {
        setErrorModal({
          isOpen: true,
          message: 'Model nodes can only connect to Agent nodes.',
        });
        return;
      }

      // Memory nodes can only connect to agent nodes
      if (sourceNode.type === 'memory' && targetNode.type !== 'agent') {
        setErrorModal({
          isOpen: true,
          message: 'Memory nodes can only connect to Agent nodes.',
        });
        return;
      }

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

  // Export workflow
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

    // Show success notification
    setNotificationModal({
      isOpen: true,
      message: 'Workflow exported successfully',
      type: 'success',
    });
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
      setNotificationModal({
        isOpen: true,
        message: 'Workspace reset successfully',
        type: 'info',
      });
    }
  };

  // Load workflow from file
  const handleLoadWorkflow = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workspaceData = JSON.parse(e.target.result);

            // Validate the loaded data
            if (
              workspaceData.nodes &&
              Array.isArray(workspaceData.nodes) &&
              workspaceData.edges &&
              Array.isArray(workspaceData.edges)
            ) {
              setNodes(workspaceData.nodes);
              setEdges(workspaceData.edges);
              if (workspaceData.config) {
                setWorkspaceConfig({
                  ...workspaceConfig,
                  ...workspaceData.config,
                });
              }

              setNotificationModal({
                isOpen: true,
                message: 'Workflow loaded successfully',
                type: 'success',
              });
            } else {
              setErrorModal({
                isOpen: true,
                message: 'Invalid workflow file format',
              });
            }
          } catch (error) {
            setErrorModal({
              isOpen: true,
              message: 'Failed to parse workflow file',
            });
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };

  // Save workflow
  const handleSaveWorkflow = () => {
    // This would typically save to a backend service
    // For demo purposes, we'll just show a notification
    setNotificationModal({
      isOpen: true,
      message: 'Workflow saved successfully',
      type: 'success',
    });
  };

  // Handle template import
  const handleTemplateImport = (templateWorkflow) => {
    if (templateWorkflow.nodes) {
      setNodes(templateWorkflow.nodes);
    }
    if (templateWorkflow.edges) {
      setEdges(templateWorkflow.edges);
    }
    closeMarketplace();

    setNotificationModal({
      isOpen: true,
      message: 'Template imported successfully',
      type: 'success',
    });
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage onLogin={handleLogin} darkMode={workspaceConfig.darkMode} />
    );
  }

  // NUOVE FUNZIONI per Execution Engine
  const openExecutionMonitor = () => {
    setIsExecutionMonitorOpen(true);
  };

  const closeExecutionMonitor = () => {
    setIsExecutionMonitorOpen(false);
  };

  const getCurrentWorkflow = () => {
    return {
      nodes,
      edges,
      config: workspaceConfig,
    };
  };

  return (
    <div
      className={`min-h-screen ${
        workspaceConfig.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onSave={handleSaveWorkflow}
        onLoad={handleLoadWorkflow}
        onExport={handleExportWorkflow}
        onReset={handleResetWorkflow}
        onToggleDarkMode={toggleDarkMode}
        darkMode={workspaceConfig.darkMode}
        onOpenMarketplace={openMarketplace}
      />

      {/* Main Content */}
      <div className='flex h-screen pt-16'>
        {activePage === 'workflow' && (
          <>
            {/* Left Sidebar - Toolbar */}
            <div className='w-20 flex-shrink-0'>
              <Toolbar
                onNodeCreate={handleInitNodeCreate}
                darkMode={workspaceConfig.darkMode}
                onOpenMemoryVisualization={() =>
                  setMemoryVisualizationOpen(true)
                }
              />
            </div>

            {/* Main Workspace */}
            <div className='flex-1 relative'>
              <WorkspaceManager
                nodes={nodes}
                edges={edges}
                onNodesChange={(changes) => {
                  // Handle node changes like position updates, selections, etc.
                  changes.forEach((change) => {
                    if (change.type === 'position' && change.position) {
                      handleNodeUpdate(change.id, {
                        position: change.position,
                      });
                    } else if (change.type === 'select') {
                      if (change.selected) {
                        handleNodeSelect(change.id);
                      }
                    }
                  });
                }}
                onEdgesChange={(changes) => {
                  // Handle edge changes
                  changes.forEach((change) => {
                    if (change.type === 'remove') {
                      handleConnectionDelete(change.id);
                    }
                  });
                }}
                onConnect={handleConnectionCreate}
                onNodeDelete={handleNodeDelete}
                onNodeUpdate={handleNodeUpdate}
                config={workspaceConfig}
                onConfigChange={handleWorkspaceConfig}
                darkMode={workspaceConfig.darkMode}
              />

              {/* NUOVO: Execution Control Panel */}
              {showExecutionPanel && (
                <div className='absolute top-4 right-4 w-80 z-10'>
                  <ExecutionControlPanel
                    workflow={getCurrentWorkflow()}
                    onOpenMonitor={openExecutionMonitor}
                    darkMode={workspaceConfig.darkMode}
                  />
                </div>
              )}
            </div>

            {/* Right Sidebar - Configuration Panel */}
            {selectedNode && (
              <div className='w-80 flex-shrink-0'>
                <ConfigurationPanel
                  selectedNode={selectedNode}
                  onNodeUpdate={handleNodeUpdate}
                  onNodeDelete={handleNodeDelete}
                  onClose={() => setSelectedNode(null)}
                  darkMode={workspaceConfig.darkMode}
                />
              </div>
            )}
          </>
        )}

        {/* Other Pages */}
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'analytics' && <Analytics />}
        {activePage === 'simulations' && <Simulations />}
        {activePage === 'settings' && <Settings />}
        {activePage === 'profile' && (
          <Profile user={user} onLogout={handleLogout} />
        )}
      </div>

      {/* Modals */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        darkMode={workspaceConfig.darkMode}
      />

      <NotificationModal
        isOpen={notificationModal.isOpen}
        message={notificationModal.message}
        type={notificationModal.type}
        onClose={() =>
          setNotificationModal({ isOpen: false, message: '', type: 'info' })
        }
        darkMode={workspaceConfig.darkMode}
      />

      <CustomNodeCreationModal
        isOpen={nodeCreationModal.isOpen}
        nodeType={nodeCreationModal.nodeType}
        onClose={() => setNodeCreationModal({ isOpen: false, nodeType: null })}
        onCreate={handleNodeCreate}
        darkMode={workspaceConfig.darkMode}
      />

      {/* Workflow Marketplace */}
      {isMarketplaceOpen && (
        <WorkflowMarketplace
          isOpen={isMarketplaceOpen}
          onClose={closeMarketplace}
          onImportTemplate={handleTemplateImport}
          darkMode={workspaceConfig.darkMode}
        />
      )}

      {/* NUOVO: Execution Monitor */}
      {isExecutionMonitorOpen && (
        <ExecutionMonitor
          workflow={getCurrentWorkflow()}
          isOpen={isExecutionMonitorOpen}
          onClose={closeExecutionMonitor}
          darkMode={workspaceConfig.darkMode}
        />
      )}

      {/* Memory Visualization */}
      {memoryVisualizationOpen && (
        <AgentMemoryVisualization
          isOpen={memoryVisualizationOpen}
          onClose={() => setMemoryVisualizationOpen(false)}
          selectedAgent={selectedAgentForMemory}
          darkMode={workspaceConfig.darkMode}
        />
      )}

      {/* Conversation Flow Visualizer */}
      <ConversationFlowVisualizer />
    </div>
  );
};

// Main App Component with Context Provider
const App = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
